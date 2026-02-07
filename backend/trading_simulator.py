"""
AI Trading Simulator - Background Task
Simulates AI-powered trading for all active bots
"""
import os
import sys
import asyncio
import random
from pathlib import Path
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import logging

# Add backend to path
sys.path.append(str(Path(__file__).parent))

from ai_engine import AITradingEngine
from market_data import market_service

# Load environment
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Initialize AI Engine
ai_engine = AITradingEngine()

async def get_market_data():
    """Get current market data"""
    return {
        "BTC": {"price": 95000 + random.uniform(-1000, 1000), "trend": "up"},
        "ETH": {"price": 3500 + random.uniform(-100, 100), "trend": "up"},
        "SOL": {"price": 180 + random.uniform(-10, 10), "trend": "neutral"},
        "BNB": {"price": 650 + random.uniform(-20, 20), "trend": "up"},
        "XRP": {"price": 2.5 + random.uniform(-0.2, 0.2), "trend": "neutral"},
    }

async def execute_trade(bot, decision, market_data):
    """Execute a simulated trade based on AI decision"""
    
    if decision['action'] == 'hold':
        return None
    
    symbol = decision['symbol']
    price = market_data.get(symbol, {}).get('price', 0)
    
    if price == 0:
        return None
    
    # Calculate amount based on decision
    amount_usd = min(decision['amount_usd'], bot['virtual_balance'] * 0.2)
    amount_crypto = amount_usd / price
    
    # Simulate profit/loss (random for now, in production would track positions)
    profit_loss = random.uniform(-amount_usd * 0.05, amount_usd * 0.15)
    
    trade = {
        "id": str(random.randint(100000, 999999)),
        "bot_id": bot['id'],
        "symbol": symbol,
        "action": decision['action'],
        "price": price,
        "amount": amount_crypto,
        "profit_loss": profit_loss,
        "reason": decision['reason'],
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "is_simulated": True
    }
    
    # Save trade to database
    await db.trades.insert_one(trade)
    
    # Update bot stats
    new_balance = bot['virtual_balance'] + profit_loss
    new_total_profit = bot['total_profit'] + profit_loss
    new_total_trades = bot['total_trades'] + 1
    
    # Update win rate
    if profit_loss > 0:
        wins = int(bot['win_rate'] * bot['total_trades'] / 100) + 1
    else:
        wins = int(bot['win_rate'] * bot['total_trades'] / 100)
    
    new_win_rate = (wins / new_total_trades) * 100 if new_total_trades > 0 else 0
    
    # Update experience and level
    new_experience = bot['experience'] + 10
    new_level = bot['level'] + (1 if new_experience >= bot['level'] * 100 else 0)
    if new_level > bot['level']:
        new_experience = 0
    
    await db.bots.update_one(
        {"id": bot['id']},
        {
            "$set": {
                "virtual_balance": new_balance,
                "total_profit": new_total_profit,
                "total_trades": new_total_trades,
                "win_rate": new_win_rate,
                "experience": new_experience,
                "level": new_level
            }
        }
    )
    
    logger.info(f"Trade executed for {bot['name']}: {decision['action']} {symbol} @ ${price:.2f} | P/L: ${profit_loss:.2f}")
    
    # Check if bot should learn new ability
    if new_level > bot['level'] and len(bot.get('abilities', [])) < 5:
        new_ability = await ai_engine.discover_new_ability({
            'bot_id': bot['id'],
            'level': new_level,
            'total_trades': new_total_trades,
            'win_rate': new_win_rate,
            'abilities': bot.get('abilities', [])
        })
        
        if new_ability:
            await db.bots.update_one(
                {"id": bot['id']},
                {"$push": {"abilities": new_ability}}
            )
            logger.info(f"🎉 {bot['name']} learned new ability: {new_ability}")
    
    return trade

async def trade_for_bot(bot):
    """Run AI trading decision for a single bot"""
    try:
        # Get market data
        market_data = await get_market_data()
        
        # Prepare bot context
        bot_context = {
            'bot_id': bot['id'],
            'virtual_balance': bot['virtual_balance'],
            'level': bot['level'],
            'abilities': bot.get('abilities', []),
            'win_rate': bot.get('win_rate', 0),
            'total_trades': bot.get('total_trades', 0)
        }
        
        # Get AI decision
        decision = await ai_engine.analyze_market(market_data, bot_context)
        
        # Execute trade
        if decision['action'] != 'hold':
            await execute_trade(bot, decision, market_data)
        else:
            logger.info(f"{bot['name']}: Holding position - {decision['reason']}")
            
    except Exception as e:
        logger.error(f"Error trading for bot {bot.get('name', 'unknown')}: {e}")

async def trading_loop():
    """Main trading loop"""
    logger.info("🤖 AI Trading Simulator Started!")
    
    while True:
        try:
            # Get all active bots
            bots = await db.bots.find({"status": "active"}).to_list(1000)
            
            if not bots:
                logger.info("No active bots found. Waiting...")
            else:
                logger.info(f"Processing {len(bots)} active bots...")
                
                # Trade for each bot
                for bot in bots:
                    await trade_for_bot(bot)
                    await asyncio.sleep(2)  # Small delay between bots
            
            # Wait before next round (simulate every 30 seconds for demo)
            logger.info("Waiting 30 seconds before next trading round...")
            await asyncio.sleep(30)
            
        except KeyboardInterrupt:
            logger.info("Shutting down trading simulator...")
            break
        except Exception as e:
            logger.error(f"Error in trading loop: {e}")
            await asyncio.sleep(10)

if __name__ == "__main__":
    logger.info("Starting AIfund.com AI Trading Simulator...")
    asyncio.run(trading_loop())
