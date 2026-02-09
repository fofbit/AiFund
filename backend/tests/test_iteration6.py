"""
AIFund.com Iteration 6 Backend Tests
Tests: Global Vision expanded with 15-year cases, 2-year cases, time periods,
       BTC Pizza Day origin, whitepaper PDF, and all API endpoints
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestGlobalVisionExpanded:
    """Tests for expanded Global Vision with 15-year and 2-year cases"""
    
    def test_global_vision_opportunities_returns_30_plus_items(self):
        """Global Vision should return 30+ opportunity items"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        assert response.status_code == 200
        
        data = response.json()
        assert "opportunities" in data
        opportunities = data["opportunities"]
        
        # Should have 30+ items
        print(f"Total opportunities: {len(opportunities)}")
        assert len(opportunities) >= 30, f"Expected 30+ opportunities, got {len(opportunities)}"
    
    def test_global_vision_has_15_year_cases(self):
        """Global Vision should have 15-year timeframe cases"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        assert response.status_code == 200
        
        data = response.json()
        opportunities = data["opportunities"]
        
        # Find 15-year cases
        year_15_cases = [o for o in opportunities if o.get('timeframe') == '15year']
        print(f"15-year cases found: {len(year_15_cases)}")
        
        # Should have at least 4 (BTC Pizza Day, Apple 2010, Amazon 2010, TSMC 2010)
        assert len(year_15_cases) >= 4, f"Expected 4+ 15-year cases, got {len(year_15_cases)}"
        
        # Verify specific cases
        ids = [o['id'] for o in year_15_cases]
        assert 'btc_2010_origin' in ids, "Missing BTC Pizza Day (btc_2010_origin)"
        assert 'aapl_2010' in ids, "Missing Apple 2010"
        assert 'amzn_2010' in ids, "Missing Amazon 2010"
        assert 'tsmc_2010' in ids, "Missing TSMC 2010"
    
    def test_btc_pizza_day_case(self):
        """Verify BTC Pizza Day case has correct data"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        assert response.status_code == 200
        
        opportunities = response.json()["opportunities"]
        btc_origin = next((o for o in opportunities if o['id'] == 'btc_2010_origin'), None)
        
        assert btc_origin is not None, "BTC Pizza Day case not found"
        
        # Verify data
        assert btc_origin['date'] == '2010-05-22', f"Expected 2010-05-22, got {btc_origin.get('date')}"
        assert btc_origin['timeframe'] == '15year'
        assert 'Pizza' in btc_origin.get('title', '') or 'Genesis' in btc_origin.get('title', '')
        assert btc_origin.get('final_value', 0) >= 1000000, "BTC 2010 should have huge final value"
        
        print(f"BTC Pizza Day: {btc_origin['title']}")
        print(f"Date: {btc_origin['date']}, ROI: {btc_origin['roi_multiplier']}")
    
    def test_global_vision_has_2_year_cases(self):
        """Global Vision should have 2-year timeframe cases"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        assert response.status_code == 200
        
        opportunities = response.json()["opportunities"]
        
        # Find 2-year cases
        year_2_cases = [o for o in opportunities if o.get('timeframe') == '2year']
        print(f"2-year cases found: {len(year_2_cases)}")
        
        # Should have at least 2 (NVDA AI boom, SOL meme season)
        assert len(year_2_cases) >= 2, f"Expected 2+ 2-year cases, got {len(year_2_cases)}"
        
        # Verify specific cases
        ids = [o['id'] for o in year_2_cases]
        print(f"2-year case IDs: {ids}")
        assert 'nvda_2023_ai_boom' in ids, "Missing NVDA AI boom 2023"
        assert 'sol_meme_2023' in ids, "Missing Solana meme season 2023"
    
    def test_nvda_2023_ai_boom_case(self):
        """Verify NVDA AI boom case exists"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        assert response.status_code == 200
        
        opportunities = response.json()["opportunities"]
        nvda_case = next((o for o in opportunities if o['id'] == 'nvda_2023_ai_boom'), None)
        
        assert nvda_case is not None, "NVDA 2023 AI boom case not found"
        assert nvda_case['timeframe'] == '2year'
        print(f"NVDA 2023: {nvda_case['title']}, ROI: {nvda_case['roi_multiplier']}")
    
    def test_sol_meme_season_case(self):
        """Verify Solana meme season case exists"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        assert response.status_code == 200
        
        opportunities = response.json()["opportunities"]
        sol_case = next((o for o in opportunities if o['id'] == 'sol_meme_2023'), None)
        
        assert sol_case is not None, "Solana meme season case not found"
        assert sol_case['timeframe'] == '2year'
        print(f"SOL Meme: {sol_case['title']}, ROI: {sol_case['roi_multiplier']}")


class TestHistoricalPricesWithPizzaDay:
    """Tests for historical prices including BTC Pizza Day origin"""
    
    def test_btc_2010_origin_price_curve(self):
        """Test /api/historical/price-curve/btc_2010_origin works"""
        response = requests.get(f"{BASE_URL}/api/historical/price-curve/btc_2010_origin")
        assert response.status_code == 200
        
        data = response.json()
        assert "asset" in data
        assert "curve" in data
        assert "milestones" in data
        
        asset = data["asset"]
        assert asset['name'] == 'Bitcoin (BTC) — Genesis' or 'BTC' in asset['name']
        assert asset['start_date'] == '2010-05-22'  # Pizza Day
        assert asset['start_price'] == 0.003
        
        # Verify curve has data
        assert len(data["curve"]) > 0, "Price curve should have data points"
        
        # Verify milestones include Pizza Day
        milestones = data["milestones"]
        pizza_day = next((m for m in milestones if m.get('date') == '2010-05-22'), None)
        assert pizza_day is not None, "Pizza Day milestone missing"
        assert pizza_day['price'] == 0.003
        assert 'Pizza' in pizza_day.get('event', '')
        
        print(f"BTC Origin asset: {asset['name']}")
        print(f"Pizza Day: {pizza_day}")
    
    def test_historical_asset_btc_2010(self):
        """Test /api/historical/asset/btc_2010_origin"""
        response = requests.get(f"{BASE_URL}/api/historical/asset/btc_2010_origin")
        assert response.status_code == 200
        
        data = response.json()
        assert "asset" in data
        asset = data["asset"]
        
        assert asset['investment_date'] == '2010-05-22'
        assert asset['investment_price'] == 0.003


class TestTimePeriodFilters:
    """Test time period filters for Global Vision"""
    
    def test_filter_by_15year_timeframe(self):
        """Test filtering by 15-year timeframe"""
        response = requests.get(f"{BASE_URL}/api/global-vision/by-timeframe/15year")
        assert response.status_code == 200
        
        data = response.json()
        assert "opportunities" in data
        assert "count" in data
        
        # All returned should be 15year
        for opp in data["opportunities"]:
            assert opp['timeframe'] == '15year', f"Expected 15year, got {opp['timeframe']}"
        
        print(f"15-year opportunities: {data['count']}")
    
    def test_filter_by_2year_timeframe(self):
        """Test that 2-year cases exist (filtered in frontend)"""
        # The backend doesn't have a dedicated 2year endpoint, but we can verify data
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        assert response.status_code == 200
        
        opportunities = response.json()["opportunities"]
        year_2 = [o for o in opportunities if o.get('timeframe') == '2year']
        
        print(f"2-year opportunities: {len(year_2)}")
        assert len(year_2) >= 2


class TestWhitepaperAPI:
    """Test Whitepaper PDF download"""
    
    def test_whitepaper_pdf_download(self):
        """Test /api/whitepaper returns valid PDF"""
        response = requests.get(f"{BASE_URL}/api/whitepaper")
        assert response.status_code == 200
        
        # Check content type
        content_type = response.headers.get('content-type', '')
        assert 'application/pdf' in content_type, f"Expected PDF, got {content_type}"
        
        # Check it's a valid PDF (starts with %PDF)
        content = response.content
        assert content[:4] == b'%PDF', "Response is not a valid PDF"
        
        print(f"Whitepaper PDF size: {len(content)} bytes")


class TestCoreAPIs:
    """Test core APIs are still working"""
    
    def test_root_api(self):
        """Test root API endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data['status'] == 'active'
    
    def test_prices_api(self):
        """Test /api/prices endpoint"""
        response = requests.get(f"{BASE_URL}/api/prices")
        assert response.status_code == 200
        data = response.json()
        assert "prices" in data
        prices = data["prices"]
        assert "BTC" in prices or "USDT" in prices
    
    def test_demo_bot_stats(self):
        """Test /api/demo/bot-stats endpoint"""
        response = requests.get(f"{BASE_URL}/api/demo/bot-stats")
        assert response.status_code == 200
        data = response.json()
        assert "stats" in data
    
    def test_market_analysis(self):
        """Test /api/market/analysis endpoint"""
        response = requests.get(f"{BASE_URL}/api/market/analysis")
        assert response.status_code == 200
        data = response.json()
        assert "analysis" in data
    
    def test_global_vision_potential(self):
        """Test /api/global-vision/potential endpoint"""
        response = requests.get(f"{BASE_URL}/api/global-vision/potential")
        assert response.status_code == 200
        data = response.json()
        assert "potential" in data
        
        potential = data["potential"]
        assert potential['initial_investment'] == 100
        assert potential['final_value'] > 0
    
    def test_global_vision_categories(self):
        """Test /api/global-vision/categories endpoint"""
        response = requests.get(f"{BASE_URL}/api/global-vision/categories")
        assert response.status_code == 200
        data = response.json()
        assert "categories" in data
        
        categories = data["categories"]
        assert len(categories) > 0
        print(f"Categories: {[c['name'] for c in categories]}")
    
    def test_supported_markets(self):
        """Test /api/vip/supported-markets endpoint"""
        response = requests.get(f"{BASE_URL}/api/vip/supported-markets")
        assert response.status_code == 200
        data = response.json()
        assert "markets" in data
        markets = data["markets"]
        assert len(markets) >= 5  # crypto, us_stock, hk_stock, etc.
    
    def test_gamification_vip_levels(self):
        """Test /api/gamification/vip-levels endpoint"""
        response = requests.get(f"{BASE_URL}/api/gamification/vip-levels")
        assert response.status_code == 200
        data = response.json()
        assert "levels" in data


