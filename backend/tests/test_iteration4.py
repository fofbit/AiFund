"""
Iteration 4 Backend Tests - Testing whitepaper API and VIP features
Tests cover:
- Whitepaper PDF download endpoint
- Wallet connection (demo mode)
- Demo trading commands
- VIP level system data
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestWhitepaperAPI:
    """Test whitepaper PDF download functionality"""
    
    def test_whitepaper_returns_200(self):
        """Test that whitepaper endpoint returns HTTP 200"""
        response = requests.get(f"{BASE_URL}/api/whitepaper")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print("✓ Whitepaper endpoint returns 200")
    
    def test_whitepaper_returns_pdf_content_type(self):
        """Test that whitepaper returns PDF content type"""
        response = requests.get(f"{BASE_URL}/api/whitepaper")
        content_type = response.headers.get('content-type', '')
        assert 'application/pdf' in content_type, f"Expected PDF content-type, got {content_type}"
        print(f"✓ Whitepaper returns correct content-type: {content_type}")
    
    def test_whitepaper_has_content_disposition(self):
        """Test that whitepaper has proper download filename"""
        response = requests.get(f"{BASE_URL}/api/whitepaper")
        content_disp = response.headers.get('content-disposition', '')
        assert 'AIFund_Whitepaper' in content_disp, f"Expected filename in content-disposition, got {content_disp}"
        print(f"✓ Whitepaper has filename: {content_disp}")
    
    def test_whitepaper_pdf_structure(self):
        """Test that response is valid PDF (starts with %PDF)"""
        response = requests.get(f"{BASE_URL}/api/whitepaper")
        content = response.content[:8]
        assert content.startswith(b'%PDF'), f"PDF should start with %PDF, got {content}"
        print("✓ Whitepaper is valid PDF format")


class TestDemoMode:
    """Test demo mode wallet connection"""
    
    def test_wallet_connect_creates_user(self):
        """Test wallet connection creates new user"""
        response = requests.post(f"{BASE_URL}/api/wallet/connect", json={
            "wallet_address": "0xTEST_demo_user_123",
            "wallet_type": "metamask"
        })
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "status" in data
        assert "user" in data
        print(f"✓ Wallet connect works, status: {data['status']}")
    
    def test_demo_trades_endpoint(self):
        """Test demo trades API returns data"""
        response = requests.get(f"{BASE_URL}/api/demo/trades/test_bot_123?num_trades=5")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "trades" in data
        assert len(data["trades"]) > 0
        print(f"✓ Demo trades endpoint returns {len(data['trades'])} trades")
    
    def test_demo_bot_stats(self):
        """Test demo bot stats endpoint"""
        response = requests.get(f"{BASE_URL}/api/demo/bot-stats")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "stats" in data
        print("✓ Demo bot stats endpoint works")


class TestVIPLevelSystem:
    """Test VIP level system endpoints"""
    
    def test_vip_levels_endpoint(self):
        """Test VIP levels API returns level data"""
        response = requests.get(f"{BASE_URL}/api/gamification/vip-levels")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "levels" in data
        print(f"✓ VIP levels endpoint returns {len(data['levels'])} levels")
    
    def test_vip_trading_commands(self):
        """Test VIP trading commands endpoint"""
        response = requests.get(f"{BASE_URL}/api/vip/trading-commands?days=7&initial_capital=10000")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "commands" in data or "trades" in data or "timeline" in data or len(data) > 0
        print("✓ VIP trading commands endpoint works")
    
    def test_supported_markets(self):
        """Test supported markets for VIP API integration"""
        response = requests.get(f"{BASE_URL}/api/vip/supported-markets")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "markets" in data
        print(f"✓ Supported markets endpoint returns {len(data['markets'])} markets")


class TestGlobalVision:
    """Test Global Vision endpoints"""
    
    def test_global_vision_opportunities(self):
        """Test global vision opportunities endpoint"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "opportunities" in data
        print(f"✓ Global vision returns {len(data['opportunities'])} opportunities")
    
    def test_global_vision_categories(self):
        """Test global vision categories endpoint"""
        response = requests.get(f"{BASE_URL}/api/global-vision/categories")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "categories" in data
        print("✓ Global vision categories endpoint works")


class TestCoreAPIs:
    """Test core API endpoints"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "status" in data
        assert data["status"] == "active"
        print("✓ API root endpoint active")
    
    def test_prices_endpoint(self):
        """Test crypto prices endpoint"""
        response = requests.get(f"{BASE_URL}/api/prices")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "prices" in data
        print(f"✓ Prices endpoint returns {len(data['prices'])} prices")
    
    def test_market_analysis(self):
        """Test market analysis endpoint"""
        response = requests.get(f"{BASE_URL}/api/market/analysis")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "analysis" in data
        print("✓ Market analysis endpoint works")
    
    def test_bot_avatars(self):
        """Test bot avatars gamification endpoint"""
        response = requests.get(f"{BASE_URL}/api/gamification/bot-avatars")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "avatars" in data
        print("✓ Bot avatars endpoint works")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
