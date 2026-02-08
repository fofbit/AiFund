import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Demo account for visitors to experience the platform
const DEMO_WALLET = '0xDemoAccount_AIFund_Experience';

function App() {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Check if already connected
  useEffect(() => {
    const savedWallet = localStorage.getItem('aifund_wallet');
    const savedDemo = localStorage.getItem('aifund_demo_mode');
    
    if (savedDemo === 'true') {
      enterDemoMode();
    } else if (savedWallet) {
      connectExistingWallet(savedWallet);
    }
  }, []);

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
      localStorage.removeItem('aifund_wallet');
    }
  };

  const enterDemoMode = async () => {
    setLoading(true);
    try {
      // Create or connect demo account
      const response = await axios.post(`${API}/wallet/connect`, {
        wallet_address: DEMO_WALLET,
        wallet_type: 'demo'
      });

      // Check if demo user needs setup
      if (response.data.status === 'new_user' || !response.data.has_bot) {
        // Auto-deposit for demo
        await axios.post(`${API}/deposit`, {
          wallet_address: DEMO_WALLET,
          currency: 'USDT',
          amount: 100,
          tx_hash: 'demo_deposit_' + Date.now()
        });

        // Auto-create bot for demo
        await axios.post(`${API}/bot/create`, {
          wallet_address: DEMO_WALLET,
          bot_name: '体验Bot',
          gender: 'male',
          avatar_id: 'male_1'
        });

        // Re-fetch user data
        const updatedResponse = await axios.post(`${API}/wallet/connect`, {
          wallet_address: DEMO_WALLET,
          wallet_type: 'demo'
        });
        setUserData(updatedResponse.data);
      } else {
        setUserData(response.data);
      }

      setWalletAddress(DEMO_WALLET);
      setConnected(true);
      setIsDemoMode(true);
      localStorage.setItem('aifund_demo_mode', 'true');

    } catch (error) {
      console.error('Error entering demo mode:', error);
      alert('演示模式加载失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    setLoading(true);
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        // Request account access
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        const address = accounts[0];
        
        // Connect to backend
        const response = await axios.post(`${API}/wallet/connect`, {
          wallet_address: address,
          wallet_type: 'metamask'
        });
        
        setWalletAddress(address);
        setUserData(response.data);
        setConnected(true);
        setIsDemoMode(false);
        
        // Save to localStorage
        localStorage.setItem('aifund_wallet', address);
        localStorage.removeItem('aifund_demo_mode');
        
      } else {
        alert('Please install MetaMask to use this dApp!');
        window.open('https://metamask.io/download/', '_blank');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setConnected(false);
    setWalletAddress(null);
    setUserData(null);
    setIsDemoMode(false);
    localStorage.removeItem('aifund_wallet');
    localStorage.removeItem('aifund_demo_mode');
  };

  const refreshUserData = async () => {
    if (walletAddress) {
      await connectExistingWallet(walletAddress);
    }
  };

  return (
    <div className="App">
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
          onExitDemo={() => {
            disconnectWallet();
          }}
          onConnectReal={connectWallet}
        />
      )}
    </div>
  );
}

export default App;
