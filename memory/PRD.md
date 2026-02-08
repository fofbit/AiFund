# AIFund.com - Product Requirements Document

## Original Problem Statement
Build a world-class, low-maintenance website on the domain `AIfund.com`. The vision is a "Bot-as-a-Service" crypto AI trading platform with gamification elements:
1. **Activation (1 USD):** Users connect a crypto wallet and pay 1U to "adopt" a personalized AI trading bot with $10,000 virtual funds.
2. **"Global Vision" (9.9 USD):** Premium feature showing historical "what-if" investment scenarios.
3. **VIP (99 USD):** Users can connect real exchange accounts via API for live trading.
4. **Revenue Model:** **10% profit share** from VIP users' bot trades.

## Core Features

### 1. ✅ Demo Mode (NEW)
- **One-click demo experience** - No wallet required
- Auto-creates demo account with:
  - 100U balance
  - Pre-configured "体验Bot"
  - $10,000 virtual trading funds
- **Welcome Guide Modal** - 3-step introduction
- **Demo Banner** - Persistent top bar with "Connect Real Wallet" CTA
- Shows "演示账户" in header

### 2. ✅ AI Trading Bot System
- Bot creation with gender selection (male/female)
- 12 avatar options (6 per gender, different rarities)
- Virtual balance ($10,000) for simulated trading
- GPT-5.2 powered trading decisions
- Bot skill progression and level-up notifications

### 3. ✅ Enhanced Bot Chat Interface (NEW)
- **Real-time typing indicator** with animated dots
- **Bot avatar** with online status badge
- **Market Analysis Cards** - BTC/ETH prices, sentiment, recommendations
- **Trade Messages** with:
  - AI reasoning (💡)
  - Action cards (buy/sell) with price/amount
  - Result indicators (profit/loss)
- **Refresh button** to get latest market analysis
- Investment review panel with suggestions

### 4. ✅ Global Vision Feature
- 18+ historical investment opportunities
- Enhanced filtering:
  - Categories: 加密货币, 传统资产, Polymarket, 昨天机会
  - Subcategories: BTC生态, ETH生态, 新公链, Meme币, DeFi
  - Timeframes: 全部, 近7天, 近1年, 1年以上
- **Demo Time Travel** - One free time travel for non-unlocked users
- **Time Travel Animation** - Canvas UFO animation traversing price charts

### 5. ✅ VIP Upgrade System
- 99U upgrade fee
- **10% profit sharing** prominently displayed
- 4-step workflow explanation
- Payment confirmation modal
- Risk warning footer

### 6. ✅ Social Share Module
- Achievement cards for: Bot adoption, VIP upgrade, Profit milestones, Level-up
- Twitter/Telegram share buttons
- Copy to clipboard

### 7. ✅ Demo Data System
- `demo_data.py` generator with:
  - Realistic trade history (buy/sell reasons)
  - Bot statistics (win rate 58-72%)
  - Market analysis (fear/greed index, hot narratives)
  - 30-day profit charts

### 8. ✅ Enhanced Landing Page
- Dual CTA buttons: "连接钱包开始" + "免费体验演示"
- Live platform stats: 12,847 bots, $2.4M profits, 67.8% win rate
- VIP pricing shows 99U with 10% profit share

### Mocked/Pending 🔶
1. **Payment Verification** - All deposits auto-confirmed
2. **Live Trading via API Bridge** - VIP feature not implemented
3. **True Bot Evolution** - Uses pre-canned trading logic

## API Endpoints
- Demo APIs:
  - `GET /api/demo/bot-stats`
  - `GET /api/demo/market-analysis`
  - `GET /api/demo/profit-chart`
  - `GET /api/demo/trades/{bot_id}`
- Core APIs:
  - `POST /api/wallet/connect`
  - `POST /api/deposit`
  - `POST /api/bot/create`
  - `GET /api/global-vision/opportunities`
  - `POST /api/global-vision/unlock`

## File Structure
```
/app
├── backend/
│   ├── server.py
│   ├── demo_data.py (NEW - Demo data generator)
│   ├── global_vision.py
│   ├── gamification.py
│   └── trading_simulator.py
├── frontend/
│   ├── src/
│   │   ├── App.js (Demo mode support)
│   │   ├── components/
│   │   │   ├── LandingPage.js (Dual CTAs)
│   │   │   ├── Dashboard.js (Demo banner, welcome guide)
│   │   │   ├── BotDashboard.js (Market analysis)
│   │   │   ├── BotChatInterface.js (Enhanced chat)
│   │   │   ├── GlobalVisionPage.js (Demo time travel)
│   │   │   ├── TimeTravelAnimation.js
│   │   │   ├── VIPUpgradePage.js
│   │   │   └── ShareAchievementModal.js
└── memory/PRD.md
```

## Last Updated
2026-02-08
