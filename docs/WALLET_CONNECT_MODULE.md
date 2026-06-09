# AiFund.com — Wallet Connect/Disconnect Module Documentation

> **Version:** 1.0 | **Source Project:** AiFund.com  
> **Stack:** React (Frontend) + FastAPI + MongoDB (Backend)  
> **No npm wallet libraries required** — uses browser-native `window.ethereum` API

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND (React)                  │
│                                                     │
│  App.js ─── State Management (connected, address)   │
│    ├── LandingPage.js ─── Connect / Demo buttons    │
│    │     └── WalletGuideModal ─── No-wallet users   │
│    └── Dashboard.js ─── Account dropdown menu       │
│          └── Disconnect / Switch wallet              │
│                                                     │
│  localStorage: aifund_wallet, aifund_demo_mode      │
├─────────────────────────────────────────────────────┤
│                    BACKEND (FastAPI)                 │
│                                                     │
│  POST /api/wallet/connect                           │
│    → Creates new user OR returns existing user       │
│    → MongoDB collection: users                       │
└─────────────────────────────────────────────────────┘
```

---

## 1. Frontend — App.js (Core State Manager)

The root component manages all wallet connection state:

```jsx
// App.js — Core wallet connection logic

import { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const DEMO_WALLET = '0xDemoAccount_Experience'; // Fixed demo address

function App() {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // ===== AUTO-RECONNECT ON PAGE LOAD =====
  // Checks localStorage for saved session
  useEffect(() => {
    const savedWallet = localStorage.getItem('aifund_wallet');
    const savedDemo = localStorage.getItem('aifund_demo_mode');
    
    if (savedDemo === 'true') {
      enterDemoMode();
    } else if (savedWallet) {
      connectExistingWallet(savedWallet);
    }
  }, []);

  // ===== RECONNECT SAVED WALLET =====
  const connectExistingWallet = async (address) => {
    try {
      const response = await axios.post(`${API}/wallet/connect`, {
        wallet_address: address,
        wallet_type: 'metamask'
      });
      setWalletAddress(address);
      setUserData(response.data);
      setConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      localStorage.removeItem('aifund_wallet'); // Clear invalid session
    }
  };

  // ===== CONNECT NEW WALLET (MetaMask/EVM) =====
  const connectWallet = async () => {
    setLoading(true);
    try {
      if (typeof window.ethereum !== 'undefined') {
        // Request wallet access via browser extension
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        const address = accounts[0];
        
        // Register/fetch user on backend
        const response = await axios.post(`${API}/wallet/connect`, {
          wallet_address: address,
          wallet_type: 'metamask'
        });
        
        setWalletAddress(address);
        setUserData(response.data);
        setConnected(true);
        setIsDemoMode(false);
        
        // Persist session
        localStorage.setItem('aifund_wallet', address);
        localStorage.removeItem('aifund_demo_mode');
      } else {
        // No wallet extension detected
        // Show wallet installation guide (handled by LandingPage)
        alert('Please install a crypto wallet first.');
      }
    } catch (error) {
      if (error.code === 4001) {
        alert('Connection cancelled by user.');
      } else {
        alert('Failed to connect. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ===== DEMO MODE (No wallet needed) =====
  const enterDemoMode = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/wallet/connect`, {
        wallet_address: DEMO_WALLET,
        wallet_type: 'demo'
      });

      // Auto-setup demo account if new
      if (response.data.status === 'new_user' || !response.data.has_bot) {
        // Auto-deposit, auto-create bot, etc.
        // ... (project-specific setup)
      }

      setWalletAddress(DEMO_WALLET);
      setUserData(response.data);
      setConnected(true);
      setIsDemoMode(true);
      localStorage.setItem('aifund_demo_mode', 'true');
    } catch (error) {
      alert('Demo mode failed to load.');
    } finally {
      setLoading(false);
    }
  };

  // ===== DISCONNECT (True logout) =====
  const disconnectWallet = () => {
    setConnected(false);
    setWalletAddress(null);
    setUserData(null);
    setIsDemoMode(false);
    localStorage.removeItem('aifund_wallet');
    localStorage.removeItem('aifund_demo_mode');
    // User returns to LandingPage, can connect different wallet
  };

  // ===== REFRESH USER DATA =====
  const refreshUserData = async () => {
    if (walletAddress) {
      await connectExistingWallet(walletAddress);
    }
  };

  // ===== ROUTING =====
  return (
    <div>
      {!connected ? (
        <LandingPage 
          onConnect={connectWallet}
          onDemoMode={enterDemoMode}
          loading={loading}
        />
      ) : (
        <Dashboard
          walletAddress={walletAddress}
          userData={userData}
          onDisconnect={disconnectWallet}
          onRefresh={refreshUserData}
          isDemoMode={isDemoMode}
          onExitDemo={disconnectWallet}
          onConnectReal={connectWallet}
        />
      )}
    </div>
  );
}
```

### Key Design Decisions:
- **No npm wallet libraries** (web3, ethers, @web3-react removed) — uses `window.ethereum` directly
- **localStorage persistence** — user stays logged in across page refreshes
- **Demo mode** — full experience without any wallet, uses a fixed demo address
- **Error code 4001** — MetaMask user-rejection handled gracefully

---

## 2. Frontend — LandingPage Connect Button + Wallet Guide

When user clicks "Connect Wallet" but has no wallet extension:

```jsx
// Wallet detection and guide trigger
const handleConnect = () => {
  if (typeof window.ethereum !== 'undefined') {
    onConnect(); // Wallet exists → connect directly
  } else {
    setShowWalletGuide(true); // No wallet → show installation guide
  }
};
```

### Supported Wallets List:

| Wallet | Chain | Official URL | Chrome Extension |
|--------|-------|-------------|-----------------|
| MetaMask | EVM | metamask.io/download | [Chrome Store](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) |
| OKX Wallet | EVM | okx.com/web3 | [Chrome Store](https://chromewebstore.google.com/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge) |
| WizzWallet | Atomicals | wizzwallet.io | [Chrome Store](https://chromewebstore.google.com/detail/wizz-wallet/ghlmndacnhlaekppcllcpcjjjomjkjpg) |
| Trust Wallet | EVM | trustwallet.com/download | [Chrome Store](https://chromewebstore.google.com/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph) |
| Coinbase Wallet | EVM | coinbase.com/wallet | [Chrome Store](https://chromewebstore.google.com/detail/coinbase-wallet/hnfanknocfeofbddgcijnmhnfnkdnaad) |
| Unisat | BTC/BRC-20 | unisat.io/download | [Chrome Store](https://chromewebstore.google.com/detail/unisat-wallet/ppbibelpcjmhbdihakflkdcoccbgbkpo) |

### Wallet Guide Modal Features:
- Chrome browser download link (required for extensions)
- Each wallet: **Official Site** button + **Chrome Extension Store** button
- "Don't want to install?" → points to Free Demo
- Bilingual (EN/中文)

---

## 3. Frontend — Dashboard Account Menu (Disconnect/Switch)

The account dropdown replaces a simple logout button:

```jsx
// Dashboard header — Account management dropdown
<div className="relative">
  <button onClick={() => setShowAccountMenu(!showAccountMenu)}>
    <span className="tier-badge">{tierBadge.text}</span>
    <span className="address">0x71...523</span>
  </button>

  {showAccountMenu && (
    <div className="dropdown">
      {/* Connected wallet info */}
      <div>
        <p>Connected Wallet</p>
        <p>{walletAddress}</p>
        <p>{chainType}</p> {/* EVM / Tron / Solana */}
      </div>

      {/* Balance */}
      <div>Balance: ${balance}</div>

      {/* Demo mode: switch to real wallet */}
      {isDemoMode && (
        <button onClick={onConnectReal}>
          Connect Real Wallet
        </button>
      )}

      {/* Disconnect (true logout) */}
      <button onClick={onDisconnect}>
        Disconnect & Switch Wallet
      </button>
    </div>
  )}
</div>
```

### Chain Type Detection:
```javascript
// Auto-detect chain from address format
const chainType = walletAddress?.startsWith('0x') ? 'EVM (Ethereum/BSC/ARB)' 
  : walletAddress?.startsWith('T') ? 'Tron' 
  : 'Solana';
```

### Click-away to close:
```javascript
useEffect(() => {
  const handleClick = (e) => {
    if (showAccountMenu 
      && !e.target.closest('[data-testid="account-menu-btn"]') 
      && !e.target.closest('[data-testid="account-dropdown"]')) {
      setShowAccountMenu(false);
    }
  };
  document.addEventListener('click', handleClick);
  return () => document.removeEventListener('click', handleClick);
}, [showAccountMenu]);
```

---

## 4. Backend — Wallet Connect API

```python
# FastAPI endpoint — POST /api/wallet/connect

class ConnectWalletRequest(BaseModel):
    wallet_address: str
    wallet_type: str  # metamask, unisat, okx, demo, etc.

class User(BaseModel):
    wallet_address: str
    username: Optional[str] = None
    balance_usd: float = 0.0
    tier: str = "inactive"  # inactive, basic, vip
    joined_at: datetime
    referral_code: str  # Auto-generated UUID
    has_global_vision: bool = False

@api_router.post("/wallet/connect")
async def connect_wallet(req: ConnectWalletRequest):
    wallet_address = req.wallet_address.lower()
    
    # Check if user exists in MongoDB
    user = await db.users.find_one({"wallet_address": wallet_address})
    
    if not user:
        # Create new user
        new_user = User(wallet_address=wallet_address)
        await db.users.insert_one(new_user.model_dump())
        return {
            "status": "new_user", 
            "user": new_user.model_dump(), 
            "has_bot": False
        }
    
    # Return existing user
    return {
        "status": "existing_user",
        "user": {
            "wallet_address": user["wallet_address"],
            "balance_usd": user.get("balance_usd", 0),
            "tier": user.get("tier", "inactive"),
            "referral_code": user.get("referral_code"),
            "has_global_vision": user.get("has_global_vision", False)
        },
        "has_bot": bot is not None  # Check if user has created a bot
    }
```

### MongoDB Schema:
```javascript
// Collection: users
{
  wallet_address: "0x71376f6e90cc455a900954be5fd8a1efc729d523",
  balance_usd: 109.90,
  tier: "vip",          // inactive | basic | vip
  joined_at: ISODate("2025-12-13T00:00:00Z"),
  referral_code: "a1b2c3d4",
  has_global_vision: true
}
```

---

## 5. Complete Flow Diagram

```
User visits site
    │
    ├── Has wallet extension? 
    │     ├── YES → Click "Connect Wallet" 
    │     │         → window.ethereum.request({method: 'eth_requestAccounts'})
    │     │         → POST /api/wallet/connect {address, type}
    │     │         → Save to localStorage
    │     │         → Show Dashboard
    │     │
    │     └── NO  → Show WalletGuideModal
    │               → Links to MetaMask/OKX/Trust/etc.
    │               → OR click "Free Demo"
    │
    ├── Click "Free Demo"
    │     → POST /api/wallet/connect {demo_address, 'demo'}
    │     → Auto-setup (deposit, create bot)
    │     → Save demo mode to localStorage
    │     → Show Dashboard (demo banner)
    │
    └── Page refresh / Return visit
          → Check localStorage for saved wallet/demo
          → Auto-reconnect via POST /api/wallet/connect
          → Resume session

In Dashboard:
    │
    ├── Click account button → Dropdown shows:
    │     ├── Connected address + chain type
    │     ├── Balance
    │     ├── "Connect Real Wallet" (demo only)
    │     └── "Disconnect & Switch Wallet"
    │           → Clear localStorage
    │           → Reset all state
    │           → Return to LandingPage
    │           → User can connect different wallet
```

---

## 6. localStorage Keys

| Key | Value | Purpose |
|-----|-------|---------|
| `aifund_wallet` | `"0x71376f..."` | Persisted wallet address for auto-reconnect |
| `aifund_demo_mode` | `"true"` | Indicates demo mode active |

Both are cleared on disconnect.

---

## 7. Key Props Interface

```typescript
// LandingPage props
interface LandingPageProps {
  onConnect: () => Promise<void>;   // Trigger wallet connection
  onDemoMode: () => Promise<void>;  // Enter demo mode
  loading: boolean;                  // Show loading state
}

// Dashboard props
interface DashboardProps {
  walletAddress: string;
  userData: { status: string; user: UserData; has_bot: boolean };
  onDisconnect: () => void;          // True disconnect
  onRefresh: () => Promise<void>;    // Refresh user data
  isDemoMode: boolean;
  onExitDemo: () => void;            // Exit demo (same as disconnect)
  onConnectReal: () => Promise<void>; // Switch from demo to real wallet
}
```

---

## 8. Adapting for Other Projects

To use this module in another project:

1. **Copy** `App.js` wallet logic (connect/disconnect/demo/localStorage)
2. **Copy** `WalletGuideModal` component from LandingPage.js
3. **Copy** Account dropdown from Dashboard.js
4. **Backend**: Implement `POST /api/wallet/connect` endpoint
5. **Customize**: Change `DEMO_WALLET` address, wallet list, localStorage keys
6. **No npm packages needed** — just `axios` for HTTP and `window.ethereum` for wallet

### Minimum viable wallet connect (simplified):
```jsx
const connectWallet = async () => {
  if (!window.ethereum) return alert('Install MetaMask');
  const [address] = await window.ethereum.request({ method: 'eth_requestAccounts' });
  localStorage.setItem('wallet', address);
  // POST to your backend
};

const disconnect = () => {
  localStorage.removeItem('wallet');
  // Reset state, show login page
};
```
