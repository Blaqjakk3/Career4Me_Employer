'use client';
import { useState, useEffect } from 'react';
import { 
    X, 
    Bell, 
    UserCheck, 
    Briefcase, 
    Clock, 
    CheckCircle, 
    Trash2,
    MarkAsRead,
    Filter,
    Search
} from 'lucide-react';
import { toast } from 'react-toastify';
import getEmployerNotifications from '../app/actions/getEmployerNotifications';
import markNotificationAsRead from '../app/actions/markNotificationAsRead';

const NotificationModal = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('all'); // all, unread, read
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            // Restore body scroll when modal is closed
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const result = await getEmployerNotifications();
            if (result.error) {
                toast.error(result.error);
                setNotifications([]);
            } else {
                setNotifications(result.notifications || []);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast.error('Failed to load notifications');
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const result = await markNotificationAsRead(notificationId);
            if (result.error) {
                toast.error(result.error);
            } else {
                setNotifications(prev => 
                    prev.map(notif => 
                        notif.$id === notificationId 
                            ? { ...notif, isRead: true }
                            : notif
                    )
                );
                toast.success('Notification marked as read');
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
            toast.error('Failed to mark notification as read');
        }
    };

    const markAllAsRead = async () => {
        const unreadNotifications = notifications.filter(n => !n.isRead);
        if (unreadNotifications.length === 0) {
            toast.info('No unread notifications');
            return;
        }

        try {
            // Mark all unread notifications as read
            await Promise.all(
                unreadNotifications.map(notification => 
                    markNotificationAsRead(notification.$id)
                )
            );
            
            setNotifications(prev => 
                prev.map(notif => ({ ...notif, isRead: true }))
            );
            toast.success(`${unreadNotifications.length} notifications marked as read`);
        } catch (error) {
            console.error('Error marking all as read:', error);
            toast.error('Failed to mark all notifications as read');
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'new_application':
                return <UserCheck className="w-6 h-6 text-blue-600" />;
            case 'job_expired':
                return <Briefcase className="w-6 h-6 text-red-600" />;
            default:
                return <Bell className="w-6 h-6 text-gray-600" />;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        // Check if it's today
        const isToday = now.toDateString() === date.toDateString();

        if (diffInHours < 1) {
            return 'Just now';
        } else if (isToday) {
            // Same date - show only time
            return date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } else {
            // Different date - show date and time
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);

            if (date.toDateString() === yesterday.toDateString()) {
                return `Yesterday ${date.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                })}`;
            } else {
                // For older dates, return JSX with date on top, time below
                return {
                    isMultiLine: true,
                    content: (
                        <div className="text-right">
                            <div className="text-sm text-gray-500">
                                {date.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
                                })}
                            </div>
                            <div className="text-xs text-gray-400">
                                {date.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                })}
                            </div>
                        </div>
                    )
                };
            }
        }
    };

    const filteredNotifications = notifications
        .filter(notification => {
            if (filter === 'unread') return !notification.isRead;
            if (filter === 'read') return notification.isRead;
            return true;
        })
        .filter(notification => {
            if (!searchTerm) return true;
            return notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   notification.message.toLowerCase().includes(searchTerm.toLowerCase());
        });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
            {/* Modal */}
            <div
                className="relative z-10 flex items-center justify-center min-h-screen p-4 pointer-events-auto"
                onClick={onClose}
            >
                <div
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Bell className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Notifications</h2>
                                    <p className="text-blue-100">
                                        {notifications.length} total • {unreadCount} unread
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between space-x-4">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search notifications..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Filter */}
                            <div className="flex items-center space-x-2">
                                <Filter className="w-4 h-4 text-gray-500" />
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">All</option>
                                    <option value="unread">Unread</option>
                                    <option value="read">Read</option>
                                </select>
                            </div>

                            {/* Mark All as Read */}
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Mark All Read
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto max-h-[60vh]">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-gray-600">Loading notifications...</p>
                                </div>
                            </div>
                        ) : filteredNotifications.length === 0 ? (
                            <div className="text-center py-12">
                                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {searchTerm ? 'No matching notifications' : 'No notifications yet'}
                                </h3>
                                <p className="text-gray-500">
                                    {searchTerm 
                                        ? 'Try adjusting your search terms or filters'
                                        : 'You\'ll be notified when talents apply to your jobs'
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {filteredNotifications.map((notification) => (
                                    <div
                                        key={notification.$id}
                                        className={`p-6 hover:bg-gray-50 transition-colors ${
                                            !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                        }`}
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0 mt-1">
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-lg font-semibold text-gray-900">
                                                        {notification.title}
                                                    </h4>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm text-gray-500">
                                                            {(() => {
                                                                const formattedDate = formatDate(notification.createdAt);
                                                                return formattedDate?.isMultiLine ? formattedDate.content : formattedDate;
                                                            })()}
                                                        </span>
                                                        {!notification.isRead && (
                                                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-gray-700 mb-3">
                                                    {notification.message}
                                                </p>
                                                {!notification.isRead && (
                                                    <button
                                                        onClick={() => markAsRead(notification.$id)}
                                                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        Mark as read
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationModal;
