"""
Iteration 9 Tests: Global Vision Expansion to 45 Cases
Tests for new legendary IPO-to-now stories and historical price curves
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://vision-profits.preview.emergentagent.com').rstrip('/')


class TestGlobalVisionExpansion:
    """Test Global Vision endpoint returns 45+ cases with proper data"""
    
    def test_global_vision_returns_45_plus_cases(self):
        """Verify /api/global-vision/opportunities returns 45+ cases"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        assert response.status_code == 200
        
        data = response.json()
        opportunities = data.get('opportunities', data)
        assert isinstance(opportunities, list)
        assert len(opportunities) >= 45, f"Expected 45+ cases, got {len(opportunities)}"
        print(f"PASS: Global Vision returns {len(opportunities)} cases")
    
    def test_btc_pizza_200000x_exists(self):
        """Verify BTC Pizza 200,000x case exists (btc_2010_origin)"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        assert response.status_code == 200
        
        data = response.json()
        opportunities = data.get('opportunities', data)
        
        pizza_case = next((o for o in opportunities if o['id'] == 'btc_2010_origin'), None)
        assert pizza_case is not None, "btc_2010_origin case not found"
        assert '200,000x' in pizza_case['roi_multiplier'], f"Expected 200,000x ROI, got {pizza_case['roi_multiplier']}"
        assert pizza_case['final_value'] == 20000000, f"Expected final_value=20000000, got {pizza_case['final_value']}"
        print(f"PASS: BTC Pizza case found with ROI={pizza_case['roi_multiplier']}")
    
    def test_sorting_by_roi_btc_pizza_at_top(self):
        """Verify BTC Pizza (200,000x) is top by ROI when sorted"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        assert response.status_code == 200
        
        data = response.json()
        opportunities = data.get('opportunities', data)
        
        # Sort by final_value (ROI)
        sorted_opps = sorted(opportunities, key=lambda x: x.get('final_value', 0), reverse=True)
        top_case = sorted_opps[0]
        
        assert top_case['id'] == 'btc_2010_origin', f"Expected btc_2010_origin at top, got {top_case['id']}"
        print(f"PASS: BTC Pizza correctly at top when sorted by ROI")
    
    def test_15year_timeframe_tags(self):
        """Verify new IPO stories have 15year timeframe tag"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        assert response.status_code == 200
        
        data = response.json()
        opportunities = data.get('opportunities', data)
        
        fifteen_year_cases = [o for o in opportunities if o.get('timeframe') == '15year']
        assert len(fifteen_year_cases) >= 10, f"Expected 10+ 15year cases, got {len(fifteen_year_cases)}"
        
        # Verify specific legendary IPO stories have 15year tag
        expected_15year_ids = [
            'tencent_ipo_2004', 'nvda_ipo_1999', 'tsla_ipo_2010', 
            'amzn_ipo_1997', 'google_ipo_2004', 'netflix_2010',
            'msft_2010', 'moutai_ipo_2001', 'bitcoin_2011', 'btc_2010_origin'
        ]
        
        fifteen_year_ids = [o['id'] for o in fifteen_year_cases]
        for expected_id in expected_15year_ids:
            assert expected_id in fifteen_year_ids, f"Expected {expected_id} to have 15year timeframe"
        
        print(f"PASS: Found {len(fifteen_year_cases)} cases with 15year timeframe")


class TestLegendaryIPOStories:
    """Test for new legendary IPO-to-now stories in Global Vision"""
    
    def test_tencent_ipo_2004_case(self):
        """Verify Tencent IPO (1300x) case exists"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        assert response.status_code == 200
        
        data = response.json()
        opportunities = data.get('opportunities', data)
        
        case = next((o for o in opportunities if o['id'] == 'tencent_ipo_2004'), None)
        assert case is not None, "tencent_ipo_2004 case not found"
        assert '1,300x' in case['roi_multiplier'] or '1300x' in case['roi_multiplier']
        print(f"PASS: Tencent IPO case found - {case['roi_multiplier']}")
    
    def test_nvda_ipo_1999_case(self):
        """Verify NVIDIA IPO (930x) case exists"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        assert response.status_code == 200
        
        data = response.json()
        opportunities = data.get('opportunities', data)
        
        case = next((o for o in opportunities if o['id'] == 'nvda_ipo_1999'), None)
        assert case is not None, "nvda_ipo_1999 case not found"
        assert '930x' in case['roi_multiplier']
        print(f"PASS: NVIDIA IPO case found - {case['roi_multiplier']}")
    
    def test_tsla_ipo_2010_case(self):
        """Verify Tesla IPO (350x) case exists"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        assert response.status_code == 200
        
        data = response.json()
        opportunities = data.get('opportunities', data)
        
        case = next((o for o in opportunities if o['id'] == 'tsla_ipo_2010'), None)
        assert case is not None, "tsla_ipo_2010 case not found"
        assert '350x' in case['roi_multiplier']
        print(f"PASS: Tesla IPO case found - {case['roi_multiplier']}")
    
    def test_amzn_ipo_1997_case(self):
        """Verify Amazon IPO (2600x) case exists"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        assert response.status_code == 200
        
        data = response.json()
        opportunities = data.get('opportunities', data)
        
        case = next((o for o in opportunities if o['id'] == 'amzn_ipo_1997'), None)
        assert case is not None, "amzn_ipo_1997 case not found"
        assert '2,600x' in case['roi_multiplier'] or '2600x' in case['roi_multiplier']
        print(f"PASS: Amazon IPO case found - {case['roi_multiplier']}")
    
    def test_google_ipo_2004_case(self):
        """Verify Google IPO (42x) case exists"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        assert response.status_code == 200
        
        data = response.json()
        opportunities = data.get('opportunities', data)
        
        case = next((o for o in opportunities if o['id'] == 'google_ipo_2004'), None)
        assert case is not None, "google_ipo_2004 case not found"
        assert '42x' in case['roi_multiplier']
        print(f"PASS: Google IPO case found - {case['roi_multiplier']}")
    
    def test_gme_wsb_2021_case(self):
        """Verify GameStop WSB (83x) case exists"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        assert response.status_code == 200
        
        data = response.json()
        opportunities = data.get('opportunities', data)
        
        case = next((o for o in opportunities if o['id'] == 'gme_wsb_2021'), None)
        assert case is not None, "gme_wsb_2021 case not found"
        assert '83x' in case['roi_multiplier']
        print(f"PASS: GameStop WSB case found - {case['roi_multiplier']}")
    
    def test_eth_ico_2014_case(self):
        """Verify Ethereum ICO (11,600x) case exists"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        assert response.status_code == 200
        
        data = response.json()
        opportunities = data.get('opportunities', data)
        
        case = next((o for o in opportunities if o['id'] == 'eth_ico_2014'), None)
        assert case is not None, "eth_ico_2014 case not found"
        assert '11,600x' in case['roi_multiplier'] or '11600x' in case['roi_multiplier']
        print(f"PASS: Ethereum ICO case found - {case['roi_multiplier']}")
    
    def test_bnb_2017_case(self):
        """Verify BNB (5900x) case exists"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        assert response.status_code == 200
        
        data = response.json()
        opportunities = data.get('opportunities', data)
        
        case = next((o for o in opportunities if o['id'] == 'bnb_2017'), None)
        assert case is not None, "bnb_2017 case not found"
        assert '5,900x' in case['roi_multiplier'] or '5900x' in case['roi_multiplier']
        print(f"PASS: BNB case found - {case['roi_multiplier']}")
    
    def test_bitcoin_2011_at_1_dollar_case(self):
        """Verify BTC at $1 (100,000x) case exists"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        assert response.status_code == 200
        
        data = response.json()
        opportunities = data.get('opportunities', data)
        
        case = next((o for o in opportunities if o['id'] == 'bitcoin_2011'), None)
        assert case is not None, "bitcoin_2011 case not found"
        assert '100,000x' in case['roi_multiplier'] or '100000x' in case['roi_multiplier']
        print(f"PASS: BTC at $1 case found - {case['roi_multiplier']}")
    
    def test_netflix_2010_case(self):
        """Verify Netflix (108x) case exists"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        assert response.status_code == 200
        
        data = response.json()
        opportunities = data.get('opportunities', data)
        
        case = next((o for o in opportunities if o['id'] == 'netflix_2010'), None)
        assert case is not None, "netflix_2010 case not found"
        assert '108x' in case['roi_multiplier']
        print(f"PASS: Netflix case found - {case['roi_multiplier']}")
    
    def test_moutai_ipo_2001_case(self):
        """Verify Moutai IPO (520x) case exists"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        assert response.status_code == 200
        
        data = response.json()
        opportunities = data.get('opportunities', data)
        
        case = next((o for o in opportunities if o['id'] == 'moutai_ipo_2001'), None)
        assert case is not None, "moutai_ipo_2001 case not found"
        assert '520x' in case['roi_multiplier']
        print(f"PASS: Moutai IPO case found - {case['roi_multiplier']}")


