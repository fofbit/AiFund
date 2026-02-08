import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LogOut, Wallet, TrendingUp, Bot, RefreshCw, Plus, Bell, Globe, Crown, Share2, Sparkles, X, ArrowRight, Rewind } from 'lucide-react';
import DepositModal from './DepositModal';
import CreateBotModal from './CreateBotModal';
import BotDashboard from './BotDashboard';
import NotificationPanel from './NotificationPanel';
import GlobalVisionPage from './GlobalVisionPage';
import VIPUpgradePage from './VIPUpgradePage';
import ShareAchievementModal from './ShareAchievementModal';
import BacktestSimulator from './BacktestSimulator';
import VIPApiSettings from './VIPApiSettings';
import BotShowcase from './BotShowcase';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = ({ walletAddress, userData, onDisconnect, onRefresh, isDemoMode, onExitDemo, onConnectReal }) => {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showCreateBotModal, setShowCreateBotModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showGlobalVision, setShowGlobalVision] = useState(false);
  const [showVIPUpgrade, setShowVIPUpgrade] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareAchievement, setShareAchievement] = useState(null);
  const [botData, setBotData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDemoBanner, setShowDemoBanner] = useState(true);
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(false);
  const [showBacktest, setShowBacktest] = useState(false);
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [showBotShowcase, setShowBotShowcase] = useState(false);

  useEffect(() => {
    if (userData?.has_bot) {
      loadBotData();
    }
    
    // Show welcome guide for demo mode
    if (isDemoMode && !localStorage.getItem('demo_guide_shown')) {
      setShowWelcomeGuide(true);
      localStorage.setItem('demo_guide_shown', 'true');
    }
    loadUnreadCount();
  }, [userData]);

  const loadUnreadCount = async () => {
    try {
      const response = await axios.get(`${API}/notifications/${walletAddress}?unread_only=true`);
      setUnreadCount(response.data.notifications.length);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const loadBotData = async () => {
    try {
      const response = await axios.get(`${API}/bot/${walletAddress}`);
      setBotData(response.data);
    } catch (error) {
      console.error('Error loading bot data:', error);
    }
  };

  const handleDepositSuccess = () => {
    onRefresh();
    setShowDepositModal(false);
  };

  const handleBotCreated = (newBot) => {
    onRefresh();
    loadBotData();
    setShowCreateBotModal(false);
    
    // Show share achievement modal for bot adoption
    if (newBot) {
      setShareAchievement({
        type: 'bot_adopted',
        botName: newBot.name,
        botEmoji: newBot.avatar_emoji,
        botLevel: newBot.level
      });
      setShowShareModal(true);
    }
  };

  const handleVIPUpgraded = () => {
    onRefresh();
    setShowVIPUpgrade(false);
    
    // Show share achievement modal for VIP upgrade
    setShareAchievement({
      type: 'vip_upgrade'
    });
    setShowShareModal(true);
  };

  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const getTierBadge = (tier) => {
    const badges = {
      inactive: { text: '未激活', color: 'bg-gray-500' },
      basic: { text: '基础版', color: 'bg-blue-500' },
      vip: { text: 'VIP', color: 'bg-gradient-to-r from-purple-500 to-pink-500' }
    };
    return badges[tier] || badges.inactive;
  };

  const tierBadge = getTierBadge(userData?.user?.tier);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Demo Mode Banner */}
      {isDemoMode && showDemoBanner && (
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
              <span className="font-semibold">演示模式</span>
              <span className="mx-2">·</span>
              <span className="text-cyan-100">您正在体验完整功能，所有数据为模拟数据</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onConnectReal}
                className="px-4 py-1.5 bg-white text-cyan-600 font-semibold rounded-lg hover:bg-cyan-50 transition-all flex items-center"
              >
                连接真实钱包
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
              <button
                onClick={() => setShowDemoBanner(false)}
                className="p-1 hover:bg-white/20 rounded transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Guide Modal for Demo */}
      {showWelcomeGuide && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-lg w-full p-8 border border-purple-500/50 shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-white mb-2">欢迎体验 AIFund!</h2>
              <p className="text-gray-300">我们已为您创建了一个演示账户</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start bg-white/5 rounded-lg p-4">
                <span className="text-2xl mr-3">🤖</span>
                <div>
                  <h4 className="text-white font-semibold">您的专属Bot</h4>
                  <p className="text-gray-400 text-sm">「体验Bot」已就绪，正在24/7为您模拟交易</p>
                </div>
              </div>
              <div className="flex items-start bg-white/5 rounded-lg p-4">
                <span className="text-2xl mr-3">💰</span>
                <div>
                  <h4 className="text-white font-semibold">虚拟资金</h4>
                  <p className="text-gray-400 text-sm">$10,000虚拟资金，观察AI如何帮您赚钱</p>
                </div>
              </div>
              <div className="flex items-start bg-white/5 rounded-lg p-4">
                <span className="text-2xl mr-3">🌍</span>
                <div>
                  <h4 className="text-white font-semibold">全球视野</h4>
                  <p className="text-gray-400 text-sm">探索历史投资机会，体验"时光旅行"</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowWelcomeGuide(false)}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl hover:opacity-90 transition-all"
            >
              开始探索 🚀
            </button>

            <p className="text-center text-gray-500 text-sm mt-4">
              随时可以连接真实钱包，开启真正的AI投资之旅
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="w-8 h-8 text-purple-400 mr-3" />
              <h1 
                className="text-2xl font-bold text-white cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => window.location.reload()}
                title="返回首页"
              >
                AI<span className="text-purple-400">fund</span>
              </h1>
              {isDemoMode && (
                <span className="ml-3 px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-semibold rounded-full border border-cyan-500/30">
                  演示模式
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <button
                onClick={() => setShowNotifications(true)}
                className="relative p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                title="通知"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              <div className="text-right">
                <div className="flex items-center">
                  <Wallet className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-white font-mono">
                    {isDemoMode ? '演示账户' : formatAddress(walletAddress)}
                  </span>
                </div>
                <div className="flex items-center mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${tierBadge.color} text-white`}>
                    {tierBadge.text}
                  </span>
                  <span className="text-gray-400 ml-2 text-sm">
                    ${userData?.user?.balance_usd?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>

              <button
                onClick={isDemoMode ? onExitDemo : onDisconnect}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                title={isDemoMode ? "退出演示" : "断开连接"}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userData?.user?.tier === 'inactive' && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-yellow-400 mb-2">账户未激活</h3>
            <p className="text-gray-300 mb-4">
              请充值至少 $1 美元等值的加密货币来激活您的账户并领养您的AI交易Bot！
            </p>
            <button
              onClick={() => setShowDepositModal(true)}
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-all"
              data-testid="deposit-btn"
            >
              <Plus className="inline-block w-5 h-5 mr-2" />
              立即充值
            </button>
          </div>
        )}

        {userData?.user?.tier !== 'inactive' && !userData?.has_bot && (
          <div className="bg-purple-500/20 border border-purple-500/50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-purple-400 mb-2">账户已激活！</h3>
            <p className="text-gray-300 mb-4">
              太棒了！现在您可以领养您的专属AI交易Bot了！
            </p>
            <button
              onClick={() => setShowCreateBotModal(true)}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg transition-all"
              data-testid="create-bot-btn"
            >
              <Bot className="inline-block w-5 h-5 mr-2" />
              领养我的Bot
            </button>
          </div>
        )}

        {/* Global Vision Promo - show for both unlocked and non-unlocked */}
        {userData?.user?.tier !== 'inactive' && (
          <div className={`rounded-xl p-6 mb-8 border-2 ${
            userData?.user?.has_global_vision
              ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/50'
              : 'bg-gradient-to-r from-yellow-600 to-orange-600 border-yellow-500'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Globe className="w-12 h-12 text-white mr-4" />
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">全球视野</h3>
                  <p className={`mb-2 ${userData?.user?.has_global_vision ? 'text-purple-200' : 'text-yellow-100'}`}>
                    {userData?.user?.has_global_vision
                      ? '已解锁 — 查看全部历史暴富案例和时光旅行'
                      : '看看如果有AI，100U能变成多少？'}
                  </p>
                  {!userData?.user?.has_global_vision && (
                    <p className="text-yellow-200 text-sm">过去10年的投资机会 · 实际数据 · 震撼展示</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowGlobalVision(true)}
                className={`px-6 py-3 font-bold rounded-lg transition-all shadow-lg ${
                  userData?.user?.has_global_vision
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-white hover:bg-gray-100 text-orange-600'
                }`}
                data-testid="global-vision-btn"
              >
                {userData?.user?.has_global_vision ? '进入探索 →' : '探索机会 →'}
              </button>
            </div>
          </div>
        )}

        {botData && (
          <BotDashboard 
            botData={botData} 
            userData={userData}
            onRefresh={loadBotData}
            onShowVIP={() => setShowVIPUpgrade(true)}
            onShareAchievement={(achievement) => {
              setShareAchievement(achievement);
              setShowShareModal(true);
            }}
          />
        )}

        {!botData && userData?.has_bot && (
          <div className="text-center py-12">
            <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-400">加载Bot数据中...</p>
          </div>
        )}

        {/* Quick Actions */}
        {userData?.user?.tier !== 'inactive' && (
          <div className="mt-8 grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            <button
              onClick={() => setShowDepositModal(true)}
              className="p-6 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 hover:border-purple-400 transition-all text-left"
            >
              <Plus className="w-8 h-8 text-purple-400 mb-2" />
              <h4 className="text-lg font-semibold text-white mb-1">充值</h4>
              <p className="text-gray-400 text-sm">增加余额或升级到VIP</p>
            </button>

            {userData?.user?.tier !== 'vip' && (
              <button
                onClick={() => setShowVIPUpgrade(true)}
                className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 backdrop-blur-lg rounded-xl border border-yellow-500/50 hover:border-yellow-400 transition-all text-left"
                data-testid="vip-upgrade-quick-btn"
              >
                <Crown className="w-8 h-8 text-yellow-400 mb-2" />
                <h4 className="text-lg font-semibold text-white mb-1">升级VIP</h4>
                <p className="text-yellow-200 text-sm">10%利润分成 · 真金白银</p>
              </button>
            )}

            {userData?.user?.tier === 'vip' && (
              <button
                onClick={() => setShowApiSettings(true)}
                className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 backdrop-blur-lg rounded-xl border border-yellow-500/50 hover:border-yellow-400 transition-all text-left"
                data-testid="api-settings-quick-btn"
              >
                <Crown className="w-8 h-8 text-yellow-400 mb-2" />
                <h4 className="text-lg font-semibold text-white mb-1">API设置</h4>
                <p className="text-yellow-200 text-sm">连接交易所自动交易</p>
              </button>
            )}

            <button
              onClick={() => setShowBacktest(true)}
              className="p-6 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 backdrop-blur-lg rounded-xl border border-cyan-500/50 hover:border-cyan-400 transition-all text-left"
              data-testid="backtest-btn"
            >
              <Rewind className="w-8 h-8 text-cyan-400 mb-2" />
              <h4 className="text-lg font-semibold text-white mb-1">模拟回测</h4>
              <p className="text-cyan-200 text-sm">验证Bot历史表现</p>
            </button>

            <button
              onClick={() => setShowGlobalVision(true)}
              className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 backdrop-blur-lg rounded-xl border border-purple-500/50 hover:border-purple-400 transition-all text-left"
              data-testid="global-vision-quick-btn"
            >
              <Globe className="w-8 h-8 text-purple-400 mb-2" />
              <h4 className="text-lg font-semibold text-white mb-1">全球视野</h4>
              <p className="text-purple-200 text-sm">历史暴富机会探索</p>
            </button>

            {botData && (
              <button
                onClick={() => setShowBotShowcase(true)}
                className="p-6 bg-gradient-to-br from-pink-500/20 to-orange-500/20 hover:from-pink-500/30 hover:to-orange-500/30 backdrop-blur-lg rounded-xl border border-pink-500/50 hover:border-pink-400 transition-all text-left"
                data-testid="bot-showcase-quick-btn"
              >
                <Sparkles className="w-8 h-8 text-pink-400 mb-2" />
                <h4 className="text-lg font-semibold text-white mb-1">Bot成长</h4>
                <p className="text-pink-200 text-sm">等级 · 成就 · 排行</p>
              </button>
            )}

            <button
              onClick={onRefresh}
              className="p-6 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 hover:border-purple-400 transition-all text-left"
            >
              <RefreshCw className="w-8 h-8 text-purple-400 mb-2" />
              <h4 className="text-lg font-semibold text-white mb-1">刷新</h4>
              <p className="text-gray-400 text-sm">更新账户和Bot数据</p>
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      {showDepositModal && (
        <DepositModal
          walletAddress={walletAddress}
          onClose={() => setShowDepositModal(false)}
          onSuccess={handleDepositSuccess}
        />
      )}

      {showCreateBotModal && (
        <CreateBotModal
          walletAddress={walletAddress}
          onClose={() => setShowCreateBotModal(false)}
          onSuccess={handleBotCreated}
        />
      )}

      {showNotifications && (
        <NotificationPanel
          walletAddress={walletAddress}
          isOpen={showNotifications}
          onClose={() => {
            setShowNotifications(false);
            loadUnreadCount();
          }}
        />
      )}

      {showGlobalVision && (
        <GlobalVisionPage
          walletAddress={walletAddress}
          userData={userData}
          onClose={() => setShowGlobalVision(false)}
          onUnlock={() => {
            setShowGlobalVision(false);
            onRefresh();
          }}
        />
      )}

      {showVIPUpgrade && (
        <VIPUpgradePage
          walletAddress={walletAddress}
          userData={userData}
          onClose={() => setShowVIPUpgrade(false)}
          onSuccess={handleVIPUpgraded}
        />
      )}

      {showShareModal && shareAchievement && (
        <ShareAchievementModal
          achievement={shareAchievement}
          onClose={() => {
            setShowShareModal(false);
            setShareAchievement(null);
          }}
        />
      )}

      {showBacktest && (
        <BacktestSimulator
          onClose={() => setShowBacktest(false)}
        />
      )}

      {showApiSettings && (
        <VIPApiSettings
          walletAddress={walletAddress}
          userData={userData}
          onClose={() => setShowApiSettings(false)}
        />
      )}

      {showBotShowcase && botData && (
        <BotShowcase
          botData={botData}
          userData={userData}
          onClose={() => setShowBotShowcase(false)}
          onShareAchievement={(achievement) => {
            setShareAchievement(achievement);
            setShowShareModal(true);
            setShowBotShowcase(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
