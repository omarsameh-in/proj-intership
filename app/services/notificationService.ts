import api from '../lib/api';

export interface NotificationItem {
    id: number;
    title: string;
    message: string;
    time: string;
    type: 'info' | 'success' | 'warning';
    read: boolean;
}

export const notificationService = {
    // 1. يجيب كل الإشعارات
    getAll: async (): Promise<NotificationItem[]> => {
        const response = await api.get('/Notification');
        return response.data;
    },

    // 2. يجيب عدد الإشعارات الجديدة بس
    getUnreadCount: async (): Promise<number> => {
        const response = await api.get('/Notification/unread-count');
        return response.data;
    },

    // 3. يحول إشعار معين لمقروء
    markAsRead: async (id: number): Promise<void> => {
        await api.put(`/Notification/${id}/mark-read`);
    },

    // 4. يخلي كل الإشعارات مقروءة
    markAllAsRead: async (): Promise<void> => {
        await api.put('/Notification/mark-all-read');
    }
};
