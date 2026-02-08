import React, { useState } from 'react';
import { Wallet, TrendingUp, Bot, Sparkles, Globe, Lock, Eye, ExternalLink, X, Search, Users, Shield } from 'lucide-react';

const WALLETS = [
  { name: 'MetaMask', desc: '最流行的以太坊钱包', icon: '🦊', url: 'https://metamask.io/download/', type: '浏览器插件 + 手机App' },
  { name: 'OKX Wallet', desc: 'OKX交易所官方钱包', icon: '⭕', url: 'https://www.okx.com/web3', type: '浏览器插件 + 手机App' },
  { name: 'Trust Wallet', desc: '币安官方推荐钱包', icon: '🛡️', url: 'https://trustwallet.com/download', type: '手机App' },
  { name: 'Coinbase Wallet', desc: 'Coinbase官方钱包', icon: '🔵', url: 'https://www.coinbase.com/wallet/downloads', type: '浏览器插件 + 手机App' },
  { name: 'Unisat', desc: '比特币铭文钱包', icon: '🟠', url: 'https://unisat.io/download', type: '浏览器插件' },
];

const WalletGuideModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-lg w-full p-6 border border-purple-500/30 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">还没有钱包？</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
      </div>
      
      <p className="text-gray-300 mb-2">加密钱包是你进入Web3世界的"银行卡"。</p>
      <p className="text-gray-400 text-sm mb-6">选一个下载安装，3分钟搞定。推荐新手使用 MetaMask。</p>

      <div className="space-y-3 mb-6">
        {WALLETS.map((w) => (
          <a
            key={w.name}
            href={w.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:border-purple-400 hover:bg-white/10 transition-all group"
            data-testid={`wallet-link-${w.name.toLowerCase().replace(' ', '-')}`}
          >
            <span className="text-3xl mr-4">{w.icon}</span>
            <div className="flex-1">
              <h4 className="text-white font-semibold group-hover:text-purple-300 transition-colors">{w.name}</h4>
              <p className="text-gray-400 text-sm">{w.desc}</p>
              <p className="text-gray-500 text-xs">{w.type}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-purple-400" />
          </a>
        ))}
      </div>

      <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl mb-4">
        <p className="text-cyan-300 text-sm">
          <strong>不想装钱包？</strong>点击首页"免费体验演示"按钮，无需钱包也能体验全部功能！
        </p>
      </div>

      <button onClick={onClose} className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all">
        我知道了
      </button>
    </div>
  </div>
);

