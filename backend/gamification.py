"""
Bot Customization & VIP Gamification System
Inspired by Monopoly - allows users to buy virtual assets and show off wealth
"""
from typing import List, Dict

class BotCustomizationService:
    """Bot gender, avatars, and personality customization"""
    
    @staticmethod
    def get_bot_avatars() -> Dict:
        """
        Get available bot avatars organized by gender
        Each gender has multiple options
        """
        return {
            "male": [
                {"id": "male_1", "emoji": "🤖", "name": "机械战士", "rarity": "common"},
                {"id": "male_2", "emoji": "👨‍💼", "name": "商业精英", "rarity": "common"},
                {"id": "male_3", "emoji": "🦸‍♂️", "name": "超级英雄", "rarity": "rare"},
                {"id": "male_4", "emoji": "👨‍🚀", "name": "太空探索者", "rarity": "rare"},
                {"id": "male_5", "emoji": "🧙‍♂️", "name": "魔法大师", "rarity": "epic"},
                {"id": "male_6", "emoji": "🤴", "name": "王子殿下", "rarity": "legendary"},
            ],
            "female": [
                {"id": "female_1", "emoji": "🤖", "name": "智能女神", "rarity": "common"},
                {"id": "female_2", "emoji": "👩‍💼", "name": "女强人", "rarity": "common"},
                {"id": "female_3", "emoji": "🦸‍♀️", "name": "超级女侠", "rarity": "rare"},
                {"id": "female_4", "emoji": "👩‍🚀", "name": "星际旅人", "rarity": "rare"},
                {"id": "female_5", "emoji": "🧙‍♀️", "name": "魔法女王", "rarity": "epic"},
                {"id": "female_6", "emoji": "👸", "name": "公主殿下", "rarity": "legendary"},
            ]
        }

class VIPLevelSystem:
    """VIP level and progression system"""
    
    @staticmethod
    def get_vip_levels() -> List[Dict]:
        """
        Get VIP level tiers - like Monopoly progression
        Users upgrade as they earn more
        """
        return [
            {
                "level": 1,
                "name": "新手投资者",
                "min_profit": 0,
                "icon": "🌱",
                "color": "text-gray-400",
                "perks": ["解锁基础Bot形象"]
            },
            {
                "level": 2,
                "name": "小有成就",
                "min_profit": 1000,
                "icon": "🏠",
                "color": "text-green-400",
                "perks": ["可购买虚拟公寓", "解锁稀有形象"]
            },
            {
                "level": 3,
                "name": "投资高手",
                "min_profit": 5000,
                "icon": "🏘️",
                "color": "text-blue-400",
                "perks": ["可购买别墅", "专属头衔"]
            },
            {
                "level": 4,
                "name": "财富自由",
                "min_profit": 10000,
                "icon": "🏰",
                "color": "text-purple-400",
                "perks": ["可购买豪宅", "VIP专属策略"]
            },
            {
                "level": 5,
                "name": "商业大亨",
                "min_profit": 25000,
                "icon": "🏢",
                "color": "text-yellow-400",
                "perks": ["可购买商业大楼", "定制Bot能力"]
            },
            {
                "level": 6,
                "name": "投资巨鳄",
                "min_profit": 50000,
                "icon": "🏙️",
                "color": "text-orange-400",
                "perks": ["可购买地标建筑", "优先新功能"]
            },
            {
                "level": 7,
                "name": "财富传奇",
                "min_profit": 100000,
                "icon": "🌆",
                "color": "text-red-400",
                "perks": ["可购买岛屿", "传奇Bot形象"]
            },
            {
                "level": 8,
                "name": "金融帝王",
                "min_profit": 250000,
                "icon": "👑",
                "color": "text-pink-400",
                "perks": ["可购买私人飞机", "帝王专属特权"]
            },
            {
                "level": 9,
                "name": "世界首富",
                "min_profit": 500000,
                "icon": "🌍",
                "color": "text-cyan-400",
                "perks": ["可购买游艇", "全站顶部展示"]
            },
            {
                "level": 10,
                "name": "宇宙之主",
                "min_profit": 1000000,
                "icon": "🚀",
                "color": "text-indigo-400",
                "perks": ["可购买太空站", "永久荣耀殿堂"]
            }
        ]
    
    @staticmethod
    def get_user_vip_level(total_profit: float) -> Dict:
        """Get user's current VIP level based on profit"""
        levels = VIPLevelSystem.get_vip_levels()
        
        current_level = levels[0]
        for level in levels:
            if total_profit >= level["min_profit"]:
                current_level = level
            else:
                break
        
        # Calculate progress to next level
        next_level = None
        for level in levels:
            if level["level"] > current_level["level"]:
                next_level = level
                break
        
        progress = 0
        if next_level:
            progress = (total_profit - current_level["min_profit"]) / (next_level["min_profit"] - current_level["min_profit"]) * 100
        
        return {
            "current_level": current_level,
            "next_level": next_level,
            "progress": round(progress, 2)
        }

