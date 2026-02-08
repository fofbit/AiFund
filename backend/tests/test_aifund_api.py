"""
AIFund.com Backend API Tests
Tests for wallet connection, deposits, bot creation, global vision, and gamification APIs
"""
import pytest
import requests
import os
import uuid
from datetime import datetime

# Use the preview URL from environment
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://vision-profits.preview.emergentagent.com')

class TestHealthCheck:
    """Health check - ensure API is running"""
    
    def test_api_root(self):
        """Test API root endpoint returns expected response"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "active"
        assert "AIfund.com" in data["message"]
        print("✓ API root endpoint working")


class TestWalletConnection:
    """Test wallet connection APIs"""
    
    def test_connect_new_wallet(self):
        """Test connecting a new wallet creates user"""
        test_wallet = f"0x{uuid.uuid4().hex[:40]}"
        
        response = requests.post(f"{BASE_URL}/api/wallet/connect", json={
            "wallet_address": test_wallet,
            "wallet_type": "metamask"
        })
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify new user created
        assert data["status"] == "new_user"
        assert "user" in data
        assert data["user"]["wallet_address"] == test_wallet.lower()
        assert data["user"]["tier"] == "inactive"
        assert data["user"]["balance_usd"] == 0.0
        assert data["has_bot"] == False
        print(f"✓ New wallet connected: {test_wallet[:10]}...")
    
    def test_connect_existing_wallet(self):
        """Test connecting an existing wallet retrieves user"""
        test_wallet = f"0x{uuid.uuid4().hex[:40]}"
        
        # First connect - creates user
        requests.post(f"{BASE_URL}/api/wallet/connect", json={
            "wallet_address": test_wallet,
            "wallet_type": "metamask"
        })
        
        # Second connect - retrieves existing user
        response = requests.post(f"{BASE_URL}/api/wallet/connect", json={
            "wallet_address": test_wallet,
            "wallet_type": "metamask"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "existing_user"
        assert data["user"]["wallet_address"] == test_wallet.lower()
        print("✓ Existing wallet retrieved correctly")


class TestDepositAPI:
    """Test deposit and tier upgrade APIs"""
    
    def test_deposit_usdt(self):
        """Test depositing USDT updates balance and tier"""
        test_wallet = f"0xTEST_{uuid.uuid4().hex[:36]}"
        
        # Create user first
        requests.post(f"{BASE_URL}/api/wallet/connect", json={
            "wallet_address": test_wallet,
            "wallet_type": "metamask"
        })
        
        # Deposit USDT (1:1 with USD)
        response = requests.post(f"{BASE_URL}/api/deposit", json={
            "wallet_address": test_wallet,
            "currency": "USDT",
            "amount": 10.0,
            "tx_hash": f"tx_{uuid.uuid4().hex[:20]}"
        })
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["success"] == True
        assert data["new_balance"] >= 9.9  # Allow slight variance due to price fluctuation
        assert data["tier"] == "basic"  # 10 > 1 so should be basic tier
        assert data["deposit"]["currency"] == "USDT"
        assert data["deposit"]["status"] == "confirmed"
        print("✓ USDT deposit successful, tier upgraded to basic")
    
    def test_deposit_vip_tier(self):
        """Test depositing enough to reach VIP tier"""
        test_wallet = f"0xTEST_VIP_{uuid.uuid4().hex[:32]}"
        
        # Create user
        requests.post(f"{BASE_URL}/api/wallet/connect", json={
            "wallet_address": test_wallet,
            "wallet_type": "metamask"
        })
        
        # Deposit 100+ for VIP
        response = requests.post(f"{BASE_URL}/api/deposit", json={
            "wallet_address": test_wallet,
            "currency": "USDT",
            "amount": 150.0,
            "tx_hash": f"tx_vip_{uuid.uuid4().hex[:20]}"
        })
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["tier"] == "vip"
        assert data["new_balance"] >= 149.0  # Allow slight variance due to price fluctuation
        print("✓ VIP tier achieved with sufficient deposit")
    
    def test_deposit_unsupported_currency(self):
        """Test depositing unsupported currency returns error"""
        test_wallet = f"0xTEST_{uuid.uuid4().hex[:36]}"
        
        requests.post(f"{BASE_URL}/api/wallet/connect", json={
            "wallet_address": test_wallet,
            "wallet_type": "metamask"
        })
        
        response = requests.post(f"{BASE_URL}/api/deposit", json={
            "wallet_address": test_wallet,
            "currency": "FAKE_COIN",
            "amount": 10.0
        })
        
        assert response.status_code == 400
        print("✓ Unsupported currency rejected correctly")


class TestBotCreation:
    """Test bot creation APIs with gender selection"""
    
    def test_create_bot_male(self):
        """Test creating a male bot"""
        test_wallet = f"0xTEST_BOT_M_{uuid.uuid4().hex[:30]}"
        
        # Create user and deposit to activate
        requests.post(f"{BASE_URL}/api/wallet/connect", json={
            "wallet_address": test_wallet,
            "wallet_type": "metamask"
        })
        
        requests.post(f"{BASE_URL}/api/deposit", json={
            "wallet_address": test_wallet,
            "currency": "USDT",
            "amount": 5.0
        })
        
        # Create male bot
        response = requests.post(f"{BASE_URL}/api/bot/create", json={
            "wallet_address": test_wallet,
            "bot_name": "TEST_MaleBot_Alpha",
            "gender": "male",
            "avatar_id": "male_1"
        })
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["success"] == True
        assert data["bot"]["name"] == "TEST_MaleBot_Alpha"
        assert data["bot"]["gender"] == "male"
        assert data["bot"]["avatar"] == "male_1"
        assert data["bot"]["avatar_emoji"] == "🤖"
        assert data["bot"]["level"] == 1
        assert data["bot"]["virtual_balance"] == 10000.0
        print("✓ Male bot created successfully")
    
    def test_create_bot_female(self):
        """Test creating a female bot"""
        test_wallet = f"0xTEST_BOT_F_{uuid.uuid4().hex[:30]}"
        
        # Create user and deposit
        requests.post(f"{BASE_URL}/api/wallet/connect", json={
            "wallet_address": test_wallet,
            "wallet_type": "metamask"
        })
        
        requests.post(f"{BASE_URL}/api/deposit", json={
            "wallet_address": test_wallet,
            "currency": "USDT",
            "amount": 5.0
        })
        
        # Create female bot
        response = requests.post(f"{BASE_URL}/api/bot/create", json={
            "wallet_address": test_wallet,
            "bot_name": "TEST_FemaleBot_Luna",
            "gender": "female",
            "avatar_id": "female_3"
        })
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["bot"]["gender"] == "female"
        assert data["bot"]["avatar"] == "female_3"
        assert data["bot"]["avatar_emoji"] == "🦸‍♀️"
        print("✓ Female bot created successfully")
    
    def test_create_bot_without_deposit(self):
        """Test creating bot without deposit fails"""
        test_wallet = f"0xTEST_NO_DEP_{uuid.uuid4().hex[:30]}"
        
        # Only create user, no deposit
        requests.post(f"{BASE_URL}/api/wallet/connect", json={
            "wallet_address": test_wallet,
            "wallet_type": "metamask"
        })
        
        response = requests.post(f"{BASE_URL}/api/bot/create", json={
            "wallet_address": test_wallet,
            "bot_name": "TEST_ShouldFail",
            "gender": "male",
            "avatar_id": "male_1"
        })
        
        assert response.status_code == 403
        data = response.json()
        assert "Insufficient balance" in data["detail"]
        print("✓ Bot creation without deposit correctly rejected")
    
    def test_create_duplicate_bot(self):
        """Test creating a second bot fails"""
        test_wallet = f"0xTEST_DUP_{uuid.uuid4().hex[:32]}"
        
        # Setup: create user, deposit, and first bot
        requests.post(f"{BASE_URL}/api/wallet/connect", json={
            "wallet_address": test_wallet,
            "wallet_type": "metamask"
        })
        
        requests.post(f"{BASE_URL}/api/deposit", json={
            "wallet_address": test_wallet,
            "currency": "USDT",
            "amount": 10.0
        })
        
        requests.post(f"{BASE_URL}/api/bot/create", json={
            "wallet_address": test_wallet,
            "bot_name": "TEST_FirstBot",
            "gender": "male",
            "avatar_id": "male_1"
        })
        
        # Try to create second bot
        response = requests.post(f"{BASE_URL}/api/bot/create", json={
            "wallet_address": test_wallet,
            "bot_name": "TEST_SecondBot",
            "gender": "female",
            "avatar_id": "female_1"
        })
        
        assert response.status_code == 400
        assert "already has a bot" in response.json()["detail"]
        print("✓ Duplicate bot creation correctly rejected")


class TestBotRetrieval:
    """Test bot retrieval APIs"""
    
    def test_get_bot_data(self):
        """Test retrieving bot data after creation"""
        test_wallet = f"0xTEST_GET_{uuid.uuid4().hex[:32]}"
        
        # Setup
        requests.post(f"{BASE_URL}/api/wallet/connect", json={
            "wallet_address": test_wallet,
            "wallet_type": "metamask"
        })
        
        requests.post(f"{BASE_URL}/api/deposit", json={
            "wallet_address": test_wallet,
            "currency": "USDT",
            "amount": 5.0
        })
        
        requests.post(f"{BASE_URL}/api/bot/create", json={
            "wallet_address": test_wallet,
            "bot_name": "TEST_RetrieveBot",
            "gender": "male",
            "avatar_id": "male_2"
        })
        
        # Get bot data
        response = requests.get(f"{BASE_URL}/api/bot/{test_wallet}")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "bot" in data
        assert data["bot"]["name"] == "TEST_RetrieveBot"
        assert "recent_trades" in data
        print("✓ Bot data retrieved successfully")
    
    def test_get_nonexistent_bot(self):
        """Test retrieving non-existent bot returns 404"""
        fake_wallet = f"0xFAKE_{uuid.uuid4().hex[:36]}"
        
        response = requests.get(f"{BASE_URL}/api/bot/{fake_wallet}")
        
        assert response.status_code == 404
        print("✓ Non-existent bot returns 404")


class TestGlobalVision:
    """Test Global Vision APIs for historical opportunities"""
    
    def test_get_opportunities(self):
        """Test getting historical opportunities"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "opportunities" in data
        assert len(data["opportunities"]) > 0
        
        # Check first opportunity has required fields
        opp = data["opportunities"][0]
        assert "id" in opp
        assert "category" in opp
        assert "title" in opp
        assert "initial_investment" in opp
        assert "final_value" in opp
        assert "roi_percentage" in opp
        print(f"✓ Retrieved {len(data['opportunities'])} historical opportunities")
    
    def test_opportunities_have_categories(self):
        """Test opportunities have different categories"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        data = response.json()
        
        categories = set(opp["category"] for opp in data["opportunities"])
        
        assert "Cryptocurrency" in categories
        assert "Stock" in categories or "Polymarket" in categories
        print(f"✓ Found categories: {categories}")
    
    def test_get_featured_opportunity(self):
        """Test getting featured opportunity (yesterday's)"""
        response = requests.get(f"{BASE_URL}/api/global-vision/featured")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "featured" in data
        assert data["featured"]["is_recent"] == True
        print("✓ Featured opportunity retrieved")
    
    def test_calculate_potential(self):
        """Test calculating total potential returns"""
        response = requests.get(f"{BASE_URL}/api/global-vision/potential")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "potential" in data
        assert data["potential"]["initial_investment"] == 100
        assert data["potential"]["final_value"] > 100
        assert "top_opportunities" in data["potential"]
        print(f"✓ Total potential: 100 → {data['potential']['final_value']}")
    
    def test_unlock_global_vision(self):
        """Test unlocking Global Vision feature (9.9U)"""
        test_wallet = f"0xTEST_GV_{uuid.uuid4().hex[:34]}"
        
        # Create user first
        requests.post(f"{BASE_URL}/api/wallet/connect", json={
            "wallet_address": test_wallet,
            "wallet_type": "metamask"
        })
        
        # Unlock Global Vision with 9.9U payment
        response = requests.post(f"{BASE_URL}/api/global-vision/unlock", json={
            "wallet_address": test_wallet,
            "currency": "USDT",
            "amount": 9.9,
            "tx_hash": f"gv_unlock_{uuid.uuid4().hex[:16]}"
        })
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["success"] == True
        assert "unlocked" in data["message"].lower() or "Global Vision" in data["message"]
        print("✓ Global Vision unlocked successfully")
    
    def test_unlock_insufficient_payment(self):
        """Test unlocking with insufficient payment fails"""
        test_wallet = f"0xTEST_GV_FAIL_{uuid.uuid4().hex[:30]}"
        
        requests.post(f"{BASE_URL}/api/wallet/connect", json={
            "wallet_address": test_wallet,
            "wallet_type": "metamask"
        })
        
        response = requests.post(f"{BASE_URL}/api/global-vision/unlock", json={
            "wallet_address": test_wallet,
            "currency": "USDT",
            "amount": 5.0  # Less than 9.9
        })
        
        assert response.status_code == 400
        print("✓ Insufficient payment correctly rejected")


class TestGamification:
    """Test gamification APIs (avatars, VIP levels, store)"""
    
    def test_get_bot_avatars(self):
        """Test getting bot avatars by gender"""
        response = requests.get(f"{BASE_URL}/api/gamification/bot-avatars")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "avatars" in data
        assert "male" in data["avatars"]
        assert "female" in data["avatars"]
        assert len(data["avatars"]["male"]) >= 6
        assert len(data["avatars"]["female"]) >= 6
        
        # Check avatar structure
        male_avatar = data["avatars"]["male"][0]
        assert "id" in male_avatar
        assert "emoji" in male_avatar
        assert "name" in male_avatar
        assert "rarity" in male_avatar
        print("✓ Bot avatars retrieved with male/female options")
    
    def test_get_vip_levels(self):
        """Test getting VIP level progression"""
        response = requests.get(f"{BASE_URL}/api/gamification/vip-levels")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "levels" in data
        assert len(data["levels"]) == 10  # 10 VIP levels
        
        # Check first level
        level_1 = data["levels"][0]
        assert level_1["level"] == 1
        assert level_1["min_profit"] == 0
        assert "perks" in level_1
        
        # Check max level
        level_10 = data["levels"][9]
        assert level_10["level"] == 10
        assert level_10["min_profit"] == 1000000
        print("✓ VIP levels retrieved (10 tiers)")
    
    def test_get_virtual_store(self):
        """Test getting virtual asset store"""
        response = requests.get(f"{BASE_URL}/api/gamification/store")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "store" in data
        assert "rarity_colors" in data
        
        # Check store categories
        store = data["store"]
        assert "real_estate" in store
        assert "vehicles" in store
        assert "luxury_goods" in store
        
        # Check item structure
        apartment = store["real_estate"]["items"][0]
        assert "id" in apartment
        assert "name" in apartment
        assert "price" in apartment
        assert "rarity" in apartment
        print(f"✓ Virtual store retrieved with {len(store)} categories")


class TestMarketData:
    """Test market data and pricing APIs"""
    
    def test_get_prices(self):
        """Test getting crypto prices"""
        response = requests.get(f"{BASE_URL}/api/prices")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "prices" in data
        prices = data["prices"]
        
        # Check major currencies are present
        assert "BTC" in prices
        assert "ETH" in prices
        assert "USDT" in prices
        
        # Check prices are reasonable
        assert prices["USDT"] == 1.0 or abs(prices["USDT"] - 1.0) < 0.01
        assert prices["BTC"] > 10000  # Bitcoin should be > $10k
        print(f"✓ Crypto prices retrieved - BTC: ${prices['BTC']:,.0f}, ETH: ${prices['ETH']:,.0f}")
    
    def test_get_market_analysis(self):
        """Test getting market analysis"""
        response = requests.get(f"{BASE_URL}/api/market/analysis")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "analysis" in data
        analysis = data["analysis"]
        
        assert "prices" in analysis
        assert "trends" in analysis
        assert "volatility" in analysis
        assert "timestamp" in analysis
        print("✓ Market analysis retrieved")


class TestLeaderboard:
    """Test leaderboard API"""
    
    def test_get_leaderboard(self):
        """Test getting bot leaderboard"""
        response = requests.get(f"{BASE_URL}/api/leaderboard")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "leaderboard" in data
        # Leaderboard may be empty if no bots exist
        print(f"✓ Leaderboard retrieved with {len(data['leaderboard'])} bots")


class TestNotifications:
    """Test notification APIs"""
    
    def test_get_notifications(self):
        """Test getting user notifications"""
        test_wallet = f"0xTEST_NOTIF_{uuid.uuid4().hex[:30]}"
        
        # Create user
        requests.post(f"{BASE_URL}/api/wallet/connect", json={
            "wallet_address": test_wallet,
            "wallet_type": "metamask"
        })
        
        response = requests.get(f"{BASE_URL}/api/notifications/{test_wallet}")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "notifications" in data
        print(f"✓ Notifications endpoint working")
    
    def test_get_unread_notifications(self):
        """Test getting only unread notifications"""
        test_wallet = f"0xTEST_UNREAD_{uuid.uuid4().hex[:30]}"
        
        requests.post(f"{BASE_URL}/api/wallet/connect", json={
            "wallet_address": test_wallet,
            "wallet_type": "metamask"
        })
        
        response = requests.get(f"{BASE_URL}/api/notifications/{test_wallet}?unread_only=true")
        
        assert response.status_code == 200
        print("✓ Unread notifications filter working")


class TestUserRetrieval:
    """Test user data retrieval"""
    
    def test_get_user(self):
        """Test getting user information"""
        test_wallet = f"0xTEST_USER_{uuid.uuid4().hex[:32]}"
        
        # Create user
        requests.post(f"{BASE_URL}/api/wallet/connect", json={
            "wallet_address": test_wallet,
            "wallet_type": "metamask"
        })
        
        response = requests.get(f"{BASE_URL}/api/user/{test_wallet}")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "user" in data
        assert data["user"]["wallet_address"] == test_wallet.lower()
        print("✓ User data retrieved successfully")
    
    def test_get_nonexistent_user(self):
        """Test getting non-existent user returns 404"""
        fake_wallet = f"0xNONEXISTENT_{uuid.uuid4().hex[:28]}"
        
        response = requests.get(f"{BASE_URL}/api/user/{fake_wallet}")
        
        assert response.status_code == 404
        print("✓ Non-existent user returns 404")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
