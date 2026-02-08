import React, { useState, useRef } from 'react';
import { Share2, Download, X, Copy, Check, Twitter, MessageCircle, Crown, Bot, Sparkles, Trophy } from 'lucide-react';

const ShareAchievementModal = ({ achievement, onClose }) => {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  // achievement types: 'bot_adopted', 'vip_upgrade', 'profit_milestone', 'level_up'
  const getAchievementConfig = () => {
    switch (achievement.type) {
      case 'bot_adopted':
        return {
          title: '领养了AI交易Bot!',
          subtitle: `${achievement.botName} 正式加入战队`,
          icon: <Bot className="w-12 h-12 text-purple-400" />,
          gradient: 'from-purple-600 to-pink-600',
          borderColor: 'border-purple-500',
          message: `我在 AIFund.com 领养了我的专属AI交易Bot "${achievement.botName}"! 让AI帮我24/7赚钱!`,
          emoji: '🤖'
        };
      case 'vip_upgrade':
        return {
          title: '升级为VIP会员!',
          subtitle: '开启真金白银交易模式',
          icon: <Crown className="w-12 h-12 text-yellow-400" />,
          gradient: 'from-yellow-500 to-orange-500',
          borderColor: 'border-yellow-500',
          message: `我在 AIFund.com 升级为VIP会员了! 我的AI Bot现在可以用真金白银帮我赚钱了!`,
          emoji: '👑'
        };
      case 'profit_milestone':
        return {
          title: `赚了 $${achievement.amount?.toLocaleString() || '0'}!`,
          subtitle: `投资回报率 ${achievement.roi || 0}%`,
          icon: <Trophy className="w-12 h-12 text-green-400" />,
          gradient: 'from-green-500 to-emerald-600',
          borderColor: 'border-green-500',
          message: `我的AI Bot在 AIFund.com 已经帮我赚了 $${achievement.amount?.toLocaleString() || '0'}! ROI: ${achievement.roi || 0}%`,
          emoji: '💰'
        };
      case 'level_up':
        return {
          title: `Bot升级到 Lv.${achievement.level}!`,
          subtitle: `解锁新技能: ${achievement.skill || '未知技能'}`,
          icon: <Sparkles className="w-12 h-12 text-cyan-400" />,
          gradient: 'from-cyan-500 to-blue-600',
          borderColor: 'border-cyan-500',
          message: `我的AI Bot在 AIFund.com 升级到了 Level ${achievement.level}! 解锁了新技能: ${achievement.skill}`,
          emoji: '⬆️'
        };
      default:
        return {
          title: '成就解锁!',
          subtitle: 'AI投资新里程碑',
          icon: <Sparkles className="w-12 h-12 text-white" />,
          gradient: 'from-gray-600 to-gray-800',
          borderColor: 'border-gray-500',
          message: '我在 AIFund.com 解锁了新成就!',
          emoji: '🎉'
        };
    }
  };

  const config = getAchievementConfig();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(config.message + ' #AIFund #AI交易');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(config.message + ' #AIFund #AI交易');
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const shareToTelegram = () => {
    const text = encodeURIComponent(config.message);
    window.open(`https://t.me/share/url?url=https://aifund.com&text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl max-w-lg w-full border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center">
            <Share2 className="w-5 h-5 text-purple-400 mr-2" />
            <h3 className="text-lg font-bold text-white">分享成就</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Achievement Card Preview */}
        <div className="p-6">
          <div 
            ref={cardRef}
            className={`bg-gradient-to-br ${config.gradient} rounded-2xl p-6 border-2 ${config.borderColor} shadow-2xl`}
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-black/30 rounded-full flex items-center justify-center mr-3">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">AIFund.com</p>
                  <p className="text-white font-bold">AI让每个人都能赚钱</p>
                </div>
              </div>
              <div className="text-4xl">{config.emoji}</div>
            </div>

            {/* Main Content */}
            <div className="text-center py-6">
              <div className="mb-4">{config.icon}</div>
              <h2 className="text-3xl font-bold text-white mb-2">{config.title}</h2>
              <p className="text-white/80 text-lg">{config.subtitle}</p>
            </div>

            {/* Bot Info (if applicable) */}
            {achievement.botName && (
              <div className="bg-black/20 rounded-lg p-4 mt-4">
                <div className="flex items-center justify-center">
                  <span className="text-3xl mr-3">{achievement.botEmoji || '🤖'}</span>
                  <div>
                    <p className="text-white font-bold">{achievement.botName}</p>
                    <p className="text-white/60 text-sm">Level {achievement.botLevel || 1}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between">
              <div className="text-white/60 text-sm">
                {new Date().toLocaleDateString('zh-CN')}
              </div>
              <div className="flex items-center">
                <span className="text-white/80 text-sm mr-2">Powered by</span>
                <span className="text-white font-bold">AIFund</span>
              </div>
            </div>
          </div>
        </div>

        {/* Share Options */}
        <div className="p-6 border-t border-white/10 bg-slate-800/50">
          <p className="text-gray-400 text-sm mb-4">分享到社交平台:</p>
          
          <div className="flex space-x-3 mb-4">
            <button
              onClick={shareToTwitter}
              className="flex-1 p-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] rounded-lg flex items-center justify-center text-white font-semibold transition-all"
              data-testid="share-twitter-btn"
            >
              <Twitter className="w-5 h-5 mr-2" />
              Twitter
            </button>
            <button
              onClick={shareToTelegram}
              className="flex-1 p-3 bg-[#0088cc] hover:bg-[#006699] rounded-lg flex items-center justify-center text-white font-semibold transition-all"
              data-testid="share-telegram-btn"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Telegram
            </button>
          </div>

          <button
            onClick={copyToClipboard}
            className="w-full p-3 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white font-semibold transition-all"
            data-testid="copy-text-btn"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 mr-2 text-green-400" />
                已复制!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 mr-2" />
                复制文案
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareAchievementModal;
