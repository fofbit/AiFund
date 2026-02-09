# AIFund.com - Product Requirements Document v7

## Overview
**AiFund.com** — Let AI Earn For You
Equal access to global wealth is everyone's right.

## Production-Ready Features

### Payment System (REAL)
- 5 chain support: TRC20, ERC20, BSC, Arbitrum, Solana
- Real receiving addresses integrated
- On-chain auto-verification (TRC20/ERC20/BSC/ARB via blockchain APIs)
- Manual TX hash fallback for all chains
- 3-step flow: Select Chain → Show Address & Copy → Verify
- Integrated into: Global Vision unlock (9.9U), VIP upgrade (99U), Deposits

### Multi-Language (EN/CN)
- Landing page + Dashboard both have EN/中文 switcher
- Persisted via localStorage

### Global Vision (9.9U) — Core Module
- 30+ cases spanning 15 years, sorted by ROI
- Time Travel Back To: 1yr/2yr/3yr/5yr/10yr/15yr
- Detail stories + time-travel animations for each case

### VIP System
- 100 levels (100U→10,000U), 50/50 profit rule
- API Settings with exchange registration links
- 12 DEX/Meme platforms

### Other Features
- Bot Chat, Bot Showcase (10 levels/skins), Referral System
- Whitepaper viewer (bilingual + PDF), Quick Start Guide (60s)
- Wallet Guide (6 wallets + Chrome links)
- Backtest, Demo Mode, Social Share

### Logo
- 2 variants generated (tech + finance style)

## Tech Stack
React + FastAPI + MongoDB + ReportLab
Payment verification: httpx + blockchain APIs

## Mocked: Trading data, bot stats, prices
## Real: Payment addresses, wallet connections

## Last Updated: 2026-12-13 v7
