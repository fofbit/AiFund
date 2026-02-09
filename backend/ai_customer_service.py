"""
AI Customer Service Chatbot for AiFund.com
Uses OpenAI GPT via Emergent integrations to answer user questions
"""
from emergentintegrations.llm.chat import LlmChat, UserMessage
import os
import logging

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are the AI Customer Service assistant for AiFund.com — a platform that lets everyone access AI-powered wealth building starting from just $1.

Key facts about AiFund.com:
- Mission: Equal access to global wealth is everyone's right
- Users connect crypto wallets (MetaMask, OKX, WizzWallet, Trust, Coinbase, Unisat)
- Pricing: Basic (≥1U), Global Vision (9.9U one-time), VIP (99U)
- Global Vision: 45+ historical wealth case studies with time-travel animations
- VIP: 100-level system, Bot manages 100U→10,000U, 50/50 profit rule (50% compound, 50% withdraw)
- Platform fee: 10% of profits only, zero when no profit
- Payment: USDT on 5 chains (TRC20, ERC20, BSC, Arbitrum, Solana)
- Bot gives daily buy/sell signals; VIP users can connect exchange API for auto-trading
- 12 DEX/Meme platforms supported (Pump.fun, Unisat, Jupiter, etc.)
- Referral: Both get +1 level boost
- Security: Funds stay in user's exchange account, Bot has trade-only API access

Rules:
- Be helpful, friendly, and concise
- Answer in the same language the user writes in (English or Chinese)
- Never give specific financial advice or guarantee returns
- Always remind users that trading involves risk
- Guide users to relevant features (Global Vision, VIP, etc.)
- If unsure, say so honestly and suggest checking the Whitepaper"""

class AIChatService:
    def __init__(self):
        self.api_key = os.environ.get('EMERGENT_LLM_KEY', '')
    
    async def get_response(self, session_id: str, user_message: str) -> str:
        try:
            chat = LlmChat(
                api_key=self.api_key,
                session_id=f"aifund_cs_{session_id}",
                system_message=SYSTEM_PROMPT
            ).with_model("openai", "gpt-4.1-mini")
            
            msg = UserMessage(text=user_message)
            response = await chat.send_message(msg)
            return response
        except Exception as e:
            logger.error(f"AI chat error: {e}")
            return "I'm having trouble connecting right now. Please try again in a moment, or check our Whitepaper for detailed information about AiFund.com."

ai_chat_service = AIChatService()
