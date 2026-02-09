"""
Iteration 8 Backend Tests - Bug fixes and new features
Tests:
1. /api/wallet/connect returns has_global_vision field
2. /api/payment/verify accepts amount parameter correctly (90% acceptance)
3. Payment addresses API still working
4. Demo mode APIs still functional
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://vision-profits.preview.emergentagent.com')

class TestIteration8BugFixes:
    """Test iteration 8 bug fixes"""
    
    def test_api_root(self):
        """Test API is accessible"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"SUCCESS: API root accessible - {data['message']}")
    
    def test_wallet_connect_returns_has_global_vision_new_user(self):
        """Test /api/wallet/connect returns has_global_vision for new users"""
        import uuid
        test_wallet = f"0xTEST_{uuid.uuid4().hex[:16]}"
        
        response = requests.post(f"{BASE_URL}/api/wallet/connect", json={
            "wallet_address": test_wallet,
            "wallet_type": "metamask"
        })
        
        assert response.status_code == 200
        data = response.json()
        
        # New user should be created
        assert data["status"] == "new_user"
        
        # Check user object has has_global_vision field (defaults to False)
        user = data.get("user", {})
        assert "has_global_vision" in user, "Missing has_global_vision field in user object"
        assert user["has_global_vision"] == False, "New user should have has_global_vision=False"
        print(f"SUCCESS: New user has has_global_vision={user['has_global_vision']}")
    
    def test_wallet_connect_returns_has_global_vision_existing_user(self):
        """Test /api/wallet/connect returns has_global_vision for existing users"""
        # Use a wallet that should already exist from demo mode
        test_wallet = "0xdemo_test_iteration8_existing"
        
        # First connect to create user
        requests.post(f"{BASE_URL}/api/wallet/connect", json={
            "wallet_address": test_wallet,
            "wallet_type": "metamask"
        })
        
        # Connect again as existing user
        response = requests.post(f"{BASE_URL}/api/wallet/connect", json={
            "wallet_address": test_wallet,
            "wallet_type": "metamask"
        })
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["status"] == "existing_user"
        
        # Check user object has has_global_vision field
        user = data.get("user", {})
        assert "has_global_vision" in user, "Missing has_global_vision field in existing user response"
        print(f"SUCCESS: Existing user response includes has_global_vision={user['has_global_vision']}")
    
    def test_payment_verify_accepts_amount_parameter(self):
        """Test /api/payment/verify accepts amount parameter correctly"""
        response = requests.post(f"{BASE_URL}/api/payment/verify", json={
            "wallet_address": "0xtest_payment_verify",
            "amount": 9.0,  # 90% of 10 USDT
            "chain": "trc20",
            "payment_type": "deposit"
        })
        
        assert response.status_code == 200
        data = response.json()
        
        # Should return verified:false since no real payment was made
        assert "verified" in data
        assert data["verified"] == False, "Expected verified:false for test wallet with no real payment"
        print(f"SUCCESS: Payment verify returned verified={data['verified']} for test amount")
    
    def test_payment_verify_with_global_vision_type(self):
        """Test payment verify with global_vision payment type"""
        response = requests.post(f"{BASE_URL}/api/payment/verify", json={
            "wallet_address": "0xtest_global_vision_payment",
            "amount": 8.91,  # 90% of 9.9 USDT
            "chain": "trc20",
            "payment_type": "global_vision"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "verified" in data
        print(f"SUCCESS: Global Vision payment verify returned verified={data['verified']}")
    
    def test_payment_verify_with_vip_type(self):
        """Test payment verify with vip payment type"""
        response = requests.post(f"{BASE_URL}/api/payment/verify", json={
            "wallet_address": "0xtest_vip_payment",
            "amount": 89.10,  # 90% of 99 USDT
            "chain": "erc20",
            "payment_type": "vip"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "verified" in data
        print(f"SUCCESS: VIP payment verify returned verified={data['verified']}")
    
    def test_payment_addresses_still_working(self):
        """Test /api/payment/addresses still returns all chains"""
        response = requests.get(f"{BASE_URL}/api/payment/addresses")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "addresses" in data
        addresses = data["addresses"]
        
        # Check all 5 chains present
        expected_chains = ["trc20", "erc20", "bsc", "arb", "sol"]
        for chain in expected_chains:
            assert chain in addresses, f"Missing {chain} in payment addresses"
            assert "address" in addresses[chain], f"Missing address for {chain}"
            assert "explorer" in addresses[chain], f"Missing explorer URL for {chain}"
        
        print(f"SUCCESS: All {len(expected_chains)} payment chains available")
        print(f"  TRC20: {addresses['trc20']['address'][:20]}...")
        print(f"  SOL: {addresses['sol']['address'][:20]}...")


class TestIteration8DemoMode:
    """Test demo mode still works correctly"""
    
    def test_demo_bot_stats(self):
        """Test demo bot stats endpoint"""
        response = requests.get(f"{BASE_URL}/api/demo/bot-stats")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "stats" in data
        stats = data["stats"]
        assert "total_profit" in stats
        assert "win_rate" in stats
        print(f"SUCCESS: Demo bot stats - profit: {stats['total_profit']}, win_rate: {stats['win_rate']}")
    
    def test_demo_market_analysis(self):
        """Test demo market analysis endpoint"""
        response = requests.get(f"{BASE_URL}/api/demo/market-analysis")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "analysis" in data
        print(f"SUCCESS: Demo market analysis returned")
    
    def test_demo_profit_chart(self):
        """Test demo profit chart endpoint"""
        response = requests.get(f"{BASE_URL}/api/demo/profit-chart?days=30")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "chart_data" in data
        assert len(data["chart_data"]) > 0
        print(f"SUCCESS: Demo profit chart - {len(data['chart_data'])} data points")


class TestIteration8GlobalVision:
    """Test Global Vision feature persistence"""
    
    def test_global_vision_opportunities(self):
        """Test Global Vision opportunities endpoint"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "opportunities" in data
        print(f"SUCCESS: Global Vision opportunities - {len(data['opportunities'])} available")
    
    def test_global_vision_featured(self):
        """Test featured opportunity endpoint"""
        response = requests.get(f"{BASE_URL}/api/global-vision/featured")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "featured" in data
        print(f"SUCCESS: Global Vision featured opportunity returned")


class TestIteration8I18n:
    """Test i18n translations are working"""
    
    def test_market_prices(self):
        """Test market prices endpoint for i18n display"""
        response = requests.get(f"{BASE_URL}/api/prices")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "prices" in data
        prices = data["prices"]
        assert "BTC" in prices or "bitcoin" in str(prices).lower()
        print(f"SUCCESS: Market prices returned for i18n display")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
