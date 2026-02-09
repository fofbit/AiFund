import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X, Copy, CheckCircle, ExternalLink, Clock, Shield, AlertTriangle, RefreshCw, ChevronRight, QrCode } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CHAIN_INFO = {
  trc20: { name: 'Tron (TRC20)', icon: '🔴', fee: '~1 USDT gas', speed: '~3 sec' },
  erc20: { name: 'Ethereum (ERC20)', icon: '🔷', fee: 'High gas', speed: '~15 sec' },
  bsc: { name: 'BNB Chain (BEP20)', icon: '🟡', fee: 'Very low gas', speed: '~3 sec' },
  arb: { name: 'Arbitrum', icon: '🔵', fee: 'Low gas', speed: '~2 sec' },
  sol: { name: 'Solana', icon: '🟣', fee: 'Minimal gas', speed: '~0.4 sec' },
};

const PaymentFlow = ({ walletAddress, paymentType, amount, onClose, onSuccess }) => {
  const [addresses, setAddresses] = useState({});
  const [selectedChain, setSelectedChain] = useState('trc20');
  const [step, setStep] = useState('select');
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [autoPolling, setAutoPolling] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const [verifyResult, setVerifyResult] = useState(null);
  const [txHash, setTxHash] = useState('');
  const pollRef = useRef(null);

  useEffect(() => {
    loadAddresses();
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
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

  // Auto-polling verification every 10 seconds
  const startAutoVerify = () => {
    setAutoPolling(true);
    setVerifyResult(null);
    setPollCount(0);
    doVerify();
    pollRef.current = setInterval(() => {
      setPollCount(prev => {
        if (prev >= 30) { // Stop after 5 minutes (30 * 10s)
          clearInterval(pollRef.current);
          setAutoPolling(false);
          return prev;
        }
        doVerify();
        return prev + 1;
      });
    }, 10000);
  };

  const stopAutoVerify = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setAutoPolling(false);
  };

  const doVerify = async () => {
    setVerifying(true);
    try {
      const res = await axios.post(`${API}/payment/verify`, {
        wallet_address: walletAddress,
        amount: amount * 0.9, // Accept 90% to account for gas fees
        chain: selectedChain,
        payment_type: paymentType,
      });
      setVerifyResult(res.data);
      if (res.data.verified) {
        stopAutoVerify();
        setTimeout(() => onSuccess && onSuccess(), 1500);
      }
    } catch (e) {
      setVerifyResult({ verified: false, message: 'Check failed, retrying...' });
    }
    setVerifying(false);
  };

  const handleManualConfirm = async () => {
    if (!txHash) return;
    setVerifying(true);
    stopAutoVerify();
    try {
      await axios.post(`${API}/payment/manual-confirm`, {
        wallet_address: walletAddress,
        tx_hash: txHash,
        amount: amount,
        chain: selectedChain,
        payment_type: paymentType,
      });
      setVerifyResult({ verified: true, message: 'Payment confirmed!' });
      setTimeout(() => onSuccess && onSuccess(), 1500);
    } catch (e) {
      setVerifyResult({ verified: false, message: 'Submission failed.' });
    }
    setVerifying(false);
  };

  const currentAddr = addresses[selectedChain];
  const chainInfo = CHAIN_INFO[selectedChain];
  const minAmount = amount;

  const title = paymentType === 'global_vision' ? `Unlock Global Vision — ${amount} USDT`
    : paymentType === 'vip' ? `Upgrade to VIP — ${amount} USDT`
    : `Pay ${amount} USDT`;

  // QR code URL (using public API)
  const qrUrl = currentAddr ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentAddr.address)}` : '';

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
            <button onClick={() => { stopAutoVerify(); onClose(); }} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
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
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl mb-3">
                <p className="text-green-300 text-xs flex items-center">
                  <Shield className="w-3 h-3 mr-1 flex-shrink-0" />
                  Recommended: <strong className="ml-1">TRC20</strong> — lowest fee, fast confirmation
                </p>
              </div>
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl mb-4">
                <p className="text-yellow-300 text-xs flex items-start">
                  <AlertTriangle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                  Please pay from the <strong className="mx-1">same wallet</strong> you used to log in. This verifies your identity and activates your Bot.
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

          {/* Step 2: Show Address, QR & Pay */}
          {step === 'pay' && currentAddr && (
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">
                2. Send <span className="text-yellow-400">{minAmount} USDT</span> ({chainInfo.icon} {chainInfo.name})
              </h4>
              
              {/* QR Code + Address */}
              <div className="bg-black/30 rounded-xl p-4 border border-white/10 mb-4">
                <div className="flex flex-col items-center mb-3">
                  <div className="bg-white rounded-xl p-2 mb-3">
                    <img src={qrUrl} alt="Payment QR Code" className="w-36 h-36 sm:w-44 sm:h-44" data-testid="payment-qr" />
                  </div>
                  <p className="text-gray-400 text-xs mb-1">Scan QR or copy address below</p>
                </div>

                <div className="bg-black/40 rounded-lg p-3 mb-2">
                  <p className="text-white font-mono text-xs break-all select-all" data-testid="payment-address">{currentAddr.address}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleCopy(currentAddr.address)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center ${copied ? 'bg-green-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                    data-testid="copy-address-btn"
                  >
                    {copied ? <><CheckCircle className="w-4 h-4 mr-1" />Copied!</> : <><Copy className="w-4 h-4 mr-1" />Copy Address</>}
                  </button>
                  <a href={currentAddr.explorer} target="_blank" rel="noopener noreferrer"
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm flex items-center">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Warnings */}
              <div className="space-y-2 mb-4">
                <div className="p-2.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <p className="text-yellow-300 text-xs flex items-start">
                    <AlertTriangle className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0" />
                    <span>Make sure you send <strong>at least {minAmount} USDT</strong> (after gas fees). Your wallet may deduct gas from the amount — add a little extra to ensure the received amount is sufficient.</span>
                  </p>
                </div>
                <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-red-300 text-xs flex items-start">
                    <AlertTriangle className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0" />
                    <span>Send only <strong>USDT</strong> on the <strong>{chainInfo.name}</strong> network. Wrong token or network = lost funds.</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setStep('select')} className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl text-sm">Back</button>
                <button onClick={() => { setStep('verify'); startAutoVerify(); }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl text-sm"
                  data-testid="ive-paid-btn"
                >
                  I've Sent Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Auto-Verify with polling */}
          {step === 'verify' && (
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">3. Verifying your payment</h4>

              {/* Auto-polling status */}
              <div className={`p-4 rounded-xl mb-4 border ${verifyResult?.verified ? 'bg-green-500/20 border-green-500/30' : 'bg-purple-500/10 border-purple-500/20'}`}>
                <div className="flex items-center justify-center mb-3">
                  {verifyResult?.verified ? (
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  ) : (
                    <RefreshCw className={`w-10 h-10 text-purple-400 ${autoPolling ? 'animate-spin' : ''}`} />
                  )}
                </div>
                <p className={`text-center font-semibold text-sm ${verifyResult?.verified ? 'text-green-300' : 'text-white'}`}>
                  {verifyResult?.verified ? 'Payment Verified!' : autoPolling ? 'Scanning blockchain...' : 'Waiting to verify'}
                </p>
                {!verifyResult?.verified && autoPolling && (
                  <p className="text-center text-gray-400 text-xs mt-1">
                    Auto-checking every 10 seconds (attempt {pollCount + 1}/30)
                  </p>
                )}
                {verifyResult?.verified && verifyResult.tx_hash && (
                  <p className="text-gray-400 text-xs mt-2 text-center break-all">TX: {verifyResult.tx_hash}</p>
                )}
                {verifyResult && !verifyResult.verified && verifyResult.message && (
                  <p className="text-orange-300 text-xs mt-2 text-center">{verifyResult.message}</p>
                )}
              </div>

              {/* Manual retry button */}
              {!verifyResult?.verified && !autoPolling && (
                <button onClick={startAutoVerify}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl mb-4 flex items-center justify-center text-sm"
                  data-testid="auto-verify-btn"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />Retry Auto-Verify
                </button>
              )}

              {/* Manual TX hash fallback */}
              {!verifyResult?.verified && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-gray-400 text-xs mb-2">Or paste your transaction hash for instant confirmation:</p>
                  <input type="text" value={txHash} onChange={(e) => setTxHash(e.target.value)}
                    placeholder="Paste TX hash here..."
                    className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white text-xs font-mono placeholder-gray-500 focus:border-purple-400 focus:outline-none mb-2"
                    data-testid="tx-hash-input"
                  />
                  <button onClick={handleManualConfirm} disabled={!txHash || verifying}
                    className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50">
                    {verifying ? 'Submitting...' : 'Confirm with TX Hash'}
                  </button>
                </div>
              )}

              <button onClick={() => { stopAutoVerify(); setStep('pay'); }} className="w-full mt-3 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl text-sm">
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
