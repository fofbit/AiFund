import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LogOut, Wallet, TrendingUp, Bot, RefreshCw, Plus, Bell, Globe, Crown, Share2, Sparkles, X, ArrowRight, Rewind, FileText } from 'lucide-react';
import { getTranslations } from './LangContext';
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
import VIPLevelSystem from './VIPLevelSystem';
import WhitepaperViewer from './WhitepaperViewer';
import ReferralSystem from './ReferralSystem';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = ({ walletAddress, userData, onDisconnect, onRefresh, isDemoMode, onExitDemo, onConnectReal }) => {
  const { lang, setLang, t } = useLang();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showCreateBotModal, setShowCreateBotModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showGlobalVision, setShowGlobalVision] = useState(false);
  const [showVIPUpgrade, setShowVIPUpgrade] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareAchievement, setShareAchievement] = useState(null);
  const [botData, setBotData] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDemoBanner, setShowDemoBanner] = useState(true);
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(false);
  const [showBacktest, setShowBacktest] = useState(false);
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [showBotShowcase, setShowBotShowcase] = useState(false);
  const [showVipLevels, setShowVipLevels] = useState(false);
  const [showWhitepaper, setShowWhitepaper] = useState(false);
  const [showReferral, setShowReferral] = useState(false);

  useEffect(() => {
    if (userData?.has_bot) loadBotData();
    if (isDemoMode && !localStorage.getItem('demo_guide_shown')) {
      setShowWelcomeGuide(true);
      localStorage.setItem('demo_guide_shown', 'true');
    }
    loadUnreadCount();
  }, [userData]);

  const loadUnreadCount = async () => {
    try {
      const r = await axios.get(`${API}/notifications/${walletAddress}?unread_only=true`);
      setUnreadCount(r.data.notifications.length);
    } catch (e) { console.error(e); }
  };

  const loadBotData = async () => {
    try {
      const r = await axios.get(`${API}/bot/${walletAddress}`);
      setBotData(r.data);
    } catch (e) { console.error(e); }
  };

  const handleDepositSuccess = () => { onRefresh(); setShowDepositModal(false); };
  const handleBotCreated = (newBot) => {
    onRefresh(); loadBotData(); setShowCreateBotModal(false);
    if (newBot) { setShareAchievement({ type: 'bot_adopted', botName: newBot.name, botEmoji: newBot.avatar_emoji, botLevel: newBot.level }); setShowShareModal(true); }
  };
  const handleVIPUpgraded = () => { onRefresh(); setShowVIPUpgrade(false); setShareAchievement({ type: 'vip_upgrade' }); setShowShareModal(true); };
  const formatAddress = (a) => `${a.substring(0, 6)}...${a.substring(a.length - 4)}`;

  const tierBadge = {
    inactive: { text: t.inactive, color: 'bg-gray-500' },
    basic: { text: t.basic, color: 'bg-blue-500' },
    vip: { text: t.vip, color: 'bg-gradient-to-r from-purple-500 to-pink-500' }
  }[userData?.user?.tier] || { text: t.inactive, color: 'bg-gray-500' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Demo Banner */}
      {isDemoMode && showDemoBanner && (
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              <span className="font-semibold text-sm">{t.demoMode}</span>
              <span className="mx-2 text-xs">·</span>
              <span className="text-cyan-100 text-xs sm:text-sm">{t.demoDesc}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={onConnectReal} className="px-3 py-1 bg-white text-cyan-600 font-semibold rounded-lg text-xs sm:text-sm flex items-center">
                {t.connectReal}<ArrowRight className="w-3 h-3 ml-1" />
              </button>
              <button onClick={() => setShowDemoBanner(false)} className="p-1 hover:bg-white/20 rounded"><X className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Guide */}
      {showWelcomeGuide && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-purple-500/50 shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t.welcomeTitle}</h2>
              <p className="text-gray-300 text-sm">{t.welcomeDesc}</p>
            </div>
            <div className="space-y-3 mb-6">
              {[
                { emoji: '🤖', title: t.yourBot, desc: t.botReady },
                { emoji: '💰', title: t.virtualFunds, desc: t.virtualDesc },
                { emoji: '🌍', title: t.globalVision, desc: t.gvDesc },
              ].map((item, i) => (
                <div key={i} className="flex items-start bg-white/5 rounded-lg p-3">
                  <span className="text-2xl mr-3">{item.emoji}</span>
                  <div><h4 className="text-white font-semibold text-sm">{item.title}</h4><p className="text-gray-400 text-xs">{item.desc}</p></div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowWelcomeGuide(false)} className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl">{t.startExploring}</button>
            <p className="text-center text-gray-500 text-xs mt-3">{t.connectAnytime}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400 mr-2" />
              <h1 className="text-xl sm:text-2xl font-bold text-white cursor-pointer hover:opacity-80" onClick={() => window.location.reload()}>
                AI<span className="text-purple-400">fund</span>
              </h1>
              {isDemoMode && <span className="ml-2 px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs font-semibold rounded-full border border-cyan-500/30">{t.demoMode}</span>}
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Language switcher */}
              <div className="flex items-center space-x-0.5 bg-white/10 rounded-full px-0.5 py-0.5">
                <button onClick={() => setLang('en')} className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${lang === 'en' ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>EN</button>
                <button onClick={() => setLang('zh')} className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${lang === 'zh' ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>中文</button>
              </div>
              <button onClick={() => setShowWhitepaper(true)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Whitepaper" data-testid="dashboard-whitepaper-btn">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button onClick={() => setShowNotifications(true)} className="relative p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title={t.notifications}>
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadCount > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{unreadCount > 9 ? '9+' : unreadCount}</span>}
              </button>
              <div className="text-right hidden sm:block">
                <div className="flex items-center"><Wallet className="w-3 h-3 text-gray-400 mr-1" /><span className="text-white font-mono text-sm">{isDemoMode ? t.demoAccount : formatAddress(walletAddress)}</span></div>
                <div className="flex items-center mt-0.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${tierBadge.color} text-white`}>{tierBadge.text}</span>
                  <span className="text-gray-400 ml-2 text-xs">${userData?.user?.balance_usd?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
              <button onClick={isDemoMode ? onExitDemo : onDisconnect} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title={isDemoMode ? t.exitDemo : t.disconnect}>
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Activation prompts */}
        {userData?.user?.tier === 'inactive' && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-5 mb-6">
            <h3 className="text-lg font-bold text-yellow-400 mb-2">{t.notActivated}</h3>
            <p className="text-gray-300 text-sm mb-3">{t.depositPrompt}</p>
            <button onClick={() => setShowDepositModal(true)} className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-all text-sm" data-testid="deposit-btn">
              <Plus className="inline-block w-4 h-4 mr-1" />{t.depositNow}
            </button>
          </div>
        )}

        {userData?.user?.tier !== 'inactive' && !userData?.has_bot && (
          <div className="bg-purple-500/20 border border-purple-500/50 rounded-xl p-5 mb-6">
            <h3 className="text-lg font-bold text-purple-400 mb-2">{t.activated}</h3>
            <p className="text-gray-300 text-sm mb-3">{t.activatedDesc}</p>
            <button onClick={() => setShowCreateBotModal(true)} className="px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg transition-all text-sm" data-testid="create-bot-btn">
              <Bot className="inline-block w-4 h-4 mr-1" />{t.adoptBot}
            </button>
          </div>
        )}

        {/* Global Vision Promo */}
        {userData?.user?.tier !== 'inactive' && (
          <div className={`rounded-xl p-5 mb-6 border-2 ${userData?.user?.has_global_vision ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/50' : 'bg-gradient-to-r from-yellow-600 to-orange-600 border-yellow-500'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Globe className="w-10 h-10 sm:w-12 sm:h-12 text-white mr-3" />
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{t.gvTitle}</h3>
                  <p className={`text-sm ${userData?.user?.has_global_vision ? 'text-purple-200' : 'text-yellow-100'}`}>
                    {userData?.user?.has_global_vision ? t.gvUnlocked : t.gvLocked}
                  </p>
                  {!userData?.user?.has_global_vision && <p className="text-yellow-200 text-xs mt-1">{t.gvLockedDesc}</p>}
                </div>
              </div>
              <button onClick={() => setShowGlobalVision(true)} className={`px-5 py-2.5 font-bold rounded-lg transition-all text-sm ${userData?.user?.has_global_vision ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-white hover:bg-gray-100 text-orange-600'}`} data-testid="global-vision-btn">
                {userData?.user?.has_global_vision ? t.enterExplore + ' →' : t.explore + ' →'}
              </button>
            </div>
          </div>
        )}

        {/* Bot Dashboard */}
        {botData && (
          <BotDashboard botData={botData} userData={userData} onRefresh={loadBotData} onShowVIP={() => setShowVIPUpgrade(true)}
            onShareAchievement={(a) => { setShareAchievement(a); setShowShareModal(true); }} />
        )}

        {!botData && userData?.has_bot && (
          <div className="text-center py-12"><RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" /><p className="text-gray-400 text-sm">{t.loadingBot}</p></div>
        )}

        {/* Quick Actions */}
        {userData?.user?.tier !== 'inactive' && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <button onClick={() => setShowDepositModal(true)} className="p-4 sm:p-5 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 hover:border-purple-400 transition-all text-left">
              <Plus className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400 mb-2" /><h4 className="text-sm sm:text-base font-semibold text-white mb-0.5">{t.deposit}</h4><p className="text-gray-400 text-xs">{t.depositDesc}</p>
            </button>

            {userData?.user?.tier !== 'vip' ? (
              <button onClick={() => setShowVIPUpgrade(true)} className="p-4 sm:p-5 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 rounded-xl border border-yellow-500/50 transition-all text-left" data-testid="vip-upgrade-quick-btn">
                <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400 mb-2" /><h4 className="text-sm sm:text-base font-semibold text-white mb-0.5">{t.upgradeVip}</h4><p className="text-yellow-200 text-xs">{t.vipDesc}</p>
              </button>
            ) : (
              <button onClick={() => setShowApiSettings(true)} className="p-4 sm:p-5 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 rounded-xl border border-yellow-500/50 transition-all text-left" data-testid="api-settings-quick-btn">
                <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400 mb-2" /><h4 className="text-sm sm:text-base font-semibold text-white mb-0.5">{t.apiSettings}</h4><p className="text-yellow-200 text-xs">{t.apiDesc}</p>
              </button>
            )}

            <button onClick={() => setShowBacktest(true)} className="p-4 sm:p-5 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 rounded-xl border border-cyan-500/50 transition-all text-left" data-testid="backtest-btn">
              <Rewind className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400 mb-2" /><h4 className="text-sm sm:text-base font-semibold text-white mb-0.5">{t.backtest}</h4><p className="text-cyan-200 text-xs">{t.backtestDesc}</p>
            </button>

            <button onClick={() => setShowGlobalVision(true)} className="p-4 sm:p-5 bg-gradient-to-br from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 rounded-xl border border-purple-500/50 transition-all text-left" data-testid="global-vision-quick-btn">
              <Globe className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400 mb-2" /><h4 className="text-sm sm:text-base font-semibold text-white mb-0.5">{t.globalVisionBtn}</h4><p className="text-purple-200 text-xs">{t.gvBtnDesc}</p>
            </button>

            {botData && (
              <button onClick={() => setShowBotShowcase(true)} className="p-4 sm:p-5 bg-gradient-to-br from-pink-500/20 to-orange-500/20 hover:from-pink-500/30 hover:to-orange-500/30 rounded-xl border border-pink-500/50 transition-all text-left" data-testid="bot-showcase-quick-btn">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-pink-400 mb-2" /><h4 className="text-sm sm:text-base font-semibold text-white mb-0.5">{t.botGrowth}</h4><p className="text-pink-200 text-xs">{t.botGrowthDesc}</p>
              </button>
            )}

            <button onClick={() => setShowVipLevels(true)} className="p-4 sm:p-5 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 hover:from-yellow-500/20 hover:to-amber-500/20 rounded-xl border border-yellow-500/30 transition-all text-left" data-testid="vip-levels-btn">
              <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400 mb-2" /><h4 className="text-sm sm:text-base font-semibold text-white mb-0.5">{t.vipLevels}</h4><p className="text-yellow-200 text-xs">{t.vipLevelsDesc}</p>
            </button>

            <button onClick={() => setShowReferral(true)} className="p-4 sm:p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 rounded-xl border border-green-500/30 transition-all text-left" data-testid="referral-btn">
              <Share2 className="w-6 h-6 sm:w-7 sm:h-7 text-green-400 mb-2" /><h4 className="text-sm sm:text-base font-semibold text-white mb-0.5">{t.referFriends}</h4><p className="text-green-200 text-xs">{t.referDesc}</p>
            </button>

            <button onClick={onRefresh} className="p-4 sm:p-5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all text-left">
              <RefreshCw className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400 mb-2" /><h4 className="text-sm sm:text-base font-semibold text-white mb-0.5">{t.refresh}</h4><p className="text-gray-400 text-xs">{t.refreshDesc}</p>
            </button>
          </div>
        )}

        {/* VIP Share Banner */}
        {userData?.user?.tier === 'vip' && botData && (
          <div className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-5 border border-purple-400">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-1 flex items-center"><Crown className="w-5 h-5 text-yellow-400 mr-2" />{t.youAreVip}</h3>
                <p className="text-white/80 text-sm">{t.shareVip}</p>
              </div>
              <button onClick={() => { setShareAchievement({ type: 'profit_milestone', botName: botData.bot.name, botEmoji: botData.bot.avatar_emoji || '🤖', botLevel: botData.bot.level, amount: botData.bot.total_profit, roi: ((botData.bot.total_profit / 10000) * 100).toFixed(2) }); setShowShareModal(true); }}
                className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg transition-all flex items-center text-sm" data-testid="share-achievement-btn">
                <Share2 className="w-4 h-4 mr-2" />{t.shareBtn}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showDepositModal && <DepositModal walletAddress={walletAddress} onClose={() => setShowDepositModal(false)} onSuccess={handleDepositSuccess} />}
      {showCreateBotModal && <CreateBotModal walletAddress={walletAddress} onClose={() => setShowCreateBotModal(false)} onSuccess={handleBotCreated} />}
      {showNotifications && <NotificationPanel walletAddress={walletAddress} isOpen={showNotifications} onClose={() => { setShowNotifications(false); loadUnreadCount(); }} />}
      {showGlobalVision && <GlobalVisionPage walletAddress={walletAddress} userData={userData} onClose={() => setShowGlobalVision(false)} onUnlock={() => onRefresh()} />}
      {showVIPUpgrade && <VIPUpgradePage walletAddress={walletAddress} userData={userData} onClose={() => setShowVIPUpgrade(false)} onSuccess={handleVIPUpgraded} />}
      {showShareModal && shareAchievement && <ShareAchievementModal achievement={shareAchievement} onClose={() => { setShowShareModal(false); setShareAchievement(null); }} />}
      {showBacktest && <BacktestSimulator onClose={() => setShowBacktest(false)} />}
      {showApiSettings && <VIPApiSettings walletAddress={walletAddress} userData={userData} onClose={() => setShowApiSettings(false)} />}
      {showBotShowcase && botData && <BotShowcase botData={botData} userData={userData} onClose={() => setShowBotShowcase(false)} onShareAchievement={(a) => { setShareAchievement(a); setShowShareModal(true); setShowBotShowcase(false); }} />}
      {showVipLevels && <VIPLevelSystem onClose={() => setShowVipLevels(false)} currentLevel={1} />}
      {showWhitepaper && <WhitepaperViewer onClose={() => setShowWhitepaper(false)} />}
      {showReferral && <ReferralSystem walletAddress={walletAddress} userData={userData} onClose={() => setShowReferral(false)} />}
    </div>
  );
};

export default Dashboard;