const LandingPage = ({ onConnect, onDemoMode, loading }) => {
  const [showWalletGuide, setShowWalletGuide] = useState(false);
  const [lang, setLang] = useState('zh'); // zh | en

  const handleConnect = () => {
    if (typeof window.ethereum !== 'undefined') {
      onConnect();
    } else {
      setShowWalletGuide(true);
    }
  };

  const t = lang === 'zh' ? {
    slogan: 'AI赚钱给大家分',
    subtitle: '让AI帮你赚钱 · 最低1美元起步 · 全球无门槛',
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
    copy1: '让每个普通人都能平等享受AI时代的财富红利',
    copy2: '这一次，你是从100美元到100万美元暴富神话的主角',
    howToStart: '如何开始',
    step1: '连接钱包', step1sub: '3分钟创建',
    step2: '充值激活', step2sub: '最低1美元',
    step3: '领养Bot', step3sub: '给它取个名字',
    step4: '跟随Bot', step4sub: 'Bot只提供投资情报，不操作用户资金和交易账户',
    step5: 'Bot帮主人赚钱', step5sub: '通过API接入，让Bot接管账户，24/7自动赚钱',
    statsTitle: '平台实时数据',
    statsNote: '* 数据为演示数据，实际收益因市场波动而异',
    gvTitle: '全球视野',
    gvSubtitle: '看看过去10年你错过了哪些暴富机会',
    gvUnlock: '仅需 9.9U 解锁',
    basic: '基础版', vip: 'VIP版',
    basicDesc: '充值激活开始体验',
    vipDesc: '让Bot用真金白银帮你赚',
    basicF1: '专属AI交易Bot',
    basicF2: '$10,000模拟资金',
    basicF3: '实时收益展示',
    basicF4: 'Bot自动成长进化',
    vipF1: '基础版所有功能',
    vipF2: '连接交易所账户',
    vipF3: 'Bot自动真实交易',
    vipF4: '平台仅收盈利的10%',
    footer: '资金自主 · 全程透明 · 人人可参与',
    footerCrypto: '支持: BTC, ETH, USDT, USDC, BNB, SOL 等主流加密货币',
  } : {
    slogan: 'AI Makes Money, We Share',
    subtitle: 'Let AI earn for you · Start from $1 · No barriers worldwide',
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
    copy1: 'Equal access to AI-powered wealth for everyone',
    copy2: 'This time, YOU are the hero of the $100 to $1,000,000 story',
    howToStart: 'How It Works',
    step1: 'Connect Wallet', step1sub: '3 min setup',
    step2: 'Deposit', step2sub: 'From $1',
    step3: 'Adopt Bot', step3sub: 'Name your Bot',
    step4: 'Follow Bot', step4sub: 'Bot gives intel only — never touches your funds',
    step5: 'Bot Earns For You', step5sub: 'Connect API, let Bot trade 24/7 automatically',
    statsTitle: 'Platform Stats',
    statsNote: '* Demo data. Actual returns vary with market conditions.',
    gvTitle: 'Global Vision',
    gvSubtitle: 'See which wealth opportunities you missed in the last 10 years',
    gvUnlock: 'Unlock for 9.9U',
    basic: 'Basic', vip: 'VIP',
    basicDesc: 'Deposit to activate',
    vipDesc: 'Let Bot trade real money',
    basicF1: 'Personal AI Trading Bot',
    basicF2: '$10,000 virtual funds',
    basicF3: 'Real-time profit display',
    basicF4: 'Bot auto-evolution',
    vipF1: 'All Basic features',
    vipF2: 'Connect exchange accounts',
    vipF3: 'Real automated trading',
    vipF4: 'Only 10% of profits as fee',
    footer: 'Your funds · Full transparency · For everyone',
    footerCrypto: 'Supports: BTC, ETH, USDT, USDC, BNB, SOL and more',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob top-0 left-0"></div>
          <div className="absolute w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 top-0 right-0"></div>
          <div className="absolute w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 bottom-0 left-1/2"></div>
        </div>

        {/* Language Switcher */}
        <div className="absolute top-4 right-4 z-10 flex items-center space-x-1 bg-white/10 backdrop-blur-lg rounded-full px-1 py-1 border border-white/20">
          <button onClick={() => setLang('zh')} className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${lang === 'zh' ? 'bg-purple-500 text-white' : 'text-gray-300 hover:text-white'}`} data-testid="lang-zh">中文</button>
          <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${lang === 'en' ? 'bg-purple-500 text-white' : 'text-gray-300 hover:text-white'}`} data-testid="lang-en">EN</button>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-16">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <Bot className="w-10 h-10 sm:w-16 sm:h-16 text-purple-400 mr-3" />
              <h1 className="text-4xl sm:text-6xl font-bold text-white">
                AI<span className="text-purple-400">fund</span>.com
              </h1>
            </div>
            <p className="text-xl sm:text-2xl text-gray-300 mb-3">{t.slogan}</p>
            <p className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto">{t.subtitle}</p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center mb-12 sm:mb-20">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 w-full sm:w-auto px-4 sm:px-0">
              <button
                onClick={handleConnect}
                disabled={loading}
                className="group relative px-8 sm:px-12 py-4 sm:py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg sm:text-xl font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
                data-testid="connect-wallet-btn"
              >
                <Wallet className="inline-block w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                {loading ? '...' : t.connectBtn}
              </button>
              <button
                onClick={onDemoMode}
                disabled={loading}
                className="group relative px-8 sm:px-10 py-4 sm:py-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-lg sm:text-xl font-bold rounded-full hover:shadow-2xl hover:shadow-cyan-500/30 hover:scale-105 transition-all duration-300 disabled:opacity-50 border-2 border-cyan-400/50"
                data-testid="demo-mode-btn"
              >
                <Eye className="inline-block w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                {loading ? '...' : t.demoBtn}
              </button>
            </div>
            <p className="text-gray-400 text-sm">{t.minDeposit}</p>
            <p className="text-cyan-400 text-sm mt-1">{t.noWallet}</p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-20 px-2 sm:px-0">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-purple-400 transition-all">
              <div className="bg-purple-500/20 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-5">
                <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{t.feat1Title}</h3>
              <p className="text-gray-300 text-sm sm:text-base">{t.feat1Desc}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-purple-400 transition-all">
              <div className="bg-pink-500/20 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-5">
                <Search className="w-7 h-7 sm:w-8 sm:h-8 text-pink-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{t.feat2Title}</h3>
              <p className="text-gray-300 text-sm sm:text-base">{t.feat2Desc}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-purple-400 transition-all">
              <div className="bg-indigo-500/20 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-5">
                <Users className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{t.feat3Title}</h3>
              <p className="text-gray-300 text-sm sm:text-base">{t.feat3Desc}</p>
            </div>
          </div>

          {/* Emotional Marketing Copy */}
          <div className="text-center mb-12 sm:mb-20 px-4">
            <p className="text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 mb-4 sm:mb-6 leading-relaxed">
              {t.copy1}
            </p>
            <p className="text-xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-cyan-400 to-blue-400 leading-relaxed">
              {t.copy2}
            </p>
          </div>

          {/* How It Works */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-12 border border-white/10 mb-12 sm:mb-20">
            <h2 className="text-2xl sm:text-4xl font-bold text-white text-center mb-8 sm:mb-12">{t.howToStart}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="bg-purple-600 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-xl sm:text-2xl font-bold text-white">1</div>
                <h4 className="text-sm sm:text-lg font-semibold text-white mb-1">{t.step1}</h4>
                <p className="text-gray-400 text-xs sm:text-sm">{t.step1sub}</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-600 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-xl sm:text-2xl font-bold text-white">2</div>
                <h4 className="text-sm sm:text-lg font-semibold text-white mb-1">{t.step2}</h4>
                <p className="text-gray-400 text-xs sm:text-sm">{t.step2sub}</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-600 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-xl sm:text-2xl font-bold text-white">3</div>
                <h4 className="text-sm sm:text-lg font-semibold text-white mb-1">{t.step3}</h4>
                <p className="text-gray-400 text-xs sm:text-sm">{t.step3sub}</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-xl sm:text-2xl font-bold text-white">4</div>
                <h4 className="text-sm sm:text-lg font-semibold text-white mb-1">{t.step4}</h4>
                <p className="text-gray-400 text-xs sm:text-sm">{t.step4sub}</p>
              </div>
              <div className="text-center col-span-2 sm:col-span-1">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-500 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-xl sm:text-2xl font-bold text-white">5</div>
                <h4 className="text-sm sm:text-lg font-semibold text-white mb-1">{t.step5}</h4>
                <p className="text-gray-400 text-xs sm:text-sm">{t.step5sub}</p>
              </div>
            </div>
          </div>

          {/* Live Stats */}
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-green-500/30 mb-12 sm:mb-20">
            <h2 className="text-xl sm:text-3xl font-bold text-white text-center mb-6 sm:mb-8">{t.statsTitle}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-2xl sm:text-4xl font-bold text-green-400 mb-1">12,847</div>
                <p className="text-gray-300 text-sm">{lang === 'zh' ? '活跃Bot数' : 'Active Bots'}</p>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-4xl font-bold text-yellow-400 mb-1">$2.4M</div>
                <p className="text-gray-300 text-sm">{lang === 'zh' ? '累计收益' : 'Total Profit'}</p>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-4xl font-bold text-purple-400 mb-1">67.8%</div>
                <p className="text-gray-300 text-sm">{lang === 'zh' ? '平均胜率' : 'Avg Win Rate'}</p>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-4xl font-bold text-cyan-400 mb-1">24/7</div>
                <p className="text-gray-300 text-sm">{lang === 'zh' ? '全天候运行' : 'Always On'}</p>
              </div>
            </div>
            <p className="text-center text-gray-400 text-xs sm:text-sm mt-4 sm:mt-6">{t.statsNote}</p>
          </div>

          {/* Global Vision */}
          <div 
            onClick={handleConnect}
            className="bg-gradient-to-br from-purple-600/30 via-pink-600/20 to-orange-600/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-purple-500/50 mb-12 sm:mb-20 cursor-pointer hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/20 transition-all group"
            data-testid="global-vision-intro"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 mb-4 sm:mb-0">
                <div className="flex items-center mb-4">
                  <Globe className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400 mr-3" />
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">{t.gvTitle}</h2>
                    <p className="text-purple-300 text-sm sm:text-lg">{t.gvSubtitle}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-black/30 rounded-xl p-3 sm:p-4 border border-white/10">
                    <div className="text-lg sm:text-2xl mb-1">₿</div>
                    <p className="text-white font-semibold text-xs sm:text-base">2015{lang === 'zh' ? '年买' : ' '}BTC</p>
                    <p className="text-green-400 text-sm sm:text-xl font-bold">100U → $458K</p>
                    <p className="text-gray-400 text-xs">4583x</p>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3 sm:p-4 border border-white/10">
                    <div className="text-lg sm:text-2xl mb-1">🐸</div>
                    <p className="text-white font-semibold text-xs sm:text-base">2023 PEPE</p>
                    <p className="text-green-400 text-sm sm:text-xl font-bold">100U → $180K</p>
                    <p className="text-gray-400 text-xs">1800x</p>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3 sm:p-4 border border-white/10">
                    <div className="text-lg sm:text-2xl mb-1">🖥️</div>
                    <p className="text-white font-semibold text-xs sm:text-base">2024 NVDA</p>
                    <p className="text-green-400 text-sm sm:text-xl font-bold">100U → $320</p>
                    <p className="text-gray-400 text-xs">3.2x</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center sm:ml-6">
                <div className="flex items-center bg-gradient-to-r from-yellow-500 to-orange-500 px-5 sm:px-6 py-3 rounded-xl group-hover:scale-105 transition-all">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-black mr-2" />
                  <span className="text-black font-bold text-sm sm:text-lg">{t.gvUnlock}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto mb-12 sm:mb-20 px-2 sm:px-0">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border-2 border-purple-500/50">
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{t.basic}</h3>
                <div className="text-4xl sm:text-5xl font-bold text-purple-400 mb-3">≥1 <span className="text-xl sm:text-2xl">U</span></div>
                <p className="text-gray-300 mb-5 text-sm sm:text-base">{t.basicDesc}</p>
                <ul className="text-left space-y-2 sm:space-y-3 mb-6">
                  {[t.basicF1, t.basicF2, t.basicF3, t.basicF4].map((f, i) => (
                    <li key={i} className="flex items-start text-gray-300 text-sm sm:text-base">
                      <span className="text-green-400 mr-2">✓</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 sm:p-8 border-2 border-purple-400 shadow-2xl">
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{t.vip}</h3>
                <div className="text-4xl sm:text-5xl font-bold text-white mb-3">99 <span className="text-xl sm:text-2xl">U</span></div>
                <p className="text-white/90 mb-5 text-sm sm:text-base">{t.vipDesc}</p>
                <ul className="text-left space-y-2 sm:space-y-3 mb-6">
                  {[t.vipF1, t.vipF2, t.vipF3, t.vipF4].map((f, i) => (
                    <li key={i} className="flex items-start text-white text-sm sm:text-base">
                      <span className="text-yellow-300 mr-2">★</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center px-4">
            <div className="flex items-center justify-center text-gray-400 mb-3">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">{t.footer}</span>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm">{t.footerCrypto}</p>
          </div>
        </div>
      </div>

      {/* Wallet Guide Modal */}
      {showWalletGuide && <WalletGuideModal onClose={() => setShowWalletGuide(false)} />}
    </div>
  );
};

export default LandingPage;
