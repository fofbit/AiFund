import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Users, Gift, Star, Crown, Trophy, CheckCircle, Sparkles } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CoCreatorWaitlist = ({ walletAddress, userData, onClose }) => {
  const [joined, setJoined] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const res = await axios.get(`${API}/waitlist/status/${walletAddress}`);
      setJoined(res.data.joined);
      setWaitlistCount(res.data.total_count);
    } catch (e) {
      setWaitlistCount(847); // Fallback mock count
    }
  };

  const handleJoin = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/waitlist/join`, { wallet_address: walletAddress });
      setJoined(true);
      setWaitlistCount(prev => prev + 1);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const spotsLeft = Math.max(0, 10000 - waitlistCount);
  const progress = Math.min(100, (waitlistCount / 10000) * 100);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-2xl max-w-lg w-full border border-yellow-500/30 shadow-2xl my-4">
        
        <div className="p-5 border-b border-yellow-500/30 bg-gradient-to-r from-yellow-600/10 to-orange-600/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Trophy className="w-7 h-7 text-yellow-400 mr-3" />
              <div>
                <h2 className="text-xl font-bold text-white" data-testid="waitlist-title">10,000 Co-Creators</h2>
                <p className="text-yellow-300 text-xs">Join the founding community</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Progress */}
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-1">
              {waitlistCount.toLocaleString()} <span className="text-gray-400 text-lg">/ 10,000</span>
            </div>
            <p className="text-yellow-300 text-sm mb-3">{spotsLeft.toLocaleString()} spots remaining</p>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-1000 rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Mystery NFT */}
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-5 text-center">
            <div className="text-5xl mb-3">🎁</div>
            <h3 className="text-white font-bold text-lg mb-2">Mystery Co-Creator NFT</h3>
            <p className="text-gray-300 text-sm mb-3">
              The first 10,000 members receive an exclusive Co-Creator NFT with:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: <Crown className="w-4 h-4 text-yellow-400" />, text: 'Founding Member Badge' },
                { icon: <Star className="w-4 h-4 text-purple-400" />, text: 'Exclusive Bot Skin' },
                { icon: <Gift className="w-4 h-4 text-green-400" />, text: 'Bonus VIP Levels' },
                { icon: <Sparkles className="w-4 h-4 text-cyan-400" />, text: 'Governance Rights' },
              ].map((item, i) => (
                <div key={i} className="flex items-center p-2 bg-black/20 rounded-lg">
                  {item.icon}
                  <span className="text-white text-xs ml-2">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-2">Co-Creator Benefits</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>Priority access to new features before public release</li>
              <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>Direct influence on product roadmap (voting rights)</li>
              <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>+5 bonus VIP levels at platform launch</li>
              <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>Mystery NFT airdrop (tradeable, collectible)</li>
              <li className="flex items-start"><span className="text-green-400 mr-2">✓</span>Lifetime "Founding Member" badge on profile</li>
            </ul>
          </div>

          {/* Join / Joined */}
          {joined ? (
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-center">
              <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
              <h4 className="text-white font-bold">You're on the list!</h4>
              <p className="text-green-300 text-sm mt-1">You'll receive your Co-Creator NFT when we reach 10,000 members.</p>
            </div>
          ) : (
            <button onClick={handleJoin} disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 text-black font-bold rounded-xl text-sm transition-all flex items-center justify-center"
              data-testid="join-waitlist-btn"
            >
              <Users className="w-5 h-5 mr-2" />
              {loading ? 'Joining...' : 'Join Co-Creator Waitlist'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoCreatorWaitlist;
