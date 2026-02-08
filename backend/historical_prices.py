"""
Historical Price Data Service
Provides real historical price data for Time Travel animations
"""
from datetime import datetime, timedelta
from typing import List, Dict
import math

class HistoricalPriceService:
    """Generate realistic historical price data for various assets"""
    
    # BTC historical milestones (approximate real data)
    BTC_HISTORY = [
        {"date": "2010-07-17", "price": 0.05, "event": "首次有记录的交易价格"},
        {"date": "2010-10-01", "price": 0.06, "event": "缓慢上涨"},
        {"date": "2011-02-09", "price": 1.00, "event": "首次达到1美元"},
        {"date": "2011-06-08", "price": 31.91, "event": "第一次泡沫顶峰"},
        {"date": "2011-11-17", "price": 2.05, "event": "泡沫破裂"},
        {"date": "2013-04-10", "price": 266.00, "event": "第二次泡沫"},
        {"date": "2013-12-04", "price": 1147.00, "event": "第一次突破1000美元"},
        {"date": "2014-01-14", "price": 850.00, "event": "Mt.Gox事件前"},
        {"date": "2015-01-14", "price": 200.00, "event": "熊市底部"},
        {"date": "2016-07-09", "price": 650.00, "event": "第二次减半"},
        {"date": "2017-01-01", "price": 998.00, "event": "新年开始"},
        {"date": "2017-12-17", "price": 19783.00, "event": "历史最高点"},
        {"date": "2018-12-15", "price": 3200.00, "event": "熊市底部"},
        {"date": "2020-03-12", "price": 4800.00, "event": "新冠崩盘"},
        {"date": "2020-05-11", "price": 8600.00, "event": "第三次减半"},
        {"date": "2020-12-16", "price": 20000.00, "event": "突破前高"},
        {"date": "2021-04-14", "price": 64800.00, "event": "新高"},
        {"date": "2021-11-10", "price": 69000.00, "event": "历史最高"},
        {"date": "2022-11-21", "price": 15500.00, "event": "FTX崩盘后"},
        {"date": "2024-01-11", "price": 46000.00, "event": "ETF获批"},
        {"date": "2024-03-14", "price": 73000.00, "event": "新高"},
        {"date": "2024-12-05", "price": 100000.00, "event": "突破10万"},
        {"date": "2025-01-20", "price": 105000.00, "event": "特朗普就职"},
    ]
    
    # ETH historical milestones
    ETH_HISTORY = [
        {"date": "2015-08-07", "price": 1.00, "event": "上线首日"},
        {"date": "2016-03-14", "price": 12.00, "event": "早期上涨"},
        {"date": "2016-06-17", "price": 21.00, "event": "DAO事件前"},
        {"date": "2017-01-01", "price": 8.00, "event": "新年"},
        {"date": "2017-06-12", "price": 400.00, "event": "ICO狂热"},
        {"date": "2018-01-13", "price": 1430.00, "event": "历史高点"},
        {"date": "2018-12-15", "price": 84.00, "event": "熊市底部"},
        {"date": "2020-03-12", "price": 109.00, "event": "新冠崩盘"},
        {"date": "2021-05-12", "price": 4380.00, "event": "DeFi Summer后"},
        {"date": "2021-11-10", "price": 4865.00, "event": "历史最高"},
        {"date": "2022-06-18", "price": 880.00, "event": "熊市低点"},
        {"date": "2024-03-12", "price": 4000.00, "event": "牛市回归"},
    ]
    
    # Stock historical data
    NVDA_HISTORY = [
        {"date": "2019-01-02", "price": 33.00, "event": "AI前夜"},
        {"date": "2020-03-18", "price": 48.00, "event": "新冠低点"},
        {"date": "2021-11-22", "price": 82.00, "event": "GPU短缺"},
        {"date": "2023-01-03", "price": 14.50, "event": "调整低点"},
        {"date": "2023-05-25", "price": 39.00, "event": "AI爆发"},
        {"date": "2024-03-08", "price": 92.00, "event": "持续上涨"},
        {"date": "2024-06-18", "price": 135.00, "event": "全球市值第一"},
        {"date": "2025-01-01", "price": 140.00, "event": "继续创新高"},
    ]
    
    TSLA_HISTORY = [
        {"date": "2019-06-03", "price": 35.00, "event": "低谷期"},
        {"date": "2020-03-18", "price": 28.00, "event": "新冠低点"},
        {"date": "2020-08-31", "price": 86.00, "event": "拆股前"},
        {"date": "2021-01-25", "price": 180.00, "event": "持续上涨"},
        {"date": "2021-11-04", "price": 409.00, "event": "历史最高"},
        {"date": "2022-12-28", "price": 37.00, "event": "暴跌低点"},
        {"date": "2024-07-15", "price": 260.00, "event": "反弹"},
    ]
    
    PEPE_HISTORY = [
        {"date": "2023-04-14", "price": 0.00000001, "event": "创建"},
        {"date": "2023-04-17", "price": 0.0000001, "event": "开始交易"},
        {"date": "2023-05-05", "price": 0.0000044, "event": "首次暴涨"},
        {"date": "2023-06-20", "price": 0.0000008, "event": "回调"},
        {"date": "2024-03-14", "price": 0.000010, "event": "再次起飞"},
        {"date": "2024-05-27", "price": 0.000017, "event": "历史新高"},
        {"date": "2024-12-09", "price": 0.000025, "event": "持续上涨"},
    ]
    
    SOL_HISTORY = [
        {"date": "2020-04-10", "price": 0.50, "event": "上线"},
        {"date": "2021-01-01", "price": 1.50, "event": "起步"},
        {"date": "2021-09-09", "price": 213.00, "event": "首次高点"},
        {"date": "2021-11-06", "price": 259.00, "event": "历史最高"},
        {"date": "2022-11-09", "price": 12.00, "event": "FTX崩盘"},
        {"date": "2022-12-29", "price": 8.00, "event": "最低点"},
        {"date": "2024-03-18", "price": 200.00, "event": "强势回归"},
        {"date": "2024-11-24", "price": 263.00, "event": "新高"},
    ]
    
    @staticmethod
    def get_asset_history(asset_id: str) -> Dict:
        """Get historical data for a specific asset"""
        histories = {
            "btc_2015": {
                "name": "比特币 (BTC)",
                "symbol": "BTC",
                "data": HistoricalPriceService.BTC_HISTORY,
                "start_date": "2010-07-17",
                "start_price": 0.05,
                "investment_date": "2015-01-01",
                "investment_price": 200,
                "current_price": 91000,
                "color": "#F7931A"
            },
            "eth_2016": {
                "name": "以太坊 (ETH)",
                "symbol": "ETH", 
                "data": HistoricalPriceService.ETH_HISTORY,
                "start_date": "2015-08-07",
                "start_price": 1.00,
                "investment_date": "2016-01-01",
                "investment_price": 8,
                "current_price": 3600,
                "color": "#627EEA"
            },
            "nvda_2019": {
                "name": "英伟达 (NVDA)",
                "symbol": "NVDA",
                "data": HistoricalPriceService.NVDA_HISTORY,
                "start_date": "2019-01-02",
                "start_price": 33,
                "investment_date": "2024-01-01",
                "investment_price": 48,
                "current_price": 140,
                "color": "#76B900"
            },
            "tsla_2020": {
                "name": "特斯拉 (TSLA)",
                "symbol": "TSLA",
                "data": HistoricalPriceService.TSLA_HISTORY,
                "start_date": "2019-06-03",
                "start_price": 35,
                "investment_date": "2020-03-18",
                "investment_price": 28,
                "current_price": 260,
                "color": "#CC0000"
            },
            "pepe_2023": {
                "name": "PEPE币",
                "symbol": "PEPE",
                "data": HistoricalPriceService.PEPE_HISTORY,
                "start_date": "2023-04-14",
                "start_price": 0.00000001,
                "investment_date": "2023-04-17",
                "investment_price": 0.0000001,
                "current_price": 0.000018,
                "color": "#479F53"
            },
            "sol_2020": {
                "name": "Solana (SOL)",
                "symbol": "SOL",
                "data": HistoricalPriceService.SOL_HISTORY,
                "start_date": "2020-04-10",
                "start_price": 0.50,
                "investment_date": "2022-12-29",
                "investment_price": 8,
                "current_price": 180,
                "color": "#9945FF"
            },
        }
        return histories.get(asset_id, histories["btc_2015"])
    
    @staticmethod
    def generate_price_curve(history_data: List[Dict], num_points: int = 200) -> List[Dict]:
        """Generate smooth price curve from historical milestones"""
        if not history_data:
            return []
        
        result = []
        total_days = 0
        
        # Calculate total time span
        start = datetime.strptime(history_data[0]["date"], "%Y-%m-%d")
        end = datetime.strptime(history_data[-1]["date"], "%Y-%m-%d")
        total_days = (end - start).days
        
        if total_days == 0:
            return [{"x": 0, "price": history_data[0]["price"], "date": history_data[0]["date"]}]
        
        # Generate interpolated points
        for i in range(num_points):
            progress = i / (num_points - 1)
            current_day = int(progress * total_days)
            current_date = start + timedelta(days=current_day)
            
            # Find surrounding data points
            prev_milestone = history_data[0]
            next_milestone = history_data[-1]
            
            for j in range(len(history_data) - 1):
                m_date = datetime.strptime(history_data[j]["date"], "%Y-%m-%d")
                n_date = datetime.strptime(history_data[j+1]["date"], "%Y-%m-%d")
                
                if m_date <= current_date <= n_date:
                    prev_milestone = history_data[j]
                    next_milestone = history_data[j+1]
                    break
            
            # Interpolate price with some randomness for realism
            prev_date = datetime.strptime(prev_milestone["date"], "%Y-%m-%d")
            next_date = datetime.strptime(next_milestone["date"], "%Y-%m-%d")
            
            if prev_date == next_date:
                price = prev_milestone["price"]
            else:
                segment_progress = (current_date - prev_date).days / max(1, (next_date - prev_date).days)
                # Use logarithmic interpolation for large price changes
                if prev_milestone["price"] > 0 and next_milestone["price"] > 0:
                    log_prev = math.log(prev_milestone["price"])
                    log_next = math.log(next_milestone["price"])
                    log_price = log_prev + (log_next - log_prev) * segment_progress
                    price = math.exp(log_price)
                else:
                    price = prev_milestone["price"] + (next_milestone["price"] - prev_milestone["price"]) * segment_progress
            
            result.append({
                "x": i,
                "price": round(price, 8),
                "date": current_date.strftime("%Y-%m-%d"),
                "progress": progress
            })
        
        return result
    
    @staticmethod
    def get_milestones_for_animation(asset_id: str) -> List[Dict]:
        """Get key milestones for animation display"""
        history = HistoricalPriceService.get_asset_history(asset_id)
        return history.get("data", [])

historical_price_service = HistoricalPriceService()
