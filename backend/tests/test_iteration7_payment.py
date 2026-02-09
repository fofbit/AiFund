"""
Iteration 7 Payment System Tests
Tests the new USDT payment system with 5-chain support
Covers: payment addresses, verification, manual confirmation
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Expected wallet addresses from user's specifications
EXPECTED_ADDRESSES = {
    "trc20": "TNGtpM41boEAdQkgEFcofLJsBrhcr5sbWv",
    "erc20": "0x71376f6e90cc455a900954be5fd8a1efc729d523",
    "bsc": "0x71376f6e90cc455a900954be5fd8a1efc729d523",
    "arb": "0x71376f6e90cc455a900954be5fd8a1efc729d523",
    "sol": "EjjW87k2JFnivfTvDxGTUhAksgj2VUYL8KhfF6mJoZSD",
}


class TestPaymentAddresses:
    """Test GET /api/payment/addresses endpoint"""

    def test_payment_addresses_returns_5_chains(self):
        """Verify all 5 chains are returned"""
        response = requests.get(f"{BASE_URL}/api/payment/addresses")
        assert response.status_code == 200
        
        data = response.json()
        assert "addresses" in data
        addresses = data["addresses"]
        
        # Must have exactly 5 chains
        assert len(addresses) == 5
        expected_chains = ["trc20", "erc20", "bsc", "arb", "sol"]
        for chain in expected_chains:
            assert chain in addresses, f"Missing chain: {chain}"

    def test_trc20_address_correct(self):
        """TRC20 address is TNGtpM41boEAdQkgEFcofLJsBrhcr5sbWv"""
        response = requests.get(f"{BASE_URL}/api/payment/addresses")
        assert response.status_code == 200
        
        data = response.json()["addresses"]["trc20"]
        assert data["address"] == EXPECTED_ADDRESSES["trc20"]
        assert data["chain"] == "Tron"
        assert data["label"] == "USDT/TRC20"
        assert "explorer" in data

    def test_erc20_address_correct(self):
        """ERC20 address is 0x71376f6e90cc455a900954be5fd8a1efc729d523"""
        response = requests.get(f"{BASE_URL}/api/payment/addresses")
        assert response.status_code == 200
        
        data = response.json()["addresses"]["erc20"]
        assert data["address"] == EXPECTED_ADDRESSES["erc20"]
        assert data["chain"] == "Ethereum"
        assert data["label"] == "USDT/ERC20"

    def test_bsc_address_correct(self):
        """BSC uses same EVM address as ERC20"""
        response = requests.get(f"{BASE_URL}/api/payment/addresses")
        assert response.status_code == 200
        
        data = response.json()["addresses"]["bsc"]
        assert data["address"] == EXPECTED_ADDRESSES["bsc"]
        assert data["chain"] == "BSC"
        assert data["label"] == "USDT/BSC"

    def test_arb_address_correct(self):
        """Arbitrum uses same EVM address"""
        response = requests.get(f"{BASE_URL}/api/payment/addresses")
        assert response.status_code == 200
        
        data = response.json()["addresses"]["arb"]
        assert data["address"] == EXPECTED_ADDRESSES["arb"]
        assert data["chain"] == "Arbitrum"
        assert data["label"] == "USDT/ARB"

    def test_sol_address_correct(self):
        """Solana address is EjjW87k2JFnivfTvDxGTUhAksgj2VUYL8KhfF6mJoZSD"""
        response = requests.get(f"{BASE_URL}/api/payment/addresses")
        assert response.status_code == 200
        
        data = response.json()["addresses"]["sol"]
        assert data["address"] == EXPECTED_ADDRESSES["sol"]
        assert data["chain"] == "Solana"
        assert data["label"] == "USDT/SOL"


class TestPaymentVerify:
    """Test POST /api/payment/verify endpoint"""

    def test_verify_returns_verified_false_for_test_address(self):
        """Auto-verify returns verified:false for test wallets (expected)"""
        response = requests.post(f"{BASE_URL}/api/payment/verify", json={
            "wallet_address": "0xtest_wallet_address_123",
            "amount": 9.9,
            "chain": "trc20",
            "payment_type": "global_vision"
        })
        assert response.status_code == 200
        
        data = response.json()
        # Expected: verified=false because no real payment was made
        assert data["verified"] == False
        assert "message" in data

    def test_verify_invalid_request(self):
        """Verify rejects empty wallet address"""
        response = requests.post(f"{BASE_URL}/api/payment/verify", json={
            "wallet_address": "",
            "amount": 0,
            "chain": "trc20",
            "payment_type": "deposit"
        })
        # Should return 400 for invalid request
        assert response.status_code == 400

    def test_verify_all_payment_types(self):
        """Verify accepts all payment types: deposit, global_vision, vip"""
        for payment_type in ["deposit", "global_vision", "vip"]:
            response = requests.post(f"{BASE_URL}/api/payment/verify", json={
                "wallet_address": "0xtest_wallet_verify",
                "amount": 10,
                "chain": "erc20",
                "payment_type": payment_type
            })
            assert response.status_code == 200
            assert "verified" in response.json()

    def test_verify_all_chains(self):
        """Verify endpoint works with all 5 chain types"""
        for chain in ["trc20", "erc20", "bsc", "arb", "sol"]:
            response = requests.post(f"{BASE_URL}/api/payment/verify", json={
                "wallet_address": "0xtest_chain_verify",
                "amount": 50,
                "chain": chain,
                "payment_type": "deposit"
            })
            assert response.status_code == 200


class TestPaymentManualConfirm:
    """Test POST /api/payment/manual-confirm endpoint"""

    def test_manual_confirm_works(self):
        """Manual confirmation with tx hash succeeds"""
        import time
        unique_tx = f"test_tx_iter7_{int(time.time())}"
        
        response = requests.post(f"{BASE_URL}/api/payment/manual-confirm", json={
            "wallet_address": "0xtest_manual_confirm",
            "tx_hash": unique_tx,
            "amount": 99,
            "chain": "bsc",
            "payment_type": "vip"
        })
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "message" in data

    def test_manual_confirm_invalid_empty_tx(self):
        """Manual confirm rejects empty tx hash"""
        response = requests.post(f"{BASE_URL}/api/payment/manual-confirm", json={
            "wallet_address": "0xtest_empty_tx",
            "tx_hash": "",
            "amount": 50,
            "chain": "trc20",
            "payment_type": "deposit"
        })
        assert response.status_code == 400

    def test_manual_confirm_duplicate_tx_hash(self):
        """Duplicate tx hash is handled gracefully"""
        import time
        tx_hash = f"dupe_test_{int(time.time())}"
        
        # First submission
        resp1 = requests.post(f"{BASE_URL}/api/payment/manual-confirm", json={
            "wallet_address": "0xtest_dupe",
            "tx_hash": tx_hash,
            "amount": 10,
            "chain": "arb",
            "payment_type": "deposit"
        })
        assert resp1.status_code == 200
        
        # Second submission (duplicate)
        resp2 = requests.post(f"{BASE_URL}/api/payment/manual-confirm", json={
            "wallet_address": "0xtest_dupe",
            "tx_hash": tx_hash,
            "amount": 10,
            "chain": "arb",
            "payment_type": "deposit"
        })
        assert resp2.status_code == 200
        # Should indicate already processed
        assert resp2.json().get("already_processed") == True


class TestExistingAPIsStillWork:
    """Verify previous iteration APIs still functional"""

    def test_root_endpoint(self):
        """API root returns status"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        assert "status" in response.json()

    def test_prices_endpoint(self):
        """Prices endpoint returns crypto prices"""
        response = requests.get(f"{BASE_URL}/api/prices")
        assert response.status_code == 200
        assert "prices" in response.json()

    def test_global_vision_opportunities(self):
        """Global Vision returns 30+ opportunities"""
        response = requests.get(f"{BASE_URL}/api/global-vision/opportunities")
        assert response.status_code == 200
        
        data = response.json()
        assert "opportunities" in data
        assert len(data["opportunities"]) >= 30

    def test_demo_trades(self):
        """Demo trades endpoint works"""
        response = requests.get(f"{BASE_URL}/api/demo/trades/test_bot_123")
        assert response.status_code == 200
        assert "trades" in response.json()

    def test_demo_bot_stats(self):
        """Demo bot stats work"""
        response = requests.get(f"{BASE_URL}/api/demo/bot-stats")
        assert response.status_code == 200
        assert "stats" in response.json()

    def test_gamification_bot_avatars(self):
        """Bot avatars endpoint"""
        response = requests.get(f"{BASE_URL}/api/gamification/bot-avatars")
        assert response.status_code == 200
        assert "avatars" in response.json()

    def test_whitepaper_pdf(self):
        """Whitepaper returns valid PDF"""
        response = requests.get(f"{BASE_URL}/api/whitepaper")
        assert response.status_code == 200
        assert response.headers.get("content-type") == "application/pdf"
