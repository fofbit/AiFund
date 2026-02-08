import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Bot, Sparkles, User } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CreateBotModal = ({ walletAddress, onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: gender, 2: avatar, 3: name
  const [gender, setGender] = useState('male');
  const [botName, setBotName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('male_1');
  const [avatars, setAvatars] = useState({ male: [], female: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAvatars();
  }, []);

  const loadAvatars = async () => {
    try {
      const response = await axios.get(`${API}/gamification/bot-avatars`);
      setAvatars(response.data.avatars);
    } catch (error) {
      console.error('Error loading avatars:', error);
    }
  };

  const suggestedNames = {
    male: ['Alpha King', 'Profit Master', 'Crypto Warrior', 'Moon Hunter', 'Diamond Lord'],
    female: ['Alpha Queen', 'Profit Goddess', 'Crypto Princess', 'Moon Goddess', 'Diamond Lady']
  };

  const handleCreate = async () => {
    if (!botName.trim()) {
      alert('请输入Bot名称');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/bot/create`, {
        wallet_address: walletAddress,
        bot_name: botName.trim(),
        gender: gender,
        avatar_id: selectedAvatar
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

  const getRarityColor = (rarity) => {
    const colors = {
      'common': 'border-gray-500 bg-gray-500/10',
      'rare': 'border-blue-500 bg-blue-500/10',
      'epic': 'border-purple-500 bg-purple-500/10',
      'legendary': 'border-yellow-500 bg-yellow-500/10'
    };
    return colors[rarity] || colors.common;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-2xl w-full p-6 border border-purple-500/30 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Bot className="w-7 h-7 text-purple-400 mr-2" />
            领养你的AI Bot {step > 1 && `- 步骤 ${step}/3`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step 1: Gender Selection */}
        {step === 1 && (
          <div>
            <h3 className="text-xl text-white mb-4 text-center">选择Bot性别</h3>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <button
                onClick={() => {
                  setGender('male');
                  setSelectedAvatar('male_1');
                }}
                className={`p-8 rounded-xl border-2 transition-all ${
                  gender === 'male'
                    ? 'border-blue-500 bg-blue-500/20 scale-105'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="text-6xl mb-3">👨‍💼</div>
                <div className="text-xl font-bold text-white">男性Bot</div>
                <div className="text-sm text-gray-400 mt-2">专业、强大、可靠</div>
              </button>

              <button
                onClick={() => {
                  setGender('female');
                  setSelectedAvatar('female_1');
                }}
                className={`p-8 rounded-xl border-2 transition-all ${
                  gender === 'female'
                    ? 'border-pink-500 bg-pink-500/20 scale-105'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="text-6xl mb-3">👩‍💼</div>
                <div className="text-xl font-bold text-white">女性Bot</div>
                <div className="text-sm text-gray-400 mt-2">智慧、优雅、精准</div>
              </button>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all"
            >
              下一步: 选择形象
            </button>
          </div>
        )}

        {/* Step 2: Avatar Selection */}
        {step === 2 && (
          <div>
            <h3 className="text-xl text-white mb-4 text-center">
              选择{gender === 'male' ? '男性' : '女性'}Bot形象
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {avatars[gender].map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedAvatar === avatar.id
                      ? 'scale-110 shadow-lg ' + getRarityColor(avatar.rarity)
                      : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                  }`}
                >
                  <div className="text-5xl mb-2">{avatar.emoji}</div>
                  <div className="text-sm font-semibold text-white">{avatar.name}</div>
                  <div className={`text-xs mt-1 ${
                    avatar.rarity === 'legendary' ? 'text-yellow-400' :
                    avatar.rarity === 'epic' ? 'text-purple-400' :
                    avatar.rarity === 'rare' ? 'text-blue-400' :
                    'text-gray-400'
                  }`}>
                    {avatar.rarity === 'legendary' ? '传说' :
                     avatar.rarity === 'epic' ? '史诗' :
                     avatar.rarity === 'rare' ? '稀有' : '普通'}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
              >
                上一步
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all"
              >
                下一步: 取名字
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Name */}
        {step === 3 && (
          <div>
            <h3 className="text-xl text-white mb-4 text-center">给你的Bot取个名字</h3>
            
            {/* Preview */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 mb-6 text-center">
              <div className="text-6xl mb-3">
                {avatars[gender].find(a => a.id === selectedAvatar)?.emoji}
              </div>
              <div className="text-white text-sm mb-1">
                {gender === 'male' ? '男性Bot' : '女性Bot'} · {avatars[gender].find(a => a.id === selectedAvatar)?.name}
              </div>
            </div>

            <div className="mb-6">
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
                {suggestedNames[gender].map((name) => (
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

            <div className="mb-6 p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg">
              <div className="flex items-start">
                <Sparkles className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-purple-300">
                  <p className="font-semibold mb-1">你的Bot将会:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• 使用 $10,000 虚拟资金开始交易</li>
                    <li>• 由 GPT-5.2 AI 驱动决策</li>
                    <li>• 24/7 自动交易和学习</li>
                    <li>• 随着收益升级VIP等级</li>
                    <li>• 解锁虚拟资产购买</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
              >
                上一步
              </button>
              <button
                onClick={handleCreate}
                disabled={loading || !botName.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
                data-testid="confirm-create-bot-btn"
              >
                {loading ? '创建中...' : '🎉 创建Bot'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateBotModal;
