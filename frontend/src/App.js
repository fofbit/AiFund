import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check if already connected
  useEffect(() => {
    const savedWallet = localStorage.getItem('aifund_wallet');
    if (savedWallet) {
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
        
        // Save to localStorage
        localStorage.setItem('aifund_wallet', address);
        
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
    localStorage.removeItem('aifund_wallet');
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
          loading={loading}
        />
      ) : (
        <Dashboard
          walletAddress={walletAddress}
          userData={userData}
          onDisconnect={disconnectWallet}
          onRefresh={refreshUserData}
        />
      )}
    </div>
  );
}

export default App;
