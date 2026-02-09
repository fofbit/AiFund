"""
Iteration 10 Test Suite - AI Customer Service, NFT Account Rights, Co-Creator Waitlist
Tests the new features: AI chatbot, waitlist join/status endpoints
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthAndRoot:
    """Basic API health tests"""
    
    def test_api_root_status(self):
        """API root returns active status"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "active"
        assert "AIfund" in data["message"]
        print("✓ API root status check passed")


class TestAICustomerService:
    """AI Support chatbot endpoint tests"""
    
    def test_ai_chat_basic_response(self):
        """AI chat returns meaningful response to basic question"""
        response = requests.post(f"{BASE_URL}/api/ai-support/chat", json={
            "session_id": f"pytest_{uuid.uuid4().hex[:8]}",
            "message": "How do I get started?"
        }, timeout=30)
        
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        assert len(data["response"]) > 50  # Should be a meaningful response
        assert isinstance(data["response"], str)
        # Check for relevant content
        assert any(keyword in data["response"].lower() for keyword in ["wallet", "connect", "deposit", "vip", "platform", "started"])
        print(f"✓ AI chat basic response test passed: {len(data['response'])} chars")
    
    def test_ai_chat_50_50_rule_question(self):
        """AI chat answers domain-specific question about 50/50 rule"""
        response = requests.post(f"{BASE_URL}/api/ai-support/chat", json={
            "session_id": f"pytest_{uuid.uuid4().hex[:8]}",
            "message": "What is the 50/50 profit rule?"
        }, timeout=30)
        
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        # Should mention profit, compounding, or withdrawal
        assert any(keyword in data["response"].lower() for keyword in ["profit", "50%", "compound", "withdraw"])
        print("✓ AI chat 50/50 rule question test passed")
    
    def test_ai_chat_global_vision_question(self):
        """AI chat knows about Global Vision feature"""
        response = requests.post(f"{BASE_URL}/api/ai-support/chat", json={
            "session_id": f"pytest_{uuid.uuid4().hex[:8]}",
            "message": "What is Global Vision?"
        }, timeout=30)
        
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        # Should mention historical, opportunities, or cases
        assert any(keyword in data["response"].lower() for keyword in ["historical", "wealth", "case", "9.9", "studies"])
        print("✓ AI chat Global Vision question test passed")
    
    def test_ai_chat_empty_message_error(self):
        """AI chat returns error for empty message"""
        response = requests.post(f"{BASE_URL}/api/ai-support/chat", json={
            "session_id": "test_empty",
            "message": ""
        }, timeout=30)
        
        assert response.status_code == 400
        print("✓ AI chat empty message error test passed")
    
    def test_ai_chat_supported_chains_question(self):
        """AI chat knows about supported blockchain chains"""
        response = requests.post(f"{BASE_URL}/api/ai-support/chat", json={
            "session_id": f"pytest_{uuid.uuid4().hex[:8]}",
            "message": "What chains do you support for payments?"
        }, timeout=30)
        
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        # Should mention some supported chains
        assert any(chain in data["response"].lower() for chain in ["trc20", "erc20", "bsc", "solana", "arb", "chain"])
        print("✓ AI chat supported chains test passed")


class TestCoCreatorWaitlist:
    """Co-Creator waitlist endpoint tests"""
    
    @pytest.fixture
    def unique_wallet(self):
        """Generate unique wallet address for testing"""
        return f"0xTEST_{uuid.uuid4().hex[:16]}"
    
    def test_waitlist_status_not_joined(self):
        """Check waitlist status for non-joined wallet"""
        test_wallet = f"0xNOT_JOINED_{uuid.uuid4().hex[:12]}"
        response = requests.get(f"{BASE_URL}/api/waitlist/status/{test_wallet}")
        
        assert response.status_code == 200
        data = response.json()
        assert "joined" in data
        assert data["joined"] == False
        assert "total_count" in data
        assert isinstance(data["total_count"], int)
        print(f"✓ Waitlist status not-joined test passed (total: {data['total_count']})")
    
    def test_waitlist_join_success(self, unique_wallet):
        """Successfully join the waitlist"""
        response = requests.post(f"{BASE_URL}/api/waitlist/join", json={
            "wallet_address": unique_wallet
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "position" in data
        assert isinstance(data["position"], int)
        assert data["position"] > 0
        print(f"✓ Waitlist join success test passed (position: {data['position']})")
    
    def test_waitlist_join_duplicate_prevention(self, unique_wallet):
        """Duplicate join returns already_joined flag"""
        # First join
        requests.post(f"{BASE_URL}/api/waitlist/join", json={
            "wallet_address": unique_wallet
        })
        
        # Second join should indicate already joined
        response = requests.post(f"{BASE_URL}/api/waitlist/join", json={
            "wallet_address": unique_wallet
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert data.get("already_joined") == True
        print("✓ Waitlist duplicate prevention test passed")
    
    def test_waitlist_status_after_join(self, unique_wallet):
        """Verify status shows joined after joining"""
        # Join first
        requests.post(f"{BASE_URL}/api/waitlist/join", json={
            "wallet_address": unique_wallet
        })
        
        # Check status
        response = requests.get(f"{BASE_URL}/api/waitlist/status/{unique_wallet}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["joined"] == True
        assert "total_count" in data
        print("✓ Waitlist status after join test passed")
    
    def test_waitlist_join_missing_wallet(self):
        """Join without wallet address returns error"""
        response = requests.post(f"{BASE_URL}/api/waitlist/join", json={})
        
        assert response.status_code == 400
        print("✓ Waitlist missing wallet error test passed")


class TestExistingFeatures:
    """Test that existing features still work"""
    
    def test_prices_endpoint(self):
        """Crypto prices endpoint works"""
        response = requests.get(f"{BASE_URL}/api/prices")
        assert response.status_code == 200
        data = response.json()
        assert "prices" in data
        assert "BTC" in data["prices"] or "USDT" in data["prices"]
        print("✓ Prices endpoint test passed")
    
    def test_global_vision_opportunities(self):
        """Global Vision returns 45 cases"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        assert response.status_code == 200
        data = response.json()
        assert "opportunities" in data
        assert len(data["opportunities"]) >= 45
        print(f"✓ Global Vision test passed ({len(data['opportunities'])} cases)")
    
    def test_payment_addresses(self):
        """Payment addresses endpoint works"""
        response = requests.get(f"{BASE_URL}/api/payment/addresses")
        assert response.status_code == 200
        data = response.json()
        assert "addresses" in data
        print("✓ Payment addresses test passed")
    
    def test_vip_trading_commands(self):
        """VIP trading commands endpoint works"""
        response = requests.get(f"{BASE_URL}/api/vip/trading-commands")
        assert response.status_code == 200
        data = response.json()
        assert "commands" in data or "final_balance" in data
        print("✓ VIP trading commands test passed")
    
    def test_demo_bot_stats(self):
        """Demo bot stats endpoint works"""
        response = requests.get(f"{BASE_URL}/api/demo/bot-stats")
        assert response.status_code == 200
        data = response.json()
        assert "stats" in data
        print("✓ Demo bot stats test passed")
    
    def test_gamification_bot_avatars(self):
        """Bot avatars endpoint works"""
        response = requests.get(f"{BASE_URL}/api/gamification/bot-avatars")
        assert response.status_code == 200
        data = response.json()
        assert "avatars" in data
        print("✓ Gamification bot avatars test passed")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
