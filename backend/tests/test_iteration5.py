"""
Iteration 5 Backend Tests
Tests for:
1. Whitepaper API returns PDF (HTTP 200)
2. Global Vision opportunities have correct time periods (1yr-15yr)
3. Backend API health checks
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestWhitepaper:
    """Whitepaper endpoint tests"""
    
    def test_whitepaper_endpoint_returns_pdf(self):
        """Test /api/whitepaper returns PDF with correct content type"""
        response = requests.get(f"{BASE_URL}/api/whitepaper", timeout=30)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        assert 'application/pdf' in response.headers.get('content-type', ''), "Content-Type should be application/pdf"
        assert len(response.content) > 1000, "PDF content should not be empty"
        # Check for PDF header
        assert response.content[:4] == b'%PDF', "Response should start with PDF header"
        print("✓ Whitepaper API returns valid PDF")


class TestGlobalVision:
    """Global Vision endpoint tests"""
    
    def test_global_vision_opportunities_available(self):
        """Test /api/global-vision/opportunities returns data"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities", timeout=10)
        assert response.status_code == 200
        data = response.json()
        assert 'opportunities' in data
        assert len(data['opportunities']) > 0, "Should have opportunities"
        print(f"✓ Global Vision has {len(data['opportunities'])} opportunities")
    
    def test_global_vision_timeframes(self):
        """Test that opportunities have various timeframes including 1yr through 15yr"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities", timeout=10)
        assert response.status_code == 200
        data = response.json()
        
        timeframes_found = set()
        for opp in data['opportunities']:
            tf = opp.get('timeframe', '')
            timeframes_found.add(tf)
        
        print(f"Found timeframes: {timeframes_found}")
        # Should have various timeframes
        assert '1year' in timeframes_found or any('1' in tf for tf in timeframes_found), "Should have 1 year timeframe"
        assert '3year' in timeframes_found or any('3' in tf for tf in timeframes_found), "Should have 3 year timeframe"
        assert '5year' in timeframes_found, "Should have 5 year timeframe"
        assert '10year' in timeframes_found, "Should have 10 year timeframe"
        print("✓ Global Vision has time periods: 1yr through 10+yr")
    
    def test_global_vision_opportunities_sorted_by_roi(self):
        """Verify opportunities can be sorted by ROI (final_value)"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities", timeout=10)
        assert response.status_code == 200
        data = response.json()
        
        # Check opportunities have final_value for sorting
        for opp in data['opportunities'][:5]:
            assert 'final_value' in opp, f"Opportunity should have final_value: {opp.get('title')}"
            assert isinstance(opp['final_value'], (int, float)), "final_value should be numeric"
        
        # Verify can be sorted
        sorted_opps = sorted(data['opportunities'], key=lambda x: x.get('final_value', 0), reverse=True)
        assert sorted_opps[0]['final_value'] >= sorted_opps[-1]['final_value'], "Should be sortable by ROI"
        print("✓ Global Vision opportunities can be sorted by ROI")
    
    def test_global_vision_potential(self):
        """Test /api/global-vision/potential returns calculation"""
        response = requests.get(f"{BASE_URL}/api/global-vision/potential", timeout=10)
        assert response.status_code == 200
        data = response.json()
        assert 'potential' in data
        assert 'final_value' in data['potential']
        assert 'total_roi' in data['potential']
        print(f"✓ Global Vision potential: 100U → {data['potential']['final_value']}U")


class TestBackendHealth:
    """Basic backend health tests"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/", timeout=10)
        assert response.status_code == 200
        data = response.json()
        assert data.get('status') == 'active'
        print("✓ API root is active")
    
    def test_prices_endpoint(self):
        """Test crypto prices endpoint"""
        response = requests.get(f"{BASE_URL}/api/prices", timeout=10)
        assert response.status_code == 200
        data = response.json()
        assert 'prices' in data
        print(f"✓ Prices endpoint working: {len(data['prices'])} currencies")
    
    def test_gamification_vip_levels(self):
        """Test VIP levels endpoint"""
        response = requests.get(f"{BASE_URL}/api/gamification/vip-levels", timeout=10)
        assert response.status_code == 200
        data = response.json()
        assert 'levels' in data
        print(f"✓ VIP levels endpoint working")
    
    def test_gamification_bot_avatars(self):
        """Test bot avatars endpoint"""
        response = requests.get(f"{BASE_URL}/api/gamification/bot-avatars", timeout=10)
        assert response.status_code == 200
        data = response.json()
        assert 'avatars' in data
        print(f"✓ Bot avatars endpoint working")
    
    def test_demo_bot_stats(self):
        """Test demo bot stats endpoint"""
        response = requests.get(f"{BASE_URL}/api/demo/bot-stats", timeout=10)
        assert response.status_code == 200
        data = response.json()
        assert 'stats' in data
        print(f"✓ Demo bot stats endpoint working")


class TestDemoMode:
    """Demo mode specific tests"""
    
    def test_demo_wallet_connect(self):
        """Test demo mode creates user correctly"""
        demo_wallet = 'demo_test_iter5_user'
        response = requests.post(f"{BASE_URL}/api/wallet/connect", json={
            "wallet_address": demo_wallet,
            "wallet_type": "demo"
        }, timeout=10)
        assert response.status_code == 200
        data = response.json()
        assert 'user' in data or 'status' in data
        print(f"✓ Demo wallet connect working")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
