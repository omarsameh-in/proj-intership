'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    UserCircle,
    Video,
    ChevronLeft,
    Globe,
    Moon,
    Sun,
    Bell,
    LogOut,
    Check,
    Clock,
    Calendar,
    CheckCircle,
    XCircle
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import styles from './mentorDashboardStyle.module.css'

function MentorDashboard() {
    const { theme, toggleTheme, language, setLanguage, t } = useApp()
    const [showLanguageMenu, setShowLanguageMenu] = useState(false)
    const router = useRouter()

    const [upcomingSessions, setUpcomingSessions] = useState<any[]>([])
    const [recentMentees, setRecentMentees] = useState<any[]>([])
    const [stats, setStats] = useState({
        totalSessions: 0,
        activeMentees: 0,
        hoursThisMonth: 0
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchDashboardData()
    }, [language])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            setError(null)

            // Mock data - replace with API calls
            setUpcomingSessions([
                {
                    id: 1,
                    studentName: 'Ahmed Mohamed',
                    topic: t.careerGuidance,
                    date: t.today,
                    time: `3:00 ${t.pm}`,
                    duration: `1 ${t.hour}`,
                    avatar: 'AM'
                },
                {
                    id: 2,
                    studentName: 'Sara Ali',
                    topic: t.resumeReview,
                    date: t.tomorrow,
                    time: `10:00 ${t.am}`,
                    duration: `45 ${t.min}`,
                    avatar: 'SA'
                },
                {
                    id: 3,
                    studentName: 'Karim Hassan',
                    topic: t.interviewPrep,
                    date: language === 'ar' ? `17 ${t.jan}` : `${t.jan} 17`,
                    time: `2:00 ${t.pm}`,
                    duration: `1 ${t.hour}`,
                    avatar: 'KH'
                }
            ])

            setRecentMentees([
                {
                    id: 1,
                    name: 'Layla Ibrahim',
                    field: t.softwareEngineering,
                    sessionsCompleted: 5,
                    avatar: 'LI'
                },
                {
                    id: 2,
                    name: 'Omar Saeed',
                    field: t.dataScience,
                    sessionsCompleted: 3,
                    avatar: 'OS'
                },
                {
                    id: 3,
                    name: 'Nour Khalil',
                    field: t.design,
                    sessionsCompleted: 7,
                    avatar: 'NK'
                }
            ])

            setStats({
                totalSessions: 47,
                activeMentees: 12,
                hoursThisMonth: 24
            })

            setLoading(false)
        } catch (err: any) {
            console.error('Error fetching dashboard data:', err)
            setError('Failed to load dashboard data. Please try again.')
            setLoading(false)
        }
    }

    const changeLanguage = (lang: 'en' | 'ar') => {
        setLanguage(lang)
        setShowLanguageMenu(false)
    }

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingText}>{t.loading}</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                {t.errorLoading}
                <button onClick={fetchDashboardData} className={styles.retryButton}>
                    {t.retry}
                </button>
            </div>
        )
    }

    return (
        <div className={`${styles.appLayout} ${language === 'ar' ? styles.rtl : ''}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className={styles.glow} aria-hidden="true" />
            <div className={styles.glowSecondary} aria-hidden="true" />
            <div className={styles.glowTertiary} aria-hidden="true" />
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.logoSection}>
                    <div className={styles.backButton} onClick={() => router.push('/')}>
                        <ChevronLeft size={20} />
                    </div>
                    <div className={styles.logo}>
                        <div className={styles.logoIcon}>IW</div>
                        <span className={styles.logoText}>InternWay</span>
                    </div>
                </div>

                <nav className={styles.nav}>
                    <Link href="/mentor/dashboard" className={`${styles.navItem} ${styles.active}`}>
                        <LayoutDashboard size={20} />
                        <span>{t.dashboard}</span>
                    </Link>
                    {/* Other pages will be added by the team */}
                    {/* 
                    <Link href="/mentor/mySessions" className={styles.navItem}>
                        <Video size={20} />
                        <span>{t.mySessions}</span>
                    </Link>
                    <Link href="/mentor/myMentees" className={styles.navItem}>
                        <Users size={20} />
                        <span>{t.myMentees}</span>
                    </Link>
                    <Link href="/mentor/profile" className={styles.navItem}>
                        <UserCircle size={20} />
                        <span>{t.profile}</span>
                    </Link>
                    */}
                </nav>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <header className={styles.topBar}>
                    <div className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>{t.mentorWelcome}</h1>
                        <p className={styles.pageSubtitle}>{t.mentorSubtitle}</p>
                    </div>

                    <div className={styles.topBarControls}>
                        <div className={styles.languageWrapper}>
                            <button
                                className={styles.iconButton}
                                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                                title={t.changeLanguage}
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
                        <button className={styles.iconButton} onClick={toggleTheme} title={t.toggleTheme}>
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button className={styles.iconButton} title={t.notifications}>
                            <Bell size={20} />
                        </button>
                        <button className={styles.iconButton} onClick={() => router.push('/')} title={t.logout}>
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.blueIcon}`}>
                            <Calendar size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <div className={styles.statLabel}>{t.totalSessions}</div>
                            <div className={styles.statValue}>{stats.totalSessions}</div>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.purpleIcon}`}>
                            <Users size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <div className={styles.statLabel}>{t.activeMentees}</div>
                            <div className={styles.statValue}>{stats.activeMentees}</div>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.orangeIcon}`}>
                            <Clock size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <div className={styles.statLabel}>{t.hoursThisMonth}</div>
                            <div className={styles.statValue}>{stats.hoursThisMonth}</div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Sessions */}
                <div className={styles.sectionBox}>
                    <h2 className={styles.sectionTitle}>{t.upcomingSessions}</h2>
                    <div className={styles.sessionsList}>
                        {upcomingSessions.length > 0 ? (
                            upcomingSessions.map((session) => (
                                <div key={session.id} className={styles.sessionItem}>
                                    <div className={styles.sessionLeft}>
                                        <div className={styles.sessionAvatar}>
                                            {session.avatar}
                                        </div>
                                        <div className={styles.sessionInfo}>
                                            <h3 className={styles.sessionName}>{session.studentName}</h3>
                                            <p className={styles.sessionTopic}>{session.topic}</p>
                                        </div>
                                    </div>
                                    <div className={styles.sessionRight}>
                                        <div className={styles.sessionDateTime}>
                                            {session.date}{language === 'ar' ? '، ' : ', '}{session.time}
                                        </div>
                                        <div className={styles.sessionDuration}>{session.duration}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className={styles.emptyMessage}>{t.noSessions}</p>
                        )}
                    </div>
                </div>

                {/* Recent Mentees */}
                <div className={styles.sectionBox}>
                    <h2 className={styles.sectionTitle}>{t.recentMentees}</h2>
                    <div className={styles.menteesGrid}>
                        {recentMentees.length > 0 ? (
                            recentMentees.map((mentee) => (
                                <div key={mentee.id} className={styles.menteeCard}>
                                    <div className={styles.menteeAvatar}>
                                        {mentee.avatar}
                                    </div>
                                    <h3 className={styles.menteeName}>{mentee.name}</h3>
                                    <p className={styles.menteeField}>{mentee.field}</p>
                                    <p className={styles.menteeSessions}>
                                        {mentee.sessionsCompleted} {t.sessionsCompleted}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className={styles.emptyMessage}>{t.noMenteesYet}</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default MentorDashboard
