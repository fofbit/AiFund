# crypto-wallet-lite

**Zero-dependency crypto wallet connect + USDT payment verification for web apps.**

*Not a dApp toolkit. A payment toolkit. For websites that want to accept crypto — without the complexity.*

No RainbowKit. No Web3Modal. No wagmi. No ethers.js. Just `window.ethereum` + your backend.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## How is this different?

The crypto wallet ecosystem has powerful tools — but they're built for **dApp developers** who need smart contract interaction. If you just want to **connect a wallet and accept payments**, you're forced to install 200KB+ of libraries you don't need.

**crypto-wallet-lite** is for the other 90% — normal websites, SaaS apps, content platforms, and indie developers who want to accept crypto payments with minimal complexity.

### vs. The Big Players

| | crypto-wallet-lite | Reown AppKit | RainbowKit |
|---|---|---|---|
| **npm dependencies** | **0** (only axios) | 30+ packages | 15+ packages |
| **Bundle size added** | **~5KB** | 200-500KB | ~150KB |
| **USDT payment verification** | **Built-in (5 chains)** | Not included | Not included |
| **QR code for payment** | **Built-in** | Not included | Not included |
| **No-wallet installation guide** | **Built-in (6 wallets)** | Not included | Not included |
| **Demo mode (no wallet)** | **Built-in** | Not included | Not included |
| **Gas fee tolerance (90%)** | **Built-in** | Not included | Not included |
| **On-chain auto-verify** | **Built-in (polling)** | Not included | Not included |
| **Setup time** | **3 minutes** | 30+ minutes | 20+ minutes |
| **Target user** | **Any website** | dApp developers | React dApp developers |

### Full Landscape

| Project | Stars | Chains | Size | What it does |
|---------|-------|--------|------|-------------|
| **Reown AppKit** (ex-Web3Modal) | ~5K | EVM+SOL+BTC+TON+TRON+DOT | 200-500KB | Full wallet SDK with social login, analytics, embedded wallets |
| **RainbowKit** | ~2.7K | EVM (via wagmi) | ~150KB | Beautiful React wallet connection UI |
| **Dynamic.xyz** | Closed | EVM+SOL+BTC+Cosmos | Heavy | Enterprise wallet + KYC/compliance |
| **Privy** | Closed | EVM+SOL | Heavy | Embedded wallets, social login |
| **Solana Wallet Adapter** | ~1.5K | Solana only | ~40KB | Official Solana wallet hooks |
| **Cosmos Kit** | ~300 | Cosmos ecosystem | ~80KB | IBC cross-chain, Keplr wallets |
| **crypto-wallet-lite** | New | EVM+Tron+Solana | **~5KB** | **Wallet connect + payment — that's it** |

### The Key Insight

> They build the **connection**. We build the **transaction**.
> 
> RainbowKit connects your wallet. AppKit connects your wallet with social login.
> **crypto-wallet-lite connects your wallet AND verifies your USDT payment on-chain.**
> 
> That's the gap. Every other library stops at "connected." We go all the way to "paid."

---

## Quick Start

### Frontend (React)

```bash
# Copy the components into your project
cp -r frontend/src/components/ your-app/src/
cp -r frontend/src/hooks/ your-app/src/

# Only dependency
npm install axios
```

```jsx
// App.jsx — minimal example
import { useWalletConnect } from './hooks/useWalletConnect';
import { WalletButton } from './components/WalletButton';
import { PaymentFlow } from './components/PaymentFlow';

function App() {
  const wallet = useWalletConnect({
    backendUrl: 'https://your-api.com/api',
    storageKey: 'my_app_wallet',
  });

  return (
    <div>
      <WalletButton wallet={wallet} />
      
      {wallet.connected && (
        <PaymentFlow
          walletAddress={wallet.address}
          amount={9.99}
          onSuccess={() => console.log('Paid!')}
        />
      )}
    </div>
  );
}
```

### Backend (Python FastAPI)

```bash
pip install fastapi motor httpx uvicorn
```

