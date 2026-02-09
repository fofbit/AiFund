import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Globe, TrendingUp, Calendar, DollarSign, Sparkles, X, Lock, Unlock, ArrowRight, Rocket, BookOpen } from 'lucide-react';
import TimeTravelAnimation from './TimeTravelAnimation';
import OpportunityDetail from './OpportunityDetail';
import PaymentFlow from './PaymentFlow';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const GlobalVisionPage = ({ walletAddress, userData, onClose, onUnlock }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [totalPotential, setTotalPotential] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showTimeTravel, setShowTimeTravel] = useState(false);
  const [timeTravelOpportunity, setTimeTravelOpportunity] = useState(null);
  const [localHasAccess, setLocalHasAccess] = useState(userData?.user?.has_global_vision || false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  const hasAccess = localHasAccess || userData?.user?.has_global_vision || false;
  const [demoUsed, setDemoUsed] = useState(false);

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
      'Cryptocurrency': '₿', 'BRC-20': '🟠', 'Meme Coin': '🐸',
      'Prediction Market': '🎯', 'Commodity': '🏅', 'Stock': '📈',
      'Recent': '⚡', 'Polymarket': '🎯', 'Futures': '📊', 'Options': '📉'
    };
    return icons[category] || '💰';
  };

  const filteredOpportunities = opportunities.filter(opp => {
    // Time period tab filter
    if (selectedTab !== 'all') {
      const tf = opp.timeframe;
      if (selectedTab === '1year' && tf !== '1year' && tf !== 'yesterday') return false;
      if (selectedTab === '2year' && tf !== '1year' && tf !== 'yesterday') return false;
      if (selectedTab === '3year' && tf !== '3year') return false;
      if (selectedTab === '5year' && tf !== '5year') return false;
      if (selectedTab === '10year' && tf !== '10year') return false;
      if (selectedTab === '15year' && tf !== '10year' && tf !== '15year') return false;
    }
    // Category filter
    if (selectedCategory !== 'all') {
      const cat = selectedCategory.toLowerCase();
      const oppCat = (opp.category || '').toLowerCase();
      const oppSub = (opp.subcategory || '').toLowerCase();
      if (cat === 'crypto' && !['cryptocurrency', 'brc-20', 'meme coin'].includes(oppCat)) return false;
      if (cat === 'stock' && oppCat !== 'stock') return false;
      if (cat === 'meme' && !oppSub.includes('meme') && oppCat !== 'meme coin') return false;
      if (cat === 'defi' && !oppSub.includes('defi')) return false;
      if (cat === 'commodity' && oppCat !== 'commodity') return false;
      if (cat === 'prediction' && oppCat !== 'polymarket') return false;
    }
    return true;
  })
  // Sort by ROI multiplier (highest first) for carousel effect
  .sort((a, b) => (b.final_value || 0) - (a.final_value || 0));

  const handleTimeTravel = (opp) => {
    setTimeTravelOpportunity(opp);
    setShowTimeTravel(true);
  };

  const handleDemoTimeTravel = (opp) => {
    setTimeTravelOpportunity(opp);
    setShowTimeTravel(true);
    setDemoUsed(true);
  };

  const handleViewDetail = (opp) => {
    setSelectedOpportunity(opp);
    setShowDetail(true);
  };

  // Show detail page
  if (showDetail && selectedOpportunity) {
    return (
      <OpportunityDetail
        opportunity={selectedOpportunity}
        userData={userData}
        onClose={onClose}
        onBack={() => {
          setShowDetail(false);
          setSelectedOpportunity(null);
        }}
      />
    );
  }

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
                <h2 className="text-3xl font-bold text-white mb-1" data-testid="global-vision-title">全球视野</h2>
                <p className="text-purple-300">让AI把每个人赚钱能力平等化</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" data-testid="close-global-vision">
              <X className="w-6 h-6" />
            </button>
          </div>

          {!hasAccess && (
            <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl flex items-center justify-between">
              <div className="flex items-center">
                <Lock className="w-5 h-5 text-yellow-400 mr-3" />
                <div>
                  <p className="text-white font-semibold">解锁完整功能</p>
                  <p className="text-yellow-300 text-sm">仅需 9.9U 查看所有历史机会 + 时光旅行 + 财富故事</p>
                </div>
              </div>
              <button
                onClick={() => setShowUnlockModal(true)}
                className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                data-testid="unlock-global-vision-btn"
              >
                立即解锁
              </button>
            </div>
          )}

          {hasAccess && (
            <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-xl flex items-center">
              <Unlock className="w-5 h-5 text-green-400 mr-3" />
              <p className="text-green-300 text-sm font-semibold">已解锁全部 {opportunities.length} 个历史案例 · 每个案例均可查看详情和时光旅行</p>
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
                收益率: {totalPotential.total_roi.toLocaleString()}%
              </p>
            </div>
          </div>
        )}

        {/* Tabs - Time Travel Periods */}
        <div className="p-6 border-b border-purple-500/30">
          <div className="flex items-center mb-3">
            <Rocket className="w-5 h-5 text-cyan-400 mr-2" />
            <span className="text-white font-semibold text-sm">Time Travel Back To:</span>
          </div>
          <div className="flex space-x-2 overflow-x-auto mb-4">
            {[
              { id: 'all', label: 'All', icon: '🌐' },
              { id: '1year', label: '1 Year Ago', icon: '⏱️' },
              { id: '2year', label: '2 Years Ago', icon: '⏳' },
              { id: '3year', label: '3 Years Ago', icon: '🕐' },
              { id: '5year', label: '5 Years Ago', icon: '🕰️' },
              { id: '10year', label: '10 Years Ago', icon: '📜' },
              { id: '15year', label: '15 Years Ago', icon: '🏛️' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setSelectedTab(tab.id); setSelectedCategory('all'); }}
                className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap text-sm ${
                  selectedTab === tab.id ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
                data-testid={`tab-${tab.id}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Category filters */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-xs">Category:</span>
            {['all', 'Crypto', 'Stock', 'Meme', 'DeFi', 'Commodity', 'Prediction'].map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  selectedCategory === cat ? 'bg-cyan-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >{cat === 'all' ? 'All' : cat}</button>
            ))}
          </div>
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
                // After unlock, ALL cards are visible. Before unlock, only first 3.
                const isLocked = !hasAccess && index >= 3;
                
                return (
                  <div
                    key={opp.id}
                    className={`relative bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20 hover:border-purple-400 transition-all group ${
                      isLocked ? 'opacity-50' : 'cursor-pointer'
                    }`}
                    onClick={() => !isLocked && hasAccess && handleViewDetail(opp)}
                    data-testid={`opportunity-card-${opp.id}`}
                  >
                    {isLocked && (
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                        <div className="text-center">
                          <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-white font-semibold">解锁查看</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <div className="text-4xl">{getCategoryIcon(opp.category)}</div>
                      <span className="text-xs px-2 py-1 bg-purple-500/30 rounded-full text-purple-200">
                        {opp.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1">{opp.title}</h3>
                    <div className="flex items-center text-gray-400 text-sm mb-3">
                      <Calendar className="w-3 h-3 mr-1" />
                      {opp.date}
                    </div>

                    <div className={`p-3 rounded-lg mb-3 bg-gradient-to-r ${opp.color}`}>
                      <div className="text-center">
                        <p className="text-white/80 text-xs">100U 投资回报</p>
                        <p className="text-3xl font-bold text-white">${opp.final_value.toLocaleString()}</p>
                        <p className="text-white/90 text-sm mt-1">{opp.roi_multiplier} 收益</p>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-2">{opp.what_happened}</p>
                    <p className="text-purple-300 text-xs italic">{opp.lesson}</p>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {opp.tags.map((tag, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 bg-white/10 rounded text-gray-300">{tag}</span>
                      ))}
                    </div>

                    {/* Action buttons for unlocked users */}
                    {hasAccess && !isLocked && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleViewDetail(opp); }}
                          className="flex-1 p-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white text-sm font-semibold transition-all border border-white/10"
                          data-testid={`detail-btn-${opp.id}`}
                        >
                          <BookOpen className="w-4 h-4 mr-1" />
                          故事详情
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleTimeTravel(opp); }}
                          className="flex-1 p-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/50 hover:to-pink-500/50 rounded-lg flex items-center justify-center text-white text-sm font-semibold transition-all border border-purple-500/30"
                          data-testid={`time-travel-btn-${opp.id}`}
                        >
                          <Rocket className="w-4 h-4 mr-1" />
                          时光旅行
                        </button>
                      </div>
                    )}

                    {/* Demo: first card only, one-time */}
                    {!hasAccess && index === 0 && !demoUsed && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDemoTimeTravel(opp); }}
                        className="w-full mt-3 p-2 bg-gradient-to-r from-yellow-500/40 to-orange-500/40 hover:from-yellow-500/60 hover:to-orange-500/60 rounded-lg flex items-center justify-center text-white text-sm font-semibold transition-all border border-yellow-500/50 animate-pulse"
                        data-testid="demo-time-travel-btn"
                      >
                        <Rocket className="w-4 h-4 mr-2" />
                        免费试玩时光旅行
                      </button>
                    )}

                    {!hasAccess && index === 0 && demoUsed && (
                      <div className="w-full mt-3 p-2 bg-gray-600/30 rounded-lg flex items-center justify-center text-gray-400 text-sm border border-gray-500/30">
                        <Rocket className="w-4 h-4 mr-2" />
                        试玩已使用 · 解锁查看更多
                      </div>
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
              {hasAccess ? "Helping you discover hidden wealth opportunities" : "Let AI help you seize the next opportunity"}
            </p>
            <p className="text-gray-300 mb-4">
              {hasAccess ? "帮你发现本来看不见的财富机遇 — Upgrade to VIP and let your Bot trade real money!" : "Unlock Global Vision to see all the wealth myths you missed"}
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

      {/* Unlock Modal - Real Payment */}
      {showUnlockModal && (
        <PaymentFlow
          walletAddress={walletAddress}
          paymentType="global_vision"
          amount={9.9}
          onClose={() => setShowUnlockModal(false)}
          onSuccess={() => {
            setShowUnlockModal(false);
            setLocalHasAccess(true);
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
          onClose={() => { setShowTimeTravel(false); setTimeTravelOpportunity(null); }}
        />
      )}
    </div>
  );
};

export default GlobalVisionPage;
