import React, { useState } from 'react';
import { X, Users, Gift, Copy, CheckCircle, Share2, Crown } from 'lucide-react';

const ReferralSystem = ({ walletAddress, userData, onClose }) => {
  const [copied, setCopied] = useState(false);
  const referralCode = userData?.user?.referral_code || 'DEMO123';
  const referralLink = `https://aifund.com/r/${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock referral data
  const referralStats = {
    totalReferred: 3,
    activeReferred: 2,
    levelsEarned: 3,
    topReferrals: [
      { name: 'User_0x8f...3a', level: 5, status: 'VIP' },
      { name: 'User_0x2c...9b', level: 2, status: 'Basic' },
      { name: 'User_0x7e...1d', level: 1, status: 'Basic' },
    ]
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-2xl max-w-lg w-full border border-purple-500/30 shadow-2xl my-4">
        
        <div className="p-5 border-b border-purple-500/30 bg-gradient-to-r from-purple-600/20 to-pink-600/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-7 h-7 text-purple-400 mr-3" />
              <div>
                <h2 className="text-xl font-bold text-white" data-testid="referral-title">Refer Friends</h2>
                <p className="text-purple-300 text-xs">Both of you get +1 level boost</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* How it works */}
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
            <h3 className="text-white font-bold text-sm mb-2 flex items-center">
              <Gift className="w-4 h-4 text-green-400 mr-2" />How Referrals Work
            </h3>
            <ul className="text-gray-300 text-xs space-y-1.5">
              <li className="flex items-start"><span className="text-green-400 mr-2">1.</span>Share your unique referral link</li>
              <li className="flex items-start"><span className="text-green-400 mr-2">2.</span>Friend signs up and activates account</li>
              <li className="flex items-start"><span className="text-green-400 mr-2">3.</span>Both of you receive <strong className="text-yellow-400 mx-1">+1 VIP level</strong> boost</li>
              <li className="flex items-start"><span className="text-green-400 mr-2">4.</span>No limit on referrals — keep leveling up!</li>
            </ul>
          </div>

          {/* Referral Link */}
          <div>
            <label className="text-gray-400 text-xs mb-2 block">Your Referral Link</label>
            <div className="flex items-center bg-black/30 rounded-xl border border-white/10 overflow-hidden">
              <input type="text" readOnly value={referralLink}
                className="flex-1 px-4 py-3 bg-transparent text-white text-sm font-mono focus:outline-none" />
              <button onClick={handleCopy}
                className={`px-4 py-3 font-semibold text-sm transition-all ${copied ? 'bg-green-600 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
                data-testid="copy-referral-btn"
              >
                {copied ? <><CheckCircle className="w-4 h-4 inline mr-1" />Copied</> : <><Copy className="w-4 h-4 inline mr-1" />Copy</>}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
              <p className="text-2xl font-bold text-white">{referralStats.totalReferred}</p>
              <p className="text-gray-400 text-xs">Referred</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
              <p className="text-2xl font-bold text-green-400">{referralStats.activeReferred}</p>
              <p className="text-gray-400 text-xs">Active</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
              <p className="text-2xl font-bold text-yellow-400">+{referralStats.levelsEarned}</p>
              <p className="text-gray-400 text-xs">Levels Earned</p>
            </div>
          </div>

          {/* Share buttons */}
          <div className="flex gap-2">
            <a href={`https://twitter.com/intent/tweet?text=Join AIFund — Let AI earn for you! Start from $1.&url=${encodeURIComponent(referralLink)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center py-2.5 bg-black hover:bg-gray-900 text-white text-sm font-semibold rounded-xl transition-all border border-white/10">
              <span className="mr-1">𝕏</span> Twitter
            </a>
            <a href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=Join AIFund — Let AI earn for you!`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all">
              <Share2 className="w-4 h-4 mr-1" /> Telegram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralSystem;
