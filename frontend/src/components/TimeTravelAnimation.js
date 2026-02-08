import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, SkipForward, Rocket, TrendingUp, Calendar, DollarSign } from 'lucide-react';

const TimeTravelAnimation = ({ opportunity, userAvatar, onClose }) => {
  const [phase, setPhase] = useState('intro'); // intro, traveling, arrived, result
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Price chart data simulation
  const generatePriceData = () => {
    const points = [];
    const startPrice = opportunity.initial_investment;
    const endPrice = opportunity.final_value;
    const steps = 100;
    
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      // Create a realistic price curve with some volatility
      const basePrice = startPrice + (endPrice - startPrice) * Math.pow(progress, 0.7);
      const volatility = (Math.random() - 0.5) * basePrice * 0.1;
      points.push({
        x: i,
        y: Math.max(startPrice * 0.5, basePrice + volatility)
      });
    }
    return points;
  };

  const [priceData] = useState(generatePriceData());

  // Draw the animated canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
      for (let i = 0; i < 50; i++) {
        const x = (i * 47) % width;
        const y = (i * 31) % height;
        const size = (i % 3) + 1;
        const twinkle = Math.sin(Date.now() / 500 + i) * 0.5 + 0.5;
        ctx.globalAlpha = twinkle * 0.8;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Draw time portal at start
      if (phase === 'intro' || phase === 'traveling') {
        const portalX = 80;
        const portalY = height / 2;
        const portalRadius = 40;
        
        const portalGradient = ctx.createRadialGradient(
          portalX, portalY, 0,
          portalX, portalY, portalRadius
        );
        portalGradient.addColorStop(0, '#8b5cf6');
        portalGradient.addColorStop(0.5, '#6366f1');
        portalGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = portalGradient;
        ctx.beginPath();
        ctx.arc(portalX, portalY, portalRadius + Math.sin(Date.now() / 200) * 5, 0, Math.PI * 2);
        ctx.fill();

        // Portal rings
        ctx.strokeStyle = '#a78bfa';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
          ctx.globalAlpha = 0.5 - i * 0.15;
          ctx.beginPath();
          ctx.arc(portalX, portalY, portalRadius + i * 15 + Math.sin(Date.now() / 300 + i) * 5, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      // Draw price chart
      const chartStartX = 150;
      const chartEndX = width - 80;
      const chartHeight = height * 0.6;
      const chartTop = height * 0.2;

      // Chart area
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(chartStartX, chartTop, chartEndX - chartStartX, chartHeight);

      // Price line
      const maxPrice = Math.max(...priceData.map(p => p.y));
      const minPrice = Math.min(...priceData.map(p => p.y));
      const priceRange = maxPrice - minPrice;

      const visiblePoints = Math.min(progress, priceData.length);
      
      if (visiblePoints > 1) {
        ctx.beginPath();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 10;

        for (let i = 0; i < visiblePoints; i++) {
          const x = chartStartX + (priceData[i].x / 100) * (chartEndX - chartStartX);
          const y = chartTop + chartHeight - ((priceData[i].y - minPrice) / priceRange) * chartHeight;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Fill area under line
        ctx.lineTo(chartStartX + ((visiblePoints - 1) / 100) * (chartEndX - chartStartX), chartTop + chartHeight);
        ctx.lineTo(chartStartX, chartTop + chartHeight);
        ctx.closePath();
        
        const fillGradient = ctx.createLinearGradient(0, chartTop, 0, chartTop + chartHeight);
        fillGradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
        fillGradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.fillStyle = fillGradient;
        ctx.fill();
      }

      // Draw UFO with user avatar
      if (phase === 'traveling' || phase === 'arrived') {
        const ufoProgress = Math.min(progress / 100, 1);
        const ufoX = chartStartX + ufoProgress * (chartEndX - chartStartX);
        const priceIndex = Math.min(Math.floor(ufoProgress * 100), 99);
        const ufoY = chartTop + chartHeight - ((priceData[priceIndex].y - minPrice) / priceRange) * chartHeight - 50;

        // UFO body
        ctx.fillStyle = '#6366f1';
        ctx.beginPath();
        ctx.ellipse(ufoX, ufoY, 35, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // UFO dome
        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath();
        ctx.ellipse(ufoX, ufoY - 8, 20, 15, 0, Math.PI, 0);
        ctx.fill();

        // UFO lights
        ctx.fillStyle = '#fbbf24';
        for (let i = 0; i < 5; i++) {
          const lightX = ufoX - 20 + i * 10;
          const blink = Math.sin(Date.now() / 100 + i) > 0;
          if (blink) {
            ctx.beginPath();
            ctx.arc(lightX, ufoY + 5, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Beam
        ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
        ctx.beginPath();
        ctx.moveTo(ufoX - 25, ufoY + 12);
        ctx.lineTo(ufoX + 25, ufoY + 12);
        ctx.lineTo(ufoX + 15, ufoY + 60);
        ctx.lineTo(ufoX - 15, ufoY + 60);
        ctx.closePath();
        ctx.fill();

        // User avatar in dome
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(userAvatar || '👤', ufoX, ufoY - 5);

        // Trail particles
        for (let i = 0; i < 10; i++) {
          const trailX = ufoX - 20 - i * 8 - Math.random() * 5;
          const trailY = ufoY + Math.sin(Date.now() / 100 + i) * 10;
          ctx.fillStyle = `rgba(139, 92, 246, ${0.8 - i * 0.08})`;
          ctx.beginPath();
          ctx.arc(trailX, trailY, 3 - i * 0.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw target portal at end
      if (phase === 'traveling' || phase === 'arrived') {
        const endPortalX = chartEndX + 40;
        const endPortalY = height / 2;
        const endPortalRadius = phase === 'arrived' ? 60 : 40;
        
        const endGradient = ctx.createRadialGradient(
          endPortalX, endPortalY, 0,
          endPortalX, endPortalY, endPortalRadius
        );
        endGradient.addColorStop(0, '#fbbf24');
        endGradient.addColorStop(0.5, '#f59e0b');
        endGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = endGradient;
        ctx.beginPath();
        ctx.arc(endPortalX, endPortalY, endPortalRadius + Math.sin(Date.now() / 150) * 8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Date labels
      ctx.fillStyle = '#9ca3af';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(opportunity.date, chartStartX, height - 20);
      ctx.fillText('现在', chartEndX, height - 20);

      // Price labels
      ctx.textAlign = 'right';
      ctx.fillText(`$${opportunity.initial_investment}`, chartStartX - 10, chartTop + chartHeight);
      ctx.fillText(`$${opportunity.final_value.toLocaleString()}`, chartStartX - 10, chartTop + 20);

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [phase, progress, priceData, opportunity, userAvatar]);

  // Animation progression
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setPhase('result');
          return 100;
        }
        
        if (prev === 0 && phase === 'intro') {
          setPhase('traveling');
        }
        
        if (prev >= 95) {
          setPhase('arrived');
        }
        
        return prev + 1;
      });
    }, 80);

    return () => clearInterval(timer);
  }, [isPaused, phase]);

  const skipToEnd = () => {
    setProgress(100);
    setPhase('result');
  };

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Rocket className="w-6 h-6 text-purple-400 mr-2" />
            <h2 className="text-2xl font-bold text-white">时光旅行</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Opportunity Info */}
        <div className="bg-white/10 rounded-xl p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-4xl mr-4">{opportunity.icon}</div>
            <div>
              <h3 className="text-xl font-bold text-white">{opportunity.title}</h3>
              <div className="flex items-center text-gray-400 text-sm">
                <Calendar className="w-4 h-4 mr-1" />
                {opportunity.date}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">如果那时投资100U</div>
            <div className="text-3xl font-bold text-green-400">
              ${opportunity.final_value.toLocaleString()}
            </div>
            <div className="text-sm text-green-300">{opportunity.roi_multiplier}</div>
          </div>
        </div>

        {/* Canvas Animation */}
        <div className="bg-slate-900 rounded-2xl overflow-hidden border border-purple-500/30">
          <canvas 
            ref={canvasRef} 
            width={800} 
            height={400}
            className="w-full"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>
            <button
              onClick={skipToEnd}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 mx-4">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="text-white font-mono">
            {progress}%
          </div>
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
                如果你在 {opportunity.date} 投资 100U
              </p>
              <div className="flex items-center justify-center space-x-8">
                <div>
                  <p className="text-gray-400">初始投资</p>
                  <p className="text-2xl font-bold text-white">$100</p>
                </div>
                <div className="text-4xl">→</div>
                <div>
                  <p className="text-gray-400">现在价值</p>
                  <p className="text-4xl font-bold text-green-400">
                    ${opportunity.final_value.toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-yellow-300 mt-4 text-lg">
                💡 {opportunity.lesson}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeTravelAnimation;
