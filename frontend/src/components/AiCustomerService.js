import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { X, Send, Bot, User, Minimize2, Maximize2, HelpCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const QUICK_QUESTIONS = [
  { en: 'How do I get started?', zh: '如何开始？' },
  { en: 'What is Global Vision?', zh: '什么是全球视野？' },
  { en: 'How does VIP work?', zh: 'VIP如何运作？' },
  { en: 'Is my money safe?', zh: '我的资金安全吗？' },
  { en: 'What chains are supported?', zh: '支持哪些链？' },
];

const AiCustomerService = ({ walletAddress }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm the AiFund AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const sessionId = useRef(`${walletAddress || 'anon'}_${Date.now()}`);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    
    const userMsg = { role: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(`${API}/ai-support/chat`, {
        session_id: sessionId.current,
        message: text.trim(),
      });
      setMessages(prev => [...prev, { role: 'bot', text: res.data.response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting. Please try again." }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Floating button when closed
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg shadow-purple-500/30 flex items-center justify-center hover:scale-110 transition-all"
        data-testid="ai-support-btn"
      >
        <HelpCircle className="w-7 h-7 text-white" />
      </button>
    );
  }

  // Minimized state
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg px-4 py-3 flex items-center space-x-3 cursor-pointer hover:scale-105 transition-all" onClick={() => setIsMinimized(false)}>
        <Bot className="w-5 h-5 text-white" />
        <span className="text-white font-semibold text-sm">AI Support</span>
        <Maximize2 className="w-4 h-4 text-white/70" />
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-[360px] sm:w-[400px] max-h-[500px] bg-slate-800 rounded-2xl border border-purple-500/30 shadow-2xl flex flex-col" data-testid="ai-support-panel">
      {/* Header */}
      <div className="p-3 border-b border-purple-500/30 bg-gradient-to-r from-purple-600/20 to-pink-600/10 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-2">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm">AI Support</h4>
            <p className="text-green-400 text-xs flex items-center"><span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></span>Online</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button onClick={() => setIsMinimized(true)} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded"><Minimize2 className="w-4 h-4" /></button>
          <button onClick={() => setIsOpen(false)} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded"><X className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[200px] max-h-[320px]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'bot' && <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5"><Bot className="w-3 h-3 text-white" /></div>}
            <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
              msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-200'
            }`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0"><Bot className="w-3 h-3 text-white" /></div>
            <div className="bg-white/10 px-3 py-2 rounded-xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick questions */}
      {messages.length <= 1 && (
        <div className="px-3 pb-2 flex flex-wrap gap-1">
          {QUICK_QUESTIONS.map((q, i) => (
            <button key={i} onClick={() => sendMessage(q.en)}
              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-gray-300 text-xs transition-all">
              {q.en}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-purple-500/20">
        <div className="flex items-center bg-black/30 rounded-xl border border-white/10 overflow-hidden">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about AiFund..."
            className="flex-1 px-3 py-2.5 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
            data-testid="ai-support-input"
          />
          <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
            className="px-3 py-2.5 text-purple-400 hover:text-purple-300 disabled:opacity-30 transition-all">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiCustomerService;
