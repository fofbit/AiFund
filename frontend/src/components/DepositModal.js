import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Copy, Check } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DepositModal = ({ walletAddress, onClose, onSuccess }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('USDT');
  const [amount, setAmount] = useState('');
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const currencies = [
    { symbol: 'USDT', name: 'Tether', icon: '💵' },
    { symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
    { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
    { symbol: 'BNB', name: 'BNB', icon: '🔶' },
    { symbol: 'SOL', name: 'Solana', icon: '◎' },
  ];

  useEffect(() => {
    loadPrices();
  }, []);

  const loadPrices = async () => {
    try {
      const response = await axios.get(`${API}/prices`);
      setPrices(response.data.prices);
    } catch (error) {
      console.error('Error loading prices:', error);
    }
  };

  const getUsdValue = () => {
    if (!amount || !prices[selectedCurrency]) return 0;
    return parseFloat(amount) * prices[selectedCurrency];
  };

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('请输入有效的金额');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/deposit`, {
        wallet_address: walletAddress,
        currency: selectedCurrency,
        amount: parseFloat(amount),
        tx_hash: 'simulated_tx_' + Date.now()
      });

      alert(`充值成功！您的新余额: $${response.data.new_balance.toFixed(2)}`);
      onSuccess();
    } catch (error) {
      console.error('Error processing deposit:', error);
      alert('充值失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const depositAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

  const copyAddress = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-purple-500/30 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">充值加密货币</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">选择币种</label>
          <div className="grid grid-cols-5 gap-2">
            {currencies.map((currency) => (
              <button
                key={currency.symbol}
                onClick={() => setSelectedCurrency(currency.symbol)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedCurrency === currency.symbol
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="text-2xl mb-1">{currency.icon}</div>
                <div className="text-xs text-white font-semibold">{currency.symbol}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">充值数量</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            data-testid="deposit-amount-input"
          />
          {amount && prices[selectedCurrency] && (
            <p className="text-sm text-gray-400 mt-2">≈ ${getUsdValue().toFixed(2)} USD</p>
          )}
        </div>

        <div className="mb-6 p-4 bg-gray-700 rounded-lg">
          <label className="block text-sm font-medium text-gray-300 mb-2">充值地址 (模拟)</label>
          <div className="flex items-center justify-between">
            <code className="text-xs text-purple-400 break-all">{depositAddress}</code>
            <button onClick={copyAddress} className="ml-2 p-2 hover:bg-gray-600 rounded transition-colors">
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
            </button>
          </div>
        </div>

        <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-300">
            <strong>MVP提示:</strong> 当前为演示模式，直接点击"确认充值"即可模拟充值。
            生产环境将集成真实的区块链支付。
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
          >
            取消
          </button>
          <button
            onClick={handleDeposit}
            disabled={loading || !amount || parseFloat(amount) <= 0}
            className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
            data-testid="confirm-deposit-btn"
          >
            {loading ? '处理中...' : '确认充值'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
