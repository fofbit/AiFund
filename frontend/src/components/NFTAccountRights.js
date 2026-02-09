import React, { useState } from 'react';
import { X, Shield, Key, RefreshCw, ArrowRight, Gift, Star, ExternalLink, Copy, CheckCircle } from 'lucide-react';

const NFTAccountRights = ({ walletAddress, userData, onClose }) => {
  const [copied, setCopied] = useState(false);
  const isVIP = userData?.user?.tier === 'vip';
  
  // Mock NFT data
  const nftData = {
    tokenId: `AIFUND-${walletAddress?.substring(2, 8)?.toUpperCase() || 'DEMO'}-001`,
    level: isVIP ? 'VIP' : 'Basic',
    botName: 'Demo Bot',
    mintDate: '2025-12-13',
    transferable: true,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(nftData.tokenId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-2xl max-w-lg w-full border border-purple-500/30 shadow-2xl my-4">
        
        <div className="p-5 border-b border-purple-500/30 bg-gradient-to-r from-purple-600/20 to-pink-600/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-7 h-7 text-purple-400 mr-3" />
              <div>
                <h2 className="text-xl font-bold text-white" data-testid="nft-rights-title">Account Rights NFT</h2>
                <p className="text-gray-400 text-xs">Your on-chain proof of ownership</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* NFT Card Visual */}
          <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-2xl p-1">
            <div className="bg-slate-900 rounded-xl p-5 text-center">
              <div className="text-6xl mb-3">🛡️</div>
              <h3 className="text-white font-bold text-lg">AiFund Account NFT</h3>
              <p className="text-purple-300 text-sm font-mono mt-1">{nftData.tokenId}</p>
              <div className="flex items-center justify-center mt-3 space-x-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isVIP ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {nftData.level}
                </span>
                <span className="text-gray-400 text-xs">Minted: {nftData.mintDate}</span>
              </div>
              <button onClick={handleCopy} className="mt-3 flex items-center justify-center mx-auto text-gray-400 hover:text-white text-xs transition-all">
                {copied ? <><CheckCircle className="w-3 h-3 mr-1" />Copied</> : <><Copy className="w-3 h-3 mr-1" />Copy Token ID</>}
              </button>
            </div>
          </div>

          {/* What this NFT does */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">What does this NFT do?</h4>
            <div className="space-y-2">
              {[
                { icon: <Key className="w-4 h-4 text-yellow-400" />, title: 'Account Recovery', desc: 'If you lose your wallet private key or seed phrase, this NFT proves your account ownership.' },
                { icon: <RefreshCw className="w-4 h-4 text-cyan-400" />, title: 'Transfer / Sell Your Bot', desc: 'You can transfer or sell your trained high-level Bot to another user — like selling a leveled-up game character.' },
                { icon: <Star className="w-4 h-4 text-purple-400" />, title: 'VIP Status Proof', desc: 'Your VIP level, Bot progress, skins, and achievements are all tied to this NFT. Verifiable on-chain.' },
                { icon: <Gift className="w-4 h-4 text-green-400" />, title: 'Early Supporter Rewards', desc: 'First 10,000 NFT holders get exclusive Co-Creator status with special rewards and governance rights.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="mr-3 mt-0.5">{item.icon}</div>
                  <div>
                    <h5 className="text-white font-semibold text-sm">{item.title}</h5>
                    <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transfer */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <h4 className="text-yellow-400 font-semibold text-sm mb-2 flex items-center">
              <ArrowRight className="w-4 h-4 mr-1" />Transfer Your Account
            </h4>
            <p className="text-gray-300 text-xs mb-3">
              You can transfer your entire account (Bot, level, VIP status) to another wallet by transferring this NFT.
            </p>
            <button className="w-full py-2.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 font-semibold rounded-lg text-sm transition-all border border-yellow-500/30" data-testid="transfer-nft-btn">
              Transfer NFT (Coming Soon)
            </button>
          </div>

          {/* Status */}
          <div className="text-center">
            <p className="text-gray-500 text-xs">
              NFT will be minted on-chain when the platform launches its smart contract.
              <br />Currently represented as a platform-level account token.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTAccountRights;
