import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Copy, CheckCircle, ExternalLink, Clock, Shield, AlertTriangle, RefreshCw, ChevronRight } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CHAIN_INFO = {
  trc20: { name: 'Tron (TRC20)', icon: '🔴', fee: 'Low fee (~1 USDT)', speed: '~3 sec' },
  erc20: { name: 'Ethereum (ERC20)', icon: '🔷', fee: 'High gas fee', speed: '~15 sec' },
  bsc: { name: 'BNB Chain (BEP20)', icon: '🟡', fee: 'Very low fee', speed: '~3 sec' },
  arb: { name: 'Arbitrum', icon: '🔵', fee: 'Low fee', speed: '~2 sec' },
  sol: { name: 'Solana', icon: '🟣', fee: 'Minimal fee', speed: '~0.4 sec' },
};

const PaymentFlow = ({ walletAddress, paymentType, amount, onClose, onSuccess }) => {
  const [addresses, setAddresses] = useState({});
  const [selectedChain, setSelectedChain] = useState('trc20');
  const [step, setStep] = useState('select'); // select, pay, verify
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [txHash, setTxHash] = useState('');

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const res = await axios.get(`${API}/payment/addresses`);
      setAddresses(res.data.addresses);
    } catch (e) { console.error(e); }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async () => {
    setVerifying(true);
    setVerifyResult(null);
    try {
      const res = await axios.post(`${API}/payment/verify`, {
        wallet_address: walletAddress,
        amount: amount,
        chain: selectedChain,
        payment_type: paymentType,
      });
      setVerifyResult(res.data);
      if (res.data.verified) {
        setTimeout(() => onSuccess && onSuccess(), 2000);
      }
    } catch (e) {
      setVerifyResult({ verified: false, message: 'Verification failed. Please try again.' });
    }
    setVerifying(false);
  };

  const handleManualConfirm = async () => {
    if (!txHash) return;
    setVerifying(true);
    try {
      await axios.post(`${API}/payment/manual-confirm`, {
        wallet_address: walletAddress,
        tx_hash: txHash,
        amount: amount,
        chain: selectedChain,
        payment_type: paymentType,
      });
      setVerifyResult({ verified: true, message: 'Payment submitted for confirmation!' });
      setTimeout(() => onSuccess && onSuccess(), 2000);
    } catch (e) {
      setVerifyResult({ verified: false, message: 'Submission failed.' });
    }
    setVerifying(false);
  };

  const currentAddr = addresses[selectedChain];
  const chainInfo = CHAIN_INFO[selectedChain];

  const title = paymentType === 'global_vision' ? 'Unlock Global Vision — 9.9 USDT'
    : paymentType === 'vip' ? 'Upgrade to VIP — 99 USDT'
    : `Deposit ${amount} USDT`;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] p-2 sm:p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-lg w-full border border-purple-500/30 shadow-2xl my-4">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-purple-500/30 bg-gradient-to-r from-purple-600/20 to-pink-600/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white" data-testid="payment-title">{title}</h3>
              <p className="text-gray-400 text-xs mt-1">Send USDT to complete payment</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {/* Step 1: Select Chain */}
          {step === 'select' && (
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">1. Select payment network</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {Object.entries(CHAIN_INFO).map(([id, info]) => (
                  <button key={id} onClick={() => setSelectedChain(id)}
                    className={`p-3 rounded-xl border text-left transition-all ${selectedChain === id ? 'border-purple-400 bg-purple-500/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}
                    data-testid={`chain-${id}`}
                  >
                    <span className="text-xl">{info.icon}</span>
                    <p className="text-white font-semibold text-xs mt-1">{info.name}</p>
                    <p className="text-gray-500 text-xs">{info.fee}</p>
                  </button>
                ))}
              </div>
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl mb-4">
                <p className="text-green-300 text-xs flex items-center">
                  <Shield className="w-3 h-3 mr-1 flex-shrink-0" />
                  Recommended: <strong className="ml-1">TRC20</strong> — lowest fee, fast confirmation
                </p>
              </div>
              <button onClick={() => setStep('pay')}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl transition-all text-sm"
                data-testid="continue-to-pay"
              >
                Continue <ChevronRight className="w-4 h-4 inline ml-1" />
              </button>
            </div>
          )}

          {/* Step 2: Show Address & Pay */}
          {step === 'pay' && currentAddr && (
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">2. Send exactly <span className="text-yellow-400">{amount} USDT</span> to:</h4>
              
              <div className="bg-black/30 rounded-xl p-4 border border-white/10 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-xs">{chainInfo.icon} {chainInfo.name}</span>
                  <a href={currentAddr.explorer} target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-xs flex items-center hover:text-cyan-300">
                    Explorer <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
                <div className="bg-black/40 rounded-lg p-3 mb-2">
                  <p className="text-white font-mono text-xs break-all select-all" data-testid="payment-address">{currentAddr.address}</p>
                </div>
                <button onClick={() => handleCopy(currentAddr.address)}
                  className={`w-full py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center ${copied ? 'bg-green-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                  data-testid="copy-address-btn"
                >
                  {copied ? <><CheckCircle className="w-4 h-4 mr-1" />Copied!</> : <><Copy className="w-4 h-4 mr-1" />Copy Address</>}
                </button>
              </div>

              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl mb-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-yellow-300 text-xs">
                    <p className="font-semibold mb-1">Important:</p>
                    <p>Send exactly <strong>{amount} USDT</strong> on the <strong>{chainInfo.name}</strong> network.</p>
                    <p className="mt-1">Wrong network = lost funds. Double check before sending.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setStep('select')} className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl text-sm">
                  Back
                </button>
                <button onClick={() => setStep('verify')}
                  className="flex-1 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl text-sm"
                  data-testid="ive-paid-btn"
                >
                  I've Sent Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Verify */}
          {step === 'verify' && (
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">3. Verify your payment</h4>

              {/* Auto verify */}
              <button onClick={handleVerify} disabled={verifying}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl mb-4 flex items-center justify-center text-sm disabled:opacity-50"
                data-testid="auto-verify-btn"
              >
                {verifying ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Checking blockchain...</> : <><CheckCircle className="w-4 h-4 mr-2" />Auto-Verify Payment</>}
              </button>

              {/* Result */}
              {verifyResult && (
                <div className={`p-4 rounded-xl mb-4 ${verifyResult.verified ? 'bg-green-500/20 border border-green-500/30' : 'bg-orange-500/10 border border-orange-500/20'}`}>
                  <div className="flex items-center">
                    {verifyResult.verified ? <CheckCircle className="w-5 h-5 text-green-400 mr-2" /> : <Clock className="w-5 h-5 text-orange-400 mr-2" />}
                    <p className={`font-semibold text-sm ${verifyResult.verified ? 'text-green-300' : 'text-orange-300'}`}>{verifyResult.message}</p>
                  </div>
                  {verifyResult.tx_hash && <p className="text-gray-400 text-xs mt-2 break-all">TX: {verifyResult.tx_hash}</p>}
                </div>
              )}

              {/* Manual fallback */}
              {!verifyResult?.verified && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-gray-400 text-xs mb-2">Payment not detected? Paste your transaction hash:</p>
                  <input type="text" value={txHash} onChange={(e) => setTxHash(e.target.value)}
                    placeholder="Paste TX hash here..."
                    className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white text-xs font-mono placeholder-gray-500 focus:border-purple-400 focus:outline-none mb-2"
                    data-testid="tx-hash-input"
                  />
                  <button onClick={handleManualConfirm} disabled={!txHash || verifying}
                    className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg disabled:opacity-50">
                    Submit TX Hash for Review
                  </button>
                </div>
              )}

              <button onClick={() => setStep('pay')} className="w-full mt-3 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl text-sm">
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentFlow;
