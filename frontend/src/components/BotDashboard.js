import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Zap, Award, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BotDashboard = ({ botData, userData, onRefresh }) => {
  const { bot, recent_trades } = botData;
  const [profitData, setProfitData] = useState([]);

  useEffect(() => {
    // Generate mock profit data for chart
    const mockData = [];
    const startBalance = 10000;
    const currentProfit = bot.total_profit || 0;
    const days = 7;
    
    for (let i = 0; i <= days; i++) {
      mockData.push({
        day: `Day ${i}`,
        profit: startBalance + (currentProfit / days) * i
      });
    }
    setProfitData(mockData);
  }, [bot]);

  const profitPercent = ((bot.total_profit / 10000) * 100).toFixed(2);
  const isProfit = bot.total_profit >= 0;

  const getAvatarEmoji = (avatar) => {
    const avatars = {
      'default_bot_1': '🤖',
      'default_bot_2': '🦾',
      'default_bot_3': '👾',
      'default_bot_4': '🚀',
      'default_bot_5': '💎',
    };
    return avatars[avatar] || '🤖';
  };

  return (
    <div className="space-y-6">
      {/* Bot Header Card */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 border border-purple-400 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="text-6xl mr-4">{getAvatarEmoji(bot.avatar)}</div>
            <div>
              <h2 className="text-3xl font-bold text-white">{bot.name}</h2>
              <div className="flex items-center mt-1">
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full text-white">
                  Level {bot.level}
                </span>
                <span className="text-sm text-white/80 ml-3">
                  {bot.experience} XP
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/80">状态</div>
            <div className="flex items-center">
              <Activity className="w-4 h-4 text-green-400 mr-1 animate-pulse" />
              <span className="text-white font-semibold">活跃中</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
            <div className="text-white/70 text-sm mb-1">虚拟余额</div>
            <div className="text-2xl font-bold text-white">
              ${bot.virtual_balance.toLocaleString()}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
            <div className="text-white/70 text-sm mb-1">总收益</div>
            <div className={`text-2xl font-bold ${isProfit ? 'text-green-300' : 'text-red-300'}`}>
              {isProfit ? '+' : ''}${bot.total_profit.toFixed(2)}
            </div>
            <div className={`text-sm ${isProfit ? 'text-green-300' : 'text-red-300'}`}>
              {isProfit ? '+' : ''}{profitPercent}%
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
            <div className="text-white/70 text-sm mb-1">交易次数</div>
            <div className="text-2xl font-bold text-white">{bot.total_trades}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
            <div className="text-white/70 text-sm mb-1">胜率</div>
            <div className="text-2xl font-bold text-white">{bot.win_rate.toFixed(1)}%</div>
          </div>
        </div>
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
          收益曲线
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={profitData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="day" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #4B5563',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ fill: '#10B981', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Trades */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">最近交易</h3>
        {recent_trades && recent_trades.length > 0 ? (
          <div className="space-y-3">
            {recent_trades.map((trade, index) => (
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
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 border border-purple-400">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">升级到VIP</h3>
              <p className="text-white/80 mb-1">解锁API自动交易，让Bot用真金白银赚钱！</p>
              <p className="text-white/60 text-sm">充值 ≥$100 等值加密货币自动升级</p>
            </div>
            <div className="text-white text-5xl">🚀</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BotDashboard;
