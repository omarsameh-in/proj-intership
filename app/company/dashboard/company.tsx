'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    Briefcase,
    Users,
    ClipboardList,
    ChevronLeft,
    Globe,
    Moon,
    Sun,
    Bell,
    LogOut,
    Check,
    PlusCircle,
    Eye,
    Star,
    CheckCircle,
    UserCircle,
    MapPin,
    Download,
    User,
    X
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import styles from './company.module.css'
import Notification from '../../components/Notification/Notification'
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen'


function Company() {
    const { theme, toggleTheme, language, setLanguage, t } = useApp()
    const [showLanguageMenu, setShowLanguageMenu] = useState(false)
    const router = useRouter()

    const [activeListings, setActiveListings] = useState<any[]>([])
    const [recentApplicants, setRecentApplicants] = useState<any[]>([])
    const [stats, setStats] = useState({
        activeListingsCount: 0,
        totalApplicantsCount: 0,
        hiredInterns: 0
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
            setActiveListings([
                {
                    id: 1,
                    title: 'Frontend Developer Intern',
                    location: 'Cairo',
                    payStatus: 'Paid',
                    applicants: 45,
                },
                {
                    id: 2,
                    title: 'Backend Developer Intern',
                    location: 'Alexandria',
                    payStatus: 'Paid',
                    applicants: 32,
                },
                {
                    id: 3,
                    title: 'UI/UX Designer Intern',
                    location: 'Remote',
                    payStatus: 'Unpaid',
                    applicants: 28,
                }
            ])

            setRecentApplicants([
                {
                    id: 1,
                    name: 'Ahmed Khaled',
                    role: 'Frontend Developer',
                    timeAgo: '2 hours ago',
                    status: 'pending',
                    avatar: 'AK',
                    matchPercent: 92
                },
                {
                    id: 2,
                    name: 'Sara Mohamed',
                    role: 'Backend Developer',
                    timeAgo: '5 hours ago',
                    status: 'pending',
                    avatar: 'SM',
                    matchPercent: 85
                },
                {
                    id: 3,
                    name: 'Omar Hassan',
                    role: 'UI/UX Designer',
                    timeAgo: '1 day ago',
                    status: 'reviewed',
                    avatar: 'OH',
                    matchPercent: 78
                }
            ])

            setStats({
                activeListingsCount: 8,
                totalApplicantsCount: 156,
                hiredInterns: 23
            })
        } catch (err: any) {
            console.error('Error fetching dashboard data:', err)
            setError('Failed to load dashboard data. Please try again.')
        } finally {
            await new Promise(r => setTimeout(r, 200))
            setLoading(false)
        }
    }

    const changeLanguage = (lang: 'en' | 'ar') => {
        setLanguage(lang)
        setShowLanguageMenu(false)
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
                    <Link href="/company/dashboard" className={`${styles.navItem} ${styles.active}`}>
                        <LayoutDashboard size={20} />
                        <span>{t.dashboard}</span>
                    </Link>
                    <Link href="/company/internships" className={styles.navItem}>
                        <Briefcase size={20} />
                        <span>{t.internships}</span>
                    </Link>
                    <Link href="/company/applicants" className={styles.navItem}>
                        <Users size={20} />
                        <span>{t.applicants}</span>
                    </Link>
                    <Link href="/company/profile" className={styles.navItem}>
                        <UserCircle size={20} />
                        <span>{t.profile}</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <header className={styles.topBar}>
                    <div className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>{t.companyWelcome}</h1>
                        <p className={styles.pageSubtitle}>{t.companySubtitle}</p>
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
                        <Notification />
                        <button className={styles.iconButton} onClick={() => router.push('/')} title={t.logout}>
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.blueIcon}`}>
                            <Briefcase size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <div className={styles.statLabel}>{t.activeListings}</div>
                            <div className={styles.statValue}>{stats.activeListingsCount}</div>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.purpleIcon}`}>
                            <Users size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <div className={styles.statLabel}>{t.totalApplicants}</div>
                            <div className={styles.statValue}>{stats.totalApplicantsCount}</div>
                        </div>
                    </div>



                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.greenIcon}`}>
                            <CheckCircle size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <div className={styles.statLabel}>{t.hiredInterns}</div>
                            <div className={styles.statValue}>{stats.hiredInterns}</div>
                        </div>
                    </div>
                </div>

                {/* Active Listings */}
                <div className={styles.sectionBox}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t.activeListings}</h2>
                        <button className={styles.postButton} onClick={() => router.push('/company/post')}>
                            {t.postNewInternship}
                        </button>
                    </div>

                    <div className={styles.listingsGrid}>
                        {activeListings.length > 0 ? (
                            activeListings.map((listing) => (
                                <div key={listing.id} className={styles.listingItem}>
                                    <div className={styles.listingLeft}>
                                        <h3 className={styles.listingTitle}>{listing.title}</h3>
                                        <div className={styles.listingDetails}>
                                            <span className={styles.listingLoc}>
                                                <MapPin size={14} />
                                                {listing.location}
                                            </span>
                                            <span className={`${styles.payBadge} ${listing.payStatus === 'Paid' ? styles.paid : styles.unpaid}`}>
                                                {listing.payStatus === 'Paid' ? t.paid : t.unpaid}
                                            </span>
                                            <span className={styles.listingApps}>{listing.applicants} {t.applicants}</span>
                                        </div>
                                    </div>
                                    <button className={styles.viewDetailsBtn}>{t.viewDetails}</button>
                                </div>
                            ))
                        ) : (
                            <p className={styles.emptyMessage}>{t.noActiveMentees}</p>
                        )}
                    </div>
                </div>

                {/* Recent Applicants */}
                <div className={styles.sectionBox}>
                    <h2 className={styles.sectionTitle}>{t.recentApplications}</h2>
                    <div className={styles.applicantsList}>
                        {recentApplicants.length > 0 ? (
                            recentApplicants.map((applicant) => (
                                <div key={applicant.id} className={styles.applicationItem}>
                                    <div className={styles.applicantLeft}>
                                        <div className={styles.applicantAvatar}>
                                            <User size={20} />
                                        </div>
                                        <div className={styles.applicantInfo}>
                                            <h3 className={styles.applicantName}>{applicant.name}</h3>
                                            <p className={styles.applicantRole}>{applicant.role}</p>
                                        </div>
                                    </div>
                                    <div className={styles.applicantRight}>
                                        <div className={styles.appMeta}>
                                            <span className={styles.timeAgo}>
                                                {applicant.timeAgo.includes('hours') ? `${applicant.timeAgo.split(' ')[0]} ${t.hoursAgo}` :
                                                    applicant.timeAgo.includes('day') ? `${applicant.timeAgo.split(' ')[0]} ${t.daysAgo}` :
                                                        applicant.timeAgo}
                                            </span>
                                            <div className={styles.badgeRow}>
                                                <span className={`${styles.appStatus} ${styles[applicant.status]}`}>
                                                    {applicant.status === 'pending' ? t.pending : t.reviewed}
                                                </span>
                                                <span className={styles.matchBadge}>
                                                    % {applicant.matchPercent}% Match
                                                </span>
                                            </div>
                                        </div>
                                        <div className={styles.actionButtons}>
                                            <button className={styles.cvBtn} title={t.downloadCv}>
                                                <Download size={14} /> CV
                                            </button>
                                            {applicant.status === 'pending' && (
                                                <>
                                                    <button className={styles.acceptBtn}>{t.accept}</button>
                                                    <button className={styles.rejectBtn}>{t.rejectApplicant}</button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className={styles.emptyMessage}>{t.noLabor}</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Company
