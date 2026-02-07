"""
Market Data Service - Real-time cryptocurrency prices
Integrates with CoinGecko API for live market data
"""
import aiohttp
import asyncio
import logging
from typing import Dict, Optional
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class MarketDataService:
    def __init__(self):
        self.base_url = "https://api.coingecko.com/api/v3"
        self.cache = {}
        self.cache_duration = timedelta(seconds=30)  # Cache for 30 seconds
        self.last_update = None
        
        # CoinGecko ID mapping
        self.coin_ids = {
            'BTC': 'bitcoin',
            'ETH': 'ethereum',
            'USDT': 'tether',
            'USDC': 'usd-coin',
            'BNB': 'binancecoin',
            'SOL': 'solana',
            'XRP': 'ripple',
            'ADA': 'cardano',
            'DOGE': 'dogecoin',
            'DOT': 'polkadot',
            'FB': 'bitcoin'  # Fractal Bitcoin - using BTC as proxy for now
        }
        
        logger.info("Market Data Service initialized")
    
    async def fetch_prices(self) -> Dict[str, float]:
        """Fetch current prices from CoinGecko"""
        try:
            # Check cache
            if self.cache and self.last_update:
                time_elapsed = datetime.now() - self.last_update
                if time_elapsed < self.cache_duration:
                    logger.debug("Using cached market data")
                    return self.cache
            
            # Fetch new data
            coin_ids = ','.join(self.coin_ids.values())
            url = f"{self.base_url}/simple/price"
            params = {
                'ids': coin_ids,
                'vs_currencies': 'usd',
                'include_24hr_change': 'true'
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params, timeout=10) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        # Convert to our format
                        prices = {}
                        for symbol, coin_id in self.coin_ids.items():
                            if coin_id in data:
                                prices[symbol] = data[coin_id].get('usd', 0)
                            else:
                                prices[symbol] = 0
                        
                        # Special handling for FB (Fractal Bitcoin)
                        if 'BTC' in prices:
                            prices['FB'] = prices['BTC'] * 0.05  # Estimate
                        
                        # Update cache
                        self.cache = prices
                        self.last_update = datetime.now()
                        
                        logger.info(f"Market data updated: {len(prices)} coins")
                        return prices
                    else:
                        logger.error(f"CoinGecko API error: {response.status}")
                        return self._get_fallback_prices()
                        
        except asyncio.TimeoutError:
            logger.error("Timeout fetching market data")
            return self._get_fallback_prices()
        except Exception as e:
            logger.error(f"Error fetching market data: {e}")
            return self._get_fallback_prices()
    
    def _get_fallback_prices(self) -> Dict[str, float]:
        """Return cached prices or default prices if API fails"""
        if self.cache:
            logger.info("Using cached prices due to API failure")
            return self.cache
        
        logger.warning("Using default fallback prices")
        return {
            'BTC': 95000.0,
            'ETH': 3500.0,
            'USDT': 1.0,
            'USDC': 1.0,
            'BNB': 650.0,
            'SOL': 180.0,
            'XRP': 2.5,
            'ADA': 1.2,
            'DOGE': 0.35,
            'DOT': 25.0,
            'FB': 4750.0
        }
    
    async def get_market_analysis(self) -> Dict:
        """Get comprehensive market analysis"""
        prices = await self.fetch_prices()
        
        # Simple trend analysis (in production, use historical data)
        analysis = {
            'prices': prices,
            'trends': {},
            'volatility': {},
            'timestamp': datetime.now().isoformat()
        }
        
        # Mock trends for now
        for symbol in prices.keys():
            if symbol in ['BTC', 'ETH', 'SOL']:
                analysis['trends'][symbol] = 'bullish'
                analysis['volatility'][symbol] = 'medium'
            elif symbol in ['USDT', 'USDC']:
                analysis['trends'][symbol] = 'stable'
                analysis['volatility'][symbol] = 'low'
            else:
                analysis['trends'][symbol] = 'neutral'
                analysis['volatility'][symbol] = 'medium'
        
        return analysis

# Global instance
market_service = MarketDataService()
