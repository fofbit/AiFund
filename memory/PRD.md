# AIFund.com - Product Requirements Document

## Original Problem Statement
Build a world-class, low-maintenance website on the domain `AIfund.com`. The vision is a "Bot-as-a-Service" crypto AI trading platform with gamification elements:
1. **Activation (1 USD):** Users connect a crypto wallet and pay 1U to "adopt" a personalized AI trading bot with $10,000 virtual funds.
2. **"Global Vision" (9.9 USD):** Premium feature showing historical "what-if" investment scenarios across 10年/5年/3年/1年/昨天.
3. **VIP (99 USD):** Users can connect real exchange/broker APIs for live trading across crypto, stocks, futures, options, forex, prediction markets.
4. **Revenue Model:** **10% profit share** from VIP users' bot trades.

## Core Features

### 1. ✅ Demo Mode
- One-click demo experience (no wallet required)
- Auto-creates demo account with 100U + "体验Bot"
- Welcome Guide Modal
- Demo Banner with "Connect Real Wallet" CTA

### 2. ✅ Global Vision (ENHANCED)
**Timeframes:**
- 昨天 (日内机会)
- 1年内 (NVDA AI狂潮, BTC ETF获批)
- 3年前 (SOL抄底, META低谷, 俄乌战争原油)
- 5年前 (TSLA疫情暴涨, DOGE崛起, GME轧空, UNI空投, QQQ期权)
- 10年前 (BTC 4583x, ETH 450x, AMZN, AAPL, AMD 85x, 黄金)

**Markets:**
- Cryptocurrency (BTC/ETH/SOL/Meme/DeFi/BRC-20)
- US Stocks (NVDA, TSLA, AAPL, META, AMD, GME)
- HK/A-Shares (比亚迪, 茅台)
- Futures (原油, VIX)
- Options (GME期权, QQQ看涨)
- Polymarket (大选, BTC价格预测)
- Commodities (黄金)

**Features:**
- Demo Time Travel (one free for non-unlocked users)
- Canvas UFO Animation

### 3. ✅ VIP Trading Commands System (NEW)
**Features:**
- Real-time command timeline with animations
- Bot指令 (BUY/SELL) with AI reasoning
- 执行结果 (profit/loss per trade)
- Cumulative profit tracking
- 10% platform fee display
- Summary stats (initial/final capital, win rate, ROI)

**Supported Markets for API:**
- 加密货币 (Binance, OKX, Bybit, Coinbase, Kraken)
- 美股 (盈透证券, 富途, 老虎, 嘉信理财)
- 港股 (富途, 老虎, 盈立)
- A股 (东方财富, 同花顺, 雪球)
- 期货 (CME, 盈透)
- 期权 (盈透, TD Ameritrade, Robinhood)
- 外汇 (OANDA, IG, 盈透)
- 预测市场 (Polymarket, Kalshi)

### 4. ✅ Enhanced Bot Chat Interface
- Real-time typing indicator
- Market Analysis Cards
- Trade Messages with AI reasoning
- Refresh button for latest analysis

### 5. ✅ VIP Upgrade System
- 99U upgrade fee
- 10% profit sharing
- "查看Bot交易指令演示" button
- 4-step workflow

### 6. ✅ Social Share Module
- Achievement cards (bot adoption, VIP, profits, level-up)
- Twitter/Telegram sharing

### 7. ✅ Demo Data System
- `demo_data.py` - trade history, stats, market analysis
- `vip_commands.py` - VIP trading commands generator

## API Endpoints
**VIP APIs (NEW):**
- `GET /api/vip/trading-commands` - Trading commands timeline
- `GET /api/vip/live-command` - Single live command
- `GET /api/vip/supported-markets` - List of supported markets

**Global Vision APIs (NEW):**
- `GET /api/global-vision/categories`
- `GET /api/global-vision/by-timeframe/{timeframe}`
- `GET /api/global-vision/by-market/{market_type}`

## File Structure
```
/app
├── backend/
│   ├── server.py
│   ├── global_vision.py (26+ opportunities, 10yr/5yr/3yr/1yr/yesterday)
│   ├── vip_commands.py (NEW - VIP trading commands generator)
│   ├── demo_data.py
│   └── gamification.py
├── frontend/src/components/
│   ├── VIPTradingCommands.js (NEW - Trading commands timeline)
│   ├── VIPUpgradePage.js (with commands preview)
│   ├── GlobalVisionPage.js (enhanced filters)
│   ├── TimeTravelAnimation.js
│   └── ...
```

## Mocked/Pending
1. Payment Verification - auto-confirmed
2. Live Trading via API Bridge - not implemented
3. Bot Evolution - pre-canned logic

## Last Updated
2026-02-08
