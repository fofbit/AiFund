import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageCircle, TrendingUp, TrendingDown, BarChart3, X, Send, Sparkles, Bot, Zap, Target, Clock, RefreshCw } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BotChatInterface = ({ botData, onClose }) => {
  const { bot, recent_trades } = botData;
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingText, setCurrentTypingText] = useState('');
  const [demoTrades, setDemoTrades] = useState([]);
  const [marketAnalysis, setMarketAnalysis] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    loadDemoData();
  }, [bot.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadDemoData = async () => {
    try {
      const [tradesRes, marketRes] = await Promise.all([
        axios.get(`${API}/demo/trades/${bot.id}?num_trades=5`),
        axios.get(`${API}/demo/market-analysis`)
      ]);
      setDemoTrades(tradesRes.data.trades);
      setMarketAnalysis(marketRes.data.analysis);
      
      // Generate initial chat messages
      generateChatMessages(tradesRes.data.trades, marketRes.data.analysis);
    } catch (error) {
      console.error('Error loading demo data:', error);
      generateChatMessages(recent_trades, null);
    }
  };

  const generateChatMessages = async (trades, analysis) => {
    const chatMessages = [];
    
    // Welcome message with typing effect
    setIsTyping(true);
    await typeMessage(`你好！我是${bot.name} 🤖`, 50);
    
    chatMessages.push({
      type: 'bot',
      content: `你好！我是${bot.name} 🤖`,
      subtitle: '你的AI交易助手',
      timestamp: new Date(bot.created_at),
      avatar: bot.avatar_emoji || '🤖'
    });

    await new Promise(r => setTimeout(r, 500));

    chatMessages.push({
      type: 'bot',
      content: '我会实时分析市场并执行交易决策',
      subtitle: 'GPT-5.2驱动 · 24/7运行',
      timestamp: new Date(bot.created_at),
      avatar: bot.avatar_emoji || '🤖'
    });
    setMessages([...chatMessages]);

    // Add market analysis message if available
    if (analysis) {
      await new Promise(r => setTimeout(r, 800));
      chatMessages.push({
        type: 'analysis',
        content: `📊 当前市场分析`,
        data: {
          btc: analysis.btc_price,
          eth: analysis.eth_price,
          sentiment: analysis.sentiment,
          recommendation: analysis.recommendation
        },
        timestamp: new Date()
      });
      setMessages([...chatMessages]);
    }

    // Add trade messages with delays
    const tradesToShow = trades || recent_trades || [];
    if (tradesToShow.length > 0) {
      for (let i = 0; i < Math.min(tradesToShow.length, 3); i++) {
        const trade = tradesToShow[i];
        await new Promise(r => setTimeout(r, 1000));
        
        // Decision message
        chatMessages.push({
          type: 'bot',
          content: `💡 ${trade.reason}`,
          subtitle: 'AI分析结果',
          timestamp: new Date(trade.timestamp),
          avatar: bot.avatar_emoji || '🤖'
        });
        setMessages([...chatMessages]);

        await new Promise(r => setTimeout(r, 600));

        // Action message
        const action = trade.action === 'buy' ? '买入' : '卖出';
        const icon = trade.action === 'buy' ? '📈' : '📉';
        chatMessages.push({
          type: 'action',
          action: trade.action,
          content: `${icon} ${action} ${trade.symbol}`,
          price: trade.price,
          amount: trade.amount,
          timestamp: new Date(trade.timestamp)
        });
        setMessages([...chatMessages]);

        await new Promise(r => setTimeout(r, 400));

        // Result message
        const profit = trade.profit_loss;
        const isProfit = profit >= 0;
        chatMessages.push({
          type: 'result',
          isProfit: isProfit,
          content: isProfit ? `✅ 盈利 $${profit.toFixed(2)}` : `⚠️ 亏损 $${Math.abs(profit).toFixed(2)}`,
          subtitle: isProfit ? '好的决策!' : '市场波动,继续优化',
          timestamp: new Date(trade.timestamp)
        });
        setMessages([...chatMessages]);
      }
    } else {
      chatMessages.push({
        type: 'bot',
        content: '正在分析市场中...',
        subtitle: '即将执行第一笔交易',
        timestamp: new Date(),
        avatar: bot.avatar_emoji || '🤖'
      });
      setMessages([...chatMessages]);
    }

    setIsTyping(false);
  };

  const typeMessage = async (text, speed = 30) => {
    for (let i = 0; i <= text.length; i++) {
      setCurrentTypingText(text.substring(0, i));
      await new Promise(r => setTimeout(r, speed));
    }
    setCurrentTypingText('');
  };

  const refreshAnalysis = async () => {
    setIsTyping(true);
    try {
      const marketRes = await axios.get(`${API}/demo/market-analysis`);
      const analysis = marketRes.data.analysis;
      
      const newMessage = {
        type: 'analysis',
        content: `📊 最新市场分析`,
        data: {
          btc: analysis.btc_price,
          eth: analysis.eth_price,
          sentiment: analysis.sentiment,
          recommendation: analysis.recommendation
        },
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error refreshing analysis:', error);
    }
    setIsTyping(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-3xl w-full h-[80vh] flex flex-col border border-purple-500/30">
        {/* Header */}
        <div className="p-4 border-b border-purple-500/30 flex items-center justify-between">
          <div className="flex items-center">
            <MessageCircle className="w-6 h-6 text-purple-400 mr-2" />
            <div>
              <h3 className="text-lg font-bold text-white">{bot.name} 的交易对话</h3>
              <p className="text-sm text-gray-400">实时交易指令与复盘</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.type === 'bot' || msg.type === 'action' || msg.type === 'result' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] ${
                msg.type === 'bot' ? 'bg-purple-600/20 border border-purple-500/30' :
                msg.type === 'action' ? (msg.action === 'buy' ? 'bg-green-600/20 border border-green-500/30' : 'bg-red-600/20 border border-red-500/30') :
                msg.type === 'result' ? (msg.isProfit ? 'bg-emerald-600/20 border border-emerald-500/30' : 'bg-orange-600/20 border border-orange-500/30') :
                'bg-gray-700'
              } rounded-xl p-4`}>
                <p className="text-white font-semibold mb-1">{msg.content}</p>
                {msg.subtitle && (
                  <p className="text-sm text-gray-400">{msg.subtitle}</p>
                )}
                {msg.price && (
                  <div className="mt-2 text-sm">
                    <p className="text-gray-300">价格: ${msg.price.toLocaleString()}</p>
                    <p className="text-gray-300">数量: {msg.amount.toFixed(6)}</p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  {msg.timestamp.toLocaleString('zh-CN')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Investment Review */}
        <div className="p-4 border-t border-purple-500/30 bg-slate-900">
          <h4 className="text-white font-bold mb-3 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
            投资复盘
          </h4>
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-gray-400 text-xs mb-1">总交易</p>
              <p className="text-white text-xl font-bold">{bot.total_trades}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-gray-400 text-xs mb-1">胜率</p>
              <p className="text-white text-xl font-bold">{bot.win_rate.toFixed(1)}%</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-gray-400 text-xs mb-1">总收益</p>
              <p className={`text-xl font-bold ${bot.total_profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${bot.total_profit.toFixed(2)}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-gray-400 text-xs mb-1">回报率</p>
              <p className={`text-xl font-bold ${bot.total_profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {((bot.total_profit / 10000) * 100).toFixed(2)}%
              </p>
            </div>
          </div>
          
          <div className="mt-3 p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg">
            <p className="text-purple-300 text-sm">
              💡 <strong>建议:</strong> {
                bot.win_rate > 60 ? '遵守Bot的交易指令，胜率很高！' :
                bot.win_rate > 40 ? 'Bot策略稳健，继续观察' :
                'Bot正在学习优化策略'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotChatInterface;
