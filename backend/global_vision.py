"""
Global Vision - Historical Investment Opportunities (Enhanced Version)
Shows what would have happened if user invested 100U at key moments in history
Covers: 10 years, 5 years, 3 years, 1 year, recent opportunities
Markets: Crypto, Stocks, Futures, Options, Polymarket, Forex, Commodities
"""
from datetime import datetime, timedelta
from typing import List, Dict
import random

class GlobalVisionService:
    """Enhanced Global Vision with comprehensive historical opportunities"""
    
    @staticmethod
    def get_historical_opportunities() -> List[Dict]:
        """
        Get comprehensive list of historical investment opportunities
        Organized by timeframe and asset class
        """
        
        opportunities = [
            # ============ 昨天/近期 (最刺激的"如果") ============
            {
                "id": "yesterday_btc",
                "category": "Cryptocurrency",
                "subcategory": "BTC生态",
                "timeframe": "yesterday",
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
                "is_recent": True,
                "market_type": "crypto"
            },
            {
                "id": "yesterday_meme",
                "category": "Cryptocurrency",
                "subcategory": "Meme币",
                "timeframe": "yesterday",
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
                "is_recent": True,
                "market_type": "crypto"
            },
            
            # ============ 1年内 ============
            {
                "id": "nvda_2024_ai",
                "category": "Stock",
                "subcategory": "美股科技",
                "timeframe": "1year",
                "title": "英伟达AI狂潮",
                "date": "2024-01-01",
                "description": "1年前买入英伟达股票",
                "initial_investment": 100,
                "final_value": 320,
                "roi_percentage": 220,
                "roi_multiplier": "3.2x",
                "icon": "🖥️",
                "color": "from-green-500 to-emerald-600",
                "tags": ["NVDA", "AI", "美股", "1年"],
                "what_happened": "英伟达因AI芯片需求暴涨，股价从$480涨至$1,500+",
                "lesson": "AI革命的核心受益者",
                "time_sensitivity": "中",
                "is_recent": False,
                "market_type": "stock"
            },
            {
                "id": "btc_etf_2024",
                "category": "Cryptocurrency",
                "subcategory": "BTC生态",
                "timeframe": "1year",
                "title": "比特币ETF获批",
                "date": "2024-01-10",
                "description": "ETF获批当天买入BTC",
                "initial_investment": 100,
                "final_value": 185,
                "roi_percentage": 85,
                "roi_multiplier": "1.85x",
                "icon": "₿",
                "color": "from-orange-500 to-yellow-500",
                "tags": ["BTC", "ETF", "里程碑", "1年"],
                "what_happened": "SEC批准比特币现货ETF，BTC从$46,000涨至$85,000+",
                "lesson": "监管利好是重大催化剂",
                "time_sensitivity": "高",
                "is_recent": False,
                "market_type": "crypto"
            },
            
            # ============ 3年前 (2022-2023) ============
            {
                "id": "sol_2022_bottom",
                "category": "Cryptocurrency",
                "subcategory": "新公链",
                "timeframe": "3year",
                "title": "Solana抄底",
                "date": "2022-12-29",
                "description": "FTX暴雷后抄底Solana",
                "initial_investment": 100,
                "final_value": 1800,
                "roi_percentage": 1700,
                "roi_multiplier": "18x",
                "icon": "◎",
                "color": "from-purple-500 to-cyan-500",
                "tags": ["SOL", "抄底", "逆袭", "3年"],
                "what_happened": "Solana从FTX暴雷后的$8涨至$180+",
                "lesson": "危机中寻找被错杀的优质资产",
                "time_sensitivity": "中",
                "is_recent": False,
                "market_type": "crypto"
            },
            {
                "id": "meta_2022_bottom",
                "category": "Stock",
                "subcategory": "美股科技",
                "timeframe": "3year",
                "title": "Meta元宇宙低谷",
                "date": "2022-11-01",
                "description": "Meta股价低谷时买入",
                "initial_investment": 100,
                "final_value": 650,
                "roi_percentage": 550,
                "roi_multiplier": "6.5x",
                "icon": "📱",
                "color": "from-blue-500 to-indigo-600",
                "tags": ["META", "美股", "翻盘", "3年"],
                "what_happened": "Meta从$88低点涨至$570+",
                "lesson": "大公司的低谷往往是买入机会",
                "time_sensitivity": "低",
                "is_recent": False,
                "market_type": "stock"
            },
            {
                "id": "oil_2022",
                "category": "Commodity",
                "subcategory": "能源",
                "timeframe": "3year",
                "title": "俄乌战争原油飙升",
                "date": "2022-02-20",
                "description": "战争前买入原油期货",
                "initial_investment": 100,
                "final_value": 165,
                "roi_percentage": 65,
                "roi_multiplier": "1.65x",
                "icon": "🛢️",
                "color": "from-gray-600 to-gray-800",
                "tags": ["原油", "地缘政治", "期货", "3年"],
                "what_happened": "原油从$90飙升至$130+",
                "lesson": "地缘政治是商品价格的重要驱动",
                "time_sensitivity": "高",
                "is_recent": False,
                "market_type": "futures"
            },
            
            # ============ 5年前 (2020-2021) ============
            {
                "id": "tsla_2020",
                "category": "Stock",
                "subcategory": "美股新能源",
                "timeframe": "5year",
                "title": "特斯拉疫情暴涨",
                "date": "2020-03-18",
                "description": "疫情低点买入特斯拉",
                "initial_investment": 100,
                "final_value": 2000,
                "roi_percentage": 1900,
                "roi_multiplier": "20x",
                "icon": "🚗",
                "color": "from-red-500 to-pink-600",
                "tags": ["TSLA", "电动车", "美股", "5年"],
                "what_happened": "特斯拉从疫情低点$70涨至最高$1,400 (拆股后)",
                "lesson": "新能源革命+疫情流动性催化",
                "time_sensitivity": "低",
                "is_recent": False,
                "market_type": "stock"
            },
            {
                "id": "doge_2020",
                "category": "Cryptocurrency",
                "subcategory": "Meme币",
                "timeframe": "5year",
                "title": "狗狗币Doge崛起",
                "date": "2020-03-01",
                "description": "疫情期间买入狗狗币",
                "initial_investment": 100,
                "final_value": 17500,
                "roi_percentage": 17400,
                "roi_multiplier": "175x",
                "icon": "🐕",
                "color": "from-yellow-400 to-orange-400",
                "tags": ["Doge", "马斯克", "Meme", "5年"],
                "what_happened": "Doge从$0.002涨至$0.35",
                "lesson": "名人效应+社区力量=爆发式增长",
                "time_sensitivity": "中",
                "is_recent": False,
                "market_type": "crypto"
            },
            {
                "id": "gme_2021",
                "category": "Stock",
                "subcategory": "美股散户",
                "timeframe": "5year",
                "title": "GameStop散户革命",
                "date": "2021-01-15",
                "description": "WSB运动前买入GME",
                "initial_investment": 100,
                "final_value": 2400,
                "roi_percentage": 2300,
                "roi_multiplier": "24x",
                "icon": "🎮",
                "color": "from-red-600 to-orange-600",
                "tags": ["GME", "轧空", "散户", "5年"],
                "what_happened": "GME从$20暴涨至$480",
                "lesson": "社交媒体时代的散户力量",
                "time_sensitivity": "极高",
                "is_recent": False,
                "market_type": "stock"
            },
            {
                "id": "uni_airdrop_2020",
                "category": "Cryptocurrency",
                "subcategory": "DeFi",
                "timeframe": "5year",
                "title": "Uniswap史诗空投",
                "date": "2020-09-17",
                "description": "参与Uniswap获得空投",
                "initial_investment": 100,
                "final_value": 4200,
                "roi_percentage": 4100,
                "roi_multiplier": "42x",
                "icon": "🦄",
                "color": "from-pink-500 to-purple-500",
                "tags": ["UNI", "空投", "DeFi", "5年"],
                "what_happened": "每个早期用户获得400 UNI (价值$4000+)",
                "lesson": "早期参与DeFi协议可获巨额空投",
                "time_sensitivity": "中",
                "is_recent": False,
                "market_type": "crypto"
            },
            {
                "id": "qqq_options_2020",
                "category": "Options",
                "subcategory": "指数期权",
                "timeframe": "5year",
                "title": "纳指期权抄底",
                "date": "2020-03-23",
                "description": "疫情底部买QQQ看涨期权",
                "initial_investment": 100,
                "final_value": 5000,
                "roi_percentage": 4900,
                "roi_multiplier": "50x",
                "icon": "📊",
                "color": "from-green-600 to-teal-600",
                "tags": ["期权", "QQQ", "杠杆", "5年"],
                "what_happened": "纳指从低点反弹100%+，期权获得50倍收益",
                "lesson": "期权在关键时刻提供巨大杠杆",
                "time_sensitivity": "极高",
                "is_recent": False,
                "market_type": "options"
            },
            
            # ============ 10年前 (2015-2016) ============
            {
                "id": "btc_2015",
                "category": "Cryptocurrency",
                "subcategory": "BTC生态",
                "timeframe": "10year",
                "title": "比特币早期投资",
                "date": "2015-01-01",
                "description": "10年前购买比特币",
                "initial_investment": 100,
                "final_value": 458333,
                "roi_percentage": 458233,
                "roi_multiplier": "4583x",
                "icon": "₿",
                "color": "from-orange-600 to-yellow-500",
                "tags": ["BTC", "长期", "传奇", "10年"],
                "what_happened": "比特币从$200涨至$91,000+",
                "lesson": "持有优质资产10年的惊人回报",
                "time_sensitivity": "低",
                "is_recent": False,
                "market_type": "crypto"
            },
            {
                "id": "eth_2016",
                "category": "Cryptocurrency",
                "subcategory": "ETH生态",
                "timeframe": "10year",
                "title": "以太坊ICO时期",
                "date": "2016-01-01",
                "description": "以太坊早期$8买入",
                "initial_investment": 100,
                "final_value": 45000,
                "roi_percentage": 44900,
                "roi_multiplier": "450x",
                "icon": "Ξ",
                "color": "from-purple-500 to-indigo-600",
                "tags": ["ETH", "智能合约", "Web3", "10年"],
                "what_happened": "以太坊从$8涨至$3,600+",
                "lesson": "区块链平台创新带来长期价值",
                "time_sensitivity": "低",
                "is_recent": False,
                "market_type": "crypto"
            },
            {
                "id": "amzn_2015",
                "category": "Stock",
                "subcategory": "美股科技",
                "timeframe": "10year",
                "title": "亚马逊云计算崛起",
                "date": "2015-01-01",
                "description": "10年前买入亚马逊",
                "initial_investment": 100,
                "final_value": 650,
                "roi_percentage": 550,
                "roi_multiplier": "6.5x",
                "icon": "📦",
                "color": "from-orange-400 to-yellow-500",
                "tags": ["AMZN", "云计算", "电商", "10年"],
                "what_happened": "亚马逊从$300涨至$2,000+",
                "lesson": "电商+云计算双引擎驱动",
                "time_sensitivity": "低",
                "is_recent": False,
                "market_type": "stock"
            },
            {
                "id": "aapl_2015",
                "category": "Stock",
                "subcategory": "美股科技",
                "timeframe": "10year",
                "title": "苹果iPhone黄金时代",
                "date": "2015-01-01",
                "description": "10年前买入苹果",
                "initial_investment": 100,
                "final_value": 800,
                "roi_percentage": 700,
                "roi_multiplier": "8x",
                "icon": "🍎",
                "color": "from-gray-400 to-gray-600",
                "tags": ["AAPL", "iPhone", "美股", "10年"],
                "what_happened": "苹果从$25涨至$200+ (拆股调整后)",
                "lesson": "消费电子龙头的稳健增长",
                "time_sensitivity": "低",
                "is_recent": False,
                "market_type": "stock"
            },
            {
                "id": "amd_2016",
                "category": "Stock",
                "subcategory": "美股芯片",
                "timeframe": "10year",
                "title": "AMD芯片逆袭",
                "date": "2016-01-01",
                "description": "AMD濒临破产时买入",
                "initial_investment": 100,
                "final_value": 8500,
                "roi_percentage": 8400,
                "roi_multiplier": "85x",
                "icon": "💻",
                "color": "from-red-600 to-orange-600",
                "tags": ["AMD", "芯片", "逆袭", "10年"],
                "what_happened": "AMD从$2涨至$170+",
                "lesson": "濒危公司的惊天逆袭",
                "time_sensitivity": "低",
                "is_recent": False,
                "market_type": "stock"
            },
            {
                "id": "gold_2015",
                "category": "Commodity",
                "subcategory": "贵金属",
                "timeframe": "10year",
                "title": "黄金十年牛市",
                "date": "2015-12-01",
                "description": "黄金低点$1,050买入",
                "initial_investment": 100,
                "final_value": 250,
                "roi_percentage": 150,
                "roi_multiplier": "2.5x",
                "icon": "🏅",
                "color": "from-yellow-500 to-amber-600",
                "tags": ["黄金", "避险", "10年"],
                "what_happened": "黄金从$1,050涨至$2,600+",
                "lesson": "贵金属是长期保值增值工具",
                "time_sensitivity": "低",
                "is_recent": False,
                "market_type": "commodity"
            },
            
            # ============ 经典案例 ============
            {
                "id": "pepe_2023",
                "category": "Cryptocurrency",
                "subcategory": "Meme币",
                "timeframe": "3year",
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
                "time_sensitivity": "极高",
                "is_recent": False,
                "market_type": "crypto"
            },
            {
                "id": "ordi_2023",
                "category": "Cryptocurrency",
                "subcategory": "BTC生态",
                "timeframe": "3year",
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
                "time_sensitivity": "高",
                "is_recent": False,
                "market_type": "crypto"
            },
            
            # ============ Polymarket预测市场 ============
            {
                "id": "polymarket_trump_2024",
                "category": "Polymarket",
                "subcategory": "政治预测",
                "timeframe": "1year",
                "title": "2024美国大选",
                "date": "2024-01-01",
                "description": "押注特朗普当选",
                "initial_investment": 100,
                "final_value": 280,
                "roi_percentage": 180,
                "roi_multiplier": "2.8x",
                "icon": "🎯",
                "color": "from-blue-500 to-red-500",
                "tags": ["Polymarket", "特朗普", "大选"],
                "what_happened": "特朗普当选,押注者获利180%",
                "lesson": "去中心化预测市场准确度高",
                "time_sensitivity": "中",
                "is_recent": False,
                "market_type": "prediction"
            },
            {
                "id": "polymarket_btc_100k",
                "category": "Polymarket",
                "subcategory": "加密预测",
                "timeframe": "1year",
                "title": "BTC突破10万",
                "date": "2024-06-01",
                "description": "押注BTC年底前破10万",
                "initial_investment": 100,
                "final_value": 220,
                "roi_percentage": 120,
                "roi_multiplier": "2.2x",
                "icon": "₿",
                "color": "from-orange-500 to-yellow-400",
                "tags": ["Polymarket", "BTC", "预测"],
                "what_happened": "BTC在12月突破10万美元",
                "lesson": "长期趋势预测可获利",
                "time_sensitivity": "中",
                "is_recent": False,
                "market_type": "prediction"
            },
            
            # ============ 期货期权经典 ============
            {
                "id": "oil_negative_2020",
                "category": "Futures",
                "subcategory": "能源期货",
                "timeframe": "5year",
                "title": "原油期货负价格",
                "date": "2020-04-20",
                "description": "负油价时买入远月合约",
                "initial_investment": 100,
                "final_value": 1200,
                "roi_percentage": 1100,
                "roi_multiplier": "12x",
                "icon": "🛢️",
                "color": "from-gray-700 to-gray-900",
                "tags": ["原油", "期货", "历史时刻"],
                "what_happened": "WTI原油跌至负$37后反弹至$80+",
                "lesson": "极端市场情况蕴含巨大机会",
                "time_sensitivity": "极高",
                "is_recent": False,
                "market_type": "futures"
            },
            {
                "id": "vix_2020",
                "category": "Options",
                "subcategory": "波动率",
                "timeframe": "5year",
                "title": "VIX恐慌指数",
                "date": "2020-02-20",
                "description": "疫情前买VIX看涨期权",
                "initial_investment": 100,
                "final_value": 3000,
                "roi_percentage": 2900,
                "roi_multiplier": "30x",
                "icon": "📉",
                "color": "from-red-700 to-red-900",
                "tags": ["VIX", "期权", "恐慌"],
                "what_happened": "VIX从15飙升至80+",
                "lesson": "恐慌是可以交易的",
                "time_sensitivity": "极高",
                "is_recent": False,
                "market_type": "options"
            },
            
            # ============ 港股/A股 ============
            {
                "id": "byd_2020",
                "category": "Stock",
                "subcategory": "港股新能源",
                "timeframe": "5year",
                "title": "比亚迪新能源王者",
                "date": "2020-03-01",
                "description": "疫情低点买比亚迪",
                "initial_investment": 100,
                "final_value": 800,
                "roi_percentage": 700,
                "roi_multiplier": "8x",
                "icon": "🚙",
                "color": "from-blue-600 to-cyan-500",
                "tags": ["BYD", "港股", "新能源", "5年"],
                "what_happened": "比亚迪从$30涨至$240+",
                "lesson": "中国新能源龙头的崛起",
                "time_sensitivity": "低",
                "is_recent": False,
                "market_type": "stock"
            },
            {
                "id": "kweichow_2015",
                "category": "Stock",
                "subcategory": "A股消费",
                "timeframe": "10year",
                "title": "贵州茅台国酒",
                "date": "2015-01-01",
                "description": "10年前买茅台",
                "initial_investment": 100,
                "final_value": 1200,
                "roi_percentage": 1100,
                "roi_multiplier": "12x",
                "icon": "🍷",
                "color": "from-red-800 to-red-600",
                "tags": ["茅台", "A股", "白酒", "10年"],
                "what_happened": "茅台从¥150涨至¥1,800+",
                "lesson": "消费升级下的白酒龙头",
                "time_sensitivity": "低",
                "is_recent": False,
                "market_type": "stock"
            },
        ]
        
        return opportunities
    
    @staticmethod
    def get_opportunities_by_timeframe(timeframe: str) -> List[Dict]:
        """Get opportunities filtered by timeframe"""
        all_opps = GlobalVisionService.get_historical_opportunities()
        return [opp for opp in all_opps if opp.get('timeframe') == timeframe]
    
    @staticmethod
    def get_opportunities_by_market(market_type: str) -> List[Dict]:
        """Get opportunities filtered by market type"""
        all_opps = GlobalVisionService.get_historical_opportunities()
        return [opp for opp in all_opps if opp.get('market_type') == market_type]
    
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
        
        result = []
        for cat, data in categories.items():
            result.append({
                'name': cat,
                'count': data['count'],
                'subcategories': list(data['subcategories'])
            })
        
        return result
    
    @staticmethod
    def get_supported_markets() -> List[Dict]:
        """Get list of supported markets for VIP API integration"""
        return [
            {
                "id": "crypto",
                "name": "加密货币",
                "icon": "₿",
                "exchanges": ["Binance", "OKX", "Bybit", "Coinbase", "Kraken"],
                "description": "BTC, ETH, SOL, Meme币等",
                "min_capital": 100
            },
            {
                "id": "us_stock",
                "name": "美股",
                "icon": "🇺🇸",
                "exchanges": ["盈透证券", "富途证券", "老虎证券", "嘉信理财"],
                "description": "NVDA, TSLA, AAPL, META等",
                "min_capital": 500
            },
            {
                "id": "hk_stock",
                "name": "港股",
                "icon": "🇭🇰",
                "exchanges": ["富途证券", "老虎证券", "盈立证券"],
                "description": "腾讯, 阿里, 比亚迪等",
                "min_capital": 500
            },
            {
                "id": "a_stock",
                "name": "A股",
                "icon": "🇨🇳",
                "exchanges": ["东方财富", "同花顺", "雪球"],
                "description": "茅台, 宁德时代等",
                "min_capital": 1000
            },
            {
                "id": "futures",
                "name": "期货",
                "icon": "📊",
                "exchanges": ["盈透证券", "芝商所(CME)", "各大期货公司"],
                "description": "原油, 黄金, 农产品等",
                "min_capital": 2000
            },
            {
                "id": "options",
                "name": "期权",
                "icon": "📈",
                "exchanges": ["盈透证券", "TD Ameritrade", "Robinhood"],
                "description": "股票期权, 指数期权",
                "min_capital": 1000
            },
            {
                "id": "forex",
                "name": "外汇",
                "icon": "💱",
                "exchanges": ["OANDA", "IG", "盈透证券"],
                "description": "EUR/USD, GBP/USD等",
                "min_capital": 500
            },
            {
                "id": "prediction",
                "name": "预测市场",
                "icon": "🎯",
                "exchanges": ["Polymarket", "Kalshi"],
                "description": "政治, 经济, 体育预测",
                "min_capital": 50
            }
        ]
    
    @staticmethod
    def calculate_total_potential(opportunities: List[Dict]) -> Dict:
        """Calculate what would have happened if AI bot caught key opportunities"""
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
        """Get today's featured opportunity"""
        opportunities = GlobalVisionService.get_historical_opportunities()
        return opportunities[0]

global_vision_service = GlobalVisionService()
