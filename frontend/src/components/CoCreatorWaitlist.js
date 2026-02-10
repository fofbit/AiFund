import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Users, Gift, Star, Crown, Trophy, CheckCircle, Sparkles, ArrowRight, Shield } from 'lucide-react';
import PaymentFlow from './PaymentFlow';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CoCreatorWaitlist = ({ walletAddress, userData, onClose }) => {
  const [joined, setJoined] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const isVIP = userData?.user?.tier === 'vip';

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const res = await axios.get(`${API}/waitlist/status/${walletAddress}`);
      setJoined(res.data.joined);
      setWaitlistCount(res.data.total_count);
    } catch (e) {
      setWaitlistCount(847);
    }
  };

  const handleJoinAfterPayment = async () => {
    try {
      await axios.post(`${API}/waitlist/join`, { wallet_address: walletAddress });
      setJoined(true);
      setWaitlistCount(prev => prev + 1);
    } catch (e) {
      console.error(e);
    }
  };

  const handleJoin = () => {
    if (isVIP) {
      // Already VIP, just join waitlist
      handleJoinAfterPayment();
    } else {
      // Need to pay 99U first
      setShowPayment(true);
    }
  };

  const spotsLeft = Math.max(0, 10000 - waitlistCount);
  const progress = Math.min(100, (waitlistCount / 10000) * 100);

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
      <div className="min-h-full bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="max-w-lg mx-auto p-4 sm:p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-2">
          <div className="flex items-center">
            <Trophy className="w-7 h-7 text-yellow-400 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-white" data-testid="waitlist-title">10,000 Co-Creators</h2>
              <p className="text-yellow-300 text-xs">First 10,000 VIP users become founding members</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {/* Progress */}
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-white mb-1">
            {waitlistCount.toLocaleString()} <span className="text-gray-400 text-lg">/ 10,000</span>
          </div>
          <p className="text-yellow-300 text-sm mb-3">{spotsLeft.toLocaleString()} spots remaining</p>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-1000 rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-5">
          <h4 className="text-white font-semibold text-sm mb-3">How Co-Creator Works</h4>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-black text-xs font-bold mr-3 flex-shrink-0">1</div>
              <div>
                <p className="text-white text-sm font-semibold">Pay 99 USDT to become VIP</p>
                <p className="text-gray-400 text-xs">This activates your VIP status and reserves your Co-Creator spot</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-black text-xs font-bold mr-3 flex-shrink-0">2</div>
              <div>
                <p className="text-white text-sm font-semibold">Wait for 10,000 Co-Creators</p>
                <p className="text-gray-400 text-xs">Once all 10,000 spots are filled, the VIP service launches for all Co-Creators simultaneously</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-black text-xs font-bold mr-3 flex-shrink-0">3</div>
              <div>
                <p className="text-white text-sm font-semibold">Receive Co-Creator NFT</p>
                <p className="text-gray-400 text-xs">Exclusive NFT airdropped to your wallet — transferable, tradeable, with growing rights as the platform evolves</p>
              </div>
            </div>
          </div>
        </div>

        {/* NFT Rights */}
        <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-5 text-center mb-5">
          <div className="text-5xl mb-3">🎁</div>
          <h3 className="text-white font-bold text-lg mb-2">Co-Creator NFT</h3>
          <p className="text-gray-300 text-xs mb-3">Airdropped to your payment wallet address. Rights grow with the platform:</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: <Crown className="w-4 h-4 text-yellow-400" />, text: 'Founding Member Badge' },
              { icon: <Star className="w-4 h-4 text-purple-400" />, text: 'Exclusive Bot Skin' },
              { icon: <Gift className="w-4 h-4 text-green-400" />, text: '+5 Bonus VIP Levels' },
              { icon: <Sparkles className="w-4 h-4 text-cyan-400" />, text: 'Governance Rights' },
              { icon: <Shield className="w-4 h-4 text-blue-400" />, text: 'Transferable Ownership' },
              { icon: <ArrowRight className="w-4 h-4 text-orange-400" />, text: 'Priority New Features' },
            ].map((item, i) => (
              <div key={i} className="flex items-center p-2 bg-black/20 rounded-lg">
                {item.icon}
                <span className="text-white text-xs ml-2">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Join / Status */}
        {joined ? (
          <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-5 text-center">
            <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
            <h4 className="text-white font-bold text-lg">You're a Co-Creator!</h4>
            <p className="text-green-300 text-sm mt-1">Your Co-Creator NFT will be airdropped to your wallet when all 10,000 spots are filled.</p>
            <p className="text-gray-400 text-xs mt-2">NFT rights will continuously grow as the platform develops.</p>
          </div>
        ) : (
          <div>
            <button onClick={handleJoin} disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 text-black font-bold rounded-xl text-sm transition-all flex items-center justify-center"
              data-testid="join-waitlist-btn"
            >
              <Crown className="w-5 h-5 mr-2" />
              {isVIP ? 'Join Co-Creator Waitlist' : 'Pay 99 USDT & Join Co-Creator'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            {!isVIP && (
              <p className="text-gray-500 text-xs text-center mt-2">
                99 USDT payment activates VIP + reserves your Co-Creator spot
              </p>
            )}
          </div>
        )}

        </div>
      </div>

      {/* Payment Flow for non-VIP users */}
      {showPayment && (
        <PaymentFlow
          walletAddress={walletAddress}
          paymentType="vip"
          amount={99}
          onClose={() => setShowPayment(false)}
          onSuccess={() => {
            setShowPayment(false);
            handleJoinAfterPayment();
          }}
        />
      )}
    </div>
  );
};

export default CoCreatorWaitlist;
