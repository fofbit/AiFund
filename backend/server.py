from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone
import asyncio
from market_data import market_service
from notifications import notification_service
from global_vision import global_vision_service
from gamification import bot_customization_service, vip_level_system, virtual_asset_store
from demo_data import demo_data_generator
from vip_commands import vip_trading_commands_service

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="AIfund.com API")
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============ MODELS ============

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    wallet_address: str
    username: Optional[str] = None
    balance_usd: float = 0.0  # USD equivalent
    tier: str = "inactive"  # inactive, basic, global_vision, vip
    joined_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    referral_code: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    referred_by: Optional[str] = None
    has_global_vision: bool = False  # Paid 9.9U for Global Vision feature

class Bot(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_wallet: str
    name: str
    gender: str = "male"  # male, female
    avatar: str = "male_1"
    avatar_emoji: str = "🤖"
    level: int = 1
    experience: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    # Trading stats
    virtual_balance: float = 10000.0  # Starting with $10k virtual
    total_profit: float = 0.0
    total_trades: int = 0
    win_rate: float = 0.0
    
    # Bot abilities
    abilities: List[str] = Field(default_factory=lambda: ["Spot Trading"])
    status: str = "active"  # active, paused
    
    # VIP & Gamification
    vip_level: int = 1
    owned_assets: List[str] = Field(default_factory=list)  # IDs of purchased virtual assets

class Trade(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    bot_id: str
    symbol: str  # BTC, ETH, etc.
    action: str  # buy, sell
    price: float
    amount: float
    profit_loss: float = 0.0
    reason: str  # AI decision reason
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_simulated: bool = True

class Deposit(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    wallet_address: str
    currency: str  # BTC, ETH, USDT, etc.
    amount: float
    usd_value: float
    tx_hash: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "pending"  # pending, confirmed

# ============ REQUEST/RESPONSE MODELS ============

class ConnectWalletRequest(BaseModel):
    wallet_address: str
    wallet_type: str  # metamask, unisat, etc.

class CreateBotRequest(BaseModel):
    wallet_address: str
    bot_name: str
    gender: str = "male"  # male or female
    avatar_id: str = "male_1"

class DepositRequest(BaseModel):
    wallet_address: str
    currency: str
    amount: float
    tx_hash: Optional[str] = None

# ============ UTILITY FUNCTIONS ============

async def get_crypto_prices() -> Dict[str, float]:
    """Get current crypto prices in USD"""
    # Use real market data from CoinGecko
    return await market_service.fetch_prices()

async def update_user_tier(wallet_address: str):
    """Update user tier based on balance"""
    user = await db.users.find_one({"wallet_address": wallet_address})
    if not user:
        return
    
    balance = user.get("balance_usd", 0)
    
    if balance >= 100:
        new_tier = "vip"
    elif balance >= 1:
        new_tier = "basic"
    else:
        new_tier = "inactive"
    
    if user.get("tier") != new_tier:
        await db.users.update_one(
            {"wallet_address": wallet_address},
            {"$set": {"tier": new_tier}}
        )
        logger.info(f"User {wallet_address} tier updated to {new_tier}")

# ============ API ROUTES ============

@api_router.get("/")
async def root():
    return {"message": "Welcome to AIfund.com API", "status": "active"}

@api_router.post("/wallet/connect")
async def connect_wallet(req: ConnectWalletRequest):
    """Connect wallet and create/get user"""
    wallet_address = req.wallet_address.lower()
    
    # Check if user exists
    user = await db.users.find_one({"wallet_address": wallet_address})
    
    if not user:
        # Create new user
        new_user = User(wallet_address=wallet_address)
        user_dict = new_user.model_dump()
        user_dict['joined_at'] = user_dict['joined_at'].isoformat()
        await db.users.insert_one(user_dict)
        logger.info(f"New user created: {wallet_address}")
        return {"status": "new_user", "user": new_user.model_dump(), "has_bot": False}
    
    # Check if user has a bot
    bot = await db.bots.find_one({"user_wallet": wallet_address})
    
    return {
        "status": "existing_user",
        "user": {
            "wallet_address": user["wallet_address"],
            "balance_usd": user.get("balance_usd", 0),
            "tier": user.get("tier", "inactive"),
            "referral_code": user.get("referral_code")
        },
        "has_bot": bot is not None
    }

@api_router.post("/deposit")
async def create_deposit(req: DepositRequest):
    """Record a deposit and update user balance"""
    wallet_address = req.wallet_address.lower()
    
    # Get current prices
    prices = await get_crypto_prices()
    
    if req.currency not in prices:
        raise HTTPException(status_code=400, detail=f"Unsupported currency: {req.currency}")
    
    usd_value = req.amount * prices[req.currency]
    
    # Create deposit record
    deposit = Deposit(
        wallet_address=wallet_address,
        currency=req.currency,
        amount=req.amount,
        usd_value=usd_value,
        tx_hash=req.tx_hash,
        status="confirmed"  # In production, verify on blockchain
    )
    
    deposit_dict = deposit.model_dump()
    deposit_dict['timestamp'] = deposit_dict['timestamp'].isoformat()
    await db.deposits.insert_one(deposit_dict)
    
    # Update user balance
    await db.users.update_one(
        {"wallet_address": wallet_address},
        {"$inc": {"balance_usd": usd_value}}
    )
    
    # Update tier
    await update_user_tier(wallet_address)
    
    # Get updated user
    user = await db.users.find_one({"wallet_address": wallet_address})
    
    logger.info(f"Deposit recorded: {wallet_address} - {req.amount} {req.currency} (${usd_value:.2f})")
    
    return {
        "success": True,
        "deposit": deposit.model_dump(),
        "new_balance": user["balance_usd"],
        "tier": user["tier"]
    }

@api_router.post("/bot/create")
async def create_bot(req: CreateBotRequest):
    """Create a new bot for user"""
    wallet_address = req.wallet_address.lower()
    
    # Check if user exists and has sufficient balance
    user = await db.users.find_one({"wallet_address": wallet_address})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.get("tier") == "inactive":
        raise HTTPException(status_code=403, detail="Insufficient balance. Deposit at least $1 equivalent to activate.")
    
    # Check if user already has a bot
    existing_bot = await db.bots.find_one({"user_wallet": wallet_address})
    if existing_bot:
        raise HTTPException(status_code=400, detail="User already has a bot")
    
    # Get avatar emoji from gamification service
    avatars = bot_customization_service.get_bot_avatars()
    avatar_data = None
    for av in avatars[req.gender]:
        if av['id'] == req.avatar_id:
            avatar_data = av
            break
    
    avatar_emoji = avatar_data['emoji'] if avatar_data else '🤖'
    
    # Create new bot
    new_bot = Bot(
        user_wallet=wallet_address,
        name=req.bot_name,
        gender=req.gender,
        avatar=req.avatar_id,
        avatar_emoji=avatar_emoji
    )
    
    bot_dict = new_bot.model_dump()
    bot_dict['created_at'] = bot_dict['created_at'].isoformat()
    await db.bots.insert_one(bot_dict)
    
    logger.info(f"Bot created for {wallet_address}: {req.bot_name}")
    
    return {"success": True, "bot": new_bot.model_dump()}

@api_router.get("/bot/{wallet_address}")
async def get_bot(wallet_address: str):
    """Get user's bot information"""
    wallet_address = wallet_address.lower()
    
    bot = await db.bots.find_one({"user_wallet": wallet_address}, {"_id": 0})
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    # Get recent trades
    trades = await db.trades.find(
        {"bot_id": bot["id"]},
        {"_id": 0}
    ).sort("timestamp", -1).limit(10).to_list(10)
    
    return {
        "bot": bot,
        "recent_trades": trades
    }

@api_router.get("/user/{wallet_address}")
async def get_user(wallet_address: str):
    """Get user information"""
    wallet_address = wallet_address.lower()
    
    user = await db.users.find_one({"wallet_address": wallet_address}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"user": user}

@api_router.get("/prices")
async def get_prices():
    """Get current crypto prices"""
    prices = await get_crypto_prices()
    return {"prices": prices}

@api_router.get("/market/analysis")
async def get_market_analysis():
    """Get comprehensive market analysis"""
    analysis = await market_service.get_market_analysis()
    return {"analysis": analysis}

@api_router.get("/leaderboard")
async def get_leaderboard():
    """Get top performing bots"""
    bots = await db.bots.find(
        {},
        {"_id": 0}
    ).sort("total_profit", -1).limit(20).to_list(20)
    
    return {"leaderboard": bots}

@api_router.get("/notifications/{wallet_address}")
async def get_notifications(wallet_address: str, unread_only: bool = False):
    """Get user notifications"""
    notifications = await notification_service.get_user_notifications(
        wallet_address, 
        unread_only
    )
    return {"notifications": notifications}

@api_router.post("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str):
    """Mark notification as read"""
    await notification_service.mark_as_read(notification_id)
    return {"success": True}

# ============ GAMIFICATION APIs ============

@api_router.get("/gamification/bot-avatars")
async def get_bot_avatars():
    """Get available bot avatars by gender"""
    avatars = bot_customization_service.get_bot_avatars()
    return {"avatars": avatars}

@api_router.get("/gamification/vip-levels")
async def get_vip_levels():
    """Get all VIP levels"""
    levels = vip_level_system.get_vip_levels()
    return {"levels": levels}

@api_router.get("/gamification/user-vip/{wallet_address}")
async def get_user_vip_level(wallet_address: str):
    """Get user's current VIP level"""
    bot = await db.bots.find_one({"user_wallet": wallet_address.lower()}, {"_id": 0})
    if not bot:
        return {"error": "Bot not found"}
    
    vip_info = vip_level_system.get_user_vip_level(bot.get("total_profit", 0))
    return {"vip_info": vip_info}

@api_router.get("/gamification/store")
async def get_virtual_store():
    """Get virtual asset store items"""
    items = virtual_asset_store.get_store_items()
    rarity_colors = virtual_asset_store.get_rarity_colors()
    return {"store": items, "rarity_colors": rarity_colors}

@api_router.post("/gamification/buy-asset")
async def buy_virtual_asset(req: dict):
    """Purchase a virtual asset"""
    wallet_address = req.get("wallet_address", "").lower()
    asset_id = req.get("asset_id")
    
    bot = await db.bots.find_one({"user_wallet": wallet_address})
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    store = virtual_asset_store.get_store_items()
    
    asset_found = None
    for category, data in store.items():
        for item in data["items"]:
            if item["id"] == asset_id:
                asset_found = item
                break
        if asset_found:
            break
    
    if not asset_found:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    if bot["total_profit"] < asset_found["price"]:
        raise HTTPException(status_code=400, detail="Insufficient profit")
    
    if asset_id in bot.get("owned_assets", []):
        raise HTTPException(status_code=400, detail="Already owned")
    
    new_profit = bot["total_profit"] - asset_found["price"]
    
    await db.bots.update_one(
        {"user_wallet": wallet_address},
        {
            "$set": {"total_profit": new_profit},
            "$push": {"owned_assets": asset_id}
        }
    )
    
    return {"success": True, "asset": asset_found, "new_profit": new_profit}

@api_router.get("/gamification/user-assets/{wallet_address}")
async def get_user_assets(wallet_address: str):
    """Get user's owned virtual assets"""
    bot = await db.bots.find_one({"user_wallet": wallet_address.lower()}, {"_id": 0})
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    owned_asset_ids = bot.get("owned_assets", [])
    store = virtual_asset_store.get_store_items()
    owned_assets = []
    
    for category, data in store.items():
        for item in data["items"]:
            if item["id"] in owned_asset_ids:
                owned_assets.append({**item, "category": category})
    
    return {"owned_assets": owned_assets, "total_value": sum(a["price"] for a in owned_assets)}

@api_router.get("/global-vision/opportunities")
async def get_global_vision_opportunities():
    """Get historical investment opportunities"""
    opportunities = global_vision_service.get_historical_opportunities()
    return {"opportunities": opportunities}

@api_router.get("/global-vision/featured")
async def get_featured_opportunity():
    """Get today's featured opportunity"""
    featured = global_vision_service.get_featured_opportunity()
    return {"featured": featured}

@api_router.get("/global-vision/potential")
async def calculate_total_potential():
    """Calculate total potential if bot caught all opportunities"""
    opportunities = global_vision_service.get_historical_opportunities()
    potential = global_vision_service.calculate_total_potential(opportunities)
    return {"potential": potential}

@api_router.post("/global-vision/unlock")
async def unlock_global_vision(req: DepositRequest):
    """Unlock Global Vision feature (9.9U)"""
    wallet_address = req.wallet_address.lower()
    
    # Check if user exists
    user = await db.users.find_one({"wallet_address": wallet_address})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if already has global vision
    if user.get("has_global_vision"):
        return {"success": True, "message": "Already unlocked"}
    
    # Process payment (9.9U)
    if req.amount < 9.9:
        raise HTTPException(status_code=400, detail="Global Vision requires 9.9U payment")
    
    # Get current prices
    prices = await get_crypto_prices()
    
    if req.currency not in prices:
        raise HTTPException(status_code=400, detail=f"Unsupported currency: {req.currency}")
    
    usd_value = req.amount * prices[req.currency]
    
    if usd_value < 9.8:  # Allow 9.8+ to account for floating point
        raise HTTPException(status_code=400, detail="Payment too low for Global Vision")
    
    # Record payment
    deposit = Deposit(
        wallet_address=wallet_address,
        currency=req.currency,
        amount=req.amount,
        usd_value=usd_value,
        tx_hash=req.tx_hash,
        status="confirmed"
    )
    
    deposit_dict = deposit.model_dump()
    deposit_dict['timestamp'] = deposit_dict['timestamp'].isoformat()
    await db.deposits.insert_one(deposit_dict)
    
    # Update user balance and unlock feature
    await db.users.update_one(
        {"wallet_address": wallet_address},
        {
            "$inc": {"balance_usd": usd_value},
            "$set": {"has_global_vision": True}
        }
    )
    
    # Update tier if needed
    await update_user_tier(wallet_address)
    
    logger.info(f"Global Vision unlocked for {wallet_address}")
    
    return {
        "success": True,
        "message": "Global Vision unlocked!",
        "new_balance": user["balance_usd"] + usd_value
    }

# ============ DEMO DATA APIs ============

@api_router.get("/demo/trades/{bot_id}")
async def get_demo_trades(bot_id: str, num_trades: int = 20):
    """Get demo trade history for showcase"""
    trades = demo_data_generator.generate_trade_history(bot_id, num_trades)
    return {"trades": trades}

@api_router.get("/demo/bot-stats")
async def get_demo_bot_stats():
    """Get impressive demo bot statistics"""
    stats = demo_data_generator.generate_demo_bot_stats()
    return {"stats": stats}

@api_router.get("/demo/market-analysis")
async def get_demo_market_analysis():
    """Get current market analysis with AI insights"""
    analysis = demo_data_generator.generate_market_analysis()
    return {"analysis": analysis}

@api_router.get("/demo/profit-chart")
async def get_demo_profit_chart(days: int = 30):
    """Get profit chart data for visualization"""
    chart_data = demo_data_generator.generate_profit_chart_data(days)
    return {"chart_data": chart_data}

@api_router.get("/demo/bot-evolution/{bot_id}")
async def get_demo_bot_evolution(bot_id: str, level: int = 5):
    """Get bot skill evolution history"""
    events = demo_data_generator.generate_bot_evolution_events(bot_id, level)
    return {"evolution_events": events}

# ============ VIP TRADING COMMANDS APIs ============

@api_router.get("/vip/trading-commands")
async def get_vip_trading_commands(days: int = 7, initial_capital: float = 10000):
    """
    Get VIP trading commands timeline
    Shows what would happen if user 100% followed bot commands
    """
    result = vip_trading_commands_service.generate_trading_commands(
        days=days,
        initial_capital=initial_capital,
        win_rate=0.72
    )
    return result

@api_router.get("/vip/live-command")
async def get_vip_live_command():
    """Get a single live trading command (real-time simulation)"""
    command = vip_trading_commands_service.get_live_command()
    return {"command": command}

@api_router.get("/vip/supported-markets")
async def get_supported_markets():
    """Get list of supported markets for VIP API integration"""
    markets = global_vision_service.get_supported_markets()
    return {"markets": markets}

@api_router.get("/global-vision/categories")
async def get_global_vision_categories():
    """Get all Global Vision categories with counts"""
    categories = global_vision_service.get_categories()
    return {"categories": categories}

@api_router.get("/global-vision/by-timeframe/{timeframe}")
async def get_opportunities_by_timeframe(timeframe: str):
    """Get opportunities filtered by timeframe (yesterday, 1year, 3year, 5year, 10year)"""
    opportunities = global_vision_service.get_opportunities_by_timeframe(timeframe)
    return {"opportunities": opportunities, "count": len(opportunities)}

@api_router.get("/global-vision/by-market/{market_type}")
async def get_opportunities_by_market(market_type: str):
    """Get opportunities filtered by market type (crypto, stock, futures, options, etc.)"""
    opportunities = global_vision_service.get_opportunities_by_market(market_type)
    return {"opportunities": opportunities, "count": len(opportunities)}

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

@app.on_event("startup")
async def startup_event():
    logger.info("AIfund.com API started successfully!")

