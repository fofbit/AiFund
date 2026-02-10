import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown, Activity, Zap, Award, Clock, MessageCircle, Crown, Share2, BarChart3, Target, Brain, Flame } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import BotChatInterface from './BotChatInterface';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BotDashboard = ({ botData, userData, onRefresh, onShowVIP, onShareAchievement }) => {
  const { bot, recent_trades } = botData;
  const [profitData, setProfitData] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [demoStats, setDemoStats] = useState(null);
  const [marketAnalysis, setMarketAnalysis] = useState(null);
  const [demoTrades, setDemoTrades] = useState([]);

  useEffect(() => {
    loadDemoData();
  }, [bot]);

  const loadDemoData = async () => {
    try {
      // Load demo stats
      const [statsRes, marketRes, chartRes, tradesRes] = await Promise.all([
        axios.get(`${API}/demo/bot-stats`),
        axios.get(`${API}/demo/market-analysis`),
        axios.get(`${API}/demo/profit-chart?days=30`),
        axios.get(`${API}/demo/trades/${bot.id}?num_trades=10`)
      ]);
      
      setDemoStats(statsRes.data.stats);
      setMarketAnalysis(marketRes.data.analysis);
      setProfitData(chartRes.data.chart_data);
      setDemoTrades(tradesRes.data.trades);
    } catch (error) {
      console.error('Error loading demo data:', error);
      // Fallback to basic chart data
      const mockData = [];
      const startBalance = 10000;
      for (let i = 0; i <= 30; i++) {
        mockData.push({
          date: `${i}`,
          balance: startBalance + Math.random() * 2000,
          profit: Math.random() * 2000
        });
      }
      setProfitData(mockData);
    }
  };

  const displayStats = demoStats || {
    total_trades: bot.total_trades || 0,
    win_rate: bot.win_rate || 0,
    total_profit: bot.total_profit || 0,
    roi_percentage: ((bot.total_profit || 0) / 100).toFixed(2)
  };

  const displayTrades = demoTrades.length > 0 ? demoTrades : recent_trades;

  const profitPercent = displayStats.roi_percentage;
  const isProfit = displayStats.total_profit >= 0;

  // Use avatar_emoji from bot data, fallback to default
  const botEmoji = bot.avatar_emoji || '🤖';

  return (
    <div className="space-y-6">
      {/* Bot Header Card */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-4 sm:p-6 border border-purple-400 shadow-2xl">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center">
            <div className="text-4xl sm:text-6xl mr-3 sm:mr-4">{botEmoji}</div>
            <div>
              <h2 className="text-xl sm:text-3xl font-bold text-white">{bot.name}</h2>
              <div className="flex items-center mt-1">
                <span className="text-xs sm:text-sm bg-white/20 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-white">Lv {bot.level}</span>
                <span className="text-xs sm:text-sm text-white/80 ml-2">{bot.experience} XP</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center">
              <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 mr-1 animate-pulse" />
              <span className="text-white font-semibold text-xs sm:text-sm">Active</span>
            </div>
          </div>
        </div>

        {/* Stats Grid - 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-3 sm:mb-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-2 sm:p-4">
            <div className="text-white/70 text-xs mb-0.5">Balance</div>
            <div className="text-base sm:text-2xl font-bold text-white">
              ${(bot.virtual_balance + (displayStats.total_profit || 0)).toLocaleString(undefined, {maximumFractionDigits: 0})}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-2 sm:p-4">
            <div className="text-white/70 text-xs mb-0.5">Profit</div>
            <div className={`text-base sm:text-2xl font-bold ${isProfit ? 'text-green-300' : 'text-red-300'}`}>
              {isProfit ? '+' : ''}${displayStats.total_profit?.toFixed(0) || '0'}
            </div>
            <div className={`text-xs ${isProfit ? 'text-green-300' : 'text-red-300'}`}>
              {isProfit ? '+' : ''}{profitPercent}%
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-2 sm:p-4">
            <div className="text-white/70 text-xs mb-0.5">Trades</div>
            <div className="text-base sm:text-2xl font-bold text-white">{displayStats.total_trades || 0}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-2 sm:p-4">
            <div className="text-white/70 text-xs mb-0.5">Win Rate</div>
            <div className="text-base sm:text-2xl font-bold text-white">{displayStats.win_rate?.toFixed(1) || '0.0'}%</div>
          </div>
        </div>

        {/* Chat Button */}
        <button
          onClick={() => setShowChat(true)}
          className="w-full p-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg flex items-center justify-center text-white font-semibold transition-all"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          查看交易对话与复盘
        </button>
      </div>

      {/* Abilities Section */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="flex items-center mb-4">
          <Zap className="w-6 h-6 text-yellow-400 mr-2" />
          <h3 className="text-xl font-bold text-white">Bot 技能</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {bot.abilities && bot.abilities.map((ability, index) => (
            <div
              key={index}
              className="px-4 py-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50 rounded-full text-white font-semibold flex items-center"
            >
              <Award className="w-4 h-4 mr-2 text-yellow-400" />
              {ability}
            </div>
          ))}
          <div className="px-4 py-2 bg-gray-700/50 border border-gray-500/50 rounded-full text-gray-400 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            更多技能解锁中...
          </div>
        </div>
        <p className="text-gray-400 text-sm mt-4">
          💡 你的Bot会自动学习新技能并通知你！
        </p>
      </div>

      {/* Profit Chart */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 text-green-400 mr-2" />
          30天收益曲线
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={profitData}>
            <defs>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #4B5563',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value) => [`$${value.toLocaleString()}`, '余额']}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#profitGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Market Analysis Panel */}
      {marketAnalysis && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-cyan-500/30">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Brain className="w-6 h-6 text-cyan-400 mr-2" />
            AI市场分析
          </h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">BTC</span>
                <span className={`font-bold ${marketAnalysis.btc_24h_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {marketAnalysis.btc_24h_change >= 0 ? '+' : ''}{marketAnalysis.btc_24h_change}%
                </span>
              </div>
              <p className="text-2xl font-bold text-white">${marketAnalysis.btc_price.toLocaleString()}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">ETH</span>
                <span className={`font-bold ${marketAnalysis.eth_24h_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {marketAnalysis.eth_24h_change >= 0 ? '+' : ''}{marketAnalysis.eth_24h_change}%
                </span>
              </div>
              <p className="text-2xl font-bold text-white">${marketAnalysis.eth_price.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">恐惧贪婪指数</span>
              <span className={`font-bold px-3 py-1 rounded-full text-sm ${
                marketAnalysis.fear_greed_index < 30 ? 'bg-red-500/20 text-red-400' :
                marketAnalysis.fear_greed_index < 50 ? 'bg-orange-500/20 text-orange-400' :
                marketAnalysis.fear_greed_index < 70 ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {marketAnalysis.fear_greed_index} - {marketAnalysis.sentiment}
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${
                  marketAnalysis.fear_greed_index < 30 ? 'bg-red-500' :
                  marketAnalysis.fear_greed_index < 50 ? 'bg-orange-500' :
                  marketAnalysis.fear_greed_index < 70 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${marketAnalysis.fear_greed_index}%` }}
              />
            </div>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
            <p className="text-cyan-300 flex items-start">
              <Target className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span><strong>AI建议:</strong> {marketAnalysis.recommendation}</span>
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-gray-400 text-sm">热门叙事:</span>
            {marketAnalysis.hot_narratives.map((narrative, i) => (
              <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full flex items-center">
                <Flame className="w-3 h-3 mr-1" />
                {narrative}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent Trades */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">最近交易</h3>
        {displayTrades && displayTrades.length > 0 ? (
          <div className="space-y-3">
            {displayTrades.slice(0, 8).map((trade, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-purple-400/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {trade.action === 'buy' ? (
                      <TrendingUp className="w-5 h-5 text-green-400 mr-3" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-400 mr-3" />
                    )}
                    <div>
                      <div className="text-white font-semibold">
                        {trade.action === 'buy' ? '买入' : '卖出'} {trade.symbol}
                      </div>
                      <div className="text-gray-400 text-sm">{trade.reason}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">
                      ${trade.price.toLocaleString()}
                    </div>
                    <div className={`text-sm ${trade.profit_loss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {trade.profit_loss >= 0 ? '+' : ''}${trade.profit_loss.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Bot即将开始交易...</p>
            <p className="text-sm mt-2">AI正在分析市场，请稍候</p>
          </div>
        )}
      </div>

      {/* VIP Upgrade CTA */}
      {userData?.user?.tier !== 'vip' && (
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl p-6 border-2 border-yellow-400 shadow-lg shadow-yellow-500/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Crown className="w-8 h-8 text-white mr-2" />
                <h3 className="text-2xl font-bold text-white">升级到VIP</h3>
              </div>
              <p className="text-white/90 mb-1">解锁API自动交易，让Bot用真金白银赚钱！</p>
              <div className="flex items-center space-x-4 text-sm text-white/80">
                <span>✓ 10%利润分成</span>
                <span>✓ 亏损不收费</span>
                <span>✓ 资金安全</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-white text-5xl mb-2">🚀</div>
              <button
                onClick={onShowVIP}
                className="px-6 py-3 bg-white hover:bg-gray-100 text-orange-600 font-bold rounded-lg transition-all shadow-lg"
                data-testid="vip-upgrade-cta-btn"
              >
                立即升级 99U
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Achievement Button */}
      {userData?.user?.tier === 'vip' && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 border border-purple-400">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                <Crown className="w-6 h-6 text-yellow-400 mr-2" />
                您已是VIP会员
              </h3>
              <p className="text-white/80">分享您的成就，让朋友也来体验AI交易!</p>
            </div>
            <button
              onClick={() => onShareAchievement && onShareAchievement({
                type: 'profit_milestone',
                botName: bot.name,
                botEmoji: botEmoji,
                botLevel: bot.level,
                amount: bot.total_profit,
                roi: ((bot.total_profit / 10000) * 100).toFixed(2)
              })}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg transition-all flex items-center"
              data-testid="share-achievement-btn"
            >
              <Share2 className="w-5 h-5 mr-2" />
              分享成就
            </button>
          </div>
        </div>
      )}

      {/* Bot Chat Interface */}
      {showChat && (
        <BotChatInterface 
          botData={botData}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
};

export default BotDashboard;
