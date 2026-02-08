# AIFund.com - Product Requirements Document

## Overview
AIFund.com - AI赚钱给大家分 - Bot-as-a-Service crypto/stock AI trading platform
**Mission:** 让全世界弱势群体能平等享受AI红利的入门级平台，让投资暴富神话在每个人身上都有机会发生。

**Pricing:**
- 1U: Basic (simulated trading)
- 9.9U: Global Vision (full historical opportunities + time-travel + stories)
- 99U: VIP (real trading via API, 10% profit share)

## Core Features (ALL IMPLEMENTED)

### 1. Multi-Language Landing Page
- Language switcher (中文/EN) in top-right corner
- All text translated: slogan, features, steps, pricing, marketing copy
- Plain language — no technical jargon (GPT-5.2 removed throughout)
- Feature cards: "让AI帮你赚钱" / "Bot是你的千里眼" / "无门槛 无国界"
- Marketing copy: "让每个普通人都能平等享受AI时代的财富红利"
- 5-step flow:
  1. 连接钱包 (3分钟创建)
  2. 充值激活 (最低1美元)
  3. 领养Bot (给它取个名字)
  4. **跟随Bot** (Bot只提供投资情报，不操作用户资金和交易账户)
  5. **Bot帮主人赚钱** (通过API接入，让Bot接管账户，24/7自动赚钱)
- Mobile responsive (tested at 390px width)

### 2. Wallet Guide Modal
- When clicking "连接钱包" without wallet extension, shows guide modal
- Lists 5 wallets with official links: MetaMask, OKX Wallet, Trust Wallet, Coinbase Wallet, Unisat
- Each entry shows wallet name, description, type (浏览器插件/手机App), and external link
- "不想装钱包？" tip pointing to free demo mode

### 3. Demo Mode
- "免费体验演示" button — one-click full experience
- Auto-creates account with 100U + "体验Bot"
- Welcome Guide Modal, Persistent Demo Banner

### 4. Global Vision (9.9U)
- After unlock: ALL 26+ opportunity cards fully accessible
- Each card has "故事详情" → OpportunityDetail with rich timeline story
- Each card has "时光旅行" → TimeTravelAnimation with historical price data
- 13 assets with price data: BTC, ETH, PEPE, SOL, NVDA, TSLA, DOGE, META, AMD, AAPL, GOLD, GME, ORDI

### 5. Bot Chat Interface (Simplified)
- Shows daily buy/sell commands only — no technical analysis
- Each command has "了解 XXX 详情" external link (CoinGecko/Yahoo Finance)
- Today's summary with total commands and expected profit
- Disclaimer: "Bot不操作您的资金"

### 6. VIP API Settings (with Exchange Links)
- 8 supported markets: 加密货币, 美股, 港股, A股, 期货, 期权, 外汇, 预测市场
- Each market shows exchange registration links ("开户注册") and app download links ("下载APP")
- Crypto: Binance, OKX, Bybit, Coinbase
- US Stock: IBKR, 富途, 老虎
- HK/A Stock, Futures, Options, Forex, Prediction Market all covered
- API key/secret input with security notices

### 7. Bot Showcase (Monopoly-style)
- 10 levels: 新手学徒 → 传奇大师
- Achievement badges (9 types)
- Leaderboard with mock data
- Share button for social bragging

### 8. Backtest Simulator
- Period selection, market filter, progress animation, results dashboard

### 9. VIP Trading Commands
- Real-time command timeline, 10% platform fee, 8 markets

### 10. Social Share
- Achievement cards for bot adoption, VIP, profits

## File Structure
```
/app
├── backend/
│   ├── server.py, global_vision.py, historical_prices.py
│   ├── vip_commands.py, demo_data.py, gamification.py
│   ├── market_data.py, notifications.py, trading_simulator.py
├── frontend/src/components/
│   ├── LandingPage.js (multilingual, wallet guide, responsive)
│   ├── Dashboard.js (6 quick actions)
│   ├── BotChatInterface.js (simplified daily commands)
│   ├── GlobalVisionPage.js, OpportunityDetail.js
│   ├── TimeTravelAnimation.js (13 assets)
│   ├── VIPApiSettings.js (exchange links)
│   ├── BotShowcase.js (Monopoly-style)
│   ├── BacktestSimulator.js, VIPTradingCommands.js
│   ├── BotDashboard.js, CreateBotModal.js
│   └── ShareAchievementModal.js, NotificationPanel.js
```

## Mocked/Pending
1. Payment verification - auto-confirmed
2. Live trading API bridge - not implemented
3. Bot evolution - pre-canned logic
4. Real price feeds - demo data

## Last Updated
2026-12-13
