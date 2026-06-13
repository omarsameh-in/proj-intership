import api from '../lib/api';

export interface NotificationItem {
    notificationId: number;
    title: string;
    message: string;
    type: string; // e.g., 'Session', 'Internship', 'System'
    relatedEntityId?: number;
    isRead: boolean;
    createdAt: string;
    timeAgo: string;
}

export const notificationService = {
    // 1. يجيب كل الإشعارات
    getAll: async (): Promise<NotificationItem[]> => {
        try {
            const response = await api.get('/Notification');
            return response.data;
        } catch (err: any) {
            if (err.response?.status === 404) {
                console.warn('[getAll] Notification endpoint not implemented on backend yet. Returning empty list.');
                return [];
            }
            throw err;
        }
    },

    // 2. يجيب عدد الإشعارات الجديدة بس
    getUnreadCount: async (): Promise<number> => {
        try {
            const response = await api.get('/Notification/unread-count');
            return response.data;
        } catch (err: any) {
            if (err.response?.status === 404) {
                console.warn('[getUnreadCount] Notification endpoint not implemented on backend yet. Falling back to 0.');
                return 0;
            }
            throw err;
        }
    },

    // 3. يحول إشعار معين لمقروء
    markAsRead: async (id: number): Promise<void> => {
        try {
            await api.put(`/Notification/${id}/mark-read`);
        } catch (err: any) {
            if (err.response?.status === 404) {
                console.warn(`[markAsRead] Notification mark-read endpoint not implemented yet.`);
                return;
            }
            throw err;
        }
    },

    // 4. يخلي كل الإشعارات مقروءة
    markAllAsRead: async (): Promise<void> => {
        try {
            await api.put('/Notification/mark-all-read');
        } catch (err: any) {
            if (err.response?.status === 404) {
                console.warn('[markAllAsRead] Notification mark-all-read endpoint not implemented yet.');
                return;
            }
            throw err;
        }
    }
};
