import React, { useState } from 'react';
import { Wallet, TrendingUp, Bot, Globe, Lock, Eye, ExternalLink, X, Search, Users, Shield, Download, Play, FileText, ChevronRight } from 'lucide-react';
import WhitepaperViewer from './WhitepaperViewer';

const WALLETS = [
  { name: 'MetaMask', desc: 'Most popular Ethereum wallet', descZh: '最流行的以太坊钱包', icon: '🦊', url: 'https://metamask.io/download/', chrome: 'https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn', type: 'Browser + Mobile' },
  { name: 'OKX Wallet', desc: 'OKX official Web3 wallet', descZh: 'OKX交易所官方钱包', icon: '⭕', url: 'https://www.okx.com/web3', chrome: 'https://chromewebstore.google.com/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge', type: 'Browser + Mobile' },
  { name: 'WizzWallet', desc: 'Atomicals protocol & ARC-20 assets', descZh: 'Atomicals协议及ARC-20资产钱包', icon: '🧙', url: 'https://wizzwallet.io/', chrome: 'https://chromewebstore.google.com/detail/wizz-wallet/ghlmndacnhlaekppcllcpcjjjomjkjpg', type: 'Browser Extension' },
  { name: 'Trust Wallet', desc: 'Binance recommended wallet', descZh: '币安官方推荐钱包', icon: '🛡️', url: 'https://trustwallet.com/download', chrome: 'https://chromewebstore.google.com/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph', type: 'Browser + Mobile' },
  { name: 'Coinbase Wallet', desc: 'Coinbase official wallet', descZh: 'Coinbase官方钱包', icon: '🔵', url: 'https://www.coinbase.com/wallet/downloads', chrome: 'https://chromewebstore.google.com/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad', type: 'Browser + Mobile' },
  { name: 'Unisat', desc: 'Bitcoin inscriptions wallet', descZh: '比特币铭文钱包', icon: '🟠', url: 'https://unisat.io/download', chrome: 'https://chromewebstore.google.com/detail/unisat-wallet/ppbibelpcjmhbdihakflkdcoccbgbkpo', type: 'Browser Extension' },
];

const CHROME_URL = 'https://www.google.com/chrome/';