class VirtualAssetStore:
    """Virtual asset store - Monopoly style"""
    
    @staticmethod
    def get_store_items() -> Dict:
        """
        Get all purchasable virtual assets
        Organized by category
        """
        return {
            "real_estate": {
                "name": "房产地产",
                "icon": "🏠",
                "items": [
                    {"id": "apartment", "name": "城市公寓", "emoji": "🏢", "price": 1000, "rarity": "common"},
                    {"id": "villa", "name": "海景别墅", "emoji": "🏡", "price": 5000, "rarity": "rare"},
                    {"id": "mansion", "name": "豪华庄园", "emoji": "🏰", "price": 15000, "rarity": "epic"},
                    {"id": "tower", "name": "摩天大楼", "emoji": "🏢", "price": 50000, "rarity": "legendary"},
                    {"id": "island", "name": "私人岛屿", "emoji": "🏝️", "price": 100000, "rarity": "mythic"},
                ]
            },
            "vehicles": {
                "name": "豪车座驾",
                "icon": "🚗",
                "items": [
                    {"id": "sedan", "name": "豪华轿车", "emoji": "🚗", "price": 500, "rarity": "common"},
                    {"id": "sports_car", "name": "跑车", "emoji": "🏎️", "price": 2000, "rarity": "rare"},
                    {"id": "supercar", "name": "超级跑车", "emoji": "🏎️", "price": 8000, "rarity": "epic"},
                    {"id": "limo", "name": "加长礼宾车", "emoji": "🚙", "price": 5000, "rarity": "epic"},
                    {"id": "yacht", "name": "豪华游艇", "emoji": "🛥️", "price": 50000, "rarity": "legendary"},
                    {"id": "jet", "name": "私人飞机", "emoji": "🛩️", "price": 200000, "rarity": "mythic"},
                ]
            },
            "luxury_goods": {
                "name": "奢侈品",
                "icon": "👜",
                "items": [
                    {"id": "watch_1", "name": "名表", "emoji": "⌚", "price": 300, "rarity": "common"},
                    {"id": "watch_2", "name": "限量表", "emoji": "⌚", "price": 3000, "rarity": "epic"},
                    {"id": "bag_1", "name": "设计师包", "emoji": "👜", "price": 500, "rarity": "rare"},
                    {"id": "bag_2", "name": "限量款包", "emoji": "👝", "price": 5000, "rarity": "legendary"},
                    {"id": "jewelry", "name": "钻石首饰", "emoji": "💎", "price": 10000, "rarity": "legendary"},
                    {"id": "crown", "name": "皇冠", "emoji": "👑", "price": 50000, "rarity": "mythic"},
                ]
            },
            "fashion": {
                "name": "时装服饰",
                "icon": "👔",
                "items": [
                    {"id": "suit", "name": "西装", "emoji": "🤵", "price": 200, "rarity": "common"},
                    {"id": "dress", "name": "晚礼服", "emoji": "👗", "price": 800, "rarity": "rare"},
                    {"id": "designer_suit", "name": "定制西装", "emoji": "🎩", "price": 3000, "rarity": "epic"},
                    {"id": "haute_couture", "name": "高级定制", "emoji": "👘", "price": 15000, "rarity": "legendary"},
                ]
            },
            "currency": {
                "name": "财富象征",
                "icon": "💰",
                "items": [
                    {"id": "gold_coin", "name": "金币", "emoji": "🪙", "price": 100, "rarity": "common"},
                    {"id": "gold_bar", "name": "金条", "emoji": "🥇", "price": 1000, "rarity": "rare"},
                    {"id": "diamond", "name": "钻石", "emoji": "💎", "price": 10000, "rarity": "epic"},
                    {"id": "treasure", "name": "宝藏", "emoji": "💰", "price": 50000, "rarity": "legendary"},
                ]
            },
            "gifts": {
                "name": "礼物道具",
                "icon": "🎁",
                "items": [
                    {"id": "flower", "name": "鲜花", "emoji": "💐", "price": 50, "rarity": "common"},
                    {"id": "chocolate", "name": "巧克力", "emoji": "🍫", "price": 100, "rarity": "common"},
                    {"id": "champagne", "name": "香槟", "emoji": "🍾", "price": 500, "rarity": "rare"},
                    {"id": "trophy", "name": "奖杯", "emoji": "🏆", "price": 2000, "rarity": "epic"},
                ]
            }
        }
    
    @staticmethod
    def get_rarity_colors() -> Dict:
        """Get color schemes for different rarity levels"""
        return {
            "common": {"text": "text-gray-400", "bg": "bg-gray-500/20", "border": "border-gray-500"},
            "rare": {"text": "text-blue-400", "bg": "bg-blue-500/20", "border": "border-blue-500"},
            "epic": {"text": "text-purple-400", "bg": "bg-purple-500/20", "border": "border-purple-500"},
            "legendary": {"text": "text-yellow-400", "bg": "bg-yellow-500/20", "border": "border-yellow-500"},
            "mythic": {"text": "text-red-400", "bg": "bg-red-500/20", "border": "border-red-500"},
        }

bot_customization_service = BotCustomizationService()
vip_level_system = VIPLevelSystem()
virtual_asset_store = VirtualAssetStore()