```python
# server.py — minimal example
from fastapi import FastAPI
from wallet_connect import create_wallet_router
from payment_verify import create_payment_router

app = FastAPI()
app.include_router(create_wallet_router(db), prefix="/api")
app.include_router(create_payment_router(db, RECEIVING_ADDRESSES), prefix="/api")
```

### Configuration

```javascript
// frontend/src/config.js — change these values, everything else works
export default {
  receivingAddresses: {
    trc20: { address: 'YOUR_TRON_ADDRESS', chain: 'Tron' },
    erc20: { address: 'YOUR_ETH_ADDRESS', chain: 'Ethereum' },
    bsc:   { address: 'YOUR_BSC_ADDRESS', chain: 'BSC' },
    arb:   { address: 'YOUR_ARB_ADDRESS', chain: 'Arbitrum' },
    sol:   { address: 'YOUR_SOL_ADDRESS', chain: 'Solana' },
  },
  backendUrl: process.env.REACT_APP_BACKEND_URL + '/api',
};
```

---

## Features

### Wallet Connect
- 🔌 **Zero-dependency** — uses native `window.ethereum` browser API
- 🦊 **6 wallets supported** — MetaMask, OKX, WizzWallet, Trust, Coinbase, Unisat
- 📱 **Wallet installation guide** — for users without wallet extensions
- 🎮 **Demo mode** — full experience without any wallet
- 💾 **Auto-reconnect** — localStorage persistence across sessions
- 🔗 **Chain auto-detect** — EVM / Tron / Solana from address format
- 🔒 **Account menu** — disconnect, switch wallet, view balance

### Payment Verification
- 💰 **5 chains** — TRC20, ERC20, BSC, Arbitrum, Solana (USDT)
- 📱 **QR code** — auto-generated for each receiving address
- 🔄 **Auto-verify** — polls blockchain every 10s with visual feedback
- ⛽ **Gas tolerance** — accepts 90% of required amount (gas fee buffer)
- 📋 **TX hash fallback** — manual confirmation for edge cases
- 🔐 **Same-wallet verify** — prompts user to pay from connected address
- 🚫 **Duplicate prevention** — same TX cannot be processed twice

---

## File Structure

```
crypto-wallet-lite/
├── frontend/src/
│   ├── hooks/
│   │   └── useWalletConnect.js    # Core wallet hook
│   ├── components/
│   │   ├── WalletButton.jsx       # Connect/disconnect button
│   │   ├── WalletGuide.jsx        # No-wallet installation guide
│   │   └── PaymentFlow.jsx        # 3-step USDT payment
│   └── config.js                  # All configuration
├── backend/
│   ├── wallet_connect.py          # FastAPI wallet routes
│   ├── payment_verify.py          # On-chain verification
│   └── config.py                  # Backend configuration
├── demo/                          # Minimal demo app
└── docs/
    └── API.md                     # API documentation
```

## Supported Chains

| Chain | Auto-Verify | Explorer API | Recommended |
|-------|------------|--------------|-------------|
| Tron (TRC20) | ✅ | TronScan | ⭐ Lowest fee |
| Ethereum (ERC20) | ✅ | Etherscan | High gas |
| BSC (BEP20) | ✅ | BscScan | Low fee |
| Arbitrum | ✅ | Arbiscan | Low fee |
| Solana | Manual TX | — | Fast |

## Roadmap

- **v1.1** — SIWE signature verification (Sign-In With Ethereum)
- **v1.2** — Native Solana + Bitcoin wallet adapters
- **v1.3** — x402 micropayment protocol integration
- **v2.0** — Multi-token payment (USDC, ETH, BTC, SOL)
- **v2.1** — Subscription payments (recurring on-chain billing)
- **v3.0** — AI Agent autonomous payment standard

## License

MIT — use it however you want.

## Credits

Built by the [AiFund.com](https://aifund.com) team. Born from building a real product that needed wallet connect + crypto payments without the bloat.
