# AIFund.com - Product Requirements Document

## Original Problem Statement
Build a world-class, low-maintenance website on the domain `AIfund.com`. The initial vision was a global, anonymous, crypto-based AI investment fund for the masses, with the motto "AI makes money for everyone".

This evolved into a "Bot-as-a-Service" model with gamification elements:
1. **Activation (1 USD equivalent):** Users connect a crypto wallet and pay a 1U fee to "adopt" a personalized AI trading bot. This bot starts with simulated funds ($10,000 virtual).
2. **"Global Vision" Feature (9.9 USD):** A premium feature that shows users historical "what-if" scenarios, demonstrating how 100U could have grown with perfect hindsight.
3. **VIP Subscription (99 USD):** Users can upgrade to VIP, allowing them to connect their real-world exchange accounts (e.g., Binance) via API. The bot then executes its trading strategy with the user's real funds.
4. **Revenue Model:** The primary income is a **10% profit share** from the trades the bot makes for VIP users.

## User Personas
- **Crypto Beginners:** Want to benefit from crypto trading without expertise
- **Passive Investors:** Looking for automated trading solutions
- **Gamification Seekers:** Enjoy leveling up bots and collecting virtual assets

## Tech Stack
- **Frontend:** React, Tailwind CSS, shadcn/ui, Recharts
- **Backend:** FastAPI (Python), async Motor driver
- **Database:** MongoDB
- **AI Integration:** GPT-5.2 via Emergent LLM Key
- **Architecture:** Containerized monorepo (frontend + backend)

## Core Features

### Implemented ✅

#### 1. User Authentication (Wallet-based)
- MetaMask wallet connection
- Automatic tier assignment (inactive/basic/vip based on balance)

#### 2. AI Trading Bot System
- Bot creation with gender selection (male/female)
- Multiple avatar options (6 per gender, different rarities)
- Virtual balance ($10,000) for simulated trading
- GPT-5.2 powered trading decisions
- Bot skill progression and notifications

#### 3. Global Vision Feature
- 18+ historical investment opportunities
- Categories: Cryptocurrency (BTC/ETH/Meme/DeFi), Stocks, Futures, Options, Polymarket
- Subcategory filters (BTC生态, ETH生态, 新公链, etc.)
- Timeframe filters (daily, monthly, yearly)
- **🆕 Time Travel Animation** - UFO traversing price chart with user avatar
- **🆕 Demo Mode** - One free time travel for non-unlocked users
- Unlock for 9.9U

#### 4. VIP Upgrade System
- 99U upgrade fee
- **10% profit sharing** model clearly displayed
- 4-step workflow explanation (Upgrade → Connect Exchange → Bot Trades → Share Profit)
- Benefits list with risk warning

#### 5. Social Share Module
- Achievement card generation for:
  - Bot adoption
  - VIP upgrade
  - Profit milestones
  - Level up events
- Twitter/Telegram share buttons
- Copy to clipboard

#### 6. Gamification System
- 10 VIP tiers (新手投资者 → 宇宙之主)
- Virtual asset store (real estate, vehicles, luxury goods, fashion, currency, gifts)
- Rarity system (common/rare/epic/legendary/mythic)

#### 7. Bot Chat Interface
- Trade command display
- AI analysis reasoning
- Investment review panel

#### 8. 🆕 Demo Data System
- Realistic mock trading data generator
- Demo bot statistics (win rate, profit, ROI)
- Market analysis with fear/greed index
- 30-day profit chart visualization
- Hot narratives and whale activity tracking

#### 9. 🆕 Enhanced Dashboard
- Live demo statistics on landing page (12,847 active bots, $2.4M profits, 67.8% win rate)
- AI Market Analysis panel (BTC/ETH prices, sentiment, AI recommendations)
- 30-day area chart with gradient
- Rich trade history with AI reasoning

### Mocked/Pending 🔶
1. **Payment Verification** - All deposits auto-confirmed (no blockchain verification)
2. **Live Trading via API Bridge** - VIP feature not implemented (no real exchange connection)
3. **True Bot Evolution** - Currently uses pre-canned trading logic

## API Endpoints
- `POST /api/wallet/connect` - Connect wallet
- `POST /api/deposit` - Record deposit
- `POST /api/bot/create` - Create bot
- `GET /api/bot/{wallet}` - Get bot info
- `GET /api/global-vision/opportunities` - Get historical opportunities
- `POST /api/global-vision/unlock` - Unlock Global Vision (9.9U)
- `GET /api/gamification/*` - Avatars, VIP levels, store, assets
- **🆕 Demo APIs:**
  - `GET /api/demo/bot-stats` - Demo bot statistics
  - `GET /api/demo/market-analysis` - AI market analysis
  - `GET /api/demo/profit-chart` - 30-day profit chart
  - `GET /api/demo/trades/{bot_id}` - Demo trade history

## File Structure
```
/app
├── backend/
│   ├── server.py (Main API)
│   ├── demo_data.py (🆕 Demo data generator)
│   ├── global_vision.py (18+ opportunities)
│   ├── gamification.py (VIP levels, virtual store)
│   └── trading_simulator.py (GPT-5.2 trading engine)
├── frontend/
│   ├── src/components/
│   │   ├── Dashboard.js (with demo data)
│   │   ├── BotDashboard.js (enhanced with market analysis)
│   │   ├── LandingPage.js (with live stats)
│   │   ├── GlobalVisionPage.js (with demo mode)
│   │   ├── TimeTravelAnimation.js (Canvas UFO animation)
│   │   ├── VIPUpgradePage.js (10% profit share)
│   │   ├── ShareAchievementModal.js
│   │   └── BotChatInterface.js
└── memory/PRD.md
```

## Testing Status
- Backend: 100% pass
- Frontend: 95% pass
- Test report: `/app/test_reports/iteration_1.json`

## Last Updated
2026-02-08
