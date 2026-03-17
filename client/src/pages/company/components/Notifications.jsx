import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../../contexts/NotificationContext';
import { Bell, CheckCircle2, ChevronRight, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();
  const navigate = useNavigate();

  // Mark all fetched notifications as read when opening the page
  // The user wanted notifications in a dedicated page, we'll mark them read on view or keep standard behavior
  // For standard behavior: we click them to mark them read. Let's provide a "Mark all as read" button.

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead([notification._id]);
    }
    if (notification.actionLink) {
      navigate(notification.actionLink);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-50 border border-slate-100 rounded">
            <Bell size={24} className="text-slate-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Notifications</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}.
            </p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-sm font-bold transition-colors border border-slate-200"
          >
            <CheckCircle2 size={16} /> Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        {notifications.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-5 hover:bg-slate-50 transition-colors cursor-pointer group flex items-start sm:items-center gap-4 ${
                  !notification.isRead ? 'bg-indigo-50/30' : 'bg-white'
                }`}
              >
                <div className="mt-1 sm:mt-0 flex-shrink-0">
                  <div className={`w-2.5 h-2.5 rounded-full ${!notification.isRead ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className={`text-sm sm:text-base ${!notification.isRead ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs font-medium text-slate-500 mt-1">
                    {formatTime(notification.createdAt)}
                  </p>
                </div>

                {notification.actionLink && (
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4">
              <Inbox size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">All caught up</h3>
            <p className="text-slate-500 font-medium mt-1">You have no new notifications right now.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
