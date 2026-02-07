"""AI Trading Engine powered by GPT-5.2"""
import os
from typing import Dict, List, Optional
import asyncio
from emergentintegrations.llm.chat import LlmChat, UserMessage
import json
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class AITradingEngine:
    def __init__(self):
        self.api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not self.api_key:
            raise ValueError("EMERGENT_LLM_KEY not found in environment")
        
        logger.info("AI Trading Engine initialized with GPT-5.2")
    
    async def analyze_market(self, market_data: Dict, bot_context: Dict) -> Dict:
        """
        Analyze market and make trading decision
        
        Args:
            market_data: Current prices and market info
            bot_context: Bot's current state, abilities, balance
        
        Returns:
            Trading decision with action, symbol, amount, and reasoning
        """
        
        # Create a unique session ID for this analysis
        session_id = f"bot_{bot_context['bot_id']}_{datetime.now().timestamp()}"
        
        # Initialize chat with system message
        system_message = """You are an expert AI trading bot advisor for cryptocurrency trading.
Your goal is to maximize profits while managing risk.

You must respond ONLY with valid JSON in this exact format:
{
    "action": "buy" or "sell" or "hold",
    "symbol": "BTC" or "ETH" or "SOL" etc,
    "amount_usd": <number>,
    "confidence": <0-100>,
    "reason": "<brief explanation>"
}

Rules:
- Only trade with available virtual balance
- Consider market trends and risk
- Be conservative with position sizes (max 20% of balance per trade)
- Provide clear reasoning for decisions"""
        
        chat = LlmChat(
            api_key=self.api_key,
            session_id=session_id,
            system_message=system_message
        ).with_model("openai", "gpt-5.2")
        
        # Prepare market context
        user_prompt = f"""Current Market Data:
{json.dumps(market_data, indent=2)}

Bot Context:
- Virtual Balance: ${bot_context['virtual_balance']:.2f}
- Current Level: {bot_context['level']}
- Abilities: {', '.join(bot_context['abilities'])}
- Win Rate: {bot_context.get('win_rate', 0):.1f}%
- Total Trades: {bot_context.get('total_trades', 0)}

Analyze the market and provide your trading decision in JSON format."""
        
        try:
            # Send message and get response
            user_message = UserMessage(text=user_prompt)
            response = await chat.send_message(user_message)
            
            # Parse JSON response
            # Remove markdown code blocks if present
            response_text = response.strip()
            if response_text.startswith('```'):
                lines = response_text.split('\n')
                response_text = '\n'.join(lines[1:-1])
            
            decision = json.loads(response_text)
            
            # Validate decision
            required_fields = ['action', 'symbol', 'amount_usd', 'confidence', 'reason']
            if not all(field in decision for field in required_fields):
                raise ValueError(f"Missing required fields in AI response")
            
            logger.info(f"AI Decision: {decision['action']} {decision['symbol']} - {decision['reason']}")
            
            return decision
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI response as JSON: {e}")
            # Return safe default
            return {
                "action": "hold",
                "symbol": "BTC",
                "amount_usd": 0,
                "confidence": 0,
                "reason": "Failed to analyze market, holding position"
            }
        except Exception as e:
            logger.error(f"AI analysis error: {e}")
            return {
                "action": "hold",
                "symbol": "BTC",
                "amount_usd": 0,
                "confidence": 0,
                "reason": f"Error occurred: {str(e)}"
            }
    
    async def discover_new_ability(self, bot_context: Dict) -> Optional[str]:
        """
        AI discovers new trading abilities for the bot
        
        Returns:
            New ability name or None
        """
        
        session_id = f"ability_discovery_{datetime.now().timestamp()}"
        
        system_message = """You are an AI that discovers new trading abilities and strategies.
Based on the bot's progress and market conditions, suggest ONE new ability.

Respond ONLY with valid JSON:
{
    "ability_name": "<name>",
    "description": "<brief description>"
}

Possible abilities:
- DeFi Yield Farming
- Arbitrage Trading
- NFT Trading
- AI Token Specialist
- Meme Coin Hunter
- Trend Prediction
- Risk Management Pro
- Liquidity Mining
- Swing Trading
- Day Trading Master"""
        
        chat = LlmChat(
            api_key=self.api_key,
            session_id=session_id,
            system_message=system_message
        ).with_model("openai", "gpt-5.2")
        
        user_prompt = f"""Bot Stats:
- Level: {bot_context['level']}
- Total Trades: {bot_context.get('total_trades', 0)}
- Win Rate: {bot_context.get('win_rate', 0):.1f}%
- Current Abilities: {', '.join(bot_context['abilities'])}

Suggest a new ability that this bot is ready to learn."""
        
        try:
            user_message = UserMessage(text=user_prompt)
            response = await chat.send_message(user_message)
            
            # Parse response
            response_text = response.strip()
            if response_text.startswith('```'):
                lines = response_text.split('\n')
                response_text = '\n'.join(lines[1:-1])
            
            ability_data = json.loads(response_text)
            
            if 'ability_name' in ability_data:
                logger.info(f"New ability discovered: {ability_data['ability_name']}")
                return ability_data['ability_name']
            
            return None
            
        except Exception as e:
            logger.error(f"Ability discovery error: {e}")
            return None