const WalletGuideModal = ({ onClose, lang }) => {
  const isEn = lang === 'en';
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-lg w-full p-5 sm:p-6 border border-purple-500/30 shadow-2xl my-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-white">{isEn ? "Don't have a wallet?" : '还没有钱包？'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <p className="text-gray-300 text-sm mb-1">{isEn ? 'A crypto wallet is your gateway to Web3.' : '加密钱包是你进入Web3世界的"银行卡"。'}</p>
        <p className="text-gray-400 text-xs mb-4">{isEn ? 'Pick one, install in 3 minutes. We recommend MetaMask for beginners.' : '选一个下载安装，3分钟搞定。推荐新手使用 MetaMask。'}</p>

        {/* Chrome download */}
        <a href={CHROME_URL} target="_blank" rel="noopener noreferrer"
          className="flex items-center p-3 mb-4 bg-blue-500/10 border border-blue-500/30 rounded-xl hover:bg-blue-500/20 transition-all"
          data-testid="chrome-download-link"
        >
          <span className="text-2xl mr-3">🌐</span>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">{isEn ? 'Download Chrome Browser' : '下载 Chrome 浏览器'}</p>
            <p className="text-gray-400 text-xs">{isEn ? 'Required for browser extension wallets' : '浏览器插件钱包需要 Chrome 浏览器'}</p>
          </div>
          <Download className="w-4 h-4 text-blue-400" />
        </a>

        <div className="space-y-2 mb-4 max-h-[50vh] overflow-y-auto">
          {WALLETS.map((w) => (
            <div key={w.name} className="p-3 bg-white/5 rounded-xl border border-white/10 hover:border-purple-400/50 transition-all" data-testid={`wallet-${w.name.toLowerCase().replace(/\s/g, '-')}`}>
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">{w.icon}</span>
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm">{w.name}</h4>
                  <p className="text-gray-400 text-xs">{isEn ? w.desc : w.descZh}</p>
                </div>
              </div>
              <div className="flex gap-2 ml-9">
                <a href={w.url} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 text-xs font-semibold rounded-lg transition-all">
                  {isEn ? 'Official Site' : '官网下载'} <ExternalLink className="w-3 h-3 ml-1" />
                </a>
                <a href={w.chrome} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 text-xs font-semibold rounded-lg transition-all">
                  Chrome {isEn ? 'Extension' : '插件商店'} <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl mb-3">
          <p className="text-cyan-300 text-xs">
            <strong>{isEn ? "Don't want to install?" : '不想装钱包？'}</strong> {isEn ? 'Click "Free Demo" on the homepage to try everything!' : '点击首页"免费体验演示"按钮，无需钱包也能体验全部功能！'}
          </p>
        </div>
        <button onClick={onClose} className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all text-sm">
          {isEn ? 'Got it' : '我知道了'}
        </button>
      </div>
    </div>
  );
};

const OnboardingVideo = ({ onClose, lang }) => {
  const isEn = lang === 'en';
  const steps = isEn ? [
    { time: '0:00', title: 'Welcome to AIFund', desc: 'Your AI-powered wealth companion', icon: '👋' },
    { time: '0:10', title: 'Create a Wallet', desc: 'Download MetaMask or any supported wallet in 3 minutes', icon: '🦊' },
    { time: '0:20', title: 'Deposit & Activate', desc: 'Send as little as $1 in crypto to get started', icon: '💰' },
    { time: '0:30', title: 'Adopt Your Bot', desc: 'Give your AI trading Bot a name and watch it grow', icon: '🤖' },
    { time: '0:40', title: 'Follow Bot Signals', desc: 'Your Bot sends daily buy/sell signals. You decide.', icon: '📊' },
    { time: '0:50', title: 'Go VIP', desc: 'Connect exchange API, let Bot trade automatically 24/7', icon: '👑' },
  ] : [
    { time: '0:00', title: '欢迎来到 AIFund', desc: '你的AI财富伙伴', icon: '👋' },
    { time: '0:10', title: '创建钱包', desc: '下载MetaMask或其他钱包，3分钟搞定', icon: '🦊' },
    { time: '0:20', title: '充值激活', desc: '发送最低1美元等值加密货币即可开始', icon: '💰' },
    { time: '0:30', title: '领养Bot', desc: '给你的AI交易Bot取个名字，看它成长', icon: '🤖' },
    { time: '0:40', title: '跟随Bot信号', desc: 'Bot每天发送买卖信号，你来决定是否执行', icon: '📊' },
    { time: '0:50', title: '升级VIP', desc: '连接交易所API，让Bot 24/7自动帮你赚钱', icon: '👑' },
  ];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-2xl w-full border border-purple-500/30 shadow-2xl">
        <div className="p-5 border-b border-purple-500/30 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Play className="w-5 h-5 text-purple-400 mr-2" />
            {isEn ? 'Quick Start Guide (60s)' : '新手快速入门 (60秒)'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {/* Animated timeline */}
        <div className="p-6">
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-yellow-500"></div>
            <div className="space-y-5">
              {steps.map((step, i) => (
                <div key={i} className="relative pl-14 animate-fadeIn" style={{ animationDelay: `${i * 200}ms` }}>
                  <div className="absolute left-3.5 w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xs text-white font-bold border-2 border-slate-800">
                    {i + 1}
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-400/30 transition-all">
                    <div className="flex items-center mb-1">
                      <span className="text-2xl mr-2">{step.icon}</span>
                      <div>
                        <span className="text-purple-400 text-xs font-mono mr-2">{step.time}</span>
                        <span className="text-white font-semibold text-sm">{step.title}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs ml-9">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-purple-500/30 text-center">
          <button onClick={onClose} className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:scale-105 transition-all">
            {isEn ? "Let's Go!" : '开始体验！'}
          </button>
        </div>
      </div>
    </div>
  );
};

const LandingPage = ({ onConnect, onDemoMode, loading }) => {
  const [showWalletGuide, setShowWalletGuide] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showWhitepaper, setShowWhitepaper] = useState(false);
  const [lang, setLang] = useState(() => localStorage.getItem('aifund_lang') || 'en');
  const handleSetLang = (l) => { setLang(l); localStorage.setItem('aifund_lang', l); };

  const handleConnect = () => {
    if (typeof window.ethereum !== 'undefined') {
      onConnect();
    } else {
      setShowWalletGuide(true);
    }
  };

  const t = lang === 'zh' ? {
    slogan: '让AI帮你赚钱',
    subtitle: '每个人都有平等享受全球财富的权利',
    connectBtn: '连接钱包从1U开始',
    demoBtn: '免费体验演示',
    minDeposit: '最低充值 $1 美元等值加密货币即可激活',
    noWallet: '没有钱包？点击"免费体验演示"立即体验',
    feat1Title: '让AI帮你赚钱',
    feat1Desc: '你的专属AI Bot，全天候分析全球市场，自动发现赚钱机会。你睡觉时，它在帮你工作。',
    feat2Title: 'Bot是你的千里眼',
    feat2Desc: '你的Bot能看到全球金融市场的每一个角落，从加密货币到美股，从期货到预测市场，不放过任何机会。',
    feat3Title: '无门槛 无国界',
    feat3Desc: '最低1美元起步，无需银行账户，无国界限制。每个人都能借助AI和自己专属Bot的力量。',
    copy1: '这一次，你是从100美元到100万美元暴富神话的主角',
    howToStart: '如何开始',
    videoBtn: '观看新手指南 (60秒)',
    step1: '连接钱包', step1sub: '3分钟创建',
    step2: '充值激活', step2sub: '最低1美元',
    step3: '领养Bot', step3sub: '给它取个名字',
    step4: '跟随Bot', step4sub: 'Bot只提供投资情报，不操作用户资金和交易账户',
    step5: 'Bot帮主人赚钱', step5sub: '通过API接入，让Bot接管账户，24/7自动赚钱',
    statsTitle: '平台实时数据',
    statsNote: '* 数据为演示数据，实际收益因市场波动而异',
    gvTitle: '全球视野', gvSubtitle: '看看过去10年你错过了哪些暴富机会', gvUnlock: '仅需 9.9U 解锁',
    basic: '基础版', vip: 'VIP版',
    basicDesc: '充值激活开始体验', vipDesc: '让Bot用真金白银帮你赚',
    basicF1: '专属AI交易Bot', basicF2: '$10,000模拟资金', basicF3: '实时收益展示', basicF4: 'Bot自动成长进化',
    vipF1: '基础版所有功能', vipF2: '连接交易所账户', vipF3: 'Bot自动真实交易', vipF4: '平台仅收盈利的10%',
    whitepaper: '白皮书', whitepaperDesc: '了解完整规则',
    footer: '资金自主 · 全程透明 · 人人可参与',
    footerCrypto: '支持: BTC, ETH, USDT, USDC, BNB, SOL 等主流加密货币',
  } : {
    slogan: 'Let AI Earn For You',
    subtitle: 'Equal access to global wealth is everyone\'s right',
    connectBtn: 'Connect Wallet',
    demoBtn: 'Free Demo',
    minDeposit: 'Activate with as little as $1 in crypto',
    noWallet: 'No wallet? Try "Free Demo" to experience everything',
    feat1Title: 'AI Earns For You',
    feat1Desc: 'Your personal AI Bot monitors global markets 24/7, finding profit opportunities while you sleep.',
    feat2Title: 'Bot is Your Global Eye',
    feat2Desc: 'Your Bot sees every corner of global finance — crypto, stocks, futures, prediction markets. No opportunity missed.',
    feat3Title: 'No Barriers, No Borders',
    feat3Desc: 'Start from just $1. No bank account needed. Everyone can harness the power of AI and their own Bot.',
    copy1: 'This time, YOU are the hero of the $100 to $1,000,000 story',
    howToStart: 'How It Works',
    videoBtn: 'Quick Start Guide (60s)',
    step1: 'Connect Wallet', step1sub: '3 min setup',
    step2: 'Deposit', step2sub: 'From $1',
    step3: 'Adopt Bot', step3sub: 'Name your Bot',
    step4: 'Follow Bot', step4sub: 'Bot gives intel only — never touches your funds',
    step5: 'Bot Earns For You', step5sub: 'Connect API, let Bot trade 24/7 automatically',
    statsTitle: 'Platform Stats',
    statsNote: '* Demo data. Actual returns vary with market conditions.',
    gvTitle: 'Global Vision', gvSubtitle: 'See which wealth opportunities you missed in the last 10 years', gvUnlock: 'Unlock for 9.9U',
    basic: 'Basic', vip: 'VIP',
    basicDesc: 'Deposit to activate', vipDesc: 'Let Bot trade real money',
    basicF1: 'Personal AI Trading Bot', basicF2: '$10,000 virtual funds', basicF3: 'Real-time profit display', basicF4: 'Bot auto-evolution',
    vipF1: 'All Basic features', vipF2: 'Connect exchange accounts', vipF3: 'Real automated trading', vipF4: 'Only 10% of profits as fee',
    whitepaper: 'Whitepaper', whitepaperDesc: 'Full rules & vision',
    footer: 'Your funds · Full transparency · For everyone',
    footerCrypto: 'Supports: BTC, ETH, USDT, USDC, BNB, SOL and more',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob top-0 left-0"></div>
          <div className="absolute w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 top-0 right-0"></div>
          <div className="absolute w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 bottom-0 left-1/2"></div>
        </div>

        {/* Top Bar: Language + Whitepaper */}
        <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
          <a href="#" onClick={(e) => { e.preventDefault(); setShowWhitepaper(true); }} className="flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-lg rounded-full text-gray-300 hover:text-white text-xs font-semibold border border-white/20 transition-all" data-testid="whitepaper-link">
            <FileText className="w-3 h-3 mr-1" />{t.whitepaper}
          </a>
          <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-lg rounded-full px-1 py-1 border border-white/20">
            <button onClick={() => handleSetLang('en')} className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${lang === 'en' ? 'bg-purple-500 text-white' : 'text-gray-300 hover:text-white'}`} data-testid="lang-en">EN</button>
            <button onClick={() => handleSetLang('zh')} className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${lang === 'zh' ? 'bg-purple-500 text-white' : 'text-gray-300 hover:text-white'}`} data-testid="lang-zh">中文</button>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          {/* Hero */}
          <div className="text-center mb-10 sm:mb-16">
            <div className="flex items-center justify-center mb-4">
              <Bot className="w-10 h-10 sm:w-14 sm:h-14 text-purple-400 mr-3" />
              <h1 className="text-4xl sm:text-6xl font-bold text-white">AI<span className="text-purple-400">fund</span>.com</h1>
            </div>
            <p className="text-xl sm:text-3xl font-bold text-white mb-2">{t.slogan}</p>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">{t.subtitle}</p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col items-center mb-12 sm:mb-20">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-3 w-full sm:w-auto px-4 sm:px-0">
              <button onClick={handleConnect} disabled={loading} className="px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg sm:text-xl font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50" data-testid="connect-wallet-btn">
                <Wallet className="inline-block w-5 h-5 mr-2" />{loading ? '...' : t.connectBtn}
              </button>
              <button onClick={onDemoMode} disabled={loading} className="px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-lg sm:text-xl font-bold rounded-full hover:shadow-2xl hover:shadow-cyan-500/30 hover:scale-105 transition-all disabled:opacity-50 border-2 border-cyan-400/50" data-testid="demo-mode-btn">
                <Eye className="inline-block w-5 h-5 mr-2" />{loading ? '...' : t.demoBtn}
              </button>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">{t.minDeposit}</p>
            <p className="text-cyan-400 text-xs sm:text-sm mt-1">{t.noWallet}</p>
            {/* Video Guide Button */}
            <button onClick={() => setShowVideo(true)} className="mt-3 flex items-center px-5 py-2 bg-white/10 hover:bg-white/20 rounded-full text-gray-300 hover:text-white text-sm transition-all border border-white/20" data-testid="video-guide-btn">
              <Play className="w-4 h-4 mr-2 text-purple-400" />{t.videoBtn}
            </button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 sm:mb-16 px-2 sm:px-0">
            {[
              { icon: <TrendingUp className="w-7 h-7 text-purple-400" />, bg: 'bg-purple-500/20', title: t.feat1Title, desc: t.feat1Desc },
              { icon: <Search className="w-7 h-7 text-pink-400" />, bg: 'bg-pink-500/20', title: t.feat2Title, desc: t.feat2Desc },
              { icon: <Users className="w-7 h-7 text-indigo-400" />, bg: 'bg-indigo-500/20', title: t.feat3Title, desc: t.feat3Desc },
            ].map((f, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-purple-400 transition-all">
                <div className={`${f.bg} w-14 h-14 rounded-full flex items-center justify-center mb-5`}>{f.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-gray-300 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Marketing Copy */}
          <div className="text-center mb-12 sm:mb-16 px-4">
            <p className="text-xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-cyan-400 to-blue-400 leading-relaxed">{t.copy1}</p>
          </div>

          {/* How It Works */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 sm:p-12 border border-white/10 mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-white text-center mb-8 sm:mb-12">{t.howToStart}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
              {[
                { n: 1, title: t.step1, sub: t.step1sub, bg: 'bg-purple-600' },
                { n: 2, title: t.step2, sub: t.step2sub, bg: 'bg-purple-600' },
                { n: 3, title: t.step3, sub: t.step3sub, bg: 'bg-purple-600' },
                { n: 4, title: t.step4, sub: t.step4sub, bg: 'bg-gradient-to-br from-cyan-500 to-blue-600' },
                { n: 5, title: t.step5, sub: t.step5sub, bg: 'bg-gradient-to-br from-yellow-500 to-orange-500' },
              ].map((s) => (
                <div key={s.n} className={`text-center ${s.n === 5 ? 'col-span-2 sm:col-span-1' : ''}`}>
                  <div className={`${s.bg} w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-xl sm:text-2xl font-bold text-white`}>{s.n}</div>
                  <h4 className="text-sm sm:text-lg font-semibold text-white mb-1">{s.title}</h4>
                  <p className="text-gray-400 text-xs sm:text-sm">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl p-6 sm:p-8 border border-green-500/30 mb-12 sm:mb-16">
            <h2 className="text-xl sm:text-3xl font-bold text-white text-center mb-6">{t.statsTitle}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { v: '12,847', l: lang === 'zh' ? '活跃Bot数' : 'Active Bots', c: 'text-green-400' },
                { v: '$2.4M', l: lang === 'zh' ? '累计收益' : 'Total Profit', c: 'text-yellow-400' },
                { v: '67.8%', l: lang === 'zh' ? '平均胜率' : 'Avg Win Rate', c: 'text-purple-400' },
                { v: '24/7', l: lang === 'zh' ? '全天候运行' : 'Always On', c: 'text-cyan-400' },
              ].map((s, i) => (
                <div key={i} className="text-center"><div className={`text-2xl sm:text-4xl font-bold ${s.c} mb-1`}>{s.v}</div><p className="text-gray-300 text-sm">{s.l}</p></div>
              ))}
            </div>
            <p className="text-center text-gray-400 text-xs mt-4">{t.statsNote}</p>
          </div>

          {/* Global Vision */}
          <div onClick={handleConnect} className="bg-gradient-to-br from-purple-600/30 via-pink-600/20 to-orange-600/30 rounded-2xl p-6 sm:p-8 border-2 border-purple-500/50 mb-12 sm:mb-16 cursor-pointer hover:border-purple-400 hover:shadow-2xl transition-all group" data-testid="global-vision-intro">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 mb-4 sm:mb-0">
                <div className="flex items-center mb-4">
                  <Globe className="w-10 h-10 text-purple-400 mr-3" />
                  <div><h2 className="text-2xl sm:text-3xl font-bold text-white">{t.gvTitle}</h2><p className="text-purple-300 text-sm">{t.gvSubtitle}</p></div>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {[{ i: '₿', n: '2015 BTC', v: '100U → $458K', x: '4583x' }, { i: '🐸', n: '2023 PEPE', v: '100U → $180K', x: '1800x' }, { i: '🖥️', n: '2024 NVDA', v: '100U → $320', x: '3.2x' }].map((c, i) => (
                    <div key={i} className="bg-black/30 rounded-xl p-3 border border-white/10">
                      <div className="text-lg mb-1">{c.i}</div><p className="text-white font-semibold text-xs">{c.n}</p><p className="text-green-400 text-sm font-bold">{c.v}</p><p className="text-gray-400 text-xs">{c.x}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center sm:ml-6 mt-4 sm:mt-0">
                <div className="flex items-center bg-gradient-to-r from-yellow-500 to-orange-500 px-5 py-3 rounded-xl group-hover:scale-105 transition-all">
                  <Lock className="w-4 h-4 text-black mr-2" /><span className="text-black font-bold text-sm">{t.gvUnlock}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12 sm:mb-16 px-2 sm:px-0">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border-2 border-purple-500/50">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">{t.basic}</h3>
                <div className="text-4xl font-bold text-purple-400 mb-3">≥1 <span className="text-xl">U</span></div>
                <p className="text-gray-300 mb-5 text-sm">{t.basicDesc}</p>
                <ul className="text-left space-y-2 mb-6">{[t.basicF1, t.basicF2, t.basicF3, t.basicF4].map((f, i) => (<li key={i} className="flex items-start text-gray-300 text-sm"><span className="text-green-400 mr-2">✓</span>{f}</li>))}</ul>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 sm:p-8 border-2 border-purple-400 shadow-2xl">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">{t.vip}</h3>
                <div className="text-4xl font-bold text-white mb-3">99 <span className="text-xl">U</span></div>
                <p className="text-white/90 mb-5 text-sm">{t.vipDesc}</p>
                <ul className="text-left space-y-2 mb-6">{[t.vipF1, t.vipF2, t.vipF3, t.vipF4].map((f, i) => (<li key={i} className="flex items-start text-white text-sm"><span className="text-yellow-300 mr-2">★</span>{f}</li>))}</ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center px-4">
            <div className="flex items-center justify-center text-gray-400 mb-3">
              <Shield className="w-4 h-4 mr-2" /><span className="text-sm">{t.footer}</span>
            </div>
            <p className="text-gray-500 text-xs">{t.footerCrypto}</p>
          </div>
        </div>
      </div>

      {showWalletGuide && <WalletGuideModal onClose={() => setShowWalletGuide(false)} lang={lang} />}
      {showVideo && <OnboardingVideo onClose={() => setShowVideo(false)} lang={lang} />}
      {showWhitepaper && <WhitepaperViewer onClose={() => setShowWhitepaper(false)} />}
    </div>
  );
};

export default LandingPage;
