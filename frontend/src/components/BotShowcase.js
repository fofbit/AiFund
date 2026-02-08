import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Trophy, Star, Zap, TrendingUp, Crown, Share2, ChevronRight, Award, Gem, Target, Flame } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Monopoly-style level progression data
const BOT_LEVELS = [
  { level: 1, title: '新手学徒', icon: '🐣', color: 'from-gray-400 to-gray-500', minProfit: 0, reward: '基础现货交易', desc: '你的Bot刚刚诞生，正在学习市场基础知识' },
  { level: 2, title: '市场观察者', icon: '👁️', color: 'from-blue-400 to-blue-500', minProfit: 100, reward: '技术分析能力', desc: 'Bot学会了看K线图和基本技术指标' },
  { level: 3, title: '策略新星', icon: '⭐', color: 'from-cyan-400 to-cyan-500', minProfit: 500, reward: '多币种交易', desc: 'Bot可以同时监控多个交易对' },
  { level: 4, title: '利润猎手', icon: '🏹', color: 'from-green-400 to-green-500', minProfit: 1000, reward: '网格交易策略', desc: 'Bot掌握了网格交易，在震荡市场中持续获利' },
  { level: 5, title: '市场行者', icon: '🚶', color: 'from-teal-400 to-emerald-500', minProfit: 2500, reward: '趋势跟踪策略', desc: '能识别主要趋势并顺势交易' },
  { level: 6, title: '赏金猎人', icon: '🤠', color: 'from-yellow-400 to-amber-500', minProfit: 5000, reward: '杠杆交易', desc: 'Bot可以使用杠杆放大收益' },
  { level: 7, title: '交易武士', icon: '⚔️', color: 'from-orange-400 to-red-500', minProfit: 10000, reward: '期货交易', desc: '解锁期货市场，多空双向获利' },
  { level: 8, title: '金融巫师', icon: '🧙', color: 'from-purple-400 to-violet-500', minProfit: 25000, reward: 'AI预测模型', desc: 'Bot使用深度学习预测市场走势' },
  { level: 9, title: '财富大亨', icon: '🎩', color: 'from-yellow-500 to-orange-500', minProfit: 50000, reward: '全市场扫描', desc: '同时扫描加密、股票、期货等所有市场' },
  { level: 10, title: '传奇大师', icon: '👑', color: 'from-yellow-300 to-yellow-500', minProfit: 100000, reward: '定制化AI策略', desc: '拥有独一无二的AI交易策略，市场之王' },
];

