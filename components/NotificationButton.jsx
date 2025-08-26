'use client';
import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import getEmployerNotifications from '../app/actions/getEmployerNotifications';

const NotificationButton = ({ onClick, collapsed = false }) => {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // Fetch notifications to get unread count
        const fetchUnreadCount = async () => {
            try {
                const result = await getEmployerNotifications();
                if (result.success && result.notifications) {
                    const unread = result.notifications.filter(n => !n.isRead).length;
                    setUnreadCount(unread);
                }
            } catch (error) {
                console.error('Error fetching unread count:', error);
            }
        };

        fetchUnreadCount();

        // Optionally, set up polling to update unread count periodically
        const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <button
            onClick={onClick}
            className="relative p-3 text-gray-600 hover:text-[#5badec] hover:bg-white/60 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md w-full flex items-center justify-center"
            title="Notifications"
        >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                </span>
            )}
            {!collapsed && (
                <span className="ml-3 text-sm font-medium">
                    Notifications
                    {unreadCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </span>
            )}
        </button>
    );
};

export default NotificationButton;
