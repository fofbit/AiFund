import React, { useState } from 'react';
import { X, Download, FileText, Globe } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const WhitepaperViewer = ({ onClose }) => {
  const [lang, setLang] = useState('en');

  const content = lang === 'en' ? {
    title: 'AIFund.com Whitepaper',
    version: 'v1.0.0',
    downloadBtn: 'Download PDF',
    sections: [
      { title: '1. Mission & Vision', body: 'AIFund.com is built on a simple belief: the wealth-building power of AI should not be a privilege of the few. Our mission is to democratize AI-powered wealth creation — connecting cutting-edge AI with anyone who has as little as $1, regardless of nationality, education, or banking status.\n\nA world where every person has an AI-powered Bot working 24/7 to grow their savings. No barriers. No borders. Equal opportunity for all.' },
      { title: '2. Core Values', body: '• AI Equalizes Knowledge — AI makes global financial intelligence available to everyone.\n• Bot Equalizes Labor — Your Bot works 24/7, monitoring markets tirelessly.\n• AI + Bot Equalizes Wealth — When knowledge and labor are equalized, wealth follows.\n• Start Small, Dream Big — Minimum $1 entry. The 100-level system grows your capital from 100U to 10,000U.\n• Transparency & Safety — Your funds stay in YOUR exchange account. Bot only has trading permissions.' },
      { title: '3. How It Works', body: '1. Connect Wallet — Create a crypto wallet (MetaMask, OKX, WizzWallet, etc.) in 3 minutes.\n2. Deposit & Activate — Send as little as $1 worth of crypto.\n3. Adopt Your Bot — Give your AI Bot a name. It starts analyzing markets immediately.\n4. Follow Bot — Bot sends daily buy/sell signals. You decide. Bot NEVER touches your funds.\n5. Go VIP — Pay 99U. Connect exchange API. Bot trades automatically 24/7, starting at 100U max.' },
      { title: '4. VIP Level System (100 Levels)', body: 'Every VIP starts at Level 1 with 100U maximum managed capital.\nEach profit-sharing deposit (10%) increases your level by 1.\nAfter 100 level-ups, Bot manages up to 10,000U.\n\nTiers: Bronze (1-10) → Silver (11-25) → Gold (26-50) → Platinum (51-75) → Diamond (76-95) → Legend (96-100)\n\nRewards: Bot skins at milestones (Lv10, 25, 50, 75, 100), increasing compute power, growing managed capital.' },
      { title: '5. Profit Distribution (50/50 Rule)', body: '• 50% Snowball — Stays in account to compound returns (default).\n• 50% Life Improvement — Must be withdrawn to improve your actual life.\n• Platform Fee — 10% of profits only. Zero when no profit.\n\nWe believe wealth should improve lives, not just grow numbers on a screen.' },
      { title: '6. Supported Markets', body: 'CEX (Auto-Trade): Binance, OKX, Bybit, Coinbase, IBKR, Futu, Tiger Brokers\n\nDEX & Meme (API or Alert): Unisat, WiZZ/Atomicals, Pump.fun, GMGN.ai, Birdeye, Uniswap, Jupiter, Raydium, PancakeSwap, Moonshot, SunPump, DEXTOOLS\n\n8 Market Categories: Crypto, US Stocks, HK Stocks, A-Shares, Futures, Options, Forex, Prediction Markets' },
      { title: '7. Global Vision (9.9U)', body: 'Unlock 26+ historical wealth stories spanning 15 years across crypto, stocks, commodities, and prediction markets.\n\nEach case includes: detailed story timeline, time-travel animation showing 100U investment journey, and AI insights.\n\nBTC from $0.05 to $100,000 (4583x), PEPE 1800x, SOL 18x, NVDA 3.2x, and many more.' },
      { title: '8. Security', body: '• Funds NEVER leave your exchange account\n• API keys stored with encryption, trade-only permissions\n• All transactions transparent and auditable\n• No custody of user funds\n• Users control their own private keys' },
      { title: '9. NFT Account Rights', body: 'Account rights are represented by an on-chain NFT, enabling:\n• Account recovery if private keys are lost\n• Transfer/sale of trained high-level Bots\n• Verifiable ownership of VIP status and level progress' },
      { title: '10. Referral Program', body: 'VIP users can refer friends. Both referrer and new user receive +1 level boost, accelerating growth and community expansion.' },
      { title: 'Disclaimer', body: 'Cryptocurrency and financial trading involve significant risk. Past performance does not guarantee future results. Users should only invest what they can afford to lose. AIFund.com provides AI-powered tools — not financial advice. Users are responsible for their own decisions.' },
    ]
  } : {
    title: 'AIFund.com 白皮书',
    version: 'v1.0.0',
    downloadBtn: '下载PDF',
    sections: [
      { title: '1. 使命与愿景', body: 'AIFund.com 建立在一个简单的信念上：AI创造财富的能力不应该是少数人的特权。我们的使命是让AI驱动的财富创造民主化——让任何拥有哪怕只有1美元的人都能接触到前沿AI，无论其国籍、教育水平还是银行账户状况。\n\n我们的愿景：一个每个人都拥有一个24/7运转的AI Bot来增长储蓄的世界。无门槛、无国界、人人平等。' },
      { title: '2. 核心价值观', body: '• AI让知识平权 — AI让全球金融情报对每个人可用\n• Bot让劳动平权 — 你的Bot 24/7不知疲倦地监控市场\n• AI+Bot让财富平权 — 当知识和劳动平等了，财富也随之而来\n• 小起步，大梦想 — 最低1美元入门，100级系统让你的资金从100U增长到10,000U\n• 透明与安全 — 你的资金始终在你自己的交易所账户，Bot只有交易权限' },
      { title: '3. 运作方式', body: '1. 连接钱包 — 创建加密钱包（MetaMask、OKX、WizzWallet等），3分钟搞定\n2. 充值激活 — 发送最低1美元等值加密货币\n3. 领养Bot — 给你的AI Bot取个名字，它立即开始分析市场\n4. 跟随Bot — Bot发送每日买卖信号，你来决定。Bot绝不触碰你的资金\n5. 升级VIP — 支付99U，连接交易所API，Bot 24/7自动交易，起步100U' },
      { title: '4. VIP级别系统（100级）', body: '每个VIP从1级开始，最大管理资金100U\n每次充值回10%收益，升1级\n100级后，Bot最多管理10,000U\n\n段位：青铜(1-10) → 白银(11-25) → 黄金(26-50) → 铂金(51-75) → 钻石(76-95) → 传奇(96-100)\n\n奖励：里程碑皮肤（10/25/50/75/100级）、算力提升、管理资金增长' },
      { title: '5. 利润分配（50/50规则）', body: '• 50%滚雪球 — 留在账户复利增长（默认）\n• 50%改善生活 — 必须提现，用于改善实际生活\n• 平台费用 — 仅收盈利的10%，无盈利零费用\n\n我们相信财富应该改善生活，而不仅仅是增长屏幕上的数字。' },
      { title: '6. 支持市场', body: 'CEX（自动交易）：Binance、OKX、Bybit、Coinbase、盈透证券、富途、老虎\n\nDEX/Meme（API或通知）：Unisat、WiZZ/Atomicals、Pump.fun、GMGN、Birdeye、Uniswap、Jupiter、Raydium、PancakeSwap、Moonshot、SunPump、DEXTOOLS\n\n8大市场类别：加密货币、美股、港股、A股、期货、期权、外汇、预测市场' },
      { title: '7. 全球视野（9.9U）', body: '解锁26+个横跨15年的历史财富神话案例，涵盖加密、股票、大宗商品和预测市场。\n\n每个案例包含：详细故事时间线、100U投资时光旅行动画、AI洞察。\n\nBTC从$0.05到$100,000（4583倍）、PEPE 1800倍、SOL 18倍、NVDA 3.2倍等。' },
      { title: '8. 安全保障', body: '• 资金永远不离开你的交易所账户\n• API密钥加密存储，仅限交易权限\n• 所有交易透明可审计\n• 平台不托管用户资金\n• 用户始终掌控自己的私钥' },
      { title: '9. NFT账户权益', body: '账户权益由链上NFT代表，实现：\n• 私钥丢失时的账户恢复\n• 训练好的高级Bot可转让/出售\n• VIP身份和级别进度可验证所有权' },
      { title: '10. 推荐好友计划', body: 'VIP用户可以推荐朋友，推荐人和新用户各获得+1级提升，加速成长和社区扩展。' },
      { title: '免责声明', body: '加密货币和金融交易存在重大风险。过往业绩不代表未来表现。用户应仅投入承受得起的资金。AIFund.com提供AI工具，而非投资建议。用户对自己的决策负责。' },
    ]
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl max-w-4xl w-full border border-purple-500/30 shadow-2xl my-4">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-purple-500/30 bg-gradient-to-r from-purple-600/20 to-pink-600/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-purple-400 mr-3" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white" data-testid="whitepaper-viewer-title">{content.title}</h2>
                <p className="text-gray-400 text-xs">{content.version}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
          </div>
          <div className="flex items-center mt-4 space-x-3">
            <div className="flex items-center space-x-1 bg-white/10 rounded-full px-1 py-1">
              <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${lang === 'en' ? 'bg-purple-500 text-white' : 'text-gray-300'}`} data-testid="wp-lang-en">EN</button>
              <button onClick={() => setLang('zh')} className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${lang === 'zh' ? 'bg-purple-500 text-white' : 'text-gray-300'}`} data-testid="wp-lang-zh">中文</button>
            </div>
            <a href={`${BACKEND_URL}/api/whitepaper`} target="_blank" rel="noopener noreferrer"
              className="flex items-center px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold rounded-full hover:scale-105 transition-all"
              data-testid="wp-download-btn"
            >
              <Download className="w-3 h-3 mr-1" />{content.downloadBtn}
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[65vh] overflow-y-auto space-y-6">
          {content.sections.map((section, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4 sm:p-5 border border-white/5">
              <h3 className="text-white font-bold text-base sm:text-lg mb-3 flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                {section.title}
              </h3>
              <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{section.body}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-purple-500/20 text-center">
          <p className="text-gray-500 text-xs">AIFund.com — Equal access to global wealth is everyone's right</p>
        </div>
      </div>
    </div>
  );
};

export default WhitepaperViewer;