const BotShowcase = ({ botData, userData, onClose, onShareAchievement }) => {
  const { bot } = botData;
  const [demoStats, setDemoStats] = useState(null);
  const [activeTab, setActiveTab] = useState('levels');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await axios.get(`${API}/demo/bot-stats`);
      setDemoStats(res.data.stats);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const totalProfit = demoStats?.total_profit || bot?.total_profit || 0;
  const currentLevel = BOT_LEVELS.reduce((acc, lvl) => totalProfit >= lvl.minProfit ? lvl : acc, BOT_LEVELS[0]);
  const nextLevel = BOT_LEVELS.find(l => l.level === currentLevel.level + 1);
  const progressToNext = nextLevel ? Math.min(100, ((totalProfit - currentLevel.minProfit) / (nextLevel.minProfit - currentLevel.minProfit)) * 100) : 100;

  const handleShare = () => {
    if (onShareAchievement) {
      onShareAchievement({
        type: 'bot_level',
        botName: bot.name,
        botEmoji: bot.avatar_emoji || '🤖',
        botLevel: currentLevel.level,
        levelTitle: currentLevel.title,
        levelIcon: currentLevel.icon,
        profit: totalProfit,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-2xl max-w-4xl w-full border border-purple-500/30 shadow-2xl my-8">
        
        {/* Header — Current bot showcase */}
        <div className="p-6 border-b border-purple-500/30 bg-gradient-to-r from-purple-600/20 via-pink-600/10 to-orange-600/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center" data-testid="bot-showcase-title">
              <Trophy className="w-7 h-7 text-yellow-400 mr-2" />
              Bot 成长之路
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white" data-testid="close-bot-showcase">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Current Level Card */}
          <div className={`bg-gradient-to-r ${currentLevel.color} rounded-2xl p-6 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 text-[120px] opacity-20 leading-none">{currentLevel.icon}</div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-5xl mr-4">{currentLevel.icon}</span>
                  <div>
                    <p className="text-white/80 text-sm">Level {currentLevel.level}</p>
                    <h3 className="text-3xl font-bold text-white">{currentLevel.title}</h3>
                  </div>
                </div>
                <p className="text-white/80 text-sm ml-1">{currentLevel.desc}</p>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-sm">总收益</p>
                <p className="text-3xl font-bold text-white">${totalProfit.toLocaleString()}</p>
              </div>
            </div>

            {/* Progress to next level */}
            {nextLevel && (
              <div className="mt-4 relative z-10">
                <div className="flex items-center justify-between text-white/80 text-xs mb-1">
                  <span>距离下一级: {nextLevel.title} {nextLevel.icon}</span>
                  <span>${nextLevel.minProfit.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white/80 rounded-full transition-all duration-1000"
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="mt-4 w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-semibold flex items-center justify-center transition-all border border-white/10"
            data-testid="share-bot-level-btn"
          >
            <Share2 className="w-5 h-5 mr-2" />
            炫耀我的Bot等级
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-purple-500/20">
          {[
            { id: 'levels', label: '升级之路', icon: <Star className="w-4 h-4 mr-1" /> },
            { id: 'achievements', label: '成就徽章', icon: <Award className="w-4 h-4 mr-1" /> },
            { id: 'leaderboard', label: '排行榜', icon: <Trophy className="w-4 h-4 mr-1" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 flex items-center justify-center text-sm font-semibold transition-all ${
                activeTab === tab.id ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'
              }`}
              data-testid={`showcase-tab-${tab.id}`}
            >
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[500px] overflow-y-auto">
          
          {/* Levels Tab - Monopoly-style board */}
          {activeTab === 'levels' && (
            <div className="space-y-3">
              {BOT_LEVELS.map((lvl, idx) => {
                const isReached = totalProfit >= lvl.minProfit;
                const isCurrent = currentLevel.level === lvl.level;
                return (
                  <div
                    key={lvl.level}
                    className={`flex items-center p-4 rounded-xl border transition-all ${
                      isCurrent
                        ? `bg-gradient-to-r ${lvl.color} border-white/30 shadow-lg`
                        : isReached
                        ? 'bg-white/10 border-green-500/30'
                        : 'bg-white/5 border-white/5 opacity-60'
                    }`}
                    data-testid={`level-${lvl.level}`}
                  >
                    <div className="text-4xl mr-4 flex-shrink-0">{lvl.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className={`text-sm font-bold ${isCurrent ? 'text-white' : isReached ? 'text-green-400' : 'text-gray-500'}`}>
                          Lv.{lvl.level}
                        </span>
                        <h4 className={`ml-2 font-bold ${isCurrent ? 'text-white text-lg' : isReached ? 'text-white' : 'text-gray-400'}`}>
                          {lvl.title}
                        </h4>
                        {isCurrent && <span className="ml-2 px-2 py-0.5 bg-white/20 text-white text-xs rounded-full">当前</span>}
                        {isReached && !isCurrent && <span className="ml-2 text-green-400 text-xs">✓ 已达成</span>}
                      </div>
                      <p className={`text-sm mt-1 ${isCurrent ? 'text-white/80' : 'text-gray-400'}`}>{lvl.desc}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className={`text-xs ${isCurrent ? 'text-white/70' : 'text-gray-500'}`}>解锁条件</p>
                      <p className={`font-bold ${isCurrent ? 'text-white' : isReached ? 'text-green-400' : 'text-gray-400'}`}>
                        ${lvl.minProfit.toLocaleString()}
                      </p>
                      <p className={`text-xs mt-1 ${isCurrent ? 'text-yellow-200' : 'text-gray-500'}`}>
                        <Zap className="w-3 h-3 inline mr-0.5" />{lvl.reward}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { id: 'first_trade', icon: '🎯', title: '首笔交易', desc: '完成第一笔交易', earned: true },
                { id: 'profit_100', icon: '💰', title: '百元盈利', desc: '累计盈利超过$100', earned: totalProfit >= 100 },
                { id: 'profit_1000', icon: '💎', title: '千元大师', desc: '累计盈利超过$1000', earned: totalProfit >= 1000 },
                { id: 'win_streak_5', icon: '🔥', title: '五连胜', desc: '连续5笔交易盈利', earned: true },
                { id: 'multi_market', icon: '🌍', title: '全球视野', desc: '在3个以上市场交易', earned: false },
                { id: 'night_owl', icon: '🦉', title: '夜间猎手', desc: 'Bot在凌晨成功交易', earned: true },
                { id: 'diamond_hands', icon: '💎', title: '钻石手', desc: '持仓超过7天盈利', earned: false },
                { id: 'quick_profit', icon: '⚡', title: '闪电盈利', desc: '1小时内盈利超过5%', earned: true },
                { id: 'survivor', icon: '🛡️', title: '熊市幸存', desc: '在下跌市场中保持盈利', earned: false },
              ].map((ach) => (
                <div
                  key={ach.id}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    ach.earned
                      ? 'bg-white/10 border-yellow-500/30 hover:border-yellow-400/50'
                      : 'bg-white/5 border-white/5 opacity-40'
                  }`}
                  data-testid={`achievement-${ach.id}`}
                >
                  <div className="text-4xl mb-2">{ach.icon}</div>
                  <h4 className={`font-bold text-sm ${ach.earned ? 'text-white' : 'text-gray-500'}`}>{ach.title}</h4>
                  <p className={`text-xs mt-1 ${ach.earned ? 'text-gray-300' : 'text-gray-600'}`}>{ach.desc}</p>
                  {ach.earned && <span className="text-yellow-400 text-xs mt-2 inline-block">✓ 已获得</span>}
                </div>
              ))}
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-2">
              {[
                { rank: 1, name: 'Alpha猎手', emoji: '🦅', profit: 156800, level: 10, badge: '👑' },
                { rank: 2, name: '量化之王', emoji: '🤖', profit: 98500, level: 9, badge: '🥈' },
                { rank: 3, name: '暴富小能手', emoji: '🐉', profit: 67200, level: 8, badge: '🥉' },
                { rank: 4, name: '稳健收割者', emoji: '🦊', profit: 45600, level: 8, badge: '' },
                { rank: 5, name: '牛市弄潮儿', emoji: '🐂', profit: 34200, level: 7, badge: '' },
                { rank: 6, name: bot?.name || '我的Bot', emoji: bot?.avatar_emoji || '🤖', profit: totalProfit, level: currentLevel.level, badge: '← 你', isMe: true },
                { rank: 7, name: '价值发现者', emoji: '🔍', profit: 12400, level: 5, badge: '' },
                { rank: 8, name: '趋势追随者', emoji: '🏄', profit: 8900, level: 4, badge: '' },
              ].sort((a, b) => b.profit - a.profit).map((entry, idx) => (
                <div
                  key={idx}
                  className={`flex items-center p-4 rounded-xl border transition-all ${
                    entry.isMe
                      ? 'bg-purple-500/20 border-purple-400/50'
                      : 'bg-white/5 border-white/5'
                  }`}
                >
                  <span className={`text-2xl font-bold mr-4 w-8 text-center ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : 'text-gray-500'}`}>
                    {idx + 1}
                  </span>
                  <span className="text-3xl mr-3">{entry.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className={`font-bold ${entry.isMe ? 'text-purple-300' : 'text-white'}`}>{entry.name}</span>
                      {entry.badge && <span className="ml-2 text-sm">{entry.badge}</span>}
                    </div>
                    <span className="text-gray-400 text-xs">Lv.{entry.level}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">${entry.profit.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BotShowcase;
