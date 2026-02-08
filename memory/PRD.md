# AIFund.com - Product Requirements Document

## Overview
AIFund.com - AI赚钱给大家分 - Bot-as-a-Service crypto/stock AI trading platform

**Pricing:**
- 1U: Basic (simulated trading)
- 9.9U: Global Vision unlock (full historical opportunities + time-travel + stories)
- 99U: VIP (real trading via API, 10% profit share)

## Core Features (ALL IMPLEMENTED)

### 1. Demo Mode
- One-click "免费体验演示" button on landing page
- Auto-creates account with 100U + "体验Bot"
- Welcome Guide Modal
- Persistent Demo Banner

### 2. Global Vision (9.9U)
**Landing Page Module:**
- Eye-catching intro card with 3 examples (BTC 4583x, PEPE 1800x, NVDA 3.2x)
- "仅需 9.9U 解锁" CTA button

**Historical Opportunities (26+):**
- 10年前: BTC, ETH, AAPL, AMD (85x), 茅台, 黄金
- 5年前: TSLA (20x), DOGE (175x), GME (24x), UNI (42x), QQQ期权 (50x)
- 3年前: SOL (18x), META (6.5x), PEPE (1800x), ORDI (1500x)
- 1年前: NVDA (3.2x), BTC ETF
- 昨天: Daily BTC, Meme coins
- Markets: Crypto, US/HK/A-Shares, Futures, Options, Polymarket, Forex

**After 9.9U Unlock:**
- ALL opportunity cards fully unlocked (not just first 3)
- Each card has "故事详情" button → opens OpportunityDetail with rich story timeline
- Each card has "时光旅行" button → opens TimeTravelAnimation with historical price chart
- Story detail includes multiple chapters, timeline visualization, and AI insights

**Time Travel Animation:**
- UFO flying across price chart with real historical price data
- Supports: BTC, ETH, PEPE, SOL, NVDA, TSLA, DOGE, META, AMD, AAPL, GOLD, GME, ORDI
- Speed controls (1x, 2x, 4x), play/pause, skip to end
- Shows current date, price, investment value, and milestone events

### 3. Backtest Simulator
- Period selection: 1周/1月/3月/6月/1年/3年
- Market filter: 全部/加密货币/美股/期货
- Progress animation, results dashboard, equity curve, trade history

### 4. VIP Trading Commands
- Real-time command timeline (BUY/SELL)
- AI reasoning, execution results, cumulative profit tracking
- 10% platform fee, 8 supported markets

### 5. Bot Dashboard
- Demo stats, 30-day profit chart, AI Market Analysis
- Trade history with AI reasoning, Bot skills panel

### 6. Bot Chat Interface
- Typing indicator, market analysis cards, trade messages

### 7. Social Share
- Achievement cards for bot adoption, VIP, profits
- Twitter/Telegram sharing

### 8. Landing Page
- Dual CTAs: "连接钱包开始" + "免费体验演示"
- Platform stats: 12,847 bots, $2.4M profits, 67.8% win rate
- **Marketing Copy:** "让Bot能让你拥有全球视野，绝不错过未来暴富机会。" + "这一次你是从100USD到100万USD暴富神话的主角。"
- **5-step How It Works:** 连接钱包 → 充值激活 → 领养Bot → 手工执行Bot策略赚钱 → 成为VIP接入API自动赚钱
- Global Vision intro module (9.9U)
- Pricing cards (基础版 1U / VIP版 99U)

### 9. VIP API Settings (NEW)
- Dedicated page for VIP users to connect trading exchange APIs
- 8 supported markets: 加密货币, 美股, 港股, A股, 期货, 期权, 外汇, 预测市场
- Each market shows supported exchanges, min capital, description
- API key + secret input with security notices
- Visual indicator for connected/not-connected exchanges

### 10. Bot Showcase - Monopoly-style Level Progression (NEW)
- 10 levels from "新手学徒" to "传奇大师" with unique icons and colors
- Level progression based on total profit ($0 → $100K+)
- Each level unlocks a new trading capability (reward)
- Progress bar showing distance to next level
- 3 tabs: 升级之路 (levels), 成就徽章 (9 achievements), 排行榜 (leaderboard)
- Share button to show off bot level
- Leaderboard with mock top traders + user's position

## File Structure
```
/app
├── backend/
│   ├── server.py           # FastAPI backend, all API routes
│   ├── global_vision.py    # 26+ historical opportunities
│   ├── historical_prices.py # Price data for 13+ assets
│   ├── vip_commands.py
│   ├── demo_data.py
│   ├── gamification.py
│   ├── market_data.py
│   └── notifications.py
├── frontend/src/components/
│   ├── LandingPage.js       # Homepage with 5 steps + marketing copy
│   ├── Dashboard.js         # Main dashboard with 6 quick actions
│   ├── BotDashboard.js      # Bot stats + chart + trades
│   ├── BotChatInterface.js  # Bot chat
│   ├── GlobalVisionPage.js  # Full unlock after 9.9U
│   ├── OpportunityDetail.js # (NEW) Story detail page for each opportunity
│   ├── TimeTravelAnimation.js # Animation with 13+ asset support
│   ├── VIPUpgradePage.js
│   ├── VIPTradingCommands.js
│   ├── VIPApiSettings.js    # (NEW) Exchange API key management
│   ├── BotShowcase.js       # (NEW) Monopoly-style level progression
│   ├── BacktestSimulator.js
│   ├── ShareAchievementModal.js
│   └── ...
```

## Key API Endpoints
- `/api/wallet/connect` - Connect wallet
- `/api/deposit` - Record deposit
- `/api/bot/create` - Create bot
- `/api/bot/{wallet}` - Get bot data
- `/api/demo/bot-stats` - Demo stats
- `/api/demo/profit-chart` - Profit chart
- `/api/global-vision/opportunities` - All opportunities
- `/api/global-vision/unlock` - Unlock for 9.9U
- `/api/historical/price-curve/{asset_id}` - Price data for animation
- `/api/vip/trading-commands` - VIP trading commands
- `/api/vip/supported-markets` - 8 markets list
- `/api/vip/api-settings/{wallet}` - GET/POST API settings

## Mocked/Pending
1. Payment verification - auto-confirmed
2. Live trading API bridge - not implemented
3. Bot evolution - pre-canned logic
4. Real price feeds - demo data

## Last Updated
2026-12-13
