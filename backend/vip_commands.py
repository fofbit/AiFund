"""
VIP Trading Commands Generator
Generates realistic bot trading commands and hypothetical execution results
Shows what users would earn if they 100% followed bot commands
"""
import random
from datetime import datetime, timedelta, timezone
from typing import List, Dict
import math

class VIPTradingCommandsService:
    """Generate VIP trading commands with execution results"""
    
    CRYPTO_PAIRS = [
        {'symbol': 'BTC/USDT', 'base_price': 68000, 'volatility': 0.03},
        {'symbol': 'ETH/USDT', 'base_price': 3500, 'volatility': 0.04},
        {'symbol': 'SOL/USDT', 'base_price': 180, 'volatility': 0.06},
        {'symbol': 'DOGE/USDT', 'base_price': 0.12, 'volatility': 0.08},
        {'symbol': 'PEPE/USDT', 'base_price': 0.000012, 'volatility': 0.15},
        {'symbol': 'ORDI/USDT', 'base_price': 45, 'volatility': 0.10},
        {'symbol': 'XRP/USDT', 'base_price': 0.62, 'volatility': 0.05},
        {'symbol': 'BNB/USDT', 'base_price': 580, 'volatility': 0.04},
    ]
    
    COMMAND_REASONS = {
        'buy': [
            "🔥 检测到主力资金大量流入，MACD金叉即将形成",
            "📊 AI模型预测价格将在4小时内上涨3-5%",
            "🐋 鲸鱼地址刚刚买入$2M，跟随大资金",
            "📈 突破关键阻力位${{price}}，趋势确认",
            "💡 社交媒体热度激增，FOMO即将启动",
            "🎯 链上数据显示巨鲸正在囤货",
            "⚡ 技术指标全面看涨，RSI刚离开超卖区",
            "🚀 发现利好消息即将公布，提前布局",
        ],
        'sell': [
            "⚠️ 检测到主力资金开始撤离，MACD死叉形成",
            "📊 AI模型预测价格将在2小时内回调2-4%",
            "🐋 鲸鱼地址开始抛售，跟随大资金离场",
            "📉 跌破关键支撑位${{price}}，止盈离场",
            "💡 社交媒体过度乐观，历史规律显示需要获利了结",
            "🎯 达到预设止盈目标，锁定利润",
            "⚡ 技术指标转空，RSI进入超买区域",
            "🔔 市场情绪过热，风险收益比不划算",
        ]
    }
    
    @staticmethod
    def generate_trading_commands(
        days: int = 7,
        commands_per_day: int = 6,
        initial_capital: float = 10000,
        win_rate: float = 0.72
    ) -> Dict:
        """
        Generate a timeline of trading commands with execution results
        
        Returns:
            Dict with commands list and summary statistics
        """
        commands = []
        current_capital = initial_capital
        total_profit = 0
        winning_trades = 0
        total_trades = 0
        
        current_time = datetime.now(timezone.utc) - timedelta(days=days)
        
        # Track positions
        positions = {}
        
        for day in range(days):
            daily_commands = random.randint(commands_per_day - 2, commands_per_day + 2)
            
            for _ in range(daily_commands):
                # Advance time randomly within the day
                current_time += timedelta(hours=random.uniform(2, 6))
                
                # Select a random pair
                pair = random.choice(VIPTradingCommandsService.CRYPTO_PAIRS)
                symbol = pair['symbol']
                base_price = pair['base_price']
                volatility = pair['volatility']
                
                # Determine if we should buy or sell based on current positions
                has_position = symbol in positions
                
                if has_position:
                    action = 'sell'
                else:
                    action = 'buy'
                
                # Generate price with some volatility
                price_change = random.uniform(-volatility, volatility)
                current_price = base_price * (1 + price_change + (day * 0.002))  # Slight upward trend
                
                # Determine if this is a winning trade
                is_winning = random.random() < win_rate
                
                # Calculate trade size (5-15% of capital)
                trade_percent = random.uniform(0.05, 0.15)
                trade_amount_usd = current_capital * trade_percent
                quantity = trade_amount_usd / current_price
                
                # Generate command reason
                reason_template = random.choice(VIPTradingCommandsService.COMMAND_REASONS[action])
                reason = reason_template.replace('{{price}}', f'{current_price:.2f}')
                
                if action == 'buy':
                    # Buy command
                    positions[symbol] = {
                        'entry_price': current_price,
                        'quantity': quantity,
                        'entry_time': current_time
                    }
                    
                    command = {
                        'id': f'cmd_{len(commands)}',
                        'timestamp': current_time.isoformat(),
                        'type': 'command',
                        'action': 'BUY',
                        'symbol': symbol,
                        'price': round(current_price, 6),
                        'quantity': round(quantity, 6),
                        'amount_usd': round(trade_amount_usd, 2),
                        'reason': reason,
                        'status': 'executed',
                        'confidence': random.randint(75, 95)
                    }
                    commands.append(command)
                    
                else:
                    # Sell command
                    entry_data = positions.pop(symbol, None)
                    if entry_data:
                        entry_price = entry_data['entry_price']
                        quantity = entry_data['quantity']
                        
                        # Calculate profit/loss
                        if is_winning:
                            profit_percent = random.uniform(0.02, 0.12)  # 2-12% profit
                        else:
                            profit_percent = -random.uniform(0.01, 0.05)  # 1-5% loss
                        
                        exit_price = entry_price * (1 + profit_percent)
                        profit_usd = quantity * (exit_price - entry_price)
                        
                        current_capital += profit_usd
                        total_profit += profit_usd
                        total_trades += 1
                        
                        if profit_usd > 0:
                            winning_trades += 1
                        
                        # Sell command
                        command = {
                            'id': f'cmd_{len(commands)}',
                            'timestamp': current_time.isoformat(),
                            'type': 'command',
                            'action': 'SELL',
                            'symbol': symbol,
                            'price': round(exit_price, 6),
                            'quantity': round(quantity, 6),
                            'amount_usd': round(quantity * exit_price, 2),
                            'reason': reason,
                            'status': 'executed',
                            'confidence': random.randint(70, 92)
                        }
                        commands.append(command)
                        
                        # Add result entry
                        result = {
                            'id': f'result_{len(commands)}',
                            'timestamp': (current_time + timedelta(minutes=1)).isoformat(),
                            'type': 'result',
                            'symbol': symbol,
                            'entry_price': round(entry_price, 6),
                            'exit_price': round(exit_price, 6),
                            'quantity': round(quantity, 6),
                            'profit_usd': round(profit_usd, 2),
                            'profit_percent': round(profit_percent * 100, 2),
                            'is_profit': profit_usd > 0,
                            'cumulative_profit': round(total_profit, 2),
                            'cumulative_capital': round(current_capital, 2)
                        }
                        commands.append(result)
        
        # Calculate platform fee (10%)
        platform_fee = total_profit * 0.10 if total_profit > 0 else 0
        user_net_profit = total_profit - platform_fee
        
        return {
            'commands': commands,
            'summary': {
                'initial_capital': initial_capital,
                'final_capital': round(current_capital, 2),
                'total_profit': round(total_profit, 2),
                'platform_fee_10_percent': round(platform_fee, 2),
                'user_net_profit': round(user_net_profit, 2),
                'total_trades': total_trades,
                'winning_trades': winning_trades,
                'win_rate': round((winning_trades / total_trades * 100) if total_trades > 0 else 0, 1),
                'roi_percent': round((total_profit / initial_capital * 100) if initial_capital > 0 else 0, 2),
                'user_net_roi': round((user_net_profit / initial_capital * 100) if initial_capital > 0 else 0, 2),
                'avg_profit_per_trade': round(total_profit / total_trades if total_trades > 0 else 0, 2),
                'days_covered': days,
                'platform_wallet': '0x7A9...3F2d (AIFund Official)'
            }
        }
    
    @staticmethod
    def get_live_command() -> Dict:
        """Generate a single live trading command (for real-time simulation)"""
        pair = random.choice(VIPTradingCommandsService.CRYPTO_PAIRS)
        action = random.choice(['BUY', 'SELL'])
        
        price_change = random.uniform(-pair['volatility'], pair['volatility'])
        current_price = pair['base_price'] * (1 + price_change)
        
        reason_key = action.lower()
        reason_template = random.choice(VIPTradingCommandsService.COMMAND_REASONS[reason_key])
        reason = reason_template.replace('{{price}}', f'{current_price:.2f}')
        
        return {
            'id': f'live_{datetime.now(timezone.utc).timestamp()}',
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'type': 'command',
            'action': action,
            'symbol': pair['symbol'],
            'price': round(current_price, 6),
            'quantity': round(random.uniform(0.01, 1.0), 6),
            'reason': reason,
            'status': 'pending',
            'confidence': random.randint(75, 95),
            'expires_in': '30秒内执行'
        }

vip_trading_commands_service = VIPTradingCommandsService()
