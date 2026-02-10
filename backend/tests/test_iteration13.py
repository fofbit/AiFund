"""
Iteration 13 Backend Tests
Tests for:
1. Demo trades API returns both crypto AND stock symbols
2. VIP supported markets endpoint for exchanges
3. Waitlist endpoints
4. All basic API health checks
"""
import pytest
import requests
import os
import random

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestAPIHealth:
    """Basic API health checks"""
    
    def test_root_endpoint(self):
        """Test API root"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "active"
        print("ROOT API: OK")

    def test_prices_endpoint(self):
        """Test prices endpoint"""
        response = requests.get(f"{BASE_URL}/api/prices")
        assert response.status_code == 200
        data = response.json()
        assert "prices" in data
        print(f"PRICES API: OK - {len(data['prices'])} currencies")


class TestDemoTrades:
    """Test demo trades endpoint returns crypto AND stocks"""
    
    def test_demo_trades_returns_both_crypto_and_stocks(self):
        """Verify /api/demo/trades returns both crypto and stock symbols"""
        crypto_symbols = ['BTC', 'ETH', 'SOL', 'DOGE', 'PEPE', 'ORDI', 'XRP', 'BNB']
        stock_symbols = ['NVDA', 'TSLA', 'AAPL', 'AMZN', 'GOOG', 'META', 'MSFT', 'NFLX']
        
        # Get multiple batches to have better coverage
        all_symbols = []
        for i in range(5):
            response = requests.get(f"{BASE_URL}/api/demo/trades/test_bot_{i}?num_trades=20")
            assert response.status_code == 200
            data = response.json()
            assert "trades" in data
            symbols = [t['symbol'] for t in data['trades']]
            all_symbols.extend(symbols)
        
        has_crypto = any(s in crypto_symbols for s in all_symbols)
        has_stock = any(s in stock_symbols for s in all_symbols)
        
        print(f"DEMO TRADES: All symbols collected: {set(all_symbols)}")
        print(f"Has crypto symbols: {has_crypto}")
        print(f"Has stock symbols: {has_stock}")
        
        assert has_crypto, "Demo trades should include crypto symbols"
        assert has_stock, "Demo trades should include stock symbols like NVDA, TSLA, AAPL"
        print("DEMO TRADES: Returns both CRYPTO and STOCKS - PASS")

    def test_demo_trades_stock_symbols_specific(self):
        """Check specific stock symbols appear in trades"""
        target_stocks = ['NVDA', 'TSLA', 'AAPL', 'AMZN', 'GOOG', 'MSFT', 'NFLX']
        
        all_symbols = set()
        for i in range(10):
            response = requests.get(f"{BASE_URL}/api/demo/trades/stock_test_{i}?num_trades=30")
            assert response.status_code == 200
            data = response.json()
            symbols = [t['symbol'] for t in data['trades']]
            all_symbols.update(symbols)
        
        found_stocks = [s for s in target_stocks if s in all_symbols]
        print(f"STOCK SYMBOLS FOUND: {found_stocks}")
        
        # At least 3 different stock symbols should appear across 300 trades
        assert len(found_stocks) >= 3, f"Expected at least 3 stock symbols, found {found_stocks}"


class TestVIPSupportedMarkets:
    """Test VIP supported markets includes new exchanges"""
    
    def test_vip_supported_markets(self):
        """Test /api/vip/supported-markets returns market list"""
        response = requests.get(f"{BASE_URL}/api/vip/supported-markets")
        assert response.status_code == 200
        data = response.json()
        assert "markets" in data
        
        markets = data['markets']
        market_ids = [m.get('id') for m in markets]
        
        print(f"VIP SUPPORTED MARKETS: {market_ids}")
        
        # Should include crypto, us_stock markets
        assert 'crypto' in market_ids, "Should have crypto market"
        assert 'us_stock' in market_ids, "Should have us_stock market"
        print("VIP SUPPORTED MARKETS: Contains crypto and us_stock - PASS")


class TestWaitlist:
    """Test Co-Creator waitlist endpoints"""
    
    def test_waitlist_status(self):
        """Test waitlist status endpoint"""
        test_wallet = f"0xtest_{random.randint(100000, 999999)}"
        response = requests.get(f"{BASE_URL}/api/waitlist/status/{test_wallet}")
        assert response.status_code == 200
        data = response.json()
        
        assert "joined" in data
        assert "total_count" in data
        print(f"WAITLIST STATUS: joined={data['joined']}, count={data['total_count']} - PASS")


class TestDemoMarketAnalysis:
    """Test demo market analysis endpoint"""
    
    def test_demo_market_analysis(self):
        """Test demo market analysis returns data"""
        response = requests.get(f"{BASE_URL}/api/demo/market-analysis")
        assert response.status_code == 200
        data = response.json()
        assert "analysis" in data
        
        analysis = data['analysis']
        assert "btc_price" in analysis
        assert "fear_greed_index" in analysis
        print(f"DEMO MARKET ANALYSIS: BTC=${analysis['btc_price']}, Fear/Greed={analysis['fear_greed_index']} - PASS")


class TestGlobalVision:
    """Test Global Vision endpoints"""
    
    def test_global_vision_opportunities(self):
        """Test global vision opportunities"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        assert response.status_code == 200
        data = response.json()
        assert "opportunities" in data
        print(f"GLOBAL VISION: {len(data['opportunities'])} opportunities - PASS")

    def test_global_vision_featured(self):
        """Test featured opportunity"""
        response = requests.get(f"{BASE_URL}/api/global-vision/featured")
        assert response.status_code == 200
        data = response.json()
        assert "featured" in data
        print("GLOBAL VISION FEATURED: PASS")


class TestGamification:
    """Test gamification endpoints"""
    
    def test_bot_avatars(self):
        """Test bot avatars endpoint"""
        response = requests.get(f"{BASE_URL}/api/gamification/bot-avatars")
        assert response.status_code == 200
        data = response.json()
        assert "avatars" in data
        print("BOT AVATARS: PASS")

    def test_vip_levels(self):
        """Test VIP levels endpoint"""
        response = requests.get(f"{BASE_URL}/api/gamification/vip-levels")
        assert response.status_code == 200
        data = response.json()
        assert "levels" in data
        print("VIP LEVELS: PASS")

    def test_virtual_store(self):
        """Test virtual store endpoint"""
        response = requests.get(f"{BASE_URL}/api/gamification/store")
        assert response.status_code == 200
        data = response.json()
        assert "store" in data
        print("VIRTUAL STORE: PASS")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
