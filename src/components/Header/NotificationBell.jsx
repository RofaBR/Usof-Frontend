import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '~/hooks/useAuth.jsx';
import { useFetch } from '~/hooks/useFetch.jsx';
import { apiDelete } from '~/utils/api.js';
import BellIcon from '~/assets/BellIcon.jsx';
import '~/styles/NotificationBell.css';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
};

function NotificationBell() {
    const { accessToken, user } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [localNotifications, setLocalNotifications] = useState(null);
    const dropdownRef = useRef(null);

    const endpoint = useMemo(() => user ? '/notifications' : null, [user]);
    const { data, loading, error } = useFetch(endpoint, { accessToken });

    useEffect(() => {
        if (data) {
            setLocalNotifications(data);
        }
    }, [data]);

    const notifications = localNotifications || [];
    const hasUnread = notifications.length > 0;
    const notificationCount = notifications.length;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const handleDeleteNotification = useCallback(async (postId) => {
        try {
            const response = await apiDelete(`/notifications/posts/${postId}`, accessToken);
            if (response.ok) {
                setLocalNotifications(prev =>
                    prev ? prev.filter(n => n.post_id !== postId) : []
                );
            }
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    }, [accessToken]);

    const handleClearAll = useCallback(async () => {
        try {
            const response = await apiDelete('/notifications', accessToken);
            if (response.ok) {
                setLocalNotifications([]);
            }
        } catch (error) {
            console.error('Failed to clear notifications:', error);
        }
    }, [accessToken]);

    const handleNotificationClick = useCallback((postId) => {
        setIsOpen(false);
        navigate(`/syntaxly/post/${postId}`);
    }, [navigate]);

    if (!user) return null;

    return (
        <div className="notification-bell-container" ref={dropdownRef}>
            <div className="notification-bell" onClick={handleToggle}>
                <BellIcon width={24} height={24} />
                {hasUnread && (
                    <span className="notification-badge">
                        {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                )}
            </div>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        {notifications.length > 0 && (
                            <button onClick={handleClearAll} className="clear-all-btn">
                                Clear all
                            </button>
                        )}
                    </div>

                    <div className="notification-list">
                        {loading ? (
                            <div className="notification-loading">Loading...</div>
                        ) : notifications.length === 0 ? (
                            <div className="notification-empty">No notifications</div>
                        ) : (
                            notifications.map((notification) => (
                                <div key={notification.post_id} className="notification-item">
                                    <div
                                        className="notification-content"
                                        onClick={() => handleNotificationClick(notification.post_id)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handleNotificationClick(notification.post_id);
                                            }
                                        }}
                                    >
                                        <p className="notification-title">
                                            <strong>{notification.author_name || notification.author_login}</strong>
                                            {' '}updated a post you're subscribed to
                                        </p>
                                        <p className="notification-post-title">
                                            "{notification.post_title}"
                                        </p>
                                        <span className="notification-time">
                                            {formatDate(notification.last_update)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteNotification(notification.post_id);
                                        }}
                                        className="notification-delete"
                                        aria-label="Dismiss"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationBell;