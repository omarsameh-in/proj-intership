'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
    Search,
    Calendar,
    Clock,
    Globe,
    Moon,
    Sun,
    Check,
    User,
    BookOpen,
    Star,
    LayoutDashboard,
    Briefcase,
    Users,
    UserCircle,
    Video,
    ChevronLeft,
    Bell,
    LogOut,
    ChevronDown
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import styles from './sessions.module.css'

interface Session {
    id: string
    title: string
    mentor: {
        name: string
        avatar: string
        role: string
    }
    date: string
    time: string
    duration: string
    skills: string[]
    description: string
    isBooked: boolean
    rating: number
    completed?: boolean
}

// Mock session data
const mockSessions: Session[] = [
    {
        id: '1',
        title: 'Career Path in Software Engineering',
        mentor: {
            name: 'Dr. Ahmed Hassan',
            avatar: '👨‍💻',
            role: 'Senior Software Engineer'
        },
        date: 'Dec 28, 2024',
        time: '3:00 PM - 4:00 PM',
        duration: '1 hour',
        skills: ['Career Guidance'],
        description: 'Learn the fundamentals of modern web development',
        isBooked: true,
        rating: 4.8
    },
    {
        id: '2',
        title: 'Machine Learning Fundamentals',
        mentor: {
            name: 'Eng. Sara Mohamed',
            avatar: '👩‍💻',
            role: 'ML Engineer'
        },
        date: 'Dec 30, 2024',
        time: '10:00 AM - 11:00 AM',
        duration: '1 hour',
        skills: ['Technical'],
        description: 'Build your first mobile app from scratch',
        isBooked: false,
        rating: 4.9
    },
    {
        id: '3',
        title: 'Portfolio Review Session',
        mentor: {
            name: 'Eng. Nour Khaled',
            avatar: '👨‍🏫',
            role: 'Senior Designer'
        },
        date: 'Jan 2, 2025',
        time: '2:00 PM - 3:00 PM',
        duration: '1 hour',
        skills: ['Design Review'],
        description: 'Master backend development and REST APIs',
        isBooked: true,
        rating: 4.7
    },
    {
        id: '4',
        title: 'Deep Learning Research Discussion',
        mentor: {
            name: 'Prof. Karim Ali',
            avatar: '👩‍🎨',
            role: 'AI Researcher'
        },
        date: 'Dec 25, 2024',
        time: '4:00 PM - 5:00 PM',
        duration: '1 hour',
        skills: ['Research'],
        description: 'Learn professional UI/UX design techniques',
        isBooked: true,
        rating: 5.0,
        completed: true
    },
    {
        id: '5',
        title: 'System Design Interview Prep',
        mentor: {
            name: 'Eng. Omar Youssef',
            avatar: '👨‍🔬',
            role: 'Tech Lead'
        },
        date: 'Dec 29, 2024',
        time: '1:00 PM - 2:00 PM',
        duration: '1 hour',
        skills: ['Career Guidance'],
        description: 'Introduction to machine learning concepts',
        isBooked: false,
        rating: 4.6
    },
    {
        id: '6',
        title: 'Mobile App Development Workshop',
        mentor: {
            name: 'Eng. Laila Ahmed',
            avatar: '👩‍💼',
            role: 'Mobile Developer'
        },
        date: 'Jan 5, 2025',
        time: '3:00 PM - 4:00 PM',
        duration: '1 hour',
        skills: ['Technical'],
        description: 'Deploy applications on AWS cloud platform',
        isBooked: false,
        rating: 4.8
    }
]

