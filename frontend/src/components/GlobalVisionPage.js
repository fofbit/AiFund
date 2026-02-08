import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Globe, TrendingUp, Calendar, DollarSign, Sparkles, X, Lock, Unlock, ArrowRight, Rocket } from 'lucide-react';
import TimeTravelAnimation from './TimeTravelAnimation';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const GlobalVisionPage = ({ walletAddress, userData, onClose, onUnlock }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [totalPotential, setTotalPotential] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [showTimeTravel, setShowTimeTravel] = useState(false);
  const [timeTravelOpportunity, setTimeTravelOpportunity] = useState(null);

  const hasAccess = userData?.user?.has_global_vision || false;
  const [demoUsed, setDemoUsed] = useState(false); // Track if demo has been used

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [oppsRes, potentialRes] = await Promise.all([
        axios.get(`${API}/global-vision/opportunities`),
        axios.get(`${API}/global-vision/potential`)
      ]);
      
      setOpportunities(oppsRes.data.opportunities);
      setTotalPotential(potentialRes.data.potential);
    } catch (error) {
      console.error('Error loading global vision data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Cryptocurrency': '₿',
      'BRC-20': '🟠',
      'Meme Coin': '🐸',
      'Prediction Market': '🎯',
      'Commodity': '🏅',
      'Stock': '📈',
      'Recent': '⚡',
      'Polymarket': '🎯',
      'Futures': '📊',
      'Options': '📉'
    };
    return icons[category] || '💰';
  };

  // Enhanced filtering with category and timeframe
  const filteredOpportunities = opportunities.filter(opp => {
    // Tab filter
    if (selectedTab === 'crypto' && !['Cryptocurrency', 'BRC-20', 'Meme Coin'].includes(opp.category)) return false;
    if (selectedTab === 'traditional' && !['Stock', 'Commodity', 'Futures', 'Options'].includes(opp.category)) return false;
    if (selectedTab === 'prediction' && opp.category !== 'Polymarket') return false;
    if (selectedTab === 'recent' && !opp.is_recent) return false;
    
    // Category filter
    if (selectedCategory !== 'all' && opp.subcategory !== selectedCategory) return false;
    
    // Timeframe filter
    if (selectedTimeframe !== 'all') {
      const oppDate = new Date(opp.date);
      const now = new Date();
      const daysDiff = Math.floor((now - oppDate) / (1000 * 60 * 60 * 24));
      
      if (selectedTimeframe === 'daily' && daysDiff > 7) return false;
      if (selectedTimeframe === 'monthly' && (daysDiff > 365 || daysDiff < 30)) return false;
      if (selectedTimeframe === 'yearly' && daysDiff < 365) return false;
    }
    
    return true;
  });

  // Get unique subcategories for the selected tab
  const getSubcategories = () => {
    const subcats = new Set();
    opportunities.forEach(opp => {
      if (opp.subcategory) subcats.add(opp.subcategory);
    });
    return Array.from(subcats);
  };

  const handleTimeTravel = (opp) => {
    setTimeTravelOpportunity(opp);
    setShowTimeTravel(true);
  };

  // Demo mode - allow one free time travel for non-unlocked users
  const handleDemoTimeTravel = (opp) => {
    setTimeTravelOpportunity(opp);
    setShowTimeTravel(true);
    setDemoUsed(true);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl max-w-6xl w-full border-2 border-purple-500/50 shadow-2xl my-8">
        
        {/* Header */}
        <div className="relative p-6 border-b border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4 animate-pulse">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">🌍 全球视野</h2>
                <p className="text-purple-300">让AI把每个人赚钱能力平等化</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {!hasAccess && (
            <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl flex items-center justify-between">
              <div className="flex items-center">
                <Lock className="w-5 h-5 text-yellow-400 mr-3" />
                <div>
                  <p className="text-white font-semibold">解锁完整功能</p>
                  <p className="text-yellow-300 text-sm">仅需 9.9U 查看所有历史机会</p>
                </div>
              </div>
              <button
                onClick={() => setShowUnlockModal(true)}
                className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transition-all"
              >
                立即解锁
              </button>
            </div>
          )}
        </div>

        {/* Total Potential Banner */}
        {hasAccess && totalPotential && (
          <div className="p-6 bg-gradient-to-r from-green-600 to-emerald-600 border-b border-green-500/30">
            <div className="text-center">
              <p className="text-white/80 text-sm mb-2">如果AI帮你抓住这些机会</p>
              <div className="text-5xl font-bold text-white mb-2">
                100U → {totalPotential.final_value.toLocaleString()}U
              </div>
              <p className="text-green-100 text-lg">
                收益率: {totalPotential.total_roi.toLocaleString()}% 💰
              </p>
              <p className="text-white/70 text-sm mt-2">
                从100U变成{(totalPotential.final_value / 10000).toFixed(1)}万U，过上富足生活！
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="p-6 border-b border-purple-500/30">
          {/* Main category tabs */}
          <div className="flex space-x-2 overflow-x-auto mb-4">
            {[
              { id: 'all', label: '全部机会', icon: '🌐' },
              { id: 'crypto', label: '加密货币', icon: '₿' },
              { id: 'traditional', label: '传统资产', icon: '📈' },
              { id: 'prediction', label: 'Polymarket', icon: '🎯' },
              { id: 'recent', label: '昨天机会', icon: '⚡' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedTab(tab.id);
                  setSelectedCategory('all');
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  selectedTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Timeframe filters */}
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-gray-400 text-sm">时间维度:</span>
            {[
              { id: 'all', label: '全部' },
              { id: 'daily', label: '近7天' },
              { id: 'monthly', label: '近1年' },
              { id: 'yearly', label: '1年以上' }
            ].map((tf) => (
              <button
                key={tf.id}
                onClick={() => setSelectedTimeframe(tf.id)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  selectedTimeframe === tf.id
                    ? 'bg-cyan-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Subcategory filters */}
          {selectedTab === 'crypto' && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">细分类别:</span>
              {['all', 'BTC生态', 'ETH生态', '新公链', 'Meme币', 'DeFi'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    selectedCategory === cat
                      ? 'bg-orange-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {cat === 'all' ? '全部' : cat}
                </button>
              ))}
            </div>
          )}

          {selectedTab === 'traditional' && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">资产类型:</span>
              {['all', '科技股', '新能源', '能源期货', '股票期权', '贵金属'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    selectedCategory === cat
                      ? 'bg-green-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {cat === 'all' ? '全部' : cat}
                </button>
              ))}
            </div>
          )}

          {selectedTab === 'prediction' && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">预测类型:</span>
              {['all', '政治预测', '加密预测', '科技预测'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {cat === 'all' ? '全部' : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Opportunities Grid */}
        <div className="p-6 max-h-[600px] overflow-y-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              <p className="text-gray-400 mt-4">加载历史机会中...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOpportunities.map((opp, index) => {
                const isLocked = !hasAccess && index >= 3;
                
                return (
                  <div
                    key={opp.id}
                    className={`relative bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20 hover:border-purple-400 transition-all ${
                      isLocked ? 'opacity-50' : ''
                    }`}
                  >
                    {isLocked && (
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                        <div className="text-center">
                          <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-white font-semibold">解锁查看</p>
                        </div>
                      </div>
                    )}

                    {/* Icon and Category */}
                    <div className="flex items-center justify-between mb-3">
                      <div className={`text-4xl`}>{getCategoryIcon(opp.category)}</div>
                      <span className="text-xs px-2 py-1 bg-purple-500/30 rounded-full text-purple-200">
                        {opp.category}
                      </span>
                    </div>

                    {/* Title and Date */}
                    <h3 className="text-lg font-bold text-white mb-1">{opp.title}</h3>
                    <div className="flex items-center text-gray-400 text-sm mb-3">
                      <Calendar className="w-3 h-3 mr-1" />
                      {opp.date}
                    </div>

                    {/* ROI */}
                    <div className={`p-3 rounded-lg mb-3 bg-gradient-to-r ${opp.color}`}>
                      <div className="text-center">
                        <p className="text-white/80 text-xs">100U 投资回报</p>
                        <p className="text-3xl font-bold text-white">${opp.final_value.toLocaleString()}</p>
                        <p className="text-white/90 text-sm mt-1">
                          {opp.roi_multiplier} 收益
                        </p>
                      </div>
                    </div>

                    {/* What Happened */}
                    <p className="text-gray-300 text-sm mb-2">{opp.what_happened}</p>
                    
                    {/* Lesson */}
                    <p className="text-purple-300 text-xs italic">
                      💡 {opp.lesson}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {opp.tags.map((tag, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 bg-white/10 rounded text-gray-300">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Time Travel Button */}
                    {hasAccess && !isLocked && (
                      <button
                        onClick={() => handleTimeTravel(opp)}
                        className="w-full mt-3 p-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/50 hover:to-pink-500/50 rounded-lg flex items-center justify-center text-white text-sm font-semibold transition-all border border-purple-500/30"
                        data-testid={`time-travel-btn-${opp.id}`}
                      >
                        <Rocket className="w-4 h-4 mr-2" />
                        时光旅行
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA Footer */}
        <div className="p-6 border-t border-purple-500/30 bg-black/30">
          <div className="text-center">
            <p className="text-2xl text-white font-bold mb-3">
              {hasAccess 
                ? "看到了吗？AI能改变一切！" 
                : "想让AI帮你抓住下一个机会？"}
            </p>
            <p className="text-gray-300 mb-4">
              {hasAccess
                ? "现在升级VIP，让你的Bot用真金白银帮你赚钱！"
                : "解锁全球视野，看看你错过的所有机会"}
            </p>
            
            <button
              onClick={hasAccess ? onUnlock : () => setShowUnlockModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center"
              data-testid="cta-button"
            >
              {hasAccess ? (
                <>
                  <Sparkles className="w-6 h-6 mr-2" />
                  请把赚钱任务交给你的Bot
                  <ArrowRight className="w-6 h-6 ml-2" />
                </>
              ) : (
                <>
                  <Unlock className="w-6 h-6 mr-2" />
                  解锁全球视野 (9.9U)
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Unlock Modal */}
      {showUnlockModal && (
        <UnlockModal
          walletAddress={walletAddress}
          onClose={() => setShowUnlockModal(false)}
          onSuccess={() => {
            setShowUnlockModal(false);
            loadData();
            if (onUnlock) onUnlock();
          }}
        />
      )}

      {/* Time Travel Animation */}
      {showTimeTravel && timeTravelOpportunity && (
        <TimeTravelAnimation
          opportunity={timeTravelOpportunity}
          userAvatar={userData?.user?.avatar || '👤'}
          onClose={() => {
            setShowTimeTravel(false);
            setTimeTravelOpportunity(null);
          }}
        />
      )}
    </div>
  );
};

// Unlock Modal Component
const UnlockModal = ({ walletAddress, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleUnlock = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/global-vision/unlock`, {
        wallet_address: walletAddress,
        currency: 'USDT',
        amount: 9.9,
        tx_hash: 'global_vision_' + Date.now()
      });

      alert('🎉 全球视野功能已解锁！');
      onSuccess();
    } catch (error) {
      console.error('Error unlocking:', error);
      alert('解锁失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
      <div className="bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-purple-500/30">
        <h3 className="text-2xl font-bold text-white mb-4">解锁全球视野</h3>
        <p className="text-gray-300 mb-4">
          仅需 <span className="text-2xl font-bold text-yellow-400">9.9U</span> 即可解锁：
        </p>
        <ul className="text-gray-300 space-y-2 mb-6">
          <li className="flex items-start">
            <span className="text-green-400 mr-2">✓</span>
            查看过去10年所有投资机会
          </li>
          <li className="flex items-start">
            <span className="text-green-400 mr-2">✓</span>
            看到如果有AI，100U能变多少
          </li>
          <li className="flex items-start">
            <span className="text-green-400 mr-2">✓</span>
            理解AI的真正赚钱潜力
          </li>
          <li className="flex items-start">
            <span className="text-green-400 mr-2">✓</span>
            为升级VIP做好心理准备
          </li>
        </ul>

        <div className="p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg mb-6">
          <p className="text-purple-300 text-sm">
            💡 <strong>提示:</strong> 看完全球视野后，你会明白为什么要升级到99U的VIP，让Bot用真金白银帮你赚钱！
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
            onClick={handleUnlock}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all"
          >
            {loading ? '处理中...' : '立即解锁 9.9U'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalVisionPage;
