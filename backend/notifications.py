"""
Notification System - Manage user notifications
"""
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
from typing import List, Dict
import uuid
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / 'backend' / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

class NotificationService:
    @staticmethod
    async def create_notification(wallet_address: str, notification_type: str, title: str, message: str, data: Dict = None):
        """Create a new notification"""
        notification = {
            "id": str(uuid.uuid4()),
            "wallet_address": wallet_address.lower(),
            "type": notification_type,  # new_ability, trade_alert, level_up, etc.
            "title": title,
            "message": message,
            "data": data or {},
            "read": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        
        await db.notifications.insert_one(notification)
        return notification
    
    @staticmethod
    async def get_user_notifications(wallet_address: str, unread_only: bool = False) -> List[Dict]:
        """Get notifications for a user"""
        query = {"wallet_address": wallet_address.lower()}
        if unread_only:
            query["read"] = False
        
        notifications = await db.notifications.find(
            query,
            {"_id": 0}
        ).sort("created_at", -1).limit(20).to_list(20)
        
        return notifications
    
    @staticmethod
    async def mark_as_read(notification_id: str):
        """Mark notification as read"""
        await db.notifications.update_one(
            {"id": notification_id},
            {"$set": {"read": True}}
        )
    
    @staticmethod
    async def notify_new_ability(wallet_address: str, bot_name: str, ability: str):
        """Notify user about new Bot ability"""
        await NotificationService.create_notification(
            wallet_address=wallet_address,
            notification_type="new_ability",
            title=f"🎉 {bot_name}学会了新技能!",
            message=f"恭喜！你的Bot解锁了新能力: {ability}",
            data={"ability": ability, "bot_name": bot_name}
        )
    
    @staticmethod
    async def notify_level_up(wallet_address: str, bot_name: str, new_level: int):
        """Notify user about Bot level up"""
        await NotificationService.create_notification(
            wallet_address=wallet_address,
            notification_type="level_up",
            title=f"⭐ {bot_name}升级了!",
            message=f"你的Bot已升至 Level {new_level}!",
            data={"level": new_level, "bot_name": bot_name}
        )
    
    @staticmethod
    async def notify_big_profit(wallet_address: str, bot_name: str, profit: float):
        """Notify user about significant profit"""
        await NotificationService.create_notification(
            wallet_address=wallet_address,
            notification_type="big_profit",
            title=f"💰 大额盈利!",
            message=f"{bot_name}赚了 ${profit:.2f}!",
            data={"profit": profit, "bot_name": bot_name}
        )
    
    @staticmethod
    async def notify_vip_eligible(wallet_address: str):
        """Notify user they can upgrade to VIP"""
        await NotificationService.create_notification(
            wallet_address=wallet_address,
            notification_type="vip_eligible",
            title=f"🚀 可以升级VIP了!",
            message=f"你的余额已达到$100，现在可以升级到VIP享受真实交易功能!",
            data={}
        )

notification_service = NotificationService()