export default function SessionsPage() {
    const { theme, toggleTheme, language, setLanguage, t } = useApp()
    const [sessions, setSessions] = useState<Session[]>(mockSessions)
    const [showLanguageMenu, setShowLanguageMenu] = useState(false)

    const changeLanguage = (lang: 'en' | 'ar') => {
        setLanguage(lang)
        setShowLanguageMenu(false)
    }

    return (
        <div className={styles.appLayout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                {/* Logo */}
                <div className={styles.logoSection}>
                    <div className={styles.backButton}>
                        <ChevronLeft size={20} />
                    </div>
                    <div className={styles.logo}>
                        <div className={styles.logoIcon}>IW</div>
                        <span className={styles.logoText}>InternWay</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className={styles.nav}>
                    <Link href="/student/dashboard" className={styles.navItem}>
                        <LayoutDashboard size={20} />
                        <span>{t.dashboard}</span>
                    </Link>
                    <Link href="/student/internships" className={styles.navItem}>
                        <Briefcase size={20} />
                        <span>{t.internships}</span>
                    </Link>
                    <Link href="/student/mentorships" className={styles.navItem}>
                        <Users size={20} />
                        <span>{t.mentorships}</span>
                    </Link>
                    <Link href="/student/profile" className={styles.navItem}>
                        <UserCircle size={20} />
                        <span>{t.profile}</span>
                    </Link>
                    <Link href="/student/sessions" className={`${styles.navItem} ${styles.active}`}>
                        <Video size={20} />
                        <span>{t.mySessions}</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {/* Top Bar */}
                <header className={styles.topBar}>
                    <div className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>{t.pageTitle}</h1>
                        <p className={styles.pageSubtitle}>{t.pageSubtitle}</p>
                    </div>

                    {/* Controls */}
                    <div className={styles.topBarControls}>
                        <div className={styles.languageWrapper}>
                            <button
                                className={styles.iconButton}
                                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                                title="Change Language"
                            >
                                <Globe size={20} />
                            </button>
                            <div className={`${styles.languageMenu} ${showLanguageMenu ? styles.show : ''}`}>
                                <div
                                    className={`${styles.languageOption} ${language === 'en' ? styles.active : ''}`}
                                    onClick={() => changeLanguage('en')}
                                >
                                    {language === 'en' && <Check size={16} />}
                                    English
                                </div>
                                <div
                                    className={`${styles.languageOption} ${language === 'ar' ? styles.active : ''}`}
                                    onClick={() => changeLanguage('ar')}
                                >
                                    {language === 'ar' && <Check size={16} />}
                                    العربية
                                </div>
                            </div>
                        </div>
                        <button className={styles.iconButton} onClick={toggleTheme} title="Toggle Theme">
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button className={styles.iconButton} title="Notifications">
                            <Bell size={20} />
                        </button>
                        <button className={styles.iconButton} title="Logout">
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>

                {/* Sessions Grid */}
                <div className={styles.sessionsGrid}>
                    {sessions.length === 0 ? (
                        <div className={styles.noSessions}>
                            <BookOpen size={48} />
                            <p>{t.noSessions}</p>
                        </div>
                    ) : (
                        sessions.map(session => (
                            <div key={session.id} className={styles.sessionCard}>
                                <div className={styles.cardHeader}>
                                    {/* Avatar */}
                                    <div className={styles.avatar}>{session.mentor.avatar}</div>

                                    {/* Session Info */}
                                    <div className={styles.sessionInfo}>
                                        <h2 className={styles.sessionTitle}>{session.title}</h2>
                                        <p className={styles.mentorName}>{t.with} {session.mentor.name}</p>

                                        {/* Session Meta */}
                                        <div className={styles.sessionMeta}>
                                            <div className={styles.metaItem}>
                                                <Calendar size={14} />
                                                <span>{session.date}</span>
                                            </div>
                                            <div className={styles.metaItem}>
                                                <Clock size={14} />
                                                <span>{session.time}</span>
                                            </div>
                                            <span className={styles.categoryTag}>{session.skills[0]}</span>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className={`${styles.statusBadge} ${session.completed ? styles.completed : session.isBooked ? styles.confirmed : styles.waiting}`}>
                                        {session.completed ? t.completed : session.isBooked ? t.confirmed : t.waitingForConfirmation}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className={styles.cardActions}>
                                    {session.completed ? (
                                        <button className={styles.reviewButton}>
                                            {t.leaveReview || 'Leave Review'}
                                        </button>
                                    ) : (
                                        <>
                                            <button className={session.isBooked ? styles.primaryButton : styles.waitingButton}>
                                                <BookOpen size={16} />
                                                {session.isBooked ? t.joinMeeting : t.waitingButtonText}
                                            </button>
                                            <div className={styles.actionDivider}></div>
                                            <button className={styles.secondaryButton}>{t.reschedule}</button>
                                            <div className={styles.actionDivider}></div>
                                            <button className={styles.dangerButton}>{t.cancel}</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    )
}
