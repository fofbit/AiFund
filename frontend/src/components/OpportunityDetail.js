import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Rocket, Calendar, TrendingUp, DollarSign, BookOpen, ArrowLeft, ChevronRight } from 'lucide-react';
import TimeTravelAnimation from './TimeTravelAnimation';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const OpportunityDetail = ({ opportunity, userData, onClose, onBack }) => {
  const [showTimeTravel, setShowTimeTravel] = useState(false);

  // Generate a rich story based on the opportunity data
  const getStory = (opp) => {
    const stories = {
      'btc_2015': {
        title: '比特币：从0.05美元到10万美元的传奇',
        chapters: [
          { year: '2010', title: '起源', text: '一个叫中本聪的神秘人发明了比特币。一个程序员用10,000枚比特币买了两个披萨——这是比特币第一次有了"价格"。' },
          { year: '2013', title: '首次突破1000美元', text: '比特币价格首次突破1000美元，全球媒体开始关注。但紧接着Mt.Gox交易所崩溃，价格暴跌80%。' },
          { year: '2017', title: 'ICO狂热', text: '比特币在12月触及近$20,000的历史高点。全球散户疯狂涌入，但随后迎来了漫长的熊市。' },
          { year: '2020', title: '机构入场', text: '新冠疫情下各国央行大量印钞，MicroStrategy、Tesla等公司开始购买比特币作为储备资产。' },
          { year: '2024', title: 'ETF获批', text: 'SEC批准比特币现货ETF，华尔街正式拥抱比特币。价格突破$73,000创新高。' },
          { year: '2025', title: '突破10万', text: '比特币突破$100,000大关，成为全球第七大资产。如果你2015年投资100美元，现在价值超过45万美元。' },
        ],
        insight: '比特币证明了：在新技术革命的早期，即使是最小的投资也能带来改变人生的回报。AI交易Bot能帮你发现下一个"比特币级别"的机会。'
      },
      'eth_2016': {
        title: '以太坊：智能合约革命',
        chapters: [
          { year: '2015', title: '诞生', text: 'Vitalik Buterin创造了以太坊，首次将"智能合约"概念变为现实。上线首日价格仅$1。' },
          { year: '2017', title: 'ICO爆发', text: '以太坊成为ICO的基础平台，价格从$8飙升至$1,400。' },
          { year: '2020', title: 'DeFi Summer', text: '去中心化金融（DeFi）在以太坊上爆发，TVL从10亿增长到1000亿美元。' },
          { year: '2021', title: '历史新高', text: '以太坊价格达到$4,865，NFT狂潮进一步推高了网络活跃度。' },
        ],
        insight: '以太坊证明了：平台型资产的价值来自于其生态系统。AI能帮你识别下一个伟大的平台级投资机会。'
      },
      'pepe_2023': {
        title: 'PEPE：Meme文化的财富密码',
        chapters: [
          { year: '2023年4月', title: '横空出世', text: 'PEPE在以太坊上发布，凭借经典的青蛙表情包文化迅速走红。' },
          { year: '2023年5月', title: '首次暴涨', text: '仅用3周时间，PEPE市值突破10亿美元，早期投资者获得超过1000倍回报。' },
          { year: '2024年', title: '二次起飞', text: 'PEPE在牛市中再次爆发，价格创历史新高。' },
        ],
        insight: 'Meme币证明了：在加密世界，文化共识就是价值。AI能实时监控社交媒体，帮你第一时间发现爆款Meme。'
      },
      'sol_2022_bottom': {
        title: 'Solana：从废墟中崛起',
        chapters: [
          { year: '2022年11月', title: 'FTX崩盘', text: 'FTX交易所崩溃，Solana被认为与FTX关系密切，价格从$35暴跌至$8。' },
          { year: '2023年', title: '绝地反击', text: '社区不离不弃，开发者持续建设，Solana生态逐步恢复。' },
          { year: '2024年', title: '王者归来', text: 'Solana成为最热门的公链之一，价格回升至$200+，从最低点上涨25倍。' },
        ],
        insight: 'Solana证明了：危机中被"错杀"的优质资产，往往蕴含着最大的机会。AI能帮你在恐慌中保持理性。'
      },
      'nvda_2024_ai': {
        title: '英伟达：AI革命的最大赢家',
        chapters: [
          { year: '2023年初', title: 'ChatGPT效应', text: 'ChatGPT爆火，GPU需求暴增，英伟达成为AI革命的核心受益者。' },
          { year: '2023年5月', title: '财报震惊华尔街', text: '英伟达公布AI芯片收入暴增，股价一夜暴涨25%。' },
          { year: '2024年', title: '全球市值第一', text: '英伟达超越苹果成为全球市值最高的公司，AI芯片供不应求。' },
        ],
        insight: '英伟达证明了：技术革命的"铲子供应商"往往是最确定的投资机会。AI能帮你识别每次技术浪潮的核心受益者。'
      },
      'tsla_2020': {
        title: '特斯拉：电动车革命',
        chapters: [
          { year: '2020年3月', title: '疫情低谷', text: '新冠疫情下特斯拉股价暴跌至$28，市场对其前景极度悲观。' },
          { year: '2020年下半年', title: '绝地反弹', text: '特斯拉交付量超预期，纳入标普500指数，股价飙升。' },
          { year: '2021年11月', title: '历史高点', text: '特斯拉股价达到$409（拆股后），市值突破1万亿美元。' },
        ],
        insight: '特斯拉证明了：颠覆性企业在极度悲观时买入，回报惊人。AI能帮你在市场恐慌中发现被低估的革命性公司。'
      },
    };

    // Default story for opportunities not in the map
    const defaultStory = {
      title: `${opp.title} — 财富神话`,
      chapters: [
        { year: opp.date?.substring(0, 4) || '起始', title: '机会出现', text: opp.what_happened || opp.description },
        { year: '结果', title: '最终回报', text: `如果当时投资100U，最终将变成$${opp.final_value?.toLocaleString()}，回报率${opp.roi_multiplier}。` },
      ],
      insight: opp.lesson || '每一个财富神话背后，都有一个被大多数人忽视的机会。AI能帮你捕捉这些被忽视的机会。'
    };

    return stories[opp.id] || defaultStory;
  };

  const story = getStory(opportunity);

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[55] p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 rounded-2xl max-w-4xl w-full border border-purple-500/30 shadow-2xl my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-purple-500/30 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
          <div className="flex items-center justify-between mb-4">
            <button onClick={onBack} className="flex items-center text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5 mr-1" />
              返回
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex items-center mb-4">
            <div className="text-5xl mr-4">{opportunity.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-white" data-testid="detail-title">{story.title}</h2>
              <div className="flex items-center mt-2 space-x-4">
                <span className="flex items-center text-gray-400 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  {opportunity.date}
                </span>
                <span className="px-2 py-0.5 bg-purple-500/30 text-purple-200 rounded-full text-xs">
                  {opportunity.category}
                </span>
              </div>
            </div>
          </div>

          {/* ROI Banner */}
          <div className={`p-4 rounded-xl bg-gradient-to-r ${opportunity.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">100U 投资回报</p>
                <p className="text-3xl font-bold text-white">${opportunity.final_value?.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">收益倍数</p>
                <p className="text-3xl font-bold text-white">{opportunity.roi_multiplier}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Story Timeline */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <BookOpen className="w-6 h-6 text-purple-400 mr-2" />
            财富神话故事
          </h3>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-pink-500"></div>
            
            <div className="space-y-6">
              {story.chapters.map((chapter, index) => (
                <div key={index} className="relative pl-16">
                  {/* Timeline dot */}
                  <div className="absolute left-4 w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-slate-900"></div>
                  
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-400/30 transition-all">
                    <div className="flex items-center mb-2">
                      <span className="text-purple-400 font-bold text-sm mr-3">{chapter.year}</span>
                      <h4 className="text-white font-semibold">{chapter.title}</h4>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{chapter.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insight */}
          <div className="mt-8 p-5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl">
            <p className="text-cyan-300 leading-relaxed">
              <strong>AI洞察：</strong>{story.insight}
            </p>
          </div>
        </div>

        {/* Time Travel CTA */}
        <div className="p-6 border-t border-purple-500/30 bg-black/20">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-bold text-lg">穿越时空，亲眼见证这个神话</h4>
              <p className="text-gray-400 text-sm">用时光旅行动画重现{opportunity.title}的完整历程</p>
            </div>
            <button
              onClick={() => setShowTimeTravel(true)}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all flex items-center shadow-lg shadow-purple-500/30"
              data-testid="detail-time-travel-btn"
            >
              <Rocket className="w-5 h-5 mr-2" />
              开始时光旅行
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Time Travel Animation */}
      {showTimeTravel && (
        <TimeTravelAnimation
          opportunity={opportunity}
          userAvatar={userData?.user?.avatar || '👤'}
          onClose={() => setShowTimeTravel(false)}
        />
      )}
    </div>
  );
};

export default OpportunityDetail;
