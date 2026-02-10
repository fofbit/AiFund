import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X, RefreshCw, TrendingUp, TrendingDown, ExternalLink, Clock, Bot, BarChart3 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Links for users to learn more
const ASSET_LINKS = {
  'BTC': 'https://www.coingecko.com/en/coins/bitcoin',
  'ETH': 'https://www.coingecko.com/en/coins/ethereum',
  'SOL': 'https://www.coingecko.com/en/coins/solana',
  'DOGE': 'https://www.coingecko.com/en/coins/dogecoin',
  'PEPE': 'https://www.coingecko.com/en/coins/pepe',
  'ORDI': 'https://www.coingecko.com/en/coins/ordi',
  'BNB': 'https://www.coingecko.com/en/coins/bnb',
  'XRP': 'https://www.coingecko.com/en/coins/xrp',
  'NVDA': 'https://finance.yahoo.com/quote/NVDA',
  'TSLA': 'https://finance.yahoo.com/quote/TSLA',
  'AAPL': 'https://finance.yahoo.com/quote/AAPL',
  'META': 'https://finance.yahoo.com/quote/META',
  'AMZN': 'https://finance.yahoo.com/quote/AMZN',
  'GOOG': 'https://finance.yahoo.com/quote/GOOG',
  'MSFT': 'https://finance.yahoo.com/quote/MSFT',
  'NFLX': 'https://finance.yahoo.com/quote/NFLX',
};

