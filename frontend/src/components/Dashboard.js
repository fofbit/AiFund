import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LogOut, Wallet, TrendingUp, Bot, RefreshCw, Plus, Bell, Globe, Crown, Share2 } from 'lucide-react';
import DepositModal from './DepositModal';
import CreateBotModal from './CreateBotModal';
import BotDashboard from './BotDashboard';
import NotificationPanel from './NotificationPanel';
import GlobalVisionPage from './GlobalVisionPage';
import VIPUpgradePage from './VIPUpgradePage';
import ShareAchievementModal from './ShareAchievementModal';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = ({ walletAddress, userData, onDisconnect, onRefresh }) => {
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

  useEffect(() => {
    if (userData?.has_bot) {
      loadBotData();
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
                  <span className="text-white font-mono">{formatAddress(walletAddress)}</span>
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
                onClick={onDisconnect}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                title="断开连接"
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

        {/* Global Vision Promo */}
        {userData?.user?.tier !== 'inactive' && !userData?.user?.has_global_vision && (
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-6 mb-8 border-2 border-yellow-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Globe className="w-12 h-12 text-white mr-4" />
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">🌍 全球视野</h3>
                  <p className="text-yellow-100 mb-2">
                    看看如果有AI，100U能变成多少？
                  </p>
                  <p className="text-yellow-200 text-sm">
                    过去10年的投资机会 · 实际数据 · 震撼展示
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGlobalVision(true)}
                className="px-6 py-3 bg-white hover:bg-gray-100 text-orange-600 font-bold rounded-lg transition-all shadow-lg"
                data-testid="global-vision-btn"
              >
                探索机会 →
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
          <div className="mt-8 grid md:grid-cols-3 gap-4">
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
    </div>
  );
};

export default Dashboard;
