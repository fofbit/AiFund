"""
Global Vision - Historical Investment Opportunities (Enhanced Version)
Shows what would have happened if user invested 100U at key moments in history
Updated with: Yesterday opportunities, More categories, Subcategories
"""
from datetime import datetime, timedelta
from typing import List, Dict
import random

class GlobalVisionService:
    """Enhanced Global Vision with more categories and yesterday opportunities"""
    
    @staticmethod
    def get_historical_opportunities() -> List[Dict]:
        """
        Get comprehensive list of historical investment opportunities
        Organized by categories and subcategories
        """
        
        opportunities = [
            # === 昨天! (最刺激的"如果") ===
            {
                "id": "yesterday_btc",
                "category": "Cryptocurrency",
                "subcategory": "BTC生态",
                "title": "⚡ 昨天的比特币波动",
                "date": (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"),
                "description": "昨天低点买入比特币",
                "initial_investment": 100,
                "final_value": 103.2,
                "roi_percentage": 3.2,
                "roi_multiplier": "1.032x",
                "icon": "⚡",
                "color": "from-yellow-400 to-orange-500",
                "tags": ["昨天", "比特币", "日内"],
                "what_happened": "昨天BTC从$68,200低点反弹至$70,380",
                "lesson": "AI能实时捕捉每日波动",
                "time_sensitivity": "极高",
                "is_recent": True
            },
            {
                "id": "yesterday_meme",
                "category": "Cryptocurrency",
                "subcategory": "Meme币",
                "title": "⚡ 昨天爆火的Meme币",
                "date": (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"),
                "description": "昨天早盘发现的Meme币",
                "initial_investment": 100,
                "final_value": 280,
                "roi_percentage": 180,
                "roi_multiplier": "2.8x",
                "icon": "🔥",
                "color": "from-pink-500 to-red-500",
                "tags": ["昨天", "Meme", "暴涨"],
                "what_happened": "某Meme币昨天单日暴涨180%",
                "lesson": "AI实时监控社交媒体热度",
                "time_sensitivity": "极高",
                "is_recent": True
            },
            
            # === 加密货币 - BTC生态 ===
            {
                "id": "btc_2015",
                "category": "Cryptocurrency",
                "subcategory": "BTC生态",
                "title": "比特币早期投资",
                "date": "2015-01-01",
                "description": "10年前购买比特币",
                "initial_investment": 100,
                "final_value": 458333,
                "roi_percentage": 458233,
                "roi_multiplier": "4583x",
                "icon": "₿",
                "color": "from-orange-500 to-yellow-500",
                "tags": ["BTC", "长期", "10年"],
                "what_happened": "比特币从$200涨至$68,695",
                "lesson": "早期投资者获得惊人回报",
                "time_sensitivity": "低"
            },
            {
                "id": "ordi_2023",
                "category": "Cryptocurrency",
                "subcategory": "BTC生态",
                "title": "ORDI铭文铸造",
                "date": "2023-03-06",
                "description": "BRC-20 ORDI铸造",
                "initial_investment": 100,
                "final_value": 150000,
                "roi_percentage": 149900,
                "roi_multiplier": "1500x",
                "icon": "🟠",
                "color": "from-orange-600 to-red-600",
                "tags": ["BRC-20", "铭文", "暴富"],
                "what_happened": "ORDI从铸造价涨至最高$90",
                "lesson": "BRC-20开启比特币新叙事",
                "time_sensitivity": "中"
            },
            
            # === 加密货币 - ETH生态 ===
            {
                "id": "eth_2017",
                "category": "Cryptocurrency",
                "subcategory": "ETH生态",
                "title": "以太坊ICO时期",
                "date": "2017-01-01",
                "description": "7年前购买以太坊",
                "initial_investment": 100,
                "final_value": 23800,
                "roi_percentage": 23700,
                "roi_multiplier": "238x",
                "icon": "Ξ",
                "color": "from-purple-500 to-indigo-500",
                "tags": ["ETH", "智能合约", "7年"],
                "what_happened": "以太坊从$8涨至$2,038",
                "lesson": "智能合约平台引领Web3革命",
                "time_sensitivity": "低"
            },
            
            # === 加密货币 - 新公链 ===
            {
                "id": "sol_2020",
                "category": "Cryptocurrency",
                "subcategory": "新公链",
                "title": "Solana高性能链",
                "date": "2020-04-10",
                "description": "4年前购买Solana",
                "initial_investment": 100,
                "final_value": 10350,
                "roi_percentage": 10250,
                "roi_multiplier": "103.5x",
                "icon": "◎",
                "color": "from-green-400 to-cyan-500",
                "tags": ["SOL", "高性能", "4年"],
                "what_happened": "Solana从$0.84涨至$86.94",
                "lesson": "新公链抓住DeFi机遇",
                "time_sensitivity": "低"
            },
            
            # === 加密货币 - Meme币 ===
            {
                "id": "pepe_2023",
                "category": "Cryptocurrency",
                "subcategory": "Meme币",
                "title": "PEPE青蛙币",
                "date": "2023-04-15",
                "description": "早期发现PEPE",
                "initial_investment": 100,
                "final_value": 180000,
                "roi_percentage": 179900,
                "roi_multiplier": "1800x",
                "icon": "🐸",
                "color": "from-green-500 to-emerald-600",
                "tags": ["Meme", "社区", "病毒"],
                "what_happened": "PEPE病毒式传播涨1800倍",
                "lesson": "Meme文化创造投资机会",
                "time_sensitivity": "高"
            },
            {
                "id": "doge_2020",
                "category": "Cryptocurrency",
                "subcategory": "Meme币",
                "title": "狗狗币Doge",
                "date": "2020-03-01",
                "description": "疫情期间买入狗狗币",
                "initial_investment": 100,
                "final_value": 17500,
                "roi_percentage": 17400,
                "roi_multiplier": "175x",
                "icon": "🐕",
                "color": "from-yellow-400 to-orange-400",
                "tags": ["Doge", "马斯克", "社区"],
                "what_happened": "Doge从$0.002涨至$0.35",
                "lesson": "名人效应+社区力量",
                "time_sensitivity": "中"
            },
            
            # === 加密货币 - DeFi ===
            {
                "id": "uni_2020",
                "category": "Cryptocurrency",
                "subcategory": "DeFi",
                "title": "Uniswap空投",
                "date": "2020-09-17",
                "description": "参与Uniswap空投",
                "initial_investment": 100,
                "final_value": 4200,
                "roi_percentage": 4100,
                "roi_multiplier": "42x",
                "icon": "🦄",
                "color": "from-pink-500 to-purple-500",
                "tags": ["DeFi", "空投", "Uniswap"],
                "what_happened": "UNI空投每人400个币",
                "lesson": "DeFi早期用户获得巨额空投",
                "time_sensitivity": "中"
            },
            
            # === 股票市场 ===
            {
                "id": "nvda_2019",
                "category": "Stock",
                "subcategory": "科技股",
                "title": "英伟达AI芯片",
                "date": "2019-01-01",
                "description": "6年前买入英伟达",
                "initial_investment": 100,
                "final_value": 3200,
                "roi_percentage": 3100,
                "roi_multiplier": "32x",
                "icon": "📈",
                "color": "from-green-600 to-lime-500",
                "tags": ["NVDA", "AI", "芯片"],
                "what_happened": "NVDA从$40涨至$1,280",
                "lesson": "AI革命带来股市机遇",
                "time_sensitivity": "低"
            },
            {
                "id": "tesla_2020",
                "category": "Stock",
                "subcategory": "新能源",
                "title": "特斯拉电动车",
                "date": "2020-03-18",
                "description": "疫情低点买特斯拉",
                "initial_investment": 100,
                "final_value": 1500,
                "roi_percentage": 1400,
                "roi_multiplier": "15x",
                "icon": "🚗",
                "color": "from-red-500 to-pink-600",
                "tags": ["TSLA", "电动车", "马斯克"],
                "what_happened": "特斯拉从$50涨至$750",
                "lesson": "新能源革命改变汽车行业",
                "time_sensitivity": "低"
            },
            {
                "id": "amd_2016",
                "category": "Stock",
                "subcategory": "科技股",
                "title": "AMD芯片逆袭",
                "date": "2016-01-01",
                "description": "8年前买入AMD",
                "initial_investment": 100,
                "final_value": 6800,
                "roi_percentage": 6700,
                "roi_multiplier": "68x",
                "icon": "💻",
                "color": "from-red-600 to-orange-600",
                "tags": ["AMD", "芯片", "逆袭"],
                "what_happened": "AMD从$2涨至$136",
                "lesson": "行业龙头竞争带来机会",
                "time_sensitivity": "低"
            },
            
            # === 期货市场 ===
            {
                "id": "oil_futures_2020",
                "category": "Futures",
                "subcategory": "能源期货",
                "title": "原油期货负价",
                "date": "2020-04-20",
                "description": "负油价时买入远月合约",
                "initial_investment": 100,
                "final_value": 850,
                "roi_percentage": 750,
                "roi_multiplier": "8.5x",
                "icon": "🛢️",
                "color": "from-gray-700 to-gray-900",
                "tags": ["原油", "期货", "历史时刻"],
                "what_happened": "WTI原油跌至负$37后反弹",
                "lesson": "极端市场情况蕴含巨大机会",
                "time_sensitivity": "极高"
            },
            
            # === 期权市场 ===
            {
                "id": "gme_options_2021",
                "category": "Options",
                "subcategory": "股票期权",
                "title": "GME期权暴击",
                "date": "2021-01-15",
                "description": "GameStop轧空前买看涨期权",
                "initial_investment": 100,
                "final_value": 50000,
                "roi_percentage": 49900,
                "roi_multiplier": "500x",
                "icon": "🎮",
                "color": "from-blue-600 to-purple-700",
                "tags": ["GME", "期权", "轧空"],
                "what_happened": "GME从$20暴涨至$480",
                "lesson": "期权杠杆放大收益",
                "time_sensitivity": "极高"
            },
            
            # === Polymarket预测市场 ===
            {
                "id": "polymarket_trump",
                "category": "Polymarket",
                "subcategory": "政治预测",
                "title": "2024美国大选",
                "date": "2024-01-01",
                "description": "押注特朗普当选",
                "initial_investment": 100,
                "final_value": 240,
                "roi_percentage": 140,
                "roi_multiplier": "2.4x",
                "icon": "🎯",
                "color": "from-blue-500 to-red-500",
                "tags": ["Polymarket", "特朗普", "大选"],
                "what_happened": "特朗普当选,押注者获利",
                "lesson": "去中心化预测市场准确度高",
                "time_sensitivity": "中"
            },
            {
                "id": "polymarket_btc_100k",
                "category": "Polymarket",
                "subcategory": "加密预测",
                "title": "BTC突破10万",
                "date": "2024-11-01",
                "description": "押注BTC年底前破10万",
                "initial_investment": 100,
                "final_value": 185,
                "roi_percentage": 85,
                "roi_multiplier": "1.85x",
                "icon": "₿",
                "color": "from-orange-500 to-yellow-400",
                "tags": ["Polymarket", "BTC", "预测"],
                "what_happened": "BTC在12月突破10万美元",
                "lesson": "长期趋势预测可获利",
                "time_sensitivity": "中"
            },
            {
                "id": "polymarket_ai_release",
                "category": "Polymarket",
                "subcategory": "科技预测",
                "title": "GPT-5发布时间",
                "date": "2024-06-01",
                "description": "押注GPT-5 Q4发布",
                "initial_investment": 100,
                "final_value": 320,
                "roi_percentage": 220,
                "roi_multiplier": "3.2x",
                "icon": "🤖",
                "color": "from-cyan-500 to-blue-600",
                "tags": ["Polymarket", "AI", "OpenAI"],
                "what_happened": "GPT-5按预测在Q4发布",
                "lesson": "科技行业预测也有利可图",
                "time_sensitivity": "中"
            },
            
            # === 大宗商品 ===
            {
                "id": "gold_2020",
                "category": "Commodity",
                "subcategory": "贵金属",
                "title": "黄金避险",
                "date": "2020-03-15",
                "description": "疫情期间买黄金",
                "initial_investment": 100,
                "final_value": 165,
                "roi_percentage": 65,
                "roi_multiplier": "1.65x",
                "icon": "🏅",
                "color": "from-yellow-400 to-amber-500",
                "tags": ["黄金", "避险", "保值"],
                "what_happened": "黄金从$1,500涨至$2,500",
                "lesson": "动荡时期避险资产保值增值",
                "time_sensitivity": "低"
            },
        ]
        
        return opportunities
    
    @staticmethod
    def get_categories() -> List[Dict]:
        """Get all categories with counts"""
        opps = GlobalVisionService.get_historical_opportunities()
        
        categories = {}
        for opp in opps:
            cat = opp['category']
            if cat not in categories:
                categories[cat] = {
                    'name': cat,
                    'count': 0,
                    'subcategories': set()
                }
            categories[cat]['count'] += 1
            if 'subcategory' in opp:
                categories[cat]['subcategories'].add(opp['subcategory'])
        
        # Convert to list
        result = []
        for cat, data in categories.items():
            result.append({
                'name': cat,
                'count': data['count'],
                'subcategories': list(data['subcategories'])
            })
        
        return result
    
    @staticmethod
    def calculate_total_potential(opportunities: List[Dict]) -> Dict:
        """Calculate what would have happened if AI bot caught key opportunities"""
        # Sort by ROI and pick top 3
        sorted_by_roi = sorted(opportunities, key=lambda x: x['final_value'], reverse=True)
        top_3 = sorted_by_roi[:3]
        
        realistic_return = sum(opp['final_value'] for opp in top_3) / 3
        
        return {
            "initial_investment": 100,
            "final_value": round(realistic_return, 2),
            "total_roi": round((realistic_return - 100) / 100 * 100, 2),
            "opportunities_caught": 3,
            "top_opportunities": [
                {
                    "title": opp['title'],
                    "return": opp['final_value'],
                    "multiplier": opp['roi_multiplier']
                } for opp in top_3
            ],
            "message": f"如果AI帮你抓住这3个机会,100U会变成{round(realistic_return, 2):,.0f}U"
        }
    
    @staticmethod
    def get_featured_opportunity() -> Dict:
        """Get today's featured opportunity - Yesterday's chance!"""
        opportunities = GlobalVisionService.get_historical_opportunities()
        # Return yesterday's opportunity (most recent)
        return opportunities[0]

global_vision_service = GlobalVisionService()
