import React from 'react';
import { Wallet, TrendingUp, Bot, Sparkles, Globe, Lock, Play, Eye } from 'lucide-react';

const LandingPage = ({ onConnect, onDemoMode, loading }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob top-0 left-0"></div>
          <div className="absolute w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 top-0 right-0"></div>
          <div className="absolute w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 bottom-0 left-1/2"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Bot className="w-16 h-16 text-purple-400 mr-4" />
              <h1 className="text-6xl font-bold text-white">
                AI<span className="text-purple-400">fund</span>.com
              </h1>
            </div>
            <p className="text-2xl text-gray-300 mb-4">
              AI赚钱给大家分
            </p>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              让AI帮你交易投资 · 从1U开始 · 全球无门槛
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center mb-20">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <button
                onClick={onConnect}
                disabled={loading}
                className="group relative px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="connect-wallet-btn"
              >
                <Wallet className="inline-block w-6 h-6 mr-3" />
                {loading ? '连接中...' : '连接钱包开始'}
              </button>
              
              <button
                onClick={onDemoMode}
                disabled={loading}
                className="group relative px-10 py-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xl font-bold rounded-full hover:shadow-2xl hover:shadow-cyan-500/30 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-cyan-400/50"
                data-testid="demo-mode-btn"
              >
                <Eye className="inline-block w-6 h-6 mr-3" />
                {loading ? '加载中...' : '免费体验演示'}
              </button>
            </div>
            
            <p className="text-gray-400 text-sm">
              最低充值 $1 美元等值加密货币即可激活
            </p>
            <p className="text-cyan-400 text-sm mt-1">
              ✨ 无需钱包，立即体验完整功能
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-400 transition-all">
              <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI自动交易</h3>
              <p className="text-gray-300">
                GPT-5.2驱动的智能交易机器人，24/7自主分析市场，自动执行交易策略，无需人工干预。
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-400 transition-all">
              <div className="bg-pink-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Bot自动进化</h3>
              <p className="text-gray-300">
                你的Bot会自动学习新策略和能力，发现DeFi挖矿、套利机会等新赚钱方式，持续提升收益。
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-400 transition-all">
              <div className="bg-indigo-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">全球无门槛</h3>
              <p className="text-gray-300">
                支持BTC、ETH等主流币充值，最低1美元起步。无需银行账户，无国界限制，人人可参与。
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/10 mb-20">
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              如何开始
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                  1
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">连接钱包</h4>
                <p className="text-gray-400">MetaMask或Unisat</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                  2
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">充值激活</h4>
                <p className="text-gray-400">≥1U基础版 | ≥99U VIP</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                  3
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">领养Bot</h4>
                <p className="text-gray-400">取名并开始模拟交易</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                  4
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">观看赚钱</h4>
                <p className="text-gray-400">Bot自动交易，全程透明</p>
              </div>
            </div>
          </div>

          {/* Live Demo Stats */}
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-3xl p-8 border border-green-500/30 mb-20">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              🔥 平台实时数据
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">12,847</div>
                <p className="text-gray-300">活跃Bot数</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">$2.4M</div>
                <p className="text-gray-300">累计收益</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">67.8%</div>
                <p className="text-gray-300">平均胜率</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-2">24/7</div>
                <p className="text-gray-300">全天候运行</p>
              </div>
            </div>
            <p className="text-center text-gray-400 text-sm mt-6">
              * 数据为演示数据，实际收益因市场波动而异
            </p>
          </div>

          {/* Pricing */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-purple-500/50">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">基础版</h3>
                <div className="text-5xl font-bold text-purple-400 mb-4">
                  ≥1 <span className="text-2xl">U</span>
                </div>
                <p className="text-gray-300 mb-6">充值等值加密货币激活</p>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-start text-gray-300">
                    <span className="text-green-400 mr-2">✓</span>
                    AI交易Bot（模拟）
                  </li>
                  <li className="flex items-start text-gray-300">
                    <span className="text-green-400 mr-2">✓</span>
                    $10,000虚拟资金
                  </li>
                  <li className="flex items-start text-gray-300">
                    <span className="text-green-400 mr-2">✓</span>
                    实时收益展示
                  </li>
                  <li className="flex items-start text-gray-300">
                    <span className="text-green-400 mr-2">✓</span>
                    Bot自动进化
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 border-2 border-purple-400 shadow-2xl">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">VIP版</h3>
                <div className="text-5xl font-bold text-white mb-4">
                  99 <span className="text-2xl">U</span>
                </div>
                <p className="text-white/90 mb-6">接入真实交易</p>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-start text-white">
                    <span className="text-yellow-300 mr-2">★</span>
                    基础版所有功能
                  </li>
                  <li className="flex items-start text-white">
                    <span className="text-yellow-300 mr-2">★</span>
                    API连接交易所
                  </li>
                  <li className="flex items-start text-white">
                    <span className="text-yellow-300 mr-2">★</span>
                    真金白银交易
                  </li>
                  <li className="flex items-start text-white">
                    <span className="text-yellow-300 mr-2">★</span>
                    平台仅收盈利的10%
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center">
            <div className="flex items-center justify-center text-gray-400 mb-4">
              <Lock className="w-5 h-5 mr-2" />
              <span>去中心化 · 资金自主 · 全程透明</span>
            </div>
            <p className="text-gray-500 text-sm">
              支持: BTC, ETH, USDT, USDC, BNB, SOL, XRP 等主流加密货币
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
