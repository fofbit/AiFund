import React, { useState } from 'react';
import { X, Crown, TrendingUp, Shield, Zap, Star, ChevronRight, ChevronDown, ExternalLink, AlertCircle } from 'lucide-react';

// 100-level VIP system: 100U start → 10,000U max
// Each level = 1 profit-sharing deposit back. Level up by returning 10% of earnings.
const generateVipLevels = () => {
  const levels = [];
  for (let i = 1; i <= 100; i++) {
    const maxFund = Math.min(100 + (i - 1) * 99, 10000); // 100U → 10,000U
    const computePower = Math.min(i, 100); // 1% → 100%
    let tier, tierIcon;
    if (i <= 10) { tier = 'Bronze'; tierIcon = '🥉'; }
    else if (i <= 25) { tier = 'Silver'; tierIcon = '🥈'; }
    else if (i <= 50) { tier = 'Gold'; tierIcon = '🥇'; }
    else if (i <= 75) { tier = 'Platinum'; tierIcon = '💎'; }
    else if (i <= 95) { tier = 'Diamond'; tierIcon = '👑'; }
    else { tier = 'Legend'; tierIcon = '🏆'; }

    // Skin rewards at milestone levels
    let skinReward = null;
    if (i === 1) skinReward = 'Starter Bot Skin';
    else if (i === 10) skinReward = 'Bronze Armor';
    else if (i === 25) skinReward = 'Silver Wings';
    else if (i === 50) skinReward = 'Golden Crown';
    else if (i === 75) skinReward = 'Platinum Shield';
    else if (i === 100) skinReward = 'Legendary Aura';

    levels.push({ level: i, maxFund, computePower, tier, tierIcon, skinReward });
  }
  return levels;
};

const VIP_LEVELS = generateVipLevels();

// DEX & Meme platforms
const DEX_PLATFORMS = [
  { name: 'Unisat Marketplace', desc: 'BTC inscriptions, runes & BRC-20', icon: '🟠', url: 'https://unisat.io/market', hasApi: false, category: 'BTC Ecosystem' },
  { name: 'WiZZ / Atomicals', desc: 'ARC-20 tokens & Atomicals protocol', icon: '🧙', url: 'https://wizzwallet.io/', hasApi: false, category: 'BTC Ecosystem' },
  { name: 'Pump.fun', desc: 'Solana meme coin launchpad', icon: '🚀', url: 'https://pump.fun/', hasApi: false, category: 'Meme Launchpad' },
  { name: 'GMGN.ai', desc: 'Meme coin discovery & analytics', icon: '📡', url: 'https://gmgn.ai/', hasApi: false, category: 'Meme Analytics' },
  { name: 'Birdeye', desc: 'Solana DEX aggregator & analytics', icon: '🦅', url: 'https://birdeye.so/', hasApi: true, category: 'DEX Aggregator' },
  { name: 'Uniswap', desc: 'Ethereum DEX — largest TVL', icon: '🦄', url: 'https://app.uniswap.org/', hasApi: true, category: 'DEX' },
  { name: 'Jupiter', desc: 'Solana DEX aggregator', icon: '🪐', url: 'https://jup.ag/', hasApi: true, category: 'DEX Aggregator' },
  { name: 'Raydium', desc: 'Solana AMM & launchpad', icon: '☀️', url: 'https://raydium.io/', hasApi: true, category: 'DEX' },
  { name: 'PancakeSwap', desc: 'BNB Chain DEX', icon: '🥞', url: 'https://pancakeswap.finance/', hasApi: true, category: 'DEX' },
  { name: 'Moonshot', desc: 'New meme coin launcher', icon: '🌙', url: 'https://moonshot.money/', hasApi: false, category: 'Meme Launchpad' },
  { name: 'SunPump', desc: 'TRON meme coin launchpad', icon: '🌞', url: 'https://sunpump.meme/', hasApi: false, category: 'Meme Launchpad' },
  { name: 'DEXTOOLS', desc: 'Multi-chain DEX explorer', icon: '🔧', url: 'https://www.dextools.io/', hasApi: true, category: 'DEX Analytics' },
];

