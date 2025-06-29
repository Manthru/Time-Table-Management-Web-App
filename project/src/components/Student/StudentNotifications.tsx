import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Bell, Clock, CheckCircle, AlertTriangle, Info, X, Calendar, BookOpen } from 'lucide-react';

export function StudentNotifications() {
  const { user } = useAuth();
  const { notifications, markNotificationRead, courses } = useData();
  const [filter, setFilter] = useState<'all' | 'unread' | 'schedule' | 'course'>('all');

  // Get student notifications
  const studentNotifications = notifications.filter(n => n.userId === user?.id);
  
  // Filter notifications
  const filteredNotifications = studentNotifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'schedule':
        return notification.type === 'warning' || notification.title.toLowerCase().includes('schedule') || notification.title.toLowerCase().includes('time');
      case 'course':
        return notification.type === 'info' || notification.title.toLowerCase().includes('course') || notification.title.toLowerCase().includes('class');
      default:
        return true;
    }
  });

  const unreadCount = studentNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning-500" />;
      case 'error':
        return <X className="h-5 w-5 text-error-500" />;
      default:
        return <Info className="h-5 w-5 text-primary-500" />;
    }
  };

  const getNotificationBg = (type: string, read: boolean) => {
    const opacity = read ? '50' : '100';
    switch (type) {
      case 'success':
        return `bg-success-${opacity} border-success-200`;
      case 'warning':
        return `bg-warning-${opacity} border-warning-200`;
      case 'error':
        return `bg-error-${opacity} border-error-200`;
      default:
        return `bg-primary-${opacity} border-primary-200`;
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationRead(notificationId);
  };

  const getCourseFromNotification = (message: string) => {
    // Try to extract course code from message
    const courseCodeMatch = message.match(/([A-Z]{2}\d{3})/);
    if (courseCodeMatch) {
      return courses.find(course => course.code === courseCodeMatch[1]);
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with schedule changes and course announcements</p>
        </div>
        
        {unreadCount > 0 && (
          <div className="mt-4 sm:mt-0">
            <span className="bg-error-100 text-error-800 text-sm font-medium px-3 py-1 rounded-full">
              {unreadCount} unread
            </span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
        <div className="flex space-x-1">
          {[
            { id: 'all', label: 'All', icon: Bell },
            { id: 'unread', label: 'Unread', icon: Clock },
            { id: 'schedule', label: 'Schedule Changes', icon: Calendar },
            { id: 'course', label: 'Course Updates', icon: BookOpen }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications</h3>
            <p className="text-gray-600">
              {filter === 'unread' 
                ? "You're all caught up! No unread notifications."
                : "No notifications found for the selected filter."
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const relatedCourse = getCourseFromNotification(notification.message);
            
            return (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow-sm border-l-4 border border-gray-200 p-6 transition-all hover:shadow-md ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-lg font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className={`mt-1 ${
                          !notification.read ? 'text-gray-700' : 'text-gray-600'
                        }`}>
                          {notification.message}
                        </p>
                        
                        {relatedCourse && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <BookOpen className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-900">
                                {relatedCourse.name}
                              </span>
                              <span className="text-sm text-gray-500">
                                ({relatedCourse.code})
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Professor: {relatedCourse.professor}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="ml-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {notification.createdAt.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          notification.type === 'success' ? 'bg-success-100 text-success-800' :
                          notification.type === 'warning' ? 'bg-warning-100 text-warning-800' :
                          notification.type === 'error' ? 'bg-error-100 text-error-800' :
                          'bg-primary-100 text-primary-800'
                        }`}>
                          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                        </span>
                      </div>
                      
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Actions */}
      {unreadCount > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              <p className="text-sm text-gray-600">Manage all your notifications at once</p>
            </div>
            <button
              onClick={() => {
                studentNotifications
                  .filter(n => !n.read)
                  .forEach(n => markNotificationRead(n.id));
              }}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              Mark All as Read
            </button>
          </div>
        </div>
      )}
    </div>
  );
}