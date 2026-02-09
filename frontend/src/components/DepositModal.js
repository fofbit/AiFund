import React, { useState } from 'react';
import PaymentFlow from './PaymentFlow';

const DepositModal = ({ walletAddress, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [showPayment, setShowPayment] = useState(false);

  const presetAmounts = [1, 10, 50, 100];

  if (showPayment) {
    return (
      <PaymentFlow
        walletAddress={walletAddress}
        paymentType="deposit"
        amount={parseFloat(amount) || 1}
        onClose={onClose}
        onSuccess={() => { onSuccess(); }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-md w-full p-6 border border-purple-500/30 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-white">Pay with USDT</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <span className="text-xl">✕</span>
          </button>
        </div>

        <p className="text-gray-300 text-sm mb-4">Select or enter the amount you want to pay.</p>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {presetAmounts.map((a) => (
            <button key={a} onClick={() => setAmount(String(a))}
              className={`py-2.5 rounded-xl font-bold text-sm transition-all ${String(a) === amount ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
            >
              ${a}
            </button>
          ))}
        </div>

        <div className="mb-5">
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
            placeholder="Custom amount (USDT)"
            className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none text-sm"
            data-testid="deposit-amount-input"
            min="1" step="0.1"
          />
        </div>

        <button onClick={() => { if (parseFloat(amount) >= 1) setShowPayment(true); }}
          disabled={!amount || parseFloat(amount) < 1}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-40 text-white font-bold rounded-xl transition-all text-sm"
          data-testid="proceed-deposit-btn"
        >
          {!amount || parseFloat(amount) < 1 ? 'Enter amount (min $1)' : `Pay $${parseFloat(amount).toFixed(2)} USDT`}
        </button>
      </div>
    </div>
  );
};

export default DepositModal;
