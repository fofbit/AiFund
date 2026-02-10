import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Key, Shield, CheckCircle, AlertTriangle, ExternalLink, ChevronRight, Eye, EyeOff, Download } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Official exchange links for each market
const EXCHANGE_LINKS = {
  crypto: [
    { name: 'Binance', register: 'https://www.binance.com/register', app: 'https://www.binance.com/download', desc: 'World\'s largest crypto exchange' },
    { name: 'OKX', register: 'https://www.okx.com/account/register', app: 'https://www.okx.com/download', desc: 'Comprehensive crypto exchange' },
    { name: 'Bybit', register: 'https://www.bybit.com/register', app: 'https://www.bybit.com/download', desc: 'Top derivatives exchange' },
    { name: 'Bitget', register: 'https://www.bitget.com/register', app: 'https://www.bitget.com/download', desc: 'Copy trading & derivatives' },
    { name: 'Gate.io', register: 'https://www.gate.io/signup', app: 'https://www.gate.io/mobileapp', desc: '1400+ tokens, early listings' },
    { name: 'Coinbase', register: 'https://www.coinbase.com/signup', app: 'https://www.coinbase.com/wallet/downloads', desc: 'US regulated exchange' },
  ],
  us_stock: [
    { name: 'Robinhood', register: 'https://robinhood.com/signup', app: 'https://robinhood.com/download', desc: 'Most popular US investing app' },
    { name: 'Webull', register: 'https://www.webull.com/introduce', app: 'https://www.webull.com/download', desc: 'Free stock trading + analytics' },
    { name: 'Charles Schwab', register: 'https://www.schwab.com/open-an-account', app: 'https://www.schwab.com/mobile', desc: 'Trusted US brokerage' },
    { name: 'Interactive Brokers', register: 'https://www.interactivebrokers.com', app: 'https://www.interactivebrokers.com/en/trading/tws-mobile.php', desc: 'Global professional broker' },
    { name: 'Futu / moomoo', register: 'https://www.futunn.com/', app: 'https://www.futunn.com/download', desc: 'Asian-popular US stock app' },
    { name: 'Tiger Brokers', register: 'https://www.itigerup.com/', app: 'https://www.itigerup.com/download', desc: 'US/HK stock trading' },
    { name: '老虎证券', register: 'https://www.itigerup.com/', app: 'https://www.itigerup.com/download', desc: '华人首选美股券商' },
  ],
  hk_stock: [
    { name: '富途证券', register: 'https://www.futunn.com/', app: 'https://www.futunn.com/download', desc: '港股交易便捷' },
    { name: '老虎证券', register: 'https://www.itigerup.com/', app: 'https://www.itigerup.com/download', desc: '港股美股一站式' },
    { name: '盈立证券', register: 'https://www.usmart.sg/', app: 'https://www.usmart.sg/', desc: '智能港股交易' },
  ],
  a_stock: [
    { name: '东方财富', register: 'https://www.eastmoney.com/', app: 'https://www.eastmoney.com/download/', desc: 'A股综合平台' },
    { name: '同花顺', register: 'https://www.10jqka.com.cn/', app: 'https://www.10jqka.com.cn/download/', desc: 'A股行情分析' },
  ],
  futures: [
    { name: '盈透证券 IBKR', register: 'https://www.interactivebrokers.com/cn/home.php', app: 'https://www.interactivebrokers.com/en/trading/tws-mobile.php', desc: '全球期货交易' },
  ],
  options: [
    { name: '盈透证券 IBKR', register: 'https://www.interactivebrokers.com/cn/home.php', app: 'https://www.interactivebrokers.com/en/trading/tws-mobile.php', desc: '专业期权交易' },
  ],
  forex: [
    { name: 'OANDA', register: 'https://www.oanda.com/', app: 'https://www.oanda.com/trading/app/', desc: '知名外汇平台' },
  ],
  prediction: [
    { name: 'Polymarket', register: 'https://polymarket.com/', app: 'https://polymarket.com/', desc: '去中心化预测市场' },
  ],
};

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
    } catch (err) {}
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

  const currentExchanges = selectedMarket ? (EXCHANGE_LINKS[selectedMarket.id] || []) : [];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 rounded-2xl max-w-4xl w-full border border-yellow-500/30 shadow-2xl my-4 sm:my-8">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-yellow-500/30 bg-gradient-to-r from-yellow-600/20 to-orange-600/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                <Key className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white" data-testid="api-settings-title">交易所API设置</h2>
                <p className="text-yellow-200 text-xs sm:text-sm">连接交易所，让Bot自动帮您交易</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white" data-testid="close-api-settings">
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-3 sm:p-4 bg-green-500/10 border-b border-green-500/20">
          <div className="flex items-center">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-2 sm:mr-3 flex-shrink-0" />
            <p className="text-green-300 text-xs sm:text-sm">
              <strong>安全保障：</strong>资金始终在您的交易所账户，Bot只有交易权限（无提币权限）。
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Markets Grid */}
          <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">选择交易市场</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
            {markets.map((market) => {
              const isConnected = savedApis[market.id]?.connected;
              return (
                <button
                  key={market.id}
                  onClick={() => setSelectedMarket(market)}
                  className={`p-3 sm:p-4 rounded-xl border transition-all text-left relative ${
                    selectedMarket?.id === market.id ? 'border-yellow-400 bg-yellow-500/10'
                    : isConnected ? 'border-green-500/50 bg-green-500/5'
                    : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                  data-testid={`market-${market.id}`}
                >
                  {isConnected && (
                    <div className="absolute top-2 right-2"><CheckCircle className="w-4 h-4 text-green-400" /></div>
                  )}
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{market.icon}</div>
                  <h4 className="text-white font-semibold text-xs sm:text-sm">{market.name}</h4>
                  <p className="text-gray-500 text-xs mt-1 hidden sm:block">{market.description}</p>
                </button>
              );
            })}
          </div>

          {/* Selected Market */}
          {selectedMarket && (
            <div className="space-y-4">
              {/* Exchange Registration Links */}
              {currentExchanges.length > 0 && (
                <div className="bg-white/5 rounded-xl p-4 sm:p-5 border border-white/10">
                  <h4 className="text-white font-bold text-sm sm:text-base mb-3 flex items-center">
                    <Download className="w-4 h-4 text-cyan-400 mr-2" />
                    还没有{selectedMarket.name}交易账户？前往正规平台开户
                  </h4>
                  <div className="space-y-2">
                    {currentExchanges.map((ex) => (
                      <div key={ex.name} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                        <div>
                          <p className="text-white font-semibold text-sm">{ex.name}</p>
                          <p className="text-gray-400 text-xs">{ex.desc}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <a
                            href={ex.register}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 text-xs font-semibold rounded-lg transition-all flex items-center"
                            data-testid={`register-${ex.name.toLowerCase().replace(/\s/g, '-')}`}
                          >
                            开户注册
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                          <a
                            href={ex.app}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 text-xs font-semibold rounded-lg transition-all flex items-center"
                            data-testid={`download-${ex.name.toLowerCase().replace(/\s/g, '-')}`}
                          >
                            下载APP
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* API Key Form */}
              <div className="bg-white/5 rounded-xl p-4 sm:p-6 border border-white/10">
                <div className="flex items-center mb-4">
                  <span className="text-2xl sm:text-3xl mr-3">{selectedMarket.icon}</span>
                  <div>
                    <h4 className="text-white font-bold text-base sm:text-lg">{selectedMarket.name} API设置</h4>
                    <p className="text-gray-400 text-xs sm:text-sm">在交易所后台获取API Key后填写在这里</p>
                  </div>
                </div>

                {savedApis[selectedMarket.id]?.connected ? (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                      <p className="text-green-300 font-semibold text-sm">已连接 — Bot 正在此市场自动交易</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 sm:space-y-4 mb-4">
                      <div>
                        <label className="block text-gray-300 text-xs sm:text-sm mb-1">API Key</label>
                        <input
                          type="text"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder={`输入${selectedMarket.name} API Key`}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/30 border border-white/20 rounded-lg text-white text-sm placeholder-gray-500 focus:border-yellow-400 focus:outline-none"
                          data-testid="api-key-input"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-xs sm:text-sm mb-1">API Secret</label>
                        <div className="relative">
                          <input
                            type={showSecret ? 'text' : 'password'}
                            value={apiSecret}
                            onChange={(e) => setApiSecret(e.target.value)}
                            placeholder="输入 API Secret"
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/30 border border-white/20 rounded-lg text-white text-sm placeholder-gray-500 focus:border-yellow-400 focus:outline-none pr-12"
                            data-testid="api-secret-input"
                          />
                          <button onClick={() => setShowSecret(!showSecret)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                            {showSecret ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-4">
                      <div className="flex items-start">
                        <AlertTriangle className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-yellow-300 text-xs">
                          请确保API仅开启<strong>交易权限</strong>，不要开启提币权限。
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleSave}
                      disabled={saving || !apiKey}
                      className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 text-black font-bold rounded-lg transition-all flex items-center justify-center text-sm sm:text-base"
                      data-testid="save-api-btn"
                    >
                      <Key className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      {saving ? '保存中...' : '保存并启动交易'}
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VIPApiSettings;
