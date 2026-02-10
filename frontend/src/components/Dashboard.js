import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LogOut, Wallet, TrendingUp, Bot, RefreshCw, Plus, Bell, Globe, Crown, Share2, Sparkles, X, ArrowRight, Rewind, FileText, Shield, Trophy, Menu, Users, Zap, BarChart3, Key } from 'lucide-react';
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
import AiCustomerService from './AiCustomerService';
import NFTAccountRights from './NFTAccountRights';
import CoCreatorWaitlist from './CoCreatorWaitlist';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = ({ walletAddress, userData, onDisconnect, onRefresh, isDemoMode, onExitDemo, onConnectReal }) => {
  const [lang, setLangState] = useState(() => localStorage.getItem('aifund_lang') || 'en');
  const setLang = (l) => { setLangState(l); localStorage.setItem('aifund_lang', l); };
  const t = getTranslations(lang);

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
  const [showNFTRights, setShowNFTRights] = useState(false);
  const [showCoCreator, setShowCoCreator] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  useEffect(() => {
    if (userData?.has_bot) loadBotData();
    if (isDemoMode && !localStorage.getItem('demo_guide_shown')) {
      setShowWelcomeGuide(true);
      localStorage.setItem('demo_guide_shown', 'true');
    }
    loadUnreadCount();
  }, [userData]);

  const loadUnreadCount = async () => { try { const r = await axios.get(`${API}/notifications/${walletAddress}?unread_only=true`); setUnreadCount(r.data.notifications.length); } catch (e) {} };
  const loadBotData = async () => { try { const r = await axios.get(`${API}/bot/${walletAddress}`); setBotData(r.data); } catch (e) {} };
  const handleDepositSuccess = () => { onRefresh(); setShowDepositModal(false); };
  const handleBotCreated = (newBot) => { onRefresh(); loadBotData(); setShowCreateBotModal(false); if (newBot) { setShareAchievement({ type: 'bot_adopted', botName: newBot.name, botEmoji: newBot.avatar_emoji, botLevel: newBot.level }); setShowShareModal(true); } };
  const handleVIPUpgraded = () => { onRefresh(); setShowVIPUpgrade(false); setShareAchievement({ type: 'vip_upgrade' }); setShowShareModal(true); };
  const formatAddress = (a) => `${a.substring(0, 6)}...${a.substring(a.length - 4)}`;
  const tierBadge = { inactive: { text: t.inactive, color: 'bg-gray-500' }, basic: { text: t.basic, color: 'bg-blue-500' }, vip: { text: t.vip, color: 'bg-gradient-to-r from-purple-500 to-pink-500' } }[userData?.user?.tier] || { text: t.inactive, color: 'bg-gray-500' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20 sm:pb-0">
      {/* Demo Banner */}
      {isDemoMode && showDemoBanner && (
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-3 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center min-w-0">
              <Sparkles className="w-4 h-4 mr-1.5 animate-pulse flex-shrink-0" />
              <span className="font-semibold text-xs">{t.demoMode}</span>
              <span className="mx-1 text-xs hidden sm:inline">·</span>
              <span className="text-cyan-100 text-xs hidden sm:inline">{t.demoDesc}</span>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button onClick={onConnectReal} className="px-2.5 py-1 bg-white text-cyan-600 font-semibold rounded-lg text-xs flex items-center">
                {t.connectReal}<ArrowRight className="w-3 h-3 ml-1" />
              </button>
              <button onClick={() => setShowDemoBanner(false)} className="p-0.5 hover:bg-white/20 rounded"><X className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Guide */}
      {showWelcomeGuide && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-lg w-full p-6 border border-purple-500/50 shadow-2xl">
            <div className="text-center mb-5">
              <div className="text-5xl mb-3">🎉</div>
              <h2 className="text-2xl font-bold text-white mb-2">{t.welcomeTitle}</h2>
              <p className="text-gray-300 text-sm">{t.welcomeDesc}</p>
            </div>
            <div className="space-y-3 mb-5">
              {[{ emoji: '🤖', title: t.yourBot, desc: t.botReady }, { emoji: '💰', title: t.virtualFunds, desc: t.virtualDesc }, { emoji: '🌍', title: t.globalVision, desc: t.gvDesc }].map((item, i) => (
                <div key={i} className="flex items-start bg-white/5 rounded-lg p-3"><span className="text-2xl mr-3">{item.emoji}</span><div><h4 className="text-white font-semibold text-sm">{item.title}</h4><p className="text-gray-400 text-xs">{item.desc}</p></div></div>
              ))}
            </div>
            <button onClick={() => setShowWelcomeGuide(false)} className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl">{t.startExploring}</button>
          </div>
        </div>
      )}

      {/* Header - compact */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400 mr-1.5" />
              <h1 className="text-lg sm:text-xl font-bold text-white cursor-pointer" onClick={() => window.location.reload()}>Ai<span className="text-purple-400">Fund</span></h1>
              {isDemoMode && <span className="ml-1.5 px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 text-[10px] font-semibold rounded-full border border-cyan-500/30">Demo</span>}
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="flex items-center space-x-0.5 bg-white/10 rounded-full px-0.5 py-0.5">
                <button onClick={() => setLang('en')} className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${lang === 'en' ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>EN</button>
                <button onClick={() => setLang('zh')} className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${lang === 'zh' ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>中文</button>
              </div>
              <button onClick={() => setShowWhitepaper(true)} className="p-1.5 text-gray-400 hover:text-white rounded" data-testid="dashboard-whitepaper-btn"><FileText className="w-4 h-4" /></button>
              <button onClick={() => setShowNotifications(true)} className="relative p-1.5 text-gray-400 hover:text-white rounded">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center">{unreadCount > 9 ? '9+' : unreadCount}</span>}
              </button>
              <div className="hidden sm:flex items-center">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tierBadge.color} text-white mr-1.5`}>{tierBadge.text}</span>
                <span className="text-gray-400 text-xs">${userData?.user?.balance_usd?.toFixed(0) || '0'}</span>
              </div>
              <button onClick={isDemoMode ? onExitDemo : onDisconnect} className="p-1.5 text-gray-400 hover:text-white rounded"><LogOut className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* Activation */}
        {userData?.user?.tier === 'inactive' && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 mb-4">
            <h3 className="text-base font-bold text-yellow-400 mb-1">{t.notActivated}</h3>
            <p className="text-gray-300 text-xs mb-3">{t.depositPrompt}</p>
            <button onClick={() => setShowDepositModal(true)} className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg text-sm" data-testid="deposit-btn"><Plus className="inline w-4 h-4 mr-1" />{t.depositNow}</button>
          </div>
        )}
        {userData?.user?.tier !== 'inactive' && !userData?.has_bot && (
          <div className="bg-purple-500/20 border border-purple-500/50 rounded-xl p-4 mb-4">
            <h3 className="text-base font-bold text-purple-400 mb-1">{t.activated}</h3>
            <p className="text-gray-300 text-xs mb-3">{t.activatedDesc}</p>
            <button onClick={() => setShowCreateBotModal(true)} className="px-4 py-2 bg-purple-500 text-white font-bold rounded-lg text-sm" data-testid="create-bot-btn"><Bot className="inline w-4 h-4 mr-1" />{t.adoptBot}</button>
          </div>
        )}

        {/* Global Vision Banner */}
        {userData?.user?.tier !== 'inactive' && (
          <div className={`rounded-xl p-4 mb-4 border ${userData?.user?.has_global_vision ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/50' : 'bg-gradient-to-r from-yellow-600 to-orange-600 border-yellow-500'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0">
                <Globe className="w-8 h-8 sm:w-10 sm:h-10 text-white mr-3 flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-white">{t.gvTitle}</h3>
                  <p className={`text-xs truncate ${userData?.user?.has_global_vision ? 'text-purple-200' : 'text-yellow-100'}`}>
                    {userData?.user?.has_global_vision ? t.gvUnlocked : t.gvLocked}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowGlobalVision(true)} className={`px-4 py-2 font-bold rounded-lg text-xs flex-shrink-0 ${userData?.user?.has_global_vision ? 'bg-purple-600 text-white' : 'bg-white text-orange-600'}`} data-testid="global-vision-btn">
                {userData?.user?.has_global_vision ? 'Enter →' : 'Explore →'}
              </button>
            </div>
          </div>
        )}

        {/* Bot Dashboard */}
        {botData && <BotDashboard botData={botData} userData={userData} onRefresh={loadBotData} onShowVIP={() => setShowVIPUpgrade(true)} onShareAchievement={(a) => { setShareAchievement(a); setShowShareModal(true); }} />}
        {!botData && userData?.has_bot && <div className="text-center py-12"><RefreshCw className="w-10 h-10 text-gray-400 mx-auto mb-3 animate-spin" /><p className="text-gray-400 text-sm">{t.loadingBot}</p></div>}

        {/* Desktop Quick Actions - hidden on mobile (mobile uses bottom nav) */}
        {userData?.user?.tier !== 'inactive' && (
          <div className="hidden sm:grid mt-6 grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {[
              { onClick: () => setShowDepositModal(true), icon: <Plus className="w-6 h-6 text-purple-400" />, title: t.deposit, desc: t.depositDesc, bg: 'bg-white/10 border-white/20' },
              userData?.user?.tier !== 'vip'
                ? { onClick: () => setShowVIPUpgrade(true), icon: <Crown className="w-6 h-6 text-yellow-400" />, title: t.upgradeVip, desc: t.vipDesc, bg: 'bg-yellow-500/10 border-yellow-500/30', testid: 'vip-upgrade-quick-btn' }
                : { onClick: () => setShowApiSettings(true), icon: <Key className="w-6 h-6 text-yellow-400" />, title: t.apiSettings, desc: t.apiDesc, bg: 'bg-yellow-500/10 border-yellow-500/30', testid: 'api-settings-quick-btn' },
              { onClick: () => setShowGlobalVision(true), icon: <Globe className="w-6 h-6 text-purple-400" />, title: t.globalVisionBtn, desc: t.gvBtnDesc, bg: 'bg-purple-500/10 border-purple-500/30', testid: 'global-vision-quick-btn' },
              { onClick: () => setShowBacktest(true), icon: <Rewind className="w-6 h-6 text-cyan-400" />, title: t.backtest, desc: t.backtestDesc, bg: 'bg-cyan-500/10 border-cyan-500/30', testid: 'backtest-btn' },
              ...(botData ? [{ onClick: () => setShowBotShowcase(true), icon: <Sparkles className="w-6 h-6 text-pink-400" />, title: t.botGrowth, desc: t.botGrowthDesc, bg: 'bg-pink-500/10 border-pink-500/30', testid: 'bot-showcase-quick-btn' }] : []),
              { onClick: () => setShowVipLevels(true), icon: <Crown className="w-6 h-6 text-yellow-400" />, title: t.vipLevels, desc: t.vipLevelsDesc, bg: 'bg-yellow-500/10 border-yellow-500/30', testid: 'vip-levels-btn' },
              { onClick: () => setShowReferral(true), icon: <Share2 className="w-6 h-6 text-green-400" />, title: t.referFriends, desc: t.referDesc, bg: 'bg-green-500/10 border-green-500/30', testid: 'referral-btn' },
              { onClick: () => setShowNFTRights(true), icon: <Shield className="w-6 h-6 text-indigo-400" />, title: 'Account NFT', desc: 'Rights · Transfer', bg: 'bg-indigo-500/10 border-indigo-500/30', testid: 'nft-rights-btn' },
              { onClick: () => setShowCoCreator(true), icon: <Trophy className="w-6 h-6 text-amber-400" />, title: 'Co-Creator', desc: '10K Waitlist', bg: 'bg-amber-500/10 border-amber-500/30', testid: 'co-creator-btn' },
              { onClick: onRefresh, icon: <RefreshCw className="w-6 h-6 text-gray-400" />, title: t.refresh, desc: t.refreshDesc, bg: 'bg-white/10 border-white/20' },
            ].map((btn, i) => (
              <button key={i} onClick={btn.onClick} className={`p-4 ${btn.bg} hover:bg-white/20 rounded-xl border transition-all text-left`} data-testid={btn.testid}>
                <div className="mb-2">{btn.icon}</div><h4 className="text-sm font-semibold text-white mb-0.5">{btn.title}</h4><p className="text-gray-400 text-xs">{btn.desc}</p>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* ===== MOBILE BOTTOM NAVIGATION BAR ===== */}
      {userData?.user?.tier !== 'inactive' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-white/10 z-30 sm:hidden" data-testid="mobile-nav">
          <div className="flex items-center justify-around py-1.5 px-1">
            {/* Global Vision */}
            <button onClick={() => setShowGlobalVision(true)} className="flex flex-col items-center py-1 px-2 text-gray-400 hover:text-purple-400 transition-all" data-testid="nav-global-vision">
              <Globe className="w-5 h-5 mb-0.5" />
              <span className="text-[9px] font-semibold">Vision</span>
            </button>

            {/* Bot / Showcase */}
            <button onClick={() => botData ? setShowBotShowcase(true) : null} className="flex flex-col items-center py-1 px-2 text-gray-400 hover:text-pink-400 transition-all" data-testid="nav-bot">
              <Zap className="w-5 h-5 mb-0.5" />
              <span className="text-[9px] font-semibold">Bot</span>
            </button>

            {/* Pay (center, highlighted) */}
            <button onClick={() => setShowDepositModal(true)} className="flex flex-col items-center -mt-3" data-testid="nav-pay">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 mb-0.5">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <span className="text-[9px] font-semibold text-purple-400">Pay</span>
            </button>

            {/* Co-Creator */}
            <button onClick={() => setShowCoCreator(true)} className="flex flex-col items-center py-1 px-2 text-gray-400 hover:text-yellow-400 transition-all" data-testid="nav-cocreator">
              <Trophy className="w-5 h-5 mb-0.5" />
              <span className="text-[9px] font-semibold">Creator</span>
            </button>

            {/* More Menu */}
            <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="flex flex-col items-center py-1 px-2 text-gray-400 hover:text-white transition-all relative" data-testid="nav-more">
              <Menu className="w-5 h-5 mb-0.5" />
              <span className="text-[9px] font-semibold">More</span>
            </button>
          </div>

          {/* More Menu Popup */}
          {showMoreMenu && (
            <div className="absolute bottom-full left-0 right-0 bg-slate-900 border-t border-white/10 p-3 shadow-2xl">
              <div className="grid grid-cols-4 gap-2">
                {[
                  { onClick: () => { setShowVipLevels(true); setShowMoreMenu(false); }, icon: <Crown className="w-5 h-5 text-yellow-400" />, label: 'VIP Levels' },
                  { onClick: () => { setShowReferral(true); setShowMoreMenu(false); }, icon: <Users className="w-5 h-5 text-green-400" />, label: 'Refer' },
                  { onClick: () => { setShowBacktest(true); setShowMoreMenu(false); }, icon: <BarChart3 className="w-5 h-5 text-cyan-400" />, label: 'Backtest' },
                  { onClick: () => { setShowNFTRights(true); setShowMoreMenu(false); }, icon: <Shield className="w-5 h-5 text-indigo-400" />, label: 'NFT' },
                  { onClick: () => { userData?.user?.tier === 'vip' ? setShowApiSettings(true) : setShowVIPUpgrade(true); setShowMoreMenu(false); }, icon: <Key className="w-5 h-5 text-orange-400" />, label: userData?.user?.tier === 'vip' ? 'API' : 'VIP' },
                  { onClick: () => { setShowWhitepaper(true); setShowMoreMenu(false); }, icon: <FileText className="w-5 h-5 text-gray-400" />, label: 'Docs' },
                  { onClick: () => { onRefresh(); setShowMoreMenu(false); }, icon: <RefreshCw className="w-5 h-5 text-gray-400" />, label: 'Refresh' },
                  { onClick: () => setShowMoreMenu(false), icon: <X className="w-5 h-5 text-gray-500" />, label: 'Close' },
                ].map((item, i) => (
                  <button key={i} onClick={item.onClick} className="flex flex-col items-center p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                    {item.icon}
                    <span className="text-white text-[10px] mt-1">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>
      )}

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
      {showNFTRights && <NFTAccountRights walletAddress={walletAddress} userData={userData} onClose={() => setShowNFTRights(false)} />}
      {showCoCreator && <CoCreatorWaitlist walletAddress={walletAddress} userData={userData} onClose={() => setShowCoCreator(false)} />}
      <AiCustomerService walletAddress={walletAddress} />
    </div>
  );
};

export default Dashboard;
