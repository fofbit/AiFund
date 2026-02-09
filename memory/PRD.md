# AIFund.com - Product Requirements Document v6 (Final Pre-Deployment)

## Overview
**AIFund.com** — Let AI Earn For You
**Subtitle:** Equal access to global wealth is everyone's right
**Values:** AI equalizes knowledge. Bot equalizes labor. AI + Bot equalizes wealth for all.

## All Implemented Features (Production Ready)

### 1. Multi-Language (EN/CN throughout)
- Landing page + Dashboard both have EN/中文 switcher
- Language persisted via localStorage
- Default: English

### 2. Landing Page
- Title: "Let AI Earn For You"
- 5-step flow, wallet guide (6 wallets + Chrome links), video guide (60s)
- Whitepaper viewer link, Global Vision promo, pricing cards
- Mobile responsive

### 3. Global Vision (9.9U) — KEY MODULE
- "Time Travel Back To:" 1yr/2yr/3yr/5yr/10yr/15yr
- 30+ cases sorted by ROI, including:
  - 15yr: BTC Pizza Day ($0.003→$100K = 200,000x), Apple 2010 (28x), Amazon (15x), TSMC (20x)
  - 10yr: BTC 2015 (4583x), ETH (450x), AMD (85x)
  - 5yr: TSLA (20x), DOGE (175x), GME (24x)
  - 3yr: SOL (18x), PEPE (1800x), ORDI (1500x)
  - 2yr: NVDA AI (9.5x), SOL Meme Season (50x)
  - 1yr: NVDA 3.2x, BTC ETF
- Each case: story detail page + time-travel animation

### 4. VIP Level System (100 levels)
- 100U→10,000U, 50/50 rule, 6 tiers, skins, 12 DEX platforms

### 5. Whitepaper v1.0.0 (bilingual)
- In-app viewer with EN/CN toggle + PDF download

### 6. Referral System
- +1 level for both, Twitter/Telegram share

### 7. Dashboard (i18n)
- All labels bilingual, 8 quick action buttons
- Header: lang switcher, whitepaper, notifications

### 8. Other Features
- Bot Chat, Bot Showcase (10 levels/skins), VIP API Settings (8 markets + exchange links)
- Backtest, Demo Mode, Social Share, Notifications

### Planned (Post-Launch)
- NFT Account Rights (transferable Bot ownership)
- 10K user co-creation waitlist
- Real payment processing
- Live trading API bridge

## Tech Stack
- Frontend: React, Tailwind CSS, Recharts
- Backend: FastAPI, MongoDB, ReportLab (PDF)
- All data: MOCKED (demo)

## Last Updated: 2026-12-13 v6 (Final)