class TestDemoModeWorkflow:
    """Test demo mode works end-to-end"""
    
    def test_demo_wallet_connect(self):
        """Test demo wallet connection"""
        demo_wallet = "demo_test_" + str(int(__import__('time').time()))
        
        response = requests.post(f"{BASE_URL}/api/wallet/connect", json={
            "wallet_address": demo_wallet,
            "wallet_type": "demo"
        })
        assert response.status_code == 200
        
        data = response.json()
        assert data['status'] == 'new_user'
        assert data['user']['wallet_address'] == demo_wallet.lower()
    
    def test_demo_deposit(self):
        """Test demo deposit flow"""
        demo_wallet = "demo_deposit_" + str(int(__import__('time').time()))
        
        # First connect wallet
        requests.post(f"{BASE_URL}/api/wallet/connect", json={
            "wallet_address": demo_wallet,
            "wallet_type": "demo"
        })
        
        # Then deposit
        response = requests.post(f"{BASE_URL}/api/deposit", json={
            "wallet_address": demo_wallet,
            "currency": "USDT",
            "amount": 100,
            "tx_hash": "demo_tx_" + str(int(__import__('time').time()))
        })
        assert response.status_code == 200
        
        data = response.json()
        assert data['success'] == True
        assert data['tier'] in ['basic', 'vip']


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
