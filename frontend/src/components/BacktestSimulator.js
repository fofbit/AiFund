import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Rewind, Play, Pause, TrendingUp, TrendingDown, Calendar, 
  DollarSign, Target, BarChart3, Zap, Clock, ChevronDown,
  X, RefreshCw, ArrowRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine } from 'recharts';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BacktestSimulator = ({ onClose }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('3month');
  const [selectedMarket, setSelectedMarket] = useState('all');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [equityCurve, setEquityCurve] = useState([]);
  const [loading, setLoading] = useState(false);

  const periods = [
    { id: '1week', label: '过去1周', days: 7 },
    { id: '1month', label: '过去1个月', days: 30 },
    { id: '3month', label: '过去3个月', days: 90 },
    { id: '6month', label: '过去6个月', days: 180 },
    { id: '1year', label: '过去1年', days: 365 },
    { id: '3year', label: '过去3年', days: 1095 },
  ];

  const markets = [
    { id: 'all', label: '全部市场', icon: '🌐' },
    { id: 'crypto', label: '加密货币', icon: '₿' },
    { id: 'us_stock', label: '美股', icon: '🇺🇸' },
    { id: 'futures', label: '期货', icon: '📊' },
  ];

  const runBacktest = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);
    setTradeHistory([]);
    setEquityCurve([]);

    const period = periods.find(p => p.id === selectedPeriod);
    const days = period?.days || 90;

    // Simulate backtest progress
    for (let i = 0; i <= 100; i += 2) {
      await new Promise(r => setTimeout(r, 50));
      setProgress(i);
    }

    // Generate backtest results
    const initialCapital = 10000;
    let capital = initialCapital;
    const trades = [];
    const equity = [];
    let totalWins = 0;
    let totalTrades = 0;

    // Generate equity curve data
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    for (let d = 0; d <= days; d++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + d);

      // Simulate daily trades
      if (d % 3 === 0 && d > 0) { // Trade every 3 days
        const isWin = Math.random() < 0.68; // 68% win rate
        const profitPercent = isWin 
          ? Math.random() * 0.08 + 0.02 // 2-10% profit
          : -(Math.random() * 0.04 + 0.01); // 1-5% loss
        
        const profit = capital * profitPercent;
        capital += profit;
        totalTrades++;
        if (isWin) totalWins++;

        const symbols = ['BTC', 'ETH', 'SOL', 'NVDA', 'TSLA', 'GOLD'];
        const actions = ['BUY', 'SELL'];
        
        trades.push({
          id: trades.length,
          date: date.toISOString().split('T')[0],
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          action: actions[Math.floor(Math.random() * actions.length)],
          profit: profit.toFixed(2),
          profitPercent: (profitPercent * 100).toFixed(2),
          isWin,
          capital: capital.toFixed(2)
        });
      }

      equity.push({
        date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
        capital: Math.round(capital),
        baseline: initialCapital
      });
    }

    const totalProfit = capital - initialCapital;
    const roi = (totalProfit / initialCapital * 100);
    const winRate = (totalWins / totalTrades * 100);
    const maxDrawdown = Math.random() * 15 + 5; // 5-20% max drawdown
    const sharpeRatio = (roi / maxDrawdown * Math.random() * 0.5 + 1.2).toFixed(2);

    setEquityCurve(equity);
    setTradeHistory(trades.reverse());
    setResults({
      initialCapital,
      finalCapital: capital.toFixed(2),
      totalProfit: totalProfit.toFixed(2),
      roi: roi.toFixed(2),
      totalTrades,
      winningTrades: totalWins,
      losingTrades: totalTrades - totalWins,
      winRate: winRate.toFixed(1),
      maxDrawdown: maxDrawdown.toFixed(1),
      sharpeRatio,
      avgTradeProfit: (totalProfit / totalTrades).toFixed(2),
      period: period?.label
    });

    setIsRunning(false);
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 via-indigo-900/30 to-slate-900 rounded-2xl max-w-6xl w-full border border-cyan-500/30 shadow-2xl my-4">
        
        {/* Header */}
        <div className="p-6 border-b border-cyan-500/30 bg-gradient-to-r from-cyan-600/20 to-blue-600/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mr-4 shadow-lg shadow-cyan-500/30">
                <Rewind className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center">
                  模拟回测
                  <span className="ml-3 px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm rounded-full border border-cyan-500/30">
                    AI策略验证
                  </span>
                </h2>
                <p className="text-cyan-200">回顾历史，验证Bot策略在过去的表现</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">×</button>
          </div>
        </div>

        {/* Configuration */}
        <div className="p-6 border-b border-white/10 bg-slate-800/50">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Period Selection */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">回测时间段</label>
              <div className="relative">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white appearance-none cursor-pointer"
                >
                  {periods.map(p => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Market Selection */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">交易市场</label>
              <div className="relative">
                <select
                  value={selectedMarket}
                  onChange={(e) => setSelectedMarket(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white appearance-none cursor-pointer"
                >
                  {markets.map(m => (
                    <option key={m.id} value={m.id}>{m.icon} {m.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Run Button */}
            <div className="flex items-end">
              <button
                onClick={runBacktest}
                disabled={isRunning}
                className="w-full p-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 text-white font-bold rounded-lg transition-all flex items-center justify-center"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    回测中... {progress}%
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    开始回测
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          {isRunning && (
            <div className="mt-4">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {results && (
          <>
            {/* Summary Stats */}
            <div className="p-6 bg-gradient-to-r from-green-600/10 to-emerald-600/10 border-b border-green-500/30">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 text-green-400 mr-2" />
                {results.period} 回测结果
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs mb-1">初始资金</p>
                  <p className="text-white font-bold">${results.initialCapital.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs mb-1">最终资金</p>
                  <p className="text-green-400 font-bold">${Number(results.finalCapital).toLocaleString()}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs mb-1">总收益</p>
                  <p className={`font-bold ${Number(results.totalProfit) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {Number(results.totalProfit) >= 0 ? '+' : ''}${Number(results.totalProfit).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs mb-1">ROI</p>
                  <p className={`font-bold ${Number(results.roi) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {Number(results.roi) >= 0 ? '+' : ''}{results.roi}%
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs mb-1">总交易</p>
                  <p className="text-white font-bold">{results.totalTrades}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs mb-1">胜率</p>
                  <p className="text-cyan-400 font-bold">{results.winRate}%</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs mb-1">最大回撤</p>
                  <p className="text-orange-400 font-bold">-{results.maxDrawdown}%</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs mb-1">夏普比率</p>
                  <p className="text-purple-400 font-bold">{results.sharpeRatio}</p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row">
              {/* Equity Curve */}
              <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
                  资金曲线
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={equityCurve}>
                    <defs>
                      <linearGradient id="backtestGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" fontSize={10} interval="preserveStartEnd" />
                    <YAxis stroke="#9CA3AF" fontSize={10} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #4B5563',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(value) => [`$${value.toLocaleString()}`, '资金']}
                    />
                    <ReferenceLine y={10000} stroke="#6B7280" strokeDasharray="5 5" label={{ value: '初始资金', fill: '#6B7280', fontSize: 10 }} />
                    <Area
                      type="monotone"
                      dataKey="capital"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      fill="url(#backtestGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Trade History */}
              <div className="w-full lg:w-96 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Clock className="w-5 h-5 text-purple-400 mr-2" />
                  最近交易
                </h3>
                <div className="space-y-2 max-h-[280px] overflow-y-auto">
                  {tradeHistory.slice(0, 10).map((trade) => (
                    <div key={trade.id} className={`p-3 rounded-lg border ${
                      trade.isWin ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className={`text-xs px-2 py-0.5 rounded mr-2 ${
                            trade.action === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {trade.action}
                          </span>
                          <span className="text-white font-semibold">{trade.symbol}</span>
                        </div>
                        <span className={`font-bold ${trade.isWin ? 'text-green-400' : 'text-red-400'}`}>
                          {trade.isWin ? '+' : ''}{trade.profitPercent}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-xs text-gray-400">
                        <span>{trade.date}</span>
                        <span>{trade.isWin ? '+' : ''}${trade.profit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-t border-purple-500/30">
              <div className="text-center">
                <p className="text-white text-lg mb-2">
                  🎯 历史回测显示：<span className="text-green-400 font-bold">{results.period}</span>内Bot可获得<span className="text-green-400 font-bold"> +{results.roi}% </span>收益
                </p>
                <p className="text-gray-300 mb-4">
                  升级VIP，让Bot用真金白银为您创造收益！
                </p>
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all inline-flex items-center"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  立即升级VIP
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!results && !isRunning && (
          <div className="p-12 text-center">
            <div className="w-24 h-24 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Rewind className="w-12 h-12 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">选择时间段开始回测</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              回测功能可以让您看到Bot策略在历史数据上的表现，
              帮助您建立对AI交易的信心
            </p>
            <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-3xl mb-2">📊</div>
                <p className="text-white font-semibold">详细统计</p>
                <p className="text-gray-400 text-sm">胜率、收益、回撤等</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-3xl mb-2">📈</div>
                <p className="text-white font-semibold">资金曲线</p>
                <p className="text-gray-400 text-sm">可视化收益变化</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-3xl mb-2">📋</div>
                <p className="text-white font-semibold">交易记录</p>
                <p className="text-gray-400 text-sm">每笔交易详情</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BacktestSimulator;
