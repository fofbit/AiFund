import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Key, Shield, CheckCircle, AlertTriangle, ExternalLink, ChevronRight, Eye, EyeOff } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const VIPApiSettings = ({ walletAddress, userData, onClose }) => {
  const [markets, setMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [savedApis, setSavedApis] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMarkets();
    loadSavedApis();
  }, []);

  const loadMarkets = async () => {
    try {
      const res = await axios.get(`${API}/vip/supported-markets`);
      setMarkets(res.data.markets);
    } catch (err) {
      console.error('Error loading markets:', err);
    }
  };

  const loadSavedApis = async () => {
    try {
      const res = await axios.get(`${API}/vip/api-settings/${walletAddress}`);
      setSavedApis(res.data.settings || {});
    } catch (err) {
      // Not saved yet, that's fine
    }
  };

  const handleSave = async () => {
    if (!selectedMarket || !apiKey) return;
    setSaving(true);
    try {
      await axios.post(`${API}/vip/api-settings`, {
        wallet_address: walletAddress,
        market_id: selectedMarket.id,
        api_key: apiKey,
        api_secret: apiSecret,
      });
      setSavedApis(prev => ({ ...prev, [selectedMarket.id]: { connected: true, exchange: selectedMarket.name } }));
      setApiKey('');
      setApiSecret('');
      alert(`${selectedMarket.name} API 已保存！Bot 将开始在此市场交易。`);
    } catch (err) {
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 rounded-2xl max-w-4xl w-full border border-yellow-500/30 shadow-2xl my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-yellow-500/30 bg-gradient-to-r from-yellow-600/20 to-orange-600/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4">
                <Key className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white" data-testid="api-settings-title">VIP交易所API设置</h2>
                <p className="text-yellow-200 text-sm">连接您的交易所API，让Bot自动帮您交易</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white" data-testid="close-api-settings">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-4 bg-green-500/10 border-b border-green-500/20">
          <div className="flex items-center">
            <Shield className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
            <p className="text-green-300 text-sm">
              <strong>安全保障：</strong>资金始终在您的交易所账户，Bot只有交易权限（无提币权限）。API密钥加密存储。
            </p>
          </div>
        </div>

        <div className="p-6">
          {/* Markets Grid */}
          <h3 className="text-lg font-bold text-white mb-4">选择交易市场</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {markets.map((market) => {
              const isConnected = savedApis[market.id]?.connected;
              return (
                <button
                  key={market.id}
                  onClick={() => setSelectedMarket(market)}
                  className={`p-4 rounded-xl border transition-all text-left relative ${
                    selectedMarket?.id === market.id
                      ? 'border-yellow-400 bg-yellow-500/10'
                      : isConnected
                      ? 'border-green-500/50 bg-green-500/5'
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                  data-testid={`market-${market.id}`}
                >
                  {isConnected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                  )}
                  <div className="text-3xl mb-2">{market.icon}</div>
                  <h4 className="text-white font-semibold text-sm">{market.name}</h4>
                  <p className="text-gray-400 text-xs mt-1">{market.description}</p>
                  <p className="text-gray-500 text-xs mt-1">最低 ${market.min_capital}</p>
                </button>
              );
            })}
          </div>

          {/* Selected Market Form */}
          {selectedMarket && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">{selectedMarket.icon}</span>
                <div>
                  <h4 className="text-white font-bold text-lg">{selectedMarket.name}</h4>
                  <p className="text-gray-400 text-sm">支持交易所: {selectedMarket.exchanges.join(', ')}</p>
                </div>
              </div>

              {savedApis[selectedMarket.id]?.connected ? (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg mb-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <p className="text-green-300 font-semibold">已连接 — Bot 正在此市场自动交易</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">API Key</label>
                      <input
                        type="text"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder={`输入${selectedMarket.name} API Key`}
                        className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none"
                        data-testid="api-key-input"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">API Secret</label>
                      <div className="relative">
                        <input
                          type={showSecret ? 'text' : 'password'}
                          value={apiSecret}
                          onChange={(e) => setApiSecret(e.target.value)}
                          placeholder="输入 API Secret"
                          className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none pr-12"
                          data-testid="api-secret-input"
                        />
                        <button
                          onClick={() => setShowSecret(!showSecret)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-4">
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-yellow-300 text-xs">
                        请确保API仅开启<strong>交易权限</strong>，不要开启提币权限。这样即使API泄露，资金也是安全的。
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleSave}
                    disabled={saving || !apiKey}
                    className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 text-black font-bold rounded-lg transition-all flex items-center justify-center"
                    data-testid="save-api-btn"
                  >
                    <Key className="w-5 h-5 mr-2" />
                    {saving ? '保存中...' : '保存并启动交易'}
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VIPApiSettings;
