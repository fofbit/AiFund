import React, { useState } from 'react';
import axios from 'axios';
import { Crown, TrendingUp, Shield, Zap, DollarSign, X, Check, AlertCircle, Rocket, Percent, Wallet, ArrowRight } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const VIPUpgradePage = ({ walletAddress, userData, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('USDT');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const isVIP = userData?.user?.tier === 'vip';
  const currentBalance = userData?.user?.balance_usd || 0;
  const neededForVIP = Math.max(0, 99 - currentBalance);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      // Simulate deposit for VIP upgrade (99U)
      await axios.post(`${API}/deposit`, {
        wallet_address: walletAddress,
        currency: selectedPayment,
        amount: selectedPayment === 'USDT' ? 99 : (selectedPayment === 'BTC' ? 0.0015 : 0.035),
        tx_hash: 'vip_upgrade_' + Date.now()
      });

      alert('🎉 恭喜升级为VIP！您的Bot现在可以用真金白银赚钱了！');
      onSuccess();
    } catch (error) {
      console.error('Error upgrading:', error);
      alert('升级失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 rounded-2xl max-w-4xl w-full border-2 border-yellow-500/50 shadow-2xl my-8">
        
        {/* Header with Crown */}
        <div className="relative p-8 border-b border-yellow-500/30 bg-gradient-to-r from-yellow-600/20 to-orange-600/20">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-yellow-500/50">
              <Crown className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-center text-white mb-2">
            升级为 <span className="text-yellow-400">VIP</span> 会员
          </h2>
          <p className="text-center text-yellow-200 text-lg">
            让你的AI Bot用真金白银帮你赚钱
          </p>
        </div>

        {/* Profit Sharing Highlight */}
        <div className="p-6 bg-gradient-to-r from-green-600/30 to-emerald-600/30 border-b border-green-500/30">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Percent className="w-8 h-8 text-green-400 mr-2" />
                <span className="text-5xl font-bold text-white">10%</span>
                <span className="text-2xl text-green-300 ml-2">利润分成</span>
              </div>
              <p className="text-green-200 text-lg">
                平台仅收取Bot帮你赚的利润的10%，亏损时不收取任何费用
              </p>
              <div className="mt-3 flex items-center justify-center space-x-6 text-sm">
                <span className="text-green-300">✓ 盈利才收费</span>
                <span className="text-green-300">✓ 亏损免费</span>
                <span className="text-green-300">✓ 透明公开</span>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="p-6 border-b border-purple-500/30">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Rocket className="w-6 h-6 text-purple-400 mr-2" />
            VIP工作流程
          </h3>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-xl p-4 text-center border border-white/20">
              <div className="text-3xl mb-2">1️⃣</div>
              <h4 className="text-white font-semibold mb-1">升级VIP</h4>
              <p className="text-gray-400 text-sm">支付99U成为VIP</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center border border-white/20">
              <div className="text-3xl mb-2">2️⃣</div>
              <h4 className="text-white font-semibold mb-1">连接交易所</h4>
              <p className="text-gray-400 text-sm">绑定币安等API</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center border border-white/20">
              <div className="text-3xl mb-2">3️⃣</div>
              <h4 className="text-white font-semibold mb-1">Bot交易</h4>
              <p className="text-gray-400 text-sm">AI自动执行策略</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center border border-white/20">
              <div className="text-3xl mb-2">4️⃣</div>
              <h4 className="text-white font-semibold mb-1">分享利润</h4>
              <p className="text-gray-400 text-sm">盈利时抽取10%</p>
            </div>
          </div>
        </div>

        {/* VIP Benefits */}
        <div className="p-6 border-b border-purple-500/30">
          <h3 className="text-xl font-bold text-white mb-4">VIP专属权益</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-4 bg-white/5 rounded-lg">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold">真实交易</h4>
                <p className="text-gray-400 text-sm">Bot使用您的真实资金在交易所执行交易</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-white/5 rounded-lg">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold">资金安全</h4>
                <p className="text-gray-400 text-sm">资金始终在您的交易所账户，Bot只有交易权限</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-white/5 rounded-lg">
              <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold">24/7运行</h4>
                <p className="text-gray-400 text-sm">AI全天候监控市场，不错过任何机会</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-white/5 rounded-lg">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold">透明收费</h4>
                <p className="text-gray-400 text-sm">只有盈利时收取10%，亏损时完全免费</p>
              </div>
            </div>
          </div>
        </div>

        {/* Example Calculation */}
        <div className="p-6 border-b border-purple-500/30 bg-slate-800/50">
          <h3 className="text-xl font-bold text-white mb-4">收益示例</h3>
          
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-gray-400 mb-1">您的投入</p>
                <p className="text-3xl font-bold text-white">$1,000</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Bot帮您赚取</p>
                <p className="text-3xl font-bold text-green-400">+$500</p>
                <p className="text-sm text-gray-400">(50% 月收益)</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">您实际获得</p>
                <p className="text-3xl font-bold text-yellow-400">$450</p>
                <p className="text-sm text-gray-400">(扣除10%分成)</p>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-purple-300">
                💡 平台收取 $50 (10%)，您净赚 $450，远超传统理财！
              </p>
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="p-6">
          {isVIP ? (
            <div className="text-center p-6 bg-green-600/20 rounded-xl border border-green-500/50">
              <Check className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">您已是VIP会员！</h3>
              <p className="text-green-300">现在可以连接交易所API，让Bot开始帮您赚钱</p>
              <button
                onClick={onClose}
                className="mt-4 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all"
              >
                开始设置
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                <p className="text-gray-400 mb-2">VIP升级费用</p>
                <div className="flex items-center justify-center">
                  <span className="text-6xl font-bold text-white">99</span>
                  <span className="text-2xl text-yellow-400 ml-2">U</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  当前余额: ${currentBalance.toFixed(2)} | 还需: ${neededForVIP.toFixed(2)}
                </p>
              </div>

              {/* Payment Options */}
              <div className="flex justify-center space-x-4 mb-6">
                {['BTC', 'ETH', 'USDT'].map((currency) => (
                  <button
                    key={currency}
                    onClick={() => setSelectedPayment(currency)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      selectedPayment === currency
                        ? 'bg-yellow-500 text-black'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {currency === 'BTC' && '₿'} 
                    {currency === 'ETH' && 'Ξ'} 
                    {currency === 'USDT' && '💵'} 
                    {' '}{currency}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowPaymentModal(true)}
                disabled={loading}
                className="px-12 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 text-black text-xl font-bold rounded-xl transition-all shadow-lg shadow-yellow-500/30 inline-flex items-center"
                data-testid="upgrade-vip-btn"
              >
                <Crown className="w-6 h-6 mr-2" />
                立即升级VIP
                <ArrowRight className="w-6 h-6 ml-2" />
              </button>

              <p className="text-gray-500 text-sm mt-4">
                升级后可随时连接交易所API开始真实交易
              </p>
            </div>
          )}
        </div>

        {/* Risk Warning */}
        <div className="p-4 bg-red-900/20 border-t border-red-500/30">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">
              <strong>风险提示:</strong> 加密货币交易存在风险，过往业绩不代表未来表现。
              请根据自身财务状况谨慎投资，切勿投入超过您承受能力的资金。
            </p>
          </div>
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <div className="bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-yellow-500/30">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Wallet className="w-6 h-6 text-yellow-400 mr-2" />
              确认支付
            </h3>
            
            <div className="bg-white/5 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">支付金额</span>
                <span className="text-white font-bold">99 USDT</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">支付方式</span>
                <span className="text-white">{selectedPayment}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">获得权益</span>
                <span className="text-yellow-400">VIP会员</span>
              </div>
            </div>

            <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg mb-6">
              <p className="text-yellow-300 text-sm">
                💡 支付成功后，您可以连接交易所API，让Bot用您的真实资金进行交易。
                平台只收取盈利的10%作为服务费。
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
              >
                取消
              </button>
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 text-black font-semibold rounded-lg transition-all"
              >
                {loading ? '处理中...' : '确认支付'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VIPUpgradePage;
