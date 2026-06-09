# crypto-wallet-lite

**Zero-dependency crypto wallet connect + USDT payment verification for web apps.**

No RainbowKit. No Web3Modal. No wagmi. No ethers.js. Just `window.ethereum` + your backend.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why?

| | crypto-wallet-lite | RainbowKit / Web3Modal |
|---|---|---|
| npm dependencies | **0** (only axios) | 10+ packages |
| Bundle size | **~5KB** | +200-500KB |
| No-wallet user guide | Built-in | Not included |
| Demo mode | Built-in | Not included |
| USDT payment verify | Built-in (5 chains) | Not included |
| QR code for payment | Built-in | Not included |
| Setup time | **3 minutes** | 30+ minutes |

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
from wallet_connect import wallet_router
from payment_verify import payment_router

app = FastAPI()
app.include_router(wallet_router, prefix="/api")
app.include_router(payment_router, prefix="/api")
```

### Configuration

```javascript
// frontend/src/config.js
export default {
  // Your USDT receiving addresses
  receivingAddresses: {
    trc20: { address: 'YOUR_TRON_ADDRESS', chain: 'Tron' },
    erc20: { address: 'YOUR_ETH_ADDRESS', chain: 'Ethereum' },
    bsc:   { address: 'YOUR_BSC_ADDRESS', chain: 'BSC' },
    arb:   { address: 'YOUR_ARB_ADDRESS', chain: 'Arbitrum' },
    sol:   { address: 'YOUR_SOL_ADDRESS', chain: 'Solana' },
  },
  
  // Wallets to show in guide (customize as needed)
  wallets: [
    { name: 'MetaMask', url: 'https://metamask.io/download/', chrome: 'https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn' },
    // ... add more
  ],
  
  // Backend API base URL
  backendUrl: process.env.REACT_APP_BACKEND_URL + '/api',
};
```

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
- 🔄 **Auto-verify** — polls blockchain every 10s with spinning animation
- ⛽ **Gas tolerance** — accepts 90% of required amount (gas fee buffer)
- 📋 **TX hash fallback** — manual confirmation for edge cases
- 🔐 **Same-wallet verify** — prompts user to pay from connected address
- 🚫 **Duplicate prevention** — same TX cannot be processed twice

## File Structure

```
crypto-wallet-lite/
├── frontend/src/
│   ├── hooks/
│   │   └── useWalletConnect.js    # Core wallet hook
│   ├── components/
│   │   ├── WalletButton.jsx       # Connect/disconnect button
│   │   ├── WalletGuide.jsx        # No-wallet installation guide
│   │   ├── AccountMenu.jsx        # Account dropdown
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

| Chain | Auto-Verify | Explorer API |
|-------|------------|--------------|
| Tron (TRC20) | ✅ | TronScan |
| Ethereum (ERC20) | ✅ | Etherscan |
| BSC (BEP20) | ✅ | BscScan |
| Arbitrum | ✅ | Arbiscan |
| Solana | Manual TX | — |

## License

MIT — use it however you want.

## Credits

Built by the [AiFund.com](https://aifund.com) team.
