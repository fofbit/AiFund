import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Crown, TrendingUp, TrendingDown, Clock, Target, Zap, 
  AlertCircle, CheckCircle, DollarSign, ArrowRight, 
  RefreshCw, Play, Pause, Settings, ExternalLink, BookOpen
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const VIPTradingCommands = ({ onClose, onConnectAPI }) => {
  const [commands, setCommands] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [supportedMarkets, setSupportedMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [showMarketSelector, setShowMarketSelector] = useState(false);
  const timelineRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isPlaying && commands.length > 0 && currentIndex < commands.length) {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => Math.min(prev + 1, commands.length));
        scrollToBottom();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentIndex, commands.length]);

  const loadData = async () => {
    try {
      const [commandsRes, marketsRes] = await Promise.all([
        axios.get(`${API}/vip/trading-commands?days=7&initial_capital=10000`),
        axios.get(`${API}/vip/supported-markets`)
      ]);
      
      setCommands(commandsRes.data.commands);
      setSummary(commandsRes.data.summary);
      setSupportedMarkets(marketsRes.data.markets);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error loading VIP data:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    if (timelineRef.current) {
      timelineRef.current.scrollTop = timelineRef.current.scrollHeight;
    }
  };

  const formatPrice = (price) => {
    if (price < 0.01) return price.toFixed(8);
    if (price < 1) return price.toFixed(6);
    return price.toLocaleString();
  };

  const visibleCommands = commands.slice(0, currentIndex);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">加载Bot交易指令...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 rounded-2xl max-w-6xl w-full h-[90vh] flex flex-col border border-yellow-500/30 shadow-2xl shadow-yellow-500/10">
        
        {/* Header */}
        <div className="p-6 border-b border-yellow-500/30 bg-gradient-to-r from-yellow-600/20 to-orange-600/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4 shadow-lg shadow-yellow-500/30">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center">
                  VIP Bot 交易指令
                  <span className="ml-3 px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full border border-green-500/30">
                    实时模拟
                  </span>
                </h2>
                <p className="text-yellow-200">如果100%遵循Bot指令，您将获得以下收益</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">×</button>
          </div>
        </div>

        {/* Summary Stats */}
        {summary && (
          <div className="p-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-b border-green-500/30">
            <div className="grid grid-cols-6 gap-4">
              <div className="text-center">
                <p className="text-gray-400 text-xs mb-1">初始资金</p>
                <p className="text-white text-lg font-bold">${summary.initial_capital.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-xs mb-1">最终价值</p>
                <p className="text-green-400 text-lg font-bold">${summary.final_capital.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-xs mb-1">总收益</p>
                <p className="text-green-400 text-lg font-bold">+${summary.total_profit.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-xs mb-1">您净得(扣10%)</p>
                <p className="text-yellow-400 text-lg font-bold">${summary.user_net_profit.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-xs mb-1">胜率</p>
                <p className="text-white text-lg font-bold">{summary.win_rate}%</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-xs mb-1">净ROI</p>
                <p className="text-green-400 text-lg font-bold">+{summary.user_net_roi}%</p>
              </div>
            </div>
            <div className="mt-3 text-center">
              <p className="text-yellow-300 text-sm">
                💰 平台仅收取盈利的10%: <span className="font-bold">${summary.platform_fee_10_percent}</span> → {summary.platform_wallet}
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Timeline */}
          <div className="flex-1 flex flex-col">
            {/* Controls */}
            <div className="p-3 border-b border-white/10 flex items-center justify-between bg-slate-800/50">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                >
                  {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
                </button>
                <button
                  onClick={() => { setCurrentIndex(0); loadData(); }}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                >
                  <RefreshCw className="w-5 h-5 text-white" />
                </button>
                <span className="text-gray-400 text-sm">
                  {currentIndex} / {commands.length} 指令
                </span>
              </div>
              <div className="flex-1 mx-4">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all"
                    style={{ width: `${(currentIndex / commands.length) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-gray-400 text-sm">过去7天</span>
            </div>

            {/* Commands Timeline */}
            <div ref={timelineRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {visibleCommands.map((item, index) => (
                <div key={item.id} className="animate-fadeIn">
                  {item.type === 'command' ? (
                    <div className={`p-4 rounded-xl border ${
                      item.action === 'BUY' 
                        ? 'bg-green-600/10 border-green-500/30' 
                        : 'bg-red-600/10 border-red-500/30'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                            item.action === 'BUY' ? 'bg-green-500/20' : 'bg-red-500/20'
                          }`}>
                            {item.action === 'BUY' 
                              ? <TrendingUp className="w-5 h-5 text-green-400" />
                              : <TrendingDown className="w-5 h-5 text-red-400" />
                            }
                          </div>
                          <div>
                            <div className="flex items-center mb-1">
                              <span className={`font-bold text-lg ${
                                item.action === 'BUY' ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {item.action}
                              </span>
                              <span className="text-white font-semibold ml-2">{item.symbol}</span>
                              <span className="ml-2 px-2 py-0.5 bg-white/10 rounded text-xs text-gray-300">
                                置信度 {item.confidence}%
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm mb-2">{item.reason}</p>
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="text-gray-400">
                                价格: <span className="text-white">${formatPrice(item.price)}</span>
                              </span>
                              <span className="text-gray-400">
                                数量: <span className="text-white">{item.quantity.toFixed(4)}</span>
                              </span>
                              <span className="text-gray-400">
                                金额: <span className="text-white">${item.amount_usd}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(item.timestamp).toLocaleString('zh-CN')}
                          </span>
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded mt-1 inline-block">
                            ✓ 已执行
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`p-4 rounded-xl border ml-8 ${
                      item.is_profit 
                        ? 'bg-emerald-600/10 border-emerald-500/30' 
                        : 'bg-orange-600/10 border-orange-500/30'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            item.is_profit ? 'bg-emerald-500/20' : 'bg-orange-500/20'
                          }`}>
                            {item.is_profit 
                              ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                              : <AlertCircle className="w-4 h-4 text-orange-400" />
                            }
                          </div>
                          <div>
                            <span className={`font-bold ${item.is_profit ? 'text-emerald-400' : 'text-orange-400'}`}>
                              {item.is_profit ? '✅ 盈利' : '⚠️ 小亏'}
                            </span>
                            <span className={`ml-2 text-lg font-bold ${item.is_profit ? 'text-emerald-400' : 'text-orange-400'}`}>
                              {item.is_profit ? '+' : ''}${item.profit_usd.toFixed(2)}
                            </span>
                            <span className="text-gray-400 text-sm ml-2">
                              ({item.profit_percent > 0 ? '+' : ''}{item.profit_percent}%)
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-sm">累计收益</p>
                          <p className="text-green-400 font-bold">+${item.cumulative_profit.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {currentIndex >= commands.length && (
                <div className="p-6 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-xl border border-yellow-500/50 text-center animate-fadeIn">
                  <div className="text-4xl mb-3">🎉</div>
                  <h3 className="text-2xl font-bold text-white mb-2">7天收益总结</h3>
                  <p className="text-yellow-300 text-lg mb-4">
                    如果您100%遵循Bot指令，${summary?.initial_capital.toLocaleString()} → 
                    <span className="font-bold text-green-400"> ${summary?.final_capital.toLocaleString()}</span>
                  </p>
                  <p className="text-gray-300 mb-4">
                    扣除10%平台费后，您净赚: <span className="text-yellow-400 font-bold text-xl">${summary?.user_net_profit.toLocaleString()}</span>
                  </p>
                  <button
                    onClick={() => setShowMarketSelector(true)}
                    className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-lg rounded-xl transition-all shadow-lg shadow-yellow-500/30"
                  >
                    <Zap className="w-5 h-5 inline mr-2" />
                    立即连接API，躺平赚钱
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Markets */}
          <div className="w-80 border-l border-white/10 bg-slate-800/50 flex flex-col">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-white font-bold flex items-center">
                <Settings className="w-5 h-5 text-purple-400 mr-2" />
                支持的市场
              </h3>
              <p className="text-gray-400 text-sm mt-1">选择您想让Bot交易的市场</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {supportedMarkets.map((market) => (
                <div 
                  key={market.id}
                  onClick={() => setSelectedMarket(market)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedMarket?.id === market.id
                      ? 'bg-purple-600/20 border-purple-500/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{market.icon}</span>
                    <span className="text-white font-semibold">{market.name}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{market.description}</p>
                  <p className="text-gray-500 text-xs">
                    最低资金: ${market.min_capital}
                  </p>
                  {selectedMarket?.id === market.id && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-gray-400 text-xs mb-2">支持的交易所/券商:</p>
                      <div className="flex flex-wrap gap-1">
                        {market.exchanges.map((ex, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white/10 rounded text-xs text-gray-300">
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/10 bg-slate-900/50">
              <button
                onClick={() => setShowMarketSelector(true)}
                disabled={!selectedMarket}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                连接 {selectedMarket?.name || '选择市场'} API
              </button>
              <button className="w-full mt-2 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-all flex items-center justify-center text-sm">
                <BookOpen className="w-4 h-4 mr-2" />
                查看开户教程
              </button>
            </div>
          </div>
        </div>

        {/* Market Selector Modal */}
        {showMarketSelector && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-purple-500/30">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Zap className="w-6 h-6 text-yellow-400 mr-2" />
                连接交易所API
              </h3>
              
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                <p className="text-yellow-300 text-sm">
                  <strong>提示:</strong> 您需要先在相应的交易所/券商开户，获取API密钥后才能连接。
                  我们会提供详细的开户教程和API配置指南。
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">选择市场</label>
                  <select className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white">
                    {supportedMarkets.map(m => (
                      <option key={m.id} value={m.id}>{m.icon} {m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">API Key</label>
                  <input 
                    type="text"
                    placeholder="输入您的API Key"
                    className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">API Secret</label>
                  <input 
                    type="password"
                    placeholder="输入您的API Secret"
                    className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowMarketSelector(false)}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    alert('🚀 API连接功能即将上线！我们会提供详细的开户和配置教程。');
                    setShowMarketSelector(false);
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold rounded-lg transition-all"
                >
                  连接API
                </button>
              </div>

              <p className="text-center text-gray-500 text-sm mt-4">
                还没有账户？ <span className="text-purple-400 cursor-pointer hover:underline">查看开户教程</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VIPTradingCommands;