const VIPLevelSystem = ({ onClose, currentLevel = 1 }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedTier, setExpandedTier] = useState(null);

  const tiers = [
    { name: 'Bronze', icon: '🥉', range: '1-10', maxFund: '100-990U', color: 'from-orange-700 to-orange-900' },
    { name: 'Silver', icon: '🥈', range: '11-25', maxFund: '1,090-2,476U', color: 'from-gray-400 to-gray-600' },
    { name: 'Gold', icon: '🥇', range: '26-50', maxFund: '2,575-4,951U', color: 'from-yellow-500 to-yellow-700' },
    { name: 'Platinum', icon: '💎', range: '51-75', maxFund: '5,050-7,426U', color: 'from-cyan-400 to-cyan-600' },
    { name: 'Diamond', icon: '👑', range: '76-95', maxFund: '7,525-9,406U', color: 'from-purple-400 to-purple-600' },
    { name: 'Legend', icon: '🏆', range: '96-100', maxFund: '9,505-10,000U', color: 'from-yellow-300 to-orange-500' },
  ];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-2xl max-w-5xl w-full border border-yellow-500/30 shadow-2xl my-4">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-yellow-500/30 bg-gradient-to-r from-yellow-600/20 to-orange-600/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center" data-testid="vip-level-title">
                <Crown className="w-6 h-6 text-yellow-400 mr-2" />VIP Level System
              </h2>
              <p className="text-yellow-200 text-xs sm:text-sm mt-1">100 levels · Start from 100U · Max 10,000U managed capital</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-purple-500/20">
          {[
            { id: 'overview', label: 'Level Overview' },
            { id: 'rules', label: 'Rules & Rewards' },
            { id: 'dex', label: 'DEX & Meme Markets' },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-xs sm:text-sm font-semibold transition-all ${activeTab === tab.id ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400 hover:text-white'}`}
              data-testid={`vip-tab-${tab.id}`}
            >{tab.label}</button>
          ))}
        </div>

        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-3">
              {tiers.map((tier) => (
                <div key={tier.name}>
                  <button
                    onClick={() => setExpandedTier(expandedTier === tier.name ? null : tier.name)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r ${tier.color} border border-white/10 transition-all hover:border-white/30`}
                  >
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">{tier.icon}</span>
                      <div className="text-left">
                        <h4 className="text-white font-bold">{tier.name} Tier</h4>
                        <p className="text-white/70 text-xs">Levels {tier.range} · Max Fund: {tier.maxFund}</p>
                      </div>
                    </div>
                    {expandedTier === tier.name ? <ChevronDown className="w-5 h-5 text-white" /> : <ChevronRight className="w-5 h-5 text-white" />}
                  </button>
                  {expandedTier === tier.name && (
                    <div className="mt-1 bg-white/5 rounded-xl p-3 border border-white/5">
                      <div className="grid grid-cols-4 gap-1 text-xs text-gray-400 font-semibold mb-2 px-2">
                        <span>Level</span><span>Max Fund</span><span>Compute</span><span>Reward</span>
                      </div>
                      {VIP_LEVELS.filter(l => {
                        const [min, max] = tier.range.split('-').map(Number);
                        return l.level >= min && l.level <= max;
                      }).map((l) => (
                        <div key={l.level} className={`grid grid-cols-4 gap-1 text-xs px-2 py-1.5 rounded ${l.level === currentLevel ? 'bg-yellow-500/20 text-yellow-300' : 'text-gray-300'}`}>
                          <span className="font-semibold">Lv.{l.level}</span>
                          <span>${l.maxFund.toLocaleString()}</span>
                          <span>{l.computePower}%</span>
                          <span>{l.skinReward || '-'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              {/* Capital Management */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h3 className="text-white font-bold text-base mb-3 flex items-center">
                  <TrendingUp className="w-5 h-5 text-green-400 mr-2" />Capital Management Rules
                </h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start"><span className="text-green-400 mr-2 mt-0.5">1.</span>New VIP starts at <strong className="text-white mx-1">100U</strong> maximum managed capital — fair for everyone</li>
                  <li className="flex items-start"><span className="text-green-400 mr-2 mt-0.5">2.</span>Each time you return 10% profit share, your level increases by 1</li>
                  <li className="flex items-start"><span className="text-green-400 mr-2 mt-0.5">3.</span>After 100 level-ups, your Bot can manage up to <strong className="text-yellow-400 mx-1">10,000U</strong></li>
                  <li className="flex items-start"><span className="text-green-400 mr-2 mt-0.5">4.</span>Bot's managed capital grows with each level: 100U → 199U → 298U → ... → 10,000U</li>
                </ul>
              </div>

              {/* Profit Rules */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h3 className="text-white font-bold text-base mb-3 flex items-center">
                  <Shield className="w-5 h-5 text-blue-400 mr-2" />Profit Distribution Rules
                </h3>
                <div className="grid sm:grid-cols-2 gap-3 mb-3">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <p className="text-green-400 font-bold text-sm mb-1">50% — Snowball (Default)</p>
                    <p className="text-gray-300 text-xs">Up to 50% of Bot's earnings stay in the account to compound — growing your capital over time.</p>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                    <p className="text-cyan-400 font-bold text-sm mb-1">50% — Improve Your Life</p>
                    <p className="text-gray-300 text-xs">The other 50% of earnings must be withdrawn — to actually improve your life. Bot does not manage this portion.</p>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <p className="text-yellow-300 text-xs flex items-start"><AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" /><span>Platform takes <strong>10%</strong> of profits only when your Bot earns. Zero fees when there's no profit.</span></p>
                </div>
              </div>

              {/* Rewards */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h3 className="text-white font-bold text-base mb-3 flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-2" />Rewards & Benefits
                </h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="bg-white/5 rounded-lg p-3 border border-white/5 text-center">
                    <p className="text-2xl mb-1">🎨</p>
                    <p className="text-white font-semibold text-sm">Bot Skins</p>
                    <p className="text-gray-400 text-xs">Unique visual upgrades at milestone levels (10, 25, 50, 75, 100)</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/5 text-center">
                    <p className="text-2xl mb-1">🧠</p>
                    <p className="text-white font-semibold text-sm">Compute Power</p>
                    <p className="text-gray-400 text-xs">Higher levels = better AI analysis, faster signals, more markets</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/5 text-center">
                    <p className="text-2xl mb-1">💰</p>
                    <p className="text-white font-semibold text-sm">Capital Growth</p>
                    <p className="text-gray-400 text-xs">Bot manages more capital per level — from 100U to 10,000U</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DEX & Meme Tab */}
          {activeTab === 'dex' && (
            <div>
              <p className="text-gray-300 text-sm mb-4">
                For early-stage users with small capital, meme coins and DEX markets offer the highest potential returns. 
                Your Bot monitors these platforms and sends buy/sell alerts.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {DEX_PLATFORMS.map((p) => (
                  <div key={p.name} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-400/50 transition-all" data-testid={`dex-${p.name.toLowerCase().replace(/[\s./]/g, '-')}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{p.icon}</span>
                        <div>
                          <h4 className="text-white font-semibold text-sm">{p.name}</h4>
                          <p className="text-gray-400 text-xs">{p.desc}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.hasApi ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {p.hasApi ? 'API' : 'Alert'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">{p.category}</span>
                      <a href={p.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                        Visit <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <p className="text-purple-300 text-xs">
                  <strong>How it works:</strong> Platforms with "API" tag — Bot trades automatically. 
                  Platforms with "Alert" tag — Bot sends you buy/sell notifications, you execute manually.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VIPLevelSystem;