class TestHistoricalPriceCurves:
    """Test new historical price curves for legendary cases"""
    
    def test_tencent_ipo_2004_price_curve(self):
        """Verify tencent_ipo_2004 price curve returns valid data"""
        response = requests.get(f"{BASE_URL}/api/historical/price-curve/tencent_ipo_2004")
        assert response.status_code == 200
        
        data = response.json()
        assert 'asset' in data
        assert 'curve' in data
        assert len(data['curve']) > 50, "Expected 50+ curve points"
        assert data['asset']['symbol'] == '0700'
        print(f"PASS: Tencent price curve - {len(data['curve'])} points")
    
    def test_nvda_ipo_1999_price_curve(self):
        """Verify nvda_ipo_1999 price curve returns valid data"""
        response = requests.get(f"{BASE_URL}/api/historical/price-curve/nvda_ipo_1999")
        assert response.status_code == 200
        
        data = response.json()
        assert 'asset' in data
        assert 'curve' in data
        assert len(data['curve']) > 50
        assert data['asset']['start_price'] == 0.15, "Expected IPO price $0.15"
        print(f"PASS: NVIDIA IPO price curve - {len(data['curve'])} points")
    
    def test_tsla_ipo_2010_price_curve(self):
        """Verify tsla_ipo_2010 price curve returns valid data"""
        response = requests.get(f"{BASE_URL}/api/historical/price-curve/tsla_ipo_2010")
        assert response.status_code == 200
        
        data = response.json()
        assert 'asset' in data
        assert 'curve' in data
        assert len(data['curve']) > 50
        assert data['asset']['start_price'] == 1.13, "Expected IPO price $1.13"
        print(f"PASS: Tesla IPO price curve - {len(data['curve'])} points")
    
    def test_amzn_ipo_1997_price_curve(self):
        """Verify amzn_ipo_1997 price curve returns valid data"""
        response = requests.get(f"{BASE_URL}/api/historical/price-curve/amzn_ipo_1997")
        assert response.status_code == 200
        
        data = response.json()
        assert 'asset' in data
        assert 'curve' in data
        assert len(data['curve']) > 50
        assert data['asset']['start_price'] == 0.075, "Expected IPO price $0.075"
        print(f"PASS: Amazon IPO price curve - {len(data['curve'])} points")
    
    def test_google_ipo_2004_price_curve(self):
        """Verify google_ipo_2004 price curve returns valid data"""
        response = requests.get(f"{BASE_URL}/api/historical/price-curve/google_ipo_2004")
        assert response.status_code == 200
        
        data = response.json()
        assert 'asset' in data
        assert 'curve' in data
        assert len(data['curve']) > 50
        assert data['asset']['start_price'] == 4.25
        print(f"PASS: Google IPO price curve - {len(data['curve'])} points")
    
    def test_gme_wsb_2021_price_curve(self):
        """Verify gme_wsb_2021 price curve returns valid data"""
        response = requests.get(f"{BASE_URL}/api/historical/price-curve/gme_wsb_2021")
        assert response.status_code == 200
        
        data = response.json()
        assert 'asset' in data
        assert 'curve' in data
        assert len(data['curve']) > 10
        print(f"PASS: GME WSB price curve - {len(data['curve'])} points")
    
    def test_netflix_2010_price_curve(self):
        """Verify netflix_2010 price curve returns valid data"""
        response = requests.get(f"{BASE_URL}/api/historical/price-curve/netflix_2010")
        assert response.status_code == 200
        
        data = response.json()
        assert 'asset' in data
        assert 'curve' in data
        assert len(data['curve']) > 50
        assert data['asset']['start_price'] == 7.64
        print(f"PASS: Netflix price curve - {len(data['curve'])} points")
    
    def test_bitcoin_2011_price_curve(self):
        """Verify bitcoin_2011 price curve returns valid data"""
        response = requests.get(f"{BASE_URL}/api/historical/price-curve/bitcoin_2011")
        assert response.status_code == 200
        
        data = response.json()
        assert 'asset' in data
        assert 'curve' in data
        assert len(data['curve']) > 50
        assert data['asset']['investment_price'] == 1.0, "Expected $1 investment price"
        print(f"PASS: Bitcoin $1 price curve - {len(data['curve'])} points")
    
    def test_eth_ico_2014_price_curve(self):
        """Verify eth_ico_2014 price curve returns valid data"""
        response = requests.get(f"{BASE_URL}/api/historical/price-curve/eth_ico_2014")
        assert response.status_code == 200
        
        data = response.json()
        assert 'asset' in data
        assert 'curve' in data
        assert len(data['curve']) > 50
        assert data['asset']['investment_price'] == 0.31, "Expected ICO price $0.31"
        print(f"PASS: ETH ICO price curve - {len(data['curve'])} points")
    
    def test_moutai_ipo_2001_price_curve(self):
        """Verify moutai_ipo_2001 price curve returns valid data"""
        response = requests.get(f"{BASE_URL}/api/historical/price-curve/moutai_ipo_2001")
        assert response.status_code == 200
        
        data = response.json()
        assert 'asset' in data
        assert 'curve' in data
        assert len(data['curve']) > 10
        print(f"PASS: Moutai IPO price curve - {len(data['curve'])} points")


