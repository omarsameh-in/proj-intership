'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Bell, X, Check, Info, AlertTriangle } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import styles from './Notification.module.css'
import { notificationService, NotificationItem } from '../../services/notificationService'

const Notification: React.FC = () => {
    const { theme, language, t } = useApp()
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState<NotificationItem[]>([])
    const [unreadCount, setUnreadCount] = useState(0)

    const dropdownRef = useRef<HTMLDivElement>(null)

    // جلب البيانات عند البداية
    useEffect(() => {
        fetchInitialData()
    }, [])

    const fetchInitialData = async () => {
        try {
            const count = await notificationService.getUnreadCount()
            setUnreadCount(count)
        } catch (error) {
            console.error('Error fetching unread count:', error)
        }
    }

    const fetchNotifications = async () => {
        try {
            const data = await notificationService.getAll()
            setNotifications(data)
            // تحديث العدد أيضاً للتأكد
            const count = data.filter(n => !n.read).length
            setUnreadCount(count)
        } catch (error) {
            console.error('Error fetching notifications:', error)
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const toggleDropdown = () => {
        if (!isOpen) {
            fetchNotifications() // جلب الإشعارات عند فتح القائمة
        }
        setIsOpen(!isOpen)
    }

    const markAsRead = async (id: number) => {
        try {
            // تحديث الواجهة فوراً (Optimistic Update)
            setNotifications(notifications.map(n => 
                n.id === id ? { ...n, read: true } : n
            ))
            setUnreadCount(prev => Math.max(0, prev - 1))
            
            // إرسال الطلب للسيرفر
            await notificationService.markAsRead(id)
        } catch (error) {
            console.error('Error marking as read:', error)
            // في حالة الفشل يمكن إعادة جلب البيانات
            fetchNotifications()
        }
    }

    const markAllAsRead = async () => {
        try {
            // تحديث الواجهة فوراً
            setNotifications(notifications.map(n => ({ ...n, read: true })))
            setUnreadCount(0)
            
            // إرسال الطلب للسيرفر
            await notificationService.markAllAsRead()
        } catch (error) {
            console.error('Error marking all as read:', error)
            fetchNotifications()
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <Check size={16} className={styles.successIcon} />
            case 'warning': return <AlertTriangle size={16} className={styles.warningIcon} />
            default: return <Info size={16} className={styles.infoIcon} />
        }
    }

    return (
        <div className={styles.notificationWrapper} ref={dropdownRef}>
            <button 
                className={styles.bellButton} 
                onClick={toggleDropdown}
                aria-label="Toggle notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className={`${styles.dropdown} ${language === 'ar' ? styles.rtl : ''}`}>
                    <div className={styles.header}>
                        <h3 className={styles.title}>{language === 'ar' ? 'التنبيهات' : 'Notifications'}</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllAsRead} className={styles.markAll}>
                                {language === 'ar' ? 'تحديد الكل كمقروء' : 'Mark all as read'}
                            </button>
                        )}
                    </div>

                    <div className={styles.list}>
                        {notifications.length > 0 ? (
                            notifications.map(notification => (
                                <div 
                                    key={notification.id} 
                                    className={`${styles.item} ${!notification.read ? styles.unread : ''}`}
                                    onClick={() => !notification.read && markAsRead(notification.id)}
                                >
                                    <div className={styles.iconBox}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className={styles.content}>
                                        <div className={styles.itemHeader}>
                                            <span className={styles.itemTitle}>{notification.title}</span>
                                            <span className={styles.time}>{notification.time}</span>
                                        </div>
                                        <p className={styles.message}>{notification.message}</p>
                                    </div>
                                    {!notification.read && <div className={styles.unreadDot} />}
                                </div>
                            ))
                        ) : (
                            <div className={styles.empty}>
                                {language === 'ar' ? 'لا توجد تنبيهات جديدة' : 'No new notifications'}
                            </div>
                        )}
                    </div>

                    <div className={styles.footer}>
                        <button className={styles.viewAll}>
                            {language === 'ar' ? 'مشاهدة كل التنبيهات' : 'View all notifications'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Notification
