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
    tier: str = "inactive"  # inactive, basic, vip
    joined_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    referral_code: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    referred_by: Optional[str] = None

class Bot(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_wallet: str
    name: str
    avatar: str = "default_bot_1"
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
    
    # Create new bot
    new_bot = Bot(
        user_wallet=wallet_address,
        name=req.bot_name
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