class TestDemoModeIntact:
    """Verify demo mode still works end-to-end"""
    
    def test_demo_wallet_connect(self):
        """Verify demo wallet connect works"""
        response = requests.post(f"{BASE_URL}/api/wallet/connect", json={
            "address": "demo_test_wallet_iter9",
            "chain_type": "evm"
        })
        assert response.status_code == 200
        
        data = response.json()
        assert 'user' in data
        print(f"PASS: Demo wallet connect works")
    
    def test_demo_login(self):
        """Verify demo login works"""
        response = requests.post(f"{BASE_URL}/api/demo/start")
        assert response.status_code == 200
        
        data = response.json()
        assert 'user' in data
        assert data['user'].get('is_demo') is True
        print(f"PASS: Demo login works")
    
    def test_health_check(self):
        """Verify health endpoint works"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        print("PASS: Health check works")


class TestAllCasesHaveRequiredFields:
    """Verify all 45 cases have required fields for display"""
    
    def test_all_cases_have_required_fields(self):
        """All cases must have id, title, roi_multiplier, final_value, timeframe, icon"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        assert response.status_code == 200
        
        data = response.json()
        opportunities = data.get('opportunities', data)
        
        required_fields = ['id', 'title', 'roi_multiplier', 'final_value', 'timeframe', 'icon', 'category']
        
        for opp in opportunities:
            for field in required_fields:
                assert field in opp, f"Case {opp.get('id', 'unknown')} missing field: {field}"
        
        print(f"PASS: All {len(opportunities)} cases have required fields")
