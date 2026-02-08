"""
Demo Data Generator - Creates realistic demo data for showcase
Provides mock trading data, bot evolution events, and market analysis
"""
import random
from datetime import datetime, timedelta, timezone
from typing import List, Dict
import math

class DemoDataGenerator:
    """Generate realistic demo data for the platform"""
    
    CRYPTO_SYMBOLS = ['BTC', 'ETH', 'SOL', 'DOGE', 'PEPE', 'ORDI', 'XRP', 'BNB']
    
    TRADE_REASONS_BUY = [
        "检测到MACD金叉信号，RSI处于超卖区域，建议买入",
        "AI分析: 鲸鱼地址大量买入，市场情绪转为贪婪",
        "技术面突破关键阻力位，成交量放大确认趋势",
        "社交媒体热度激增，FOMO情绪开始蔓延",
        "链上数据显示大量稳定币流入交易所，买盘即将启动",
        "发现潜在利好消息，机构资金正在布局",
        "波动率收窄后突破，看涨形态确认",
        "市场恐惧指数达到极端，历史上是买入良机"
    ]
    
    TRADE_REASONS_SELL = [
        "检测到MACD死叉信号，RSI进入超买区域，建议获利了结",
        "AI分析: 鲸鱼地址开始抛售，市场情绪转为恐惧",
        "技术面触及关键阻力位，成交量萎缩显示上涨乏力",
        "社交媒体过度乐观，历史表明需要谨慎",
        "链上数据显示大量代币流入交易所，抛压即将来临",
        "发现潜在利空消息，建议降低仓位",
        "达到预设止盈目标，锁定利润",
        "市场贪婪指数达到极端，历史上是卖出信号"
    ]
    
    BOT_SKILLS = [
        {"name": "Spot Trading", "level": 1, "description": "现货交易基础能力"},
        {"name": "趋势追踪", "level": 2, "description": "识别并跟随市场趋势"},
        {"name": "波段操作", "level": 3, "description": "捕捉短期价格波动"},
        {"name": "风险控制", "level": 4, "description": "智能止损止盈"},
        {"name": "情绪分析", "level": 5, "description": "分析市场情绪指标"},
        {"name": "链上数据分析", "level": 6, "description": "追踪鲸鱼钱包动向"},
        {"name": "跨市套利", "level": 7, "description": "发现套利机会"},
        {"name": "DeFi挖矿", "level": 8, "description": "自动参与流动性挖矿"},
        {"name": "NFT交易", "level": 9, "description": "发现潜力NFT项目"},
        {"name": "AI预测", "level": 10, "description": "高级机器学习预测模型"}
    ]
    
    @staticmethod
    def generate_trade_history(bot_id: str, num_trades: int = 20, 
                                start_balance: float = 10000,
                                win_rate: float = 0.65) -> List[Dict]:
        """Generate realistic trade history"""
        trades = []
        current_time = datetime.now(timezone.utc) - timedelta(days=7)
        balance = start_balance
        
        for i in range(num_trades):
            symbol = random.choice(DemoDataGenerator.CRYPTO_SYMBOLS)
            is_win = random.random() < win_rate
            action = random.choice(['buy', 'sell'])
            
            # Generate realistic price based on symbol
            base_prices = {
                'BTC': 68000, 'ETH': 3500, 'SOL': 180, 'DOGE': 0.12,
                'PEPE': 0.000012, 'ORDI': 45, 'XRP': 0.62, 'BNB': 580
            }
            price = base_prices.get(symbol, 100) * (1 + random.uniform(-0.05, 0.05))
            
            # Calculate trade amount (1-5% of balance)
            trade_value = balance * random.uniform(0.01, 0.05)
            amount = trade_value / price
            
            # Calculate profit/loss
            if is_win:
                profit_percent = random.uniform(0.02, 0.15)  # 2-15% profit
            else:
                profit_percent = -random.uniform(0.01, 0.08)  # 1-8% loss
            
            profit_loss = trade_value * profit_percent
            balance += profit_loss
            
            # Select appropriate reason
            if action == 'buy':
                reason = random.choice(DemoDataGenerator.TRADE_REASONS_BUY)
            else:
                reason = random.choice(DemoDataGenerator.TRADE_REASONS_SELL)
            
            trade = {
                "id": f"trade_{bot_id}_{i}",
                "bot_id": bot_id,
                "symbol": symbol,
                "action": action,
                "price": round(price, 6),
                "amount": round(amount, 8),
                "profit_loss": round(profit_loss, 2),
                "reason": reason,
                "timestamp": current_time.isoformat(),
                "is_simulated": True
            }
            trades.append(trade)
            
            # Advance time by 4-12 hours
            current_time += timedelta(hours=random.uniform(4, 12))
        
        return trades
    
    @staticmethod
    def generate_bot_evolution_events(bot_id: str, current_level: int = 1) -> List[Dict]:
        """Generate bot skill evolution events"""
        events = []
        current_time = datetime.now(timezone.utc) - timedelta(days=7)
        
        for skill in DemoDataGenerator.BOT_SKILLS[:current_level]:
            event = {
                "id": f"evolution_{bot_id}_{skill['level']}",
                "bot_id": bot_id,
                "type": "skill_unlock",
                "skill_name": skill['name'],
                "skill_description": skill['description'],
                "new_level": skill['level'],
                "timestamp": current_time.isoformat(),
                "message": f"🎉 你的Bot学会了新技能: {skill['name']}!"
            }
            events.append(event)
            current_time += timedelta(days=1)
        
        return events
    
    @staticmethod
    def generate_market_analysis() -> Dict:
        """Generate current market analysis"""
        btc_price = 68000 + random.uniform(-2000, 2000)
        eth_price = 3500 + random.uniform(-200, 200)
        
        fear_greed = random.randint(20, 80)
        if fear_greed < 30:
            sentiment = "极度恐惧"
            recommendation = "历史表明这是买入的好时机"
        elif fear_greed < 45:
            sentiment = "恐惧"
            recommendation = "市场情绪低迷，可考虑分批建仓"
        elif fear_greed < 55:
            sentiment = "中性"
            recommendation = "市场观望情绪浓厚，建议持有等待"
        elif fear_greed < 70:
            sentiment = "贪婪"
            recommendation = "市场偏乐观，注意控制风险"
        else:
            sentiment = "极度贪婪"
            recommendation = "市场过热，建议适当获利了结"
        
        return {
            "btc_price": round(btc_price, 2),
            "eth_price": round(eth_price, 2),
            "btc_24h_change": round(random.uniform(-5, 8), 2),
            "eth_24h_change": round(random.uniform(-6, 10), 2),
            "fear_greed_index": fear_greed,
            "sentiment": sentiment,
            "recommendation": recommendation,
            "trending_coins": random.sample(DemoDataGenerator.CRYPTO_SYMBOLS, 3),
            "hot_narratives": ["AI Agent", "RWA", "DePIN", "Meme Supercycle"],
            "whale_activity": random.choice([
                "鲸鱼正在大量买入BTC",
                "大额ETH从交易所流出",
                "稳定币市值创新高",
                "链上活跃度上升"
            ]),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    
    @staticmethod
    def generate_demo_bot_stats() -> Dict:
        """Generate impressive demo bot statistics"""
        total_trades = random.randint(50, 200)
        win_rate = random.uniform(0.58, 0.72)
        wins = int(total_trades * win_rate)
        
        # Generate cumulative profit that looks impressive
        base_profit = random.uniform(800, 2500)
        
        return {
            "total_trades": total_trades,
            "winning_trades": wins,
            "losing_trades": total_trades - wins,
            "win_rate": round(win_rate * 100, 1),
            "total_profit": round(base_profit, 2),
            "roi_percentage": round(base_profit / 100, 2),
            "best_trade": {
                "symbol": random.choice(["PEPE", "ORDI", "DOGE"]),
                "profit": round(random.uniform(200, 800), 2),
                "roi": round(random.uniform(15, 45), 1)
            },
            "current_positions": random.randint(0, 3),
            "avg_hold_time": f"{random.randint(2, 48)}小时",
            "sharpe_ratio": round(random.uniform(1.2, 2.5), 2)
        }
    
    @staticmethod
    def generate_profit_chart_data(days: int = 30, start_balance: float = 10000) -> List[Dict]:
        """Generate profit chart data with realistic curves"""
        data = []
        balance = start_balance
        
        for i in range(days + 1):
            date = datetime.now(timezone.utc) - timedelta(days=days-i)
            
            # Generate daily change with slight upward bias
            daily_change = random.gauss(0.008, 0.025)  # Mean 0.8% daily, std 2.5%
            balance *= (1 + daily_change)
            
            data.append({
                "date": date.strftime("%m/%d"),
                "balance": round(balance, 2),
                "profit": round(balance - start_balance, 2)
            })
        
        return data

demo_data_generator = DemoDataGenerator()
