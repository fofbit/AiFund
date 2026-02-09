"""
On-chain USDT Payment Verification Service
Monitors blockchain transactions to auto-confirm user payments
Supports: TRC20 (Tron), ERC20 (Ethereum), BSC, Arbitrum, Solana
"""
import httpx
import logging
from datetime import datetime, timezone
from typing import Optional, Dict

logger = logging.getLogger(__name__)

# Platform receiving addresses
RECEIVING_ADDRESSES = {
    "trc20": {
        "address": "TNGtpM41boEAdQkgEFcofLJsBrhcr5sbWv",
        "chain": "Tron",
        "label": "USDT/TRC20",
        "explorer": "https://tronscan.org/#/address/TNGtpM41boEAdQkgEFcofLJsBrhcr5sbWv",
        "usdt_contract": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
    },
    "erc20": {
        "address": "0x71376f6e90cc455a900954be5fd8a1efc729d523",
        "chain": "Ethereum",
        "label": "USDT/ERC20",
        "explorer": "https://etherscan.io/address/0x71376f6e90cc455a900954be5fd8a1efc729d523",
        "usdt_contract": "0xdac17f958d2ee523a2206206994597c13d831ec7",
    },
    "bsc": {
        "address": "0x71376f6e90cc455a900954be5fd8a1efc729d523",
        "chain": "BSC",
        "label": "USDT/BSC",
        "explorer": "https://bscscan.com/address/0x71376f6e90cc455a900954be5fd8a1efc729d523",
        "usdt_contract": "0x55d398326f99059ff775485246999027b3197955",
    },
    "arb": {
        "address": "0x71376f6e90cc455a900954be5fd8a1efc729d523",
        "chain": "Arbitrum",
        "label": "USDT/ARB",
        "explorer": "https://arbiscan.io/address/0x71376f6e90cc455a900954be5fd8a1efc729d523",
        "usdt_contract": "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
    },
    "sol": {
        "address": "EjjW87k2JFnivfTvDxGTUhAksgj2VUYL8KhfF6mJoZSD",
        "chain": "Solana",
        "label": "USDT/SOL",
        "explorer": "https://solscan.io/account/EjjW87k2JFnivfTvDxGTUhAksgj2VUYL8KhfF6mJoZSD",
    },
}

class PaymentVerifier:
    """Verify on-chain USDT payments across multiple chains"""

    @staticmethod
    def get_receiving_addresses() -> Dict:
        """Return all receiving addresses for frontend display"""
        result = {}
        for chain_id, info in RECEIVING_ADDRESSES.items():
            result[chain_id] = {
                "address": info["address"],
                "chain": info["chain"],
                "label": info["label"],
                "explorer": info["explorer"],
            }
        return result

    @staticmethod
    async def verify_trc20_payment(from_address: str, min_amount: float, since_minutes: int = 30) -> Optional[Dict]:
        """Check TRC20 USDT transfers to our address on Tron"""
        try:
            addr = RECEIVING_ADDRESSES["trc20"]["address"]
            url = f"https://apilist.tronscanapi.com/api/filter/trc20/transfers?limit=20&toAddress={addr}&contract_address={RECEIVING_ADDRESSES['trc20']['usdt_contract']}"
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.get(url)
                if resp.status_code == 200:
                    data = resp.json()
                    for tx in data.get("token_transfers", []):
                        tx_from = tx.get("from_address", "").lower()
                        amount = float(tx.get("quant", 0)) / 1e6  # USDT has 6 decimals
                        if tx_from == from_address.lower() and amount >= min_amount:
                            return {
                                "verified": True,
                                "chain": "trc20",
                                "tx_hash": tx.get("transaction_id"),
                                "amount": amount,
                                "from": tx_from,
                                "timestamp": tx.get("block_ts"),
                            }
        except Exception as e:
            logger.error(f"TRC20 verification error: {e}")
        return None

    @staticmethod
    async def verify_evm_payment(chain_id: str, from_address: str, min_amount: float) -> Optional[Dict]:
        """Check EVM chain (ETH/BSC/ARB) USDT transfers"""
        api_urls = {
            "erc20": "https://api.etherscan.io/api",
            "bsc": "https://api.bscscan.com/api",
            "arb": "https://api.arbiscan.io/api",
        }
        if chain_id not in api_urls:
            return None
        try:
            addr = RECEIVING_ADDRESSES[chain_id]["address"]
            contract = RECEIVING_ADDRESSES[chain_id]["usdt_contract"]
            url = f"{api_urls[chain_id]}?module=account&action=tokentx&contractaddress={contract}&address={addr}&sort=desc&page=1&offset=20"
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.get(url)
                if resp.status_code == 200:
                    data = resp.json()
                    for tx in data.get("result", []):
                        tx_from = tx.get("from", "").lower()
                        decimals = int(tx.get("tokenDecimal", 6))
                        amount = float(tx.get("value", 0)) / (10 ** decimals)
                        if tx_from == from_address.lower() and amount >= min_amount:
                            return {
                                "verified": True,
                                "chain": chain_id,
                                "tx_hash": tx.get("hash"),
                                "amount": amount,
                                "from": tx_from,
                                "timestamp": int(tx.get("timeStamp", 0)),
                            }
        except Exception as e:
            logger.error(f"EVM {chain_id} verification error: {e}")
        return None

    @staticmethod
    async def verify_payment(from_address: str, min_amount: float, preferred_chain: str = None) -> Optional[Dict]:
        """Try to verify payment across all supported chains"""
        chains_to_check = [preferred_chain] if preferred_chain else ["trc20", "erc20", "bsc", "arb"]
        
        for chain in chains_to_check:
            if chain == "trc20":
                result = await PaymentVerifier.verify_trc20_payment(from_address, min_amount)
            elif chain in ("erc20", "bsc", "arb"):
                result = await PaymentVerifier.verify_evm_payment(chain, from_address, min_amount)
            else:
                continue
            
            if result:
                return result
        
        return None

payment_verifier = PaymentVerifier()
