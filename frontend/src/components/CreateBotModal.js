import React, { useState } from 'react';
import axios from 'axios';
import { X, Bot, Sparkles } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CreateBotModal = ({ walletAddress, onClose, onSuccess }) => {
  const [botName, setBotName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('default_bot_1');
  const [loading, setLoading] = useState(false);

  const botAvatars = [
    { id: 'default_bot_1', emoji: '🤖', name: 'Classic' },
    { id: 'default_bot_2', emoji: '🦾', name: 'Cyborg' },
    { id: 'default_bot_3', emoji: '👾', name: 'Retro' },
    { id: 'default_bot_4', emoji: '🚀', name: 'Rocket' },
    { id: 'default_bot_5', emoji: '💎', name: 'Diamond' },
  ];

  const suggestedNames = [
    'Alpha Bot',
    'Profit Hunter',
    'Moon Chaser',
    'Diamond Hands',
    'Crypto Ninja',
  ];

  const handleCreate = async () => {
    if (!botName.trim()) {
      alert('请输入Bot名称');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/bot/create`, {
        wallet_address: walletAddress,
        bot_name: botName.trim()
      });

      alert('🎉 Bot创建成功！开始赚钱之旅吧！');
      onSuccess();
    } catch (error) {
      console.error('Error creating bot:', error);
      alert(error.response?.data?.detail || '创建失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-purple-500/30 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Bot className="w-7 h-7 text-purple-400 mr-2" />
            领养你的Bot
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">给你的Bot取个名字</label>
          <input
            type="text"
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
            placeholder="例如: Alpha Bot"
            maxLength={20}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            data-testid="bot-name-input"
          />
          
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestedNames.map((name) => (
              <button
                key={name}
                onClick={() => setBotName(name)}
                className="text-xs px-3 py-1 bg-gray-700 hover:bg-purple-600 text-gray-300 hover:text-white rounded-full transition-all"
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">选择形象</label>
          <div className="grid grid-cols-5 gap-2">
            {botAvatars.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => setSelectedAvatar(avatar.id)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedAvatar === avatar.id
                    ? 'border-purple-500 bg-purple-500/20 scale-110'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="text-3xl">{avatar.emoji}</div>
                <div className="text-xs text-white mt-1">{avatar.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg">
          <div className="flex items-start">
            <Sparkles className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-purple-300">
              <p className="font-semibold mb-1">你的Bot将会:</p>
              <ul className="space-y-1 text-xs">
                <li>• 使用 $10,000 虚拟资金开始交易</li>
                <li>• 由 GPT-5.2 AI 驱动决策</li>
                <li>• 24/7 自动交易和学习</li>
                <li>• 随着时间自动解锁新能力</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
          >
            取消
          </button>
          <button
            onClick={handleCreate}
            disabled={loading || !botName.trim()}
            className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
            data-testid="confirm-create-bot-btn"
          >
            {loading ? '创建中...' : '🎉 领养Bot'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBotModal;
