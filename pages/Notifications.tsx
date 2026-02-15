import React, { useState } from 'react';
import { Bell, CheckCircle2, AlertTriangle, XCircle, Clock, Archive } from 'lucide-react';

export const NotificationsPage = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'archived'>('all');

    // Mock Notifications
    const [notifications, setNotifications] = useState([
        {
            id: '1',
            title: 'Monitor Failed: Harsh Website',
            message: 'Harsh Website is down. Response code: 500.',
            type: 'error',
            timestamp: '2 minutes ago',
            read: false,
            archived: false,
        },
        {
            id: '2',
            title: 'High Latency Detected',
            message: 'Payment Gateway latency is > 200ms (Current: 450ms).',
            type: 'warning',
            timestamp: '1 hour ago',
            read: false,
            archived: false,
        },
        {
            id: '3',
            title: 'Scheduled Maintenance',
            message: 'Database maintenance scheduled for Feb 15, 02:00 AM UTC.',
            type: 'info',
            timestamp: '1 day ago',
            read: true,
            archived: false,
        },
        {
            id: '4',
            title: 'Monitor Recovered: Harsh Website',
            message: 'Harsh Website is back online.',
            type: 'success',
            timestamp: '2 days ago',
            read: true,
            archived: true,
        }
    ]);

    const filteredNotifications = notifications.filter(n => {
        if (activeTab === 'unread') return !n.read && !n.archived;
        if (activeTab === 'archived') return n.archived;
        return !n.archived; // 'all' usually excludes archived in these systems, or includes everything? Let's exclude archived for 'all' and show them only in 'archived'.
    });

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const archiveNotification = (id: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, archived: true } : n));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'success': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            default: return <Bell className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">Notifications</h1>
                    <p className="text-sm text-muted">Stay updated with system alerts and activities.</p>
                </div>
                <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg">
                    {['all', 'unread', 'archived'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${activeTab === tab ? 'bg-background shadow-sm text-foreground' : 'text-muted hover:text-foreground'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden min-h-[400px]">
                {filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-muted">
                        <Bell className="w-8 h-8 mb-3 opacity-20" />
                        <p className="text-sm">No notifications found.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 flex items-start gap-4 hover:bg-secondary/20 transition-colors group ${!notification.read ? 'bg-secondary/10' : ''}`}
                                onClick={() => markAsRead(notification.id)}
                            >
                                <div className="mt-0.5 shrink-0">
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className={`text-sm font-medium text-foreground ${!notification.read ? 'font-semibold' : ''}`}>
                                            {notification.title}
                                            {!notification.read && <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block" />}
                                        </h3>
                                        <span className="text-xs text-muted flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {notification.timestamp}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => archiveNotification(notification.id, e)}
                                        className="p-2 hover:bg-secondary rounded-full text-muted hover:text-foreground"
                                        title="Archive"
                                    >
                                        <Archive className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
