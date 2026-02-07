import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, X, Sparkles, TrendingUp, Award, Check } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const NotificationPanel = ({ walletAddress, isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isOpen && walletAddress) {
      loadNotifications();
    }
  }, [isOpen, walletAddress]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/notifications/${walletAddress}`);
      setNotifications(response.data.notifications);
      const unread = response.data.notifications.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(`${API}/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'new_ability':
        return <Sparkles className="w-5 h-5 text-yellow-400" />;
      case 'level_up':
        return <Award className="w-5 h-5 text-purple-400" />;
      case 'big_profit':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      default:
        return <Bell className="w-5 h-5 text-blue-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-md w-full max-h-[80vh] flex flex-col border border-purple-500/30 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center">
            <Bell className="w-6 h-6 text-purple-400 mr-2" />
            <h2 className="text-xl font-bold text-white">通知</h2>
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              <p className="text-gray-400 mt-2">加载中...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">暂无通知</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  notification.read
                    ? 'bg-white/5 border-white/10'
                    : 'bg-purple-500/20 border-purple-500/50'
                }`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <p className="text-white font-semibold">{notification.title}</p>
                      {!notification.read && (
                        <span className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full ml-2 mt-1"></span>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm mt-1">{notification.message}</p>
                    <p className="text-gray-500 text-xs mt-2">
                      {new Date(notification.created_at).toLocaleString('zh-CN')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all"
            >
              关闭
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