const BotChatInterface = ({ botData, onClose }) => {
  const { bot } = botData;
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [demoTrades, setDemoTrades] = useState([]);
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
      const tradesRes = await axios.get(`${API}/demo/trades/${bot.id}?num_trades=8`);
      setDemoTrades(tradesRes.data.trades);
      generateChatMessages(tradesRes.data.trades);
    } catch (error) {
      console.error('Error loading demo data:', error);
      generateChatMessages([]);
    }
  };

  const generateChatMessages = async (trades) => {
    const chatMessages = [];

    // Greeting
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 600));

    chatMessages.push({
      type: 'bot',
      content: `主人好！我是${bot.name}，今天的投资情报已准备好。`,
      timestamp: new Date(),
    });
    setMessages([...chatMessages]);

    await new Promise(r => setTimeout(r, 500));

    chatMessages.push({
      type: 'bot',
      content: '以下是今日的买入/卖出建议。点击链接可了解更多详情。',
      timestamp: new Date(),
    });
    setMessages([...chatMessages]);

    // Show trade commands as simple buy/sell instructions
    const tradesToShow = trades.slice(0, 6);
    for (let i = 0; i < tradesToShow.length; i++) {
      const trade = tradesToShow[i];
      await new Promise(r => setTimeout(r, 700));

      chatMessages.push({
        type: 'command',
        action: trade.action,
        symbol: trade.symbol,
        price: trade.price,
        profitLoss: trade.profit_loss,
        link: ASSET_LINKS[trade.symbol] || `https://www.coingecko.com/en/coins/${trade.symbol.toLowerCase()}`,
        timestamp: new Date(trade.timestamp),
      });
      setMessages([...chatMessages]);
    }

    await new Promise(r => setTimeout(r, 500));

    // Summary
    const totalProfit = tradesToShow.reduce((sum, t) => sum + (t.profit_loss || 0), 0);
    chatMessages.push({
      type: 'summary',
      totalTrades: tradesToShow.length,
      totalProfit: totalProfit,
      timestamp: new Date(),
    });
    setMessages([...chatMessages]);

    setIsTyping(false);
  };

  const refreshCommands = async () => {
    setIsTyping(true);
    setMessages([]);
    try {
      const tradesRes = await axios.get(`${API}/demo/trades/${bot.id}?num_trades=8`);
      setDemoTrades(tradesRes.data.trades);
      await generateChatMessages(tradesRes.data.trades);
    } catch (error) {
      console.error('Error refreshing:', error);
    }
    setIsTyping(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-slate-800 rounded-2xl max-w-2xl w-full h-[85vh] sm:h-[80vh] flex flex-col border border-purple-500/30">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-purple-500/30 flex items-center justify-between bg-gradient-to-r from-purple-600/20 to-pink-600/20">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl sm:text-2xl mr-3 shadow-lg">
              {bot.avatar_emoji || '🤖'}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center">
                {bot.name}
                <span className="ml-2 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                  在线
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-400">今日投资情报</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={refreshCommands} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="刷新">
              <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isTyping ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {messages.map((msg, index) => (
            <div key={index}>
              {msg.type === 'bot' && (
                <div className="flex items-start">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs sm:text-sm mr-2 flex-shrink-0">
                    {bot.avatar_emoji || '🤖'}
                  </div>
                  <div className="bg-purple-600/20 border border-purple-500/30 rounded-xl p-3 max-w-[85%]">
                    <p className="text-white text-sm sm:text-base">{msg.content}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {msg.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )}

              {msg.type === 'command' && (
                <div className={`ml-9 sm:ml-10 p-3 rounded-xl border ${
                  msg.action === 'buy'
                    ? 'bg-green-600/15 border-green-500/30'
                    : 'bg-red-600/15 border-red-500/30'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {msg.action === 'buy'
                        ? <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-2" />
                        : <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mr-2" />
                      }
                      <span className={`font-bold text-sm sm:text-lg ${msg.action === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                        {msg.action === 'buy' ? '买入' : '卖出'} {msg.symbol}
                      </span>
                    </div>
                    <span className="text-white font-semibold text-sm">${msg.price?.toLocaleString()}</span>
                  </div>

                  {msg.profitLoss !== undefined && (
                    <p className={`text-xs sm:text-sm mb-2 ${msg.profitLoss >= 0 ? 'text-green-300' : 'text-orange-300'}`}>
                      {msg.profitLoss >= 0 ? '预期盈利' : '预期风险'}: {msg.profitLoss >= 0 ? '+' : ''}${msg.profitLoss?.toFixed(2)}
                    </p>
                  )}

                  <a
                    href={msg.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                    data-testid={`trade-link-${msg.symbol}`}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    了解 {msg.symbol} 详情
                  </a>

                  <p className="text-xs text-gray-500 mt-1">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {msg.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              )}

              {msg.type === 'summary' && (
                <div className="ml-9 sm:ml-10 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl">
                  <div className="flex items-center mb-2">
                    <BarChart3 className="w-4 h-4 text-purple-400 mr-2" />
                    <span className="text-white font-semibold text-sm">今日汇总</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/20 rounded-lg p-2 text-center">
                      <p className="text-gray-400 text-xs">总指令</p>
                      <p className="text-white font-bold">{msg.totalTrades}</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-2 text-center">
                      <p className="text-gray-400 text-xs">预期收益</p>
                      <p className={`font-bold ${msg.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {msg.totalProfit >= 0 ? '+' : ''}${msg.totalProfit?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs mt-2 italic">
                    以上为Bot投资建议，不构成投资建议。Bot不操作您的资金。
                  </p>
                </div>
              )}
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs sm:text-sm mr-2">
                {bot.avatar_emoji || '🤖'}
              </div>
              <div className="bg-purple-600/20 border border-purple-500/30 rounded-xl p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Stats */}
        <div className="p-3 sm:p-4 border-t border-purple-500/30 bg-slate-900">
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-gray-400 text-xs">总交易</p>
              <p className="text-white text-sm sm:text-lg font-bold">{bot.total_trades || 0}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-gray-400 text-xs">胜率</p>
              <p className="text-white text-sm sm:text-lg font-bold">{(bot.win_rate || 0).toFixed(1)}%</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-gray-400 text-xs">总收益</p>
              <p className={`text-sm sm:text-lg font-bold ${(bot.total_profit || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${(bot.total_profit || 0).toFixed(0)}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-gray-400 text-xs">回报率</p>
              <p className={`text-sm sm:text-lg font-bold ${(bot.total_profit || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {((bot.total_profit / 10000) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotChatInterface;
