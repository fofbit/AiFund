# AIFund.com - Product Requirements Document

## Overview
AIFund.com - AI赚钱给大家分 - Bot-as-a-Service crypto/stock AI trading platform

**Pricing:**
- 1U: Basic (simulated trading)
- 9.9U: Global Vision unlock
- 99U: VIP (real trading via API, 10% profit share)

## Core Features (ALL IMPLEMENTED)

### 1. ✅ Demo Mode
- One-click "免费体验演示" button on landing page
- Auto-creates account with 100U + "体验Bot"
- Welcome Guide Modal
- Persistent Demo Banner

### 2. ✅ Global Vision (9.9U)
**Landing Page Module:**
- Eye-catching intro card with 3 examples (BTC 4583x, PEPE 1800x, NVDA 3.2x)
- "仅需 9.9U 解锁" CTA button
- Clickable to connect wallet

**Historical Opportunities (26+):**
- 10年前: BTC, ETH, AAPL, AMD (85x), 茅台, 黄金
- 5年前: TSLA (20x), DOGE (175x), GME (24x), UNI (42x), QQQ期权 (50x)
- 3年前: SOL (18x), META (6.5x), PEPE (1800x), ORDI (1500x)
- 1年前: NVDA (3.2x), BTC ETF
- 昨天: Daily BTC, Meme coins

**Markets:** Crypto, US/HK/A-Shares, Futures, Options, Polymarket, Forex

**Time Travel Animation:** UFO traversing price chart (demo mode: 1 free try)

**Bug Fixed:** Unlock modal now properly closes and updates access state

### 3. ✅ Backtest Simulator (NEW)
- Period selection: 1周/1月/3月/6月/1年/3年
- Market filter: 全部/加密货币/美股/期货
- Progress animation
- Results dashboard:
  - Initial/Final capital, ROI
  - Total trades, Win rate
  - Max drawdown, Sharpe ratio
- Equity curve chart
- Trade history list
- VIP upgrade CTA

### 4. ✅ VIP Trading Commands
- Real-time command timeline (BUY/SELL)
- AI reasoning for each trade
- Execution results (profit/loss)
- Cumulative profit tracking
- 10% platform fee display
- 8 supported markets with exchange list

### 5. ✅ Bot Dashboard
- Demo statistics display
- 30-day profit Area chart
- AI Market Analysis (BTC/ETH, Fear/Greed, recommendations)
- Trade history with AI reasoning
- Bot skills panel

### 6. ✅ Bot Chat Interface
- Typing indicator animation
- Market analysis cards
- Trade messages with icons
- Refresh button

### 7. ✅ Social Share
- Achievement cards for bot adoption, VIP, profits
- Twitter/Telegram sharing

### 8. ✅ Landing Page
- Dual CTAs: "连接钱包开始" + "免费体验演示"
- Platform stats: 12,847 bots, $2.4M profits, 67.8% win rate
- How it works: 4 steps
- Global Vision intro module (NEW)
- Pricing cards

## File Structure
```
/app
├── backend/
│   ├── server.py
│   ├── global_vision.py (26+ opportunities)
│   ├── vip_commands.py
│   ├── demo_data.py
│   └── gamification.py
├── frontend/src/components/
│   ├── BacktestSimulator.js (NEW)
│   ├── VIPTradingCommands.js
│   ├── GlobalVisionPage.js (bug fixed)
│   ├── TimeTravelAnimation.js
│   ├── LandingPage.js (Global Vision intro)
│   └── ...
```

## Mocked/Pending
1. Payment verification - auto-confirmed
2. Live trading API bridge - not implemented
3. Bot evolution - pre-canned logic

## Last Updated
2026-02-08
