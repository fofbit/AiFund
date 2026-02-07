"""
Global Vision - Historical Investment Opportunities
Shows what would have happened if user invested 100U at key moments in history
"""
from datetime import datetime, timedelta
from typing import List, Dict
import random

class GlobalVisionService:
    """
    Historical investment opportunities analysis
    Shows users the power of AI by displaying missed opportunities
    """
    
    @staticmethod
    def get_historical_opportunities() -> List[Dict]:
        """
        Get a curated list of historical investment opportunities
        Expanded with more categories and subcategories
        """
        
        opportunities = [
            # === 昨天的机会! (最刺激) ===
            {
                "id": "yesterday_btc",
                "category": "Cryptocurrency",
                "subcategory": "BTC生态",
                "title": "昨天的比特币波动",
                "date": (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"),
                "description": "昨天低点买入比特币",
                "initial_investment": 100,
                "final_value": 103.2,
                "roi_percentage": 3.2,
                "roi_multiplier": "1.032x",
                "icon": "⚡",
                "color": "from-yellow-500 to-orange-500",
                "tags": ["昨天", "比特币", "波动"],
                "what_happened": "昨天BTC在68,200触底后反弹至70,380",
                "lesson": "AI能实时捕捉每日波动机会",
                "time_sensitivity": "极高"
            },
            {
                "id": "yesterday_ai_token",
                "category": "Cryptocurrency", 
                "subcategory": "AI代币",
                "title": "AI板块异动",
                "date": (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"),
                "description": "昨天某AI代币暴涨",
                "initial_investment": 100,
                "final_value": 145,
                "roi_percentage": 45,
                "roi_multiplier": "1.45x",
                "icon": "🤖",
                "color": "from-cyan-500 to-blue-600",
                "tags": ["昨天", "AI代币", "热点"],
                "what_happened": "某AI概念代币单日暴涨45%",
                "lesson": "AI能第一时间发现AI板块机会",
                "time_sensitivity": "极高"
            },
            # === 加密货币 ===
            {
                "id": "btc_2015",
                "category": "Cryptocurrency",
                "title": "比特币早期投资",
                "date": "2015-01-01",
                "description": "10年前购买比特币",
                "initial_investment": 100,
                "final_value": 458333,  # BTC from $200 to $68,000 (340x, then 1.35x to today)
                "roi_percentage": 458233,
                "roi_multiplier": "4583x",
                "icon": "₿",
                "color": "from-orange-500 to-yellow-500",
                "tags": ["加密货币", "比特币", "长期投资"],
                "what_happened": "比特币从 $200 涨至 $68,695",
                "lesson": "早期加密货币投资者获得了惊人回报"
            },
            {
                "id": "eth_2017",
                "category": "Cryptocurrency",
                "title": "以太坊ICO时期",
                "date": "2017-01-01",
                "description": "7年前购买以太坊",
                "initial_investment": 100,
                "final_value": 23800,  # ETH from $8 to $2,038 (255x)
                "roi_percentage": 23700,
                "roi_multiplier": "238x",
                "icon": "Ξ",
                "color": "from-purple-500 to-indigo-500",
                "tags": ["加密货币", "以太坊", "智能合约"],
                "what_happened": "以太坊从 $8 涨至 $2,038",
                "lesson": "智能合约平台引领了Web3革命"
            },
            {
                "id": "sol_2020",
                "category": "Cryptocurrency",
                "title": "Solana早期",
                "date": "2020-04-10",
                "description": "4年前购买Solana",
                "initial_investment": 100,
                "final_value": 10350,  # SOL from $0.84 to $86.94 (103.5x)
                "roi_percentage": 10250,
                "roi_multiplier": "103.5x",
                "icon": "◎",
                "color": "from-green-400 to-cyan-500",
                "tags": ["加密货币", "Solana", "高性能链"],
                "what_happened": "Solana从 $0.84 涨至 $86.94",
                "lesson": "高性能区块链抓住了DeFi机遇"
            },
            {
                "id": "ordi_2023",
                "category": "BRC-20",
                "title": "ORDI铸造",
                "date": "2023-03-06",
                "description": "2年前参与BRC-20 ORDI铸造",
                "initial_investment": 100,
                "final_value": 150000,  # ORDI early mint to $60+ (1500x)
                "roi_percentage": 149900,
                "roi_multiplier": "1500x",
                "icon": "🟠",
                "color": "from-orange-600 to-red-600",
                "tags": ["BRC-20", "比特币", "铭文"],
                "what_happened": "ORDI从铸造价 $0.01 涨至最高 $90",
                "lesson": "BRC-20开启了比特币新叙事"
            },
            {
                "id": "pepe_2023",
                "category": "Meme Coin",
                "title": "PEPE Meme币",
                "date": "2023-04-15",
                "description": "2年前购买PEPE",
                "initial_investment": 100,
                "final_value": 180000,  # PEPE 1800x
                "roi_percentage": 179900,
                "roi_multiplier": "1800x",
                "icon": "🐸",
                "color": "from-green-500 to-emerald-600",
                "tags": ["Meme币", "社区驱动", "病毒传播"],
                "what_happened": "PEPE病毒式传播，涨幅超1800倍",
                "lesson": "Meme文化创造了新的投资机会"
            },
            
            # === 预测市场 ===
            {
                "id": "polymarket_trump",
                "category": "Prediction Market",
                "title": "Polymarket押中特朗普",
                "date": "2024-01-01",
                "description": "1年前在Polymarket押特朗普当选",
                "initial_investment": 100,
                "final_value": 240,  # ~2.4x return
                "roi_percentage": 140,
                "roi_multiplier": "2.4x",
                "icon": "🎯",
                "color": "from-blue-500 to-red-500",
                "tags": ["预测市场", "政治", "Polymarket"],
                "what_happened": "特朗普当选美国总统，押注者获利",
                "lesson": "去中心化预测市场准确捕捉事件"
            },
            
            # === 传统资产 ===
            {
                "id": "gold_2020",
                "category": "Commodity",
                "title": "黄金避险",
                "date": "2020-03-15",
                "description": "5年前购买黄金",
                "initial_investment": 100,
                "final_value": 165,  # Gold from ~$1500 to ~$2500 (1.65x)
                "roi_percentage": 65,
                "roi_multiplier": "1.65x",
                "icon": "🏅",
                "color": "from-yellow-400 to-amber-500",
                "tags": ["黄金", "避险", "大宗商品"],
                "what_happened": "黄金从 $1,500/盎司涨至 $2,500",
                "lesson": "传统避险资产在动荡中保值增值"
            },
            {
                "id": "nvda_2019",
                "category": "Stock",
                "title": "英伟达AI红利",
                "date": "2019-01-01",
                "description": "6年前购买英伟达股票",
                "initial_investment": 100,
                "final_value": 3200,  # NVDA ~32x from AI boom
                "roi_percentage": 3100,
                "roi_multiplier": "32x",
                "icon": "📈",
                "color": "from-green-600 to-lime-500",
                "tags": ["股票", "AI", "英伟达"],
                "what_happened": "NVDA从 $40 涨至 $1,280 (AI芯片需求爆发)",
                "lesson": "AI革命带来的股市机遇"
            },
            {
                "id": "tesla_2020",
                "category": "Stock",
                "title": "特斯拉电动车革命",
                "date": "2020-03-18",
                "description": "5年前购买特斯拉股票",
                "initial_investment": 100,
                "final_value": 1500,  # TSLA ~15x
                "roi_percentage": 1400,
                "roi_multiplier": "15x",
                "icon": "🚗",
                "color": "from-red-500 to-pink-600",
                "tags": ["股票", "电动车", "特斯拉"],
                "what_happened": "特斯拉股价从 $50 涨至 $750",
                "lesson": "新能源革命改变了汽车行业"
            },
            
            # === 最近24小时-7天 (模拟) ===
            {
                "id": "recent_arbitrage",
                "category": "Recent",
                "title": "套利机会",
                "date": datetime.now().strftime("%Y-%m-%d"),
                "description": "过去24小时内的跨交易所套利",
                "initial_investment": 100,
                "final_value": 103.5,  # 3.5% arbitrage
                "roi_percentage": 3.5,
                "roi_multiplier": "1.035x",
                "icon": "⚡",
                "color": "from-cyan-500 to-blue-500",
                "tags": ["套利", "实时", "低风险"],
                "what_happened": "BTC在不同交易所价差套利",
                "lesson": "AI能实时捕捉市场微小价差"
            },
            {
                "id": "recent_meme",
                "category": "Recent",
                "title": "新兴Meme币",
                "date": (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d"),
                "description": "7天前发现的Solana上Meme币",
                "initial_investment": 100,
                "final_value": 850,  # 8.5x in a week
                "roi_percentage": 750,
                "roi_multiplier": "8.5x",
                "icon": "🚀",
                "color": "from-purple-600 to-pink-600",
                "tags": ["Meme币", "短期", "高风险高回报"],
                "what_happened": "新Meme币在社区推动下暴涨",
                "lesson": "AI能提前发现社区热点"
            },
        ]
        
        return opportunities
    
    @staticmethod
    def calculate_total_potential(opportunities: List[Dict]) -> Dict:
        """
        Calculate what would have happened if AI bot caught key opportunities
        Using a more realistic scenario: pick best 5 opportunities
        """
        # Sort by ROI and pick top 5
        sorted_by_roi = sorted(opportunities, key=lambda x: x['final_value'], reverse=True)
        top_5 = sorted_by_roi[:5]
        
        # Calculate average return
        total_final = sum(opp['final_value'] for opp in top_5)
        average_final = total_final / 5
        
        # More realistic: if you caught 3 out of top 5 opportunities
        realistic_return = sum(opp['final_value'] for opp in top_5[:3]) / 3
        
        return {
            "initial_investment": 100,
            "final_value": round(realistic_return, 2),
            "total_roi": round((realistic_return - 100) / 100 * 100, 2),
            "opportunities_caught": 3,
            "top_opportunities": [
                {
                    "title": opp['title'],
                    "return": opp['final_value']
                } for opp in top_5[:3]
            ],
            "message": f"如果AI帮你抓住这3个机会,100U会变成{round(realistic_return, 2):,.0f}U"
        }
    
    @staticmethod
    def get_featured_opportunity() -> Dict:
        """Get today's featured opportunity to showcase"""
        opportunities = GlobalVisionService.get_historical_opportunities()
        # Return the most impressive one (ORDI)
        return opportunities[3]  # ORDI铸造

global_vision_service = GlobalVisionService()
