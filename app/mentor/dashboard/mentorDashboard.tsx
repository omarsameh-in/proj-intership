'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Users,
    Clock,
    Calendar
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import TopBarControls from '../../components/TopBarControls/TopBarControls'
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen'
import styles from './mentorDashboardStyle.module.css'
import api from '../../lib/api'

const getInitials = (name: string) => {
    if (!name) return '?'
    return name.trim().split(/\s+/).map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function MentorDashboard() {
    const { language, t } = useApp()
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
            const token = localStorage.getItem('token')
            
            const res = await api.get('/Mentor/Dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = res.data?.data || res.data
            setUpcomingSessions(data.upcomingSessions || [])
            setRecentMentees(data.recentMentees || [])
            setStats({
                totalSessions: data.totalSessions || 0,
                activeMentees: data.activeMentees || 0,
                hoursThisMonth: data.hoursThisMonth || 0
            })
        } catch (err: any) {
            if (err.response?.status === 401) {
                router.push('/login')
                return
            }
            console.warn('[fetchDashboardData] API failed, falling back to mock:', err)
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
        } finally {
            setLoading(false)
        }
    }



    if (loading) {
        return <LoadingScreen />
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
        <>
            <header className={styles.topBar}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>{t.mentorWelcome}</h1>
                    <p className={styles.pageSubtitle}>{t.mentorSubtitle}</p>
                </div>
                <TopBarControls />
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
                            upcomingSessions.map((session) => {
                                const key = session.sessionId || session.id
                                const avatar = session.avatar || getInitials(session.studentName)
                                return (
                                    <div key={key} className={styles.sessionItem}>
                                        <div className={styles.sessionLeft}>
                                            <div className={styles.sessionAvatar}>
                                                {avatar}
                                            </div>
                                            <div className={styles.sessionInfo}>
                                                <h3 className={styles.sessionName}>{session.studentName}</h3>
                                                <p className={styles.sessionTopic}>{session.topic}</p>
                                            </div>
                                        </div>
                                        <div className={styles.sessionRight}>
                                            <div className={styles.sessionDateTime}>
                                                {session.formattedDate || `${session.date || ''}${session.date && session.time ? ', ' : ''}${session.time || ''}`}
                                            </div>
                                            <div className={styles.sessionDuration}>{session.duration}</div>
                                        </div>
                                    </div>
                                )
                            })
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
                            recentMentees.map((mentee) => {
                                const key = mentee.studentId || mentee.id
                                const name = mentee.studentName || mentee.name || ''
                                const field = mentee.major || mentee.field || ''
                                const avatar = mentee.avatar || getInitials(name)
                                const sessionsText = mentee.completedSessionsText || `${mentee.sessionsCompleted || 0} ${t.sessionsCompleted}`
                                return (
                                    <div key={key} className={styles.menteeCard}>
                                        <div className={styles.menteeAvatar}>
                                            {avatar}
                                        </div>
                                        <h3 className={styles.menteeName}>{name}</h3>
                                        <p className={styles.menteeField}>{field}</p>
                                        <p className={styles.menteeSessions}>
                                            {sessionsText}
                                        </p>
                                    </div>
                                )
                            })
                        ) : (
                            <p className={styles.emptyMessage}>{t.noMenteesYet}</p>
                        )}
                    </div>
                </div>
        </>
    )
}

export default MentorDashboard
