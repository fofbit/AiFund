import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X, Play, Pause, SkipForward, Rocket, TrendingUp, Calendar, DollarSign, FastForward, Rewind } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const TimeTravelAnimation = ({ opportunity, userAvatar, onClose }) => {
  const [phase, setPhase] = useState('loading'); // loading, intro, traveling, arrived, result
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [priceData, setPriceData] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [assetInfo, setAssetInfo] = useState(null);
  const [currentMilestone, setCurrentMilestone] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentDate, setCurrentDate] = useState('');
  const [investmentValue, setInvestmentValue] = useState(100);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Map opportunity to asset ID
  const getAssetId = () => {
    // Direct ID match first
    const id = opportunity?.id || '';
    const directMap = {
      'btc_2015': 'btc_2015', 'btc_etf_2024': 'btc_2015', 'btc_2010_origin': 'btc_2010_origin',
      'bitcoin_2011': 'bitcoin_2011',
      'eth_2016': 'eth_2016', 'eth_ico_2014': 'eth_ico_2014', 'pepe_2023': 'pepe_2023',
      'sol_2022_bottom': 'sol_2022_bottom', 'nvda_2024_ai': 'nvda_2024_ai',
      'nvda_ipo_1999': 'nvda_ipo_1999', 'nvda_2023_ai_boom': 'nvda_2024_ai',
      'tsla_2020': 'tsla_2020', 'tsla_ipo_2010': 'tsla_ipo_2010',
      'doge_2020': 'doge_2020',
      'meta_2022_bottom': 'meta_2022_bottom', 'amd_2016': 'amd_2016',
      'aapl_2015': 'aapl_2015', 'aapl_2010': 'aapl_2015',
      'gold_2015': 'gold_2015',
      'gme_2021': 'gme_2021', 'gme_wsb_2021': 'gme_wsb_2021',
      'ordi_2023': 'ordi_2023',
      'tencent_ipo_2004': 'tencent_ipo_2004',
      'amzn_ipo_1997': 'amzn_ipo_1997', 'amzn_2010': 'amzn_ipo_1997',
      'google_ipo_2004': 'google_ipo_2004',
      'netflix_2010': 'netflix_2010', 'msft_2010': 'nvda_2024_ai',
      'shopify_ipo_2015': 'nvda_2024_ai',
      'bnb_2017': 'eth_2016', 'moutai_ipo_2001': 'moutai_ipo_2001',
      'yesterday_btc': 'btc_2015', 'yesterday_meme': 'pepe_2023',
      'amzn_2015': 'amzn_ipo_1997', 'kweichow_2015': 'gold_2015',
      'byd_2020': 'tsla_2020', 'oil_2022': 'gold_2015',
      'oil_negative_2020': 'gold_2015', 'vix_2020': 'gold_2015',
      'qqq_options_2020': 'nvda_2024_ai', 'uni_airdrop_2020': 'eth_2016',
      'polymarket_trump_2024': 'btc_2015', 'polymarket_btc_100k': 'btc_2015',
      'sol_meme_2023': 'sol_2022_bottom',
    };
    if (directMap[id]) return directMap[id];
    
    // Fallback: title-based matching
    const title = opportunity?.title?.toLowerCase() || '';
    if (title.includes('btc') || title.includes('比特币')) return 'btc_2015';
    if (title.includes('eth') || title.includes('以太坊')) return 'eth_2016';
    if (title.includes('pepe')) return 'pepe_2023';
    if (title.includes('sol') || title.includes('solana')) return 'sol_2022_bottom';
    if (title.includes('nvda') || title.includes('英伟达')) return 'nvda_2024_ai';
    if (title.includes('tsla') || title.includes('特斯拉')) return 'tsla_2020';
    if (title.includes('doge') || title.includes('狗狗')) return 'doge_2020';
    if (title.includes('meta')) return 'meta_2022_bottom';
    if (title.includes('amd')) return 'amd_2016';
    if (title.includes('aapl') || title.includes('苹果')) return 'aapl_2015';
    if (title.includes('gold') || title.includes('黄金')) return 'gold_2015';
    if (title.includes('gme') || title.includes('gamestop')) return 'gme_2021';
    if (title.includes('ordi')) return 'ordi_2023';
    return 'btc_2015';
  };

  useEffect(() => {
    loadHistoricalData();
  }, [opportunity]);

  const loadHistoricalData = async () => {
    try {
      const assetId = getAssetId();
      const response = await axios.get(`${API}/historical/price-curve/${assetId}?points=300`);
      
      setPriceData(response.data.curve);
      setMilestones(response.data.milestones);
      setAssetInfo(response.data.asset);
      setPhase('intro');
      
      // Start animation after a delay
      setTimeout(() => setPhase('traveling'), 2000);
    } catch (error) {
      console.error('Error loading historical data:', error);
      // Fallback to generated data
      generateFallbackData();
    }
  };

  const generateFallbackData = () => {
    const points = [];
    const startPrice = opportunity.initial_investment;
    const endPrice = opportunity.final_value;
    const steps = 300;
    
    for (let i = 0; i <= steps; i++) {
      const prog = i / steps;
      const basePrice = startPrice + (endPrice - startPrice) * Math.pow(prog, 0.7);
      const volatility = (Math.random() - 0.5) * basePrice * 0.1;
      points.push({
        x: i,
        price: Math.max(startPrice * 0.5, basePrice + volatility),
        progress: prog
      });
    }
    setPriceData(points);
    setPhase('intro');
    setTimeout(() => setPhase('traveling'), 2000);
  };

  // Update current values during animation
  useEffect(() => {
    if (priceData.length > 0 && phase === 'traveling') {
      const index = Math.min(Math.floor((progress / 100) * (priceData.length - 1)), priceData.length - 1);
      const point = priceData[index];
      if (point) {
        setCurrentPrice(point.price);
        setCurrentDate(point.date || '');
        
        // Calculate investment value
        const startPrice = priceData[0]?.price || 1;
        const multiplier = point.price / startPrice;
        setInvestmentValue(100 * multiplier);
        
        // Find current milestone
        if (milestones.length > 0) {
          const milestone = milestones.find((m, i) => {
            const nextM = milestones[i + 1];
            if (!nextM) return true;
            return point.date >= m.date && point.date < nextM.date;
          });
          setCurrentMilestone(milestone);
        }
      }
    }
  }, [progress, priceData, milestones, phase]);

  // Draw the animated canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || priceData.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, '#0f172a');
      bgGradient.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw stars
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 80; i++) {
        const x = (i * 47 + Date.now() / 50) % width;
        const y = (i * 31) % height;
        const size = (i % 3) + 1;
        const twinkle = Math.sin(Date.now() / 500 + i) * 0.5 + 0.5;
        ctx.globalAlpha = twinkle * 0.8;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Chart dimensions
      const chartStartX = 100;
      const chartEndX = width - 100;
      const chartHeight = height * 0.5;
      const chartTop = height * 0.25;

      // Calculate price range
      const prices = priceData.map(p => p.price);
      const maxPrice = Math.max(...prices);
      const minPrice = Math.min(...prices);
      const priceRange = maxPrice - minPrice || 1;

      // Draw time portal at start
      if (phase === 'intro' || phase === 'traveling') {
        const portalX = 60;
        const portalY = height / 2;
        const portalRadius = 50 + Math.sin(Date.now() / 200) * 5;
        
        const portalGradient = ctx.createRadialGradient(portalX, portalY, 0, portalX, portalY, portalRadius);
        portalGradient.addColorStop(0, '#8b5cf6');
        portalGradient.addColorStop(0.5, '#6366f1');
        portalGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = portalGradient;
        ctx.beginPath();
        ctx.arc(portalX, portalY, portalRadius, 0, Math.PI * 2);
        ctx.fill();

        // Portal rings
        ctx.strokeStyle = '#a78bfa';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
          ctx.globalAlpha = 0.5 - i * 0.15;
          ctx.beginPath();
          ctx.arc(portalX, portalY, portalRadius + i * 20, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      // Draw price chart with glow effect
      const visibleProgress = Math.min(progress / 100, 1);
      const visiblePoints = Math.floor(visibleProgress * priceData.length);
      
      if (visiblePoints > 1) {
        // Glow effect
        ctx.shadowColor = assetInfo?.color || '#10b981';
        ctx.shadowBlur = 20;
        
        // Draw filled area
        ctx.beginPath();
        ctx.moveTo(chartStartX, chartTop + chartHeight);
        
        for (let i = 0; i < visiblePoints; i++) {
          const x = chartStartX + (i / priceData.length) * (chartEndX - chartStartX);
          const y = chartTop + chartHeight - ((priceData[i].price - minPrice) / priceRange) * chartHeight;
          if (i === 0) {
            ctx.lineTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        const lastX = chartStartX + ((visiblePoints - 1) / priceData.length) * (chartEndX - chartStartX);
        ctx.lineTo(lastX, chartTop + chartHeight);
        ctx.closePath();
        
        const fillGradient = ctx.createLinearGradient(0, chartTop, 0, chartTop + chartHeight);
        fillGradient.addColorStop(0, (assetInfo?.color || '#10b981') + '40');
        fillGradient.addColorStop(1, (assetInfo?.color || '#10b981') + '00');
        ctx.fillStyle = fillGradient;
        ctx.fill();

        // Draw line
        ctx.beginPath();
        ctx.strokeStyle = assetInfo?.color || '#10b981';
        ctx.lineWidth = 3;
        
        for (let i = 0; i < visiblePoints; i++) {
          const x = chartStartX + (i / priceData.length) * (chartEndX - chartStartX);
          const y = chartTop + chartHeight - ((priceData[i].price - minPrice) / priceRange) * chartHeight;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Draw UFO with user avatar
      if (phase === 'traveling' || phase === 'arrived') {
        const ufoProgress = Math.min(progress / 100, 1);
        const ufoX = chartStartX + ufoProgress * (chartEndX - chartStartX);
        const priceIndex = Math.min(Math.floor(ufoProgress * priceData.length), priceData.length - 1);
        const currentP = priceData[priceIndex]?.price || 0;
        const ufoY = chartTop + chartHeight - ((currentP - minPrice) / priceRange) * chartHeight - 60;

        // UFO body with glow
        ctx.shadowColor = '#6366f1';
        ctx.shadowBlur = 30;
        ctx.fillStyle = '#6366f1';
        ctx.beginPath();
        ctx.ellipse(ufoX, ufoY, 40, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // UFO dome
        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath();
        ctx.ellipse(ufoX, ufoY - 10, 25, 18, 0, Math.PI, 0);
        ctx.fill();

        // UFO lights
        ctx.fillStyle = '#fbbf24';
        for (let i = 0; i < 5; i++) {
          const lightX = ufoX - 24 + i * 12;
          const blink = Math.sin(Date.now() / 80 + i) > 0;
          if (blink) {
            ctx.beginPath();
            ctx.arc(lightX, ufoY + 8, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Beam
        ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
        ctx.beginPath();
        ctx.moveTo(ufoX - 30, ufoY + 15);
        ctx.lineTo(ufoX + 30, ufoY + 15);
        ctx.lineTo(ufoX + 20, ufoY + 80);
        ctx.lineTo(ufoX - 20, ufoY + 80);
        ctx.closePath();
        ctx.fill();

        // User avatar in dome
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(userAvatar || '👤', ufoX, ufoY - 5);

        // Trail particles
        for (let i = 0; i < 15; i++) {
          const trailX = ufoX - 25 - i * 10 - Math.random() * 5;
          const trailY = ufoY + Math.sin(Date.now() / 100 + i) * 15;
          ctx.fillStyle = `rgba(139, 92, 246, ${0.8 - i * 0.05})`;
          ctx.beginPath();
          ctx.arc(trailX, trailY, 4 - i * 0.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw target portal at end
      if (phase === 'traveling' || phase === 'arrived') {
        const endPortalX = width - 50;
        const endPortalY = height / 2;
        const endPortalRadius = phase === 'arrived' ? 70 : 50;
        
        const endGradient = ctx.createRadialGradient(endPortalX, endPortalY, 0, endPortalX, endPortalY, endPortalRadius);
        endGradient.addColorStop(0, '#fbbf24');
        endGradient.addColorStop(0.5, '#f59e0b');
        endGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = endGradient;
        ctx.beginPath();
        ctx.arc(endPortalX, endPortalY, endPortalRadius + Math.sin(Date.now() / 150) * 10, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw milestone markers
      if (milestones.length > 0 && priceData.length > 0) {
        milestones.forEach((milestone, i) => {
          const milestoneDate = milestone.date;
          const dataIndex = priceData.findIndex(p => p.date >= milestoneDate);
          if (dataIndex > 0 && dataIndex < visiblePoints) {
            const x = chartStartX + (dataIndex / priceData.length) * (chartEndX - chartStartX);
            const y = chartTop + chartHeight - ((priceData[dataIndex].price - minPrice) / priceRange) * chartHeight;
            
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [phase, progress, priceData, milestones, assetInfo, userAvatar]);

  // Animation progression
  useEffect(() => {
    if (isPaused || phase !== 'traveling') return;

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (0.5 * speed);
        if (newProgress >= 100) {
          setPhase('result');
          return 100;
        }
        return newProgress;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [isPaused, phase, speed]);

  const skipToEnd = () => {
    setProgress(100);
    setPhase('result');
  };

  const formatPrice = (price) => {
    if (price < 0.0001) return price.toExponential(2);
    if (price < 1) return price.toFixed(6);
    if (price < 100) return price.toFixed(2);
    return price.toLocaleString();
  };

  if (phase === 'loading') {
    return (
      <div className="fixed inset-0 bg-black z-[70] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading history...</p>
          <p className="text-purple-400 mt-2 text-sm">Preparing time travel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-[70] flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-purple-500/30 flex-shrink-0">
        <div className="flex items-center min-w-0">
          <Rocket className="w-5 h-5 text-purple-400 mr-2 animate-pulse flex-shrink-0" />
          <h2 className="text-lg sm:text-2xl font-bold text-white truncate">{assetInfo?.name || opportunity?.title}</h2>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white ml-2 flex-shrink-0">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Stats - 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 sm:p-4 flex-shrink-0">
        <div className="bg-white/10 rounded-lg p-2 sm:p-3 text-center">
          <p className="text-gray-400 text-xs">Date</p>
          <p className="text-white font-bold text-sm sm:text-base truncate">{currentDate || '---'}</p>
        </div>
        <div className="bg-white/10 rounded-lg p-2 sm:p-3 text-center">
          <p className="text-gray-400 text-xs">Price</p>
          <p className="text-white font-bold text-sm sm:text-base">${formatPrice(currentPrice)}</p>
        </div>
        <div className="bg-white/10 rounded-lg p-2 sm:p-3 text-center">
          <p className="text-gray-400 text-xs">100U Value</p>
          <p className={`font-bold text-sm sm:text-base ${investmentValue >= 100 ? 'text-green-400' : 'text-red-400'}`}>
            ${investmentValue.toLocaleString(undefined, {maximumFractionDigits: 0})}
          </p>
        </div>
        <div className="bg-white/10 rounded-lg p-2 sm:p-3 text-center">
          <p className="text-gray-400 text-xs">Event</p>
          <p className="text-yellow-400 font-bold text-xs sm:text-sm truncate">{currentMilestone?.event || '---'}</p>
        </div>
      </div>

      {/* Canvas - flexible height */}
      <div className="flex-1 min-h-0 px-3 sm:px-4">
        <div className="bg-slate-900 rounded-xl overflow-hidden border border-purple-500/30 h-full">
          <canvas ref={canvasRef} width={900} height={450} className="w-full h-full" />
        </div>
      </div>

      {/* Controls - simplified on mobile */}
      <div className="flex items-center justify-between p-3 sm:p-4 bg-black border-t border-white/10 flex-shrink-0">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button onClick={() => setIsPaused(!isPaused)} className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white">
            {isPaused ? <Play className="w-4 h-4 sm:w-5 sm:h-5" /> : <Pause className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
          <button onClick={skipToEnd} className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white">
            <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          {[1, 2, 4].map(s => (
            <button key={s} onClick={() => setSpeed(s)}
              className={`px-2 py-1 sm:px-3 rounded text-xs sm:text-sm ${speed === s ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300'}`}
            >{s}x</button>
          ))}
        </div>
        <div className="flex-1 mx-3 sm:mx-6">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <span className="text-white font-mono text-sm sm:text-lg">{progress.toFixed(0)}%</span>
      </div>

        {/* Result Panel */}
        {phase === 'result' && (
          <div className="mt-4 p-6 bg-gradient-to-r from-green-600/30 to-emerald-600/30 rounded-xl border border-green-500/50 animate-fadeIn">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-bold text-white mb-2">
                时光旅行完成!
              </h3>
              <p className="text-green-300 text-xl mb-4">
                从 {assetInfo?.start_date || opportunity?.date} 到 现在
              </p>
              <div className="flex items-center justify-center space-x-8 mb-6">
                <div>
                  <p className="text-gray-400">初始投资</p>
                  <p className="text-2xl font-bold text-white">$100</p>
                </div>
                <div className="text-4xl">→</div>
                <div>
                  <p className="text-gray-400">现在价值</p>
                  <p className="text-4xl font-bold text-green-400">
                    ${investmentValue.toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </p>
                </div>
              </div>
              <p className="text-yellow-300 text-lg">
                💡 这就是为什么你需要AI帮你发现下一个暴富机会！
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeTravelAnimation;
