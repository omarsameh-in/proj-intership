'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    Briefcase,
    Users,
    ChevronLeft,
    PlusCircle,
    CheckCircle,
    UserCircle,
    MapPin,
    Download,
    X,
    Menu,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import TopBarControls from '../../components/TopBarControls/TopBarControls'
import styles from './company.module.css'
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen'
import api from '../../lib/api'

// ─── Types ────────────────────────────────────────────────────────────────────
interface RecentApplicant {
    id: number
    internId: number
    name: string
    role: string
    timeAgo: string
    status: 'Pending' | 'Accept' | 'Reject'
}

interface ActiveListing {
    id: number
    title: string
    location: string
    payStatus: string
    applicants: number
}

interface InternDetails {
    internId: number
    title: string
    description: string
    duration: number
    locationType: string
    CreatedAt: string
    DeadlineDate: string
    updateAt?: string
    IsPaid: boolean
    price?: number
    status: string
    IsOpen: boolean
    Internship_City?: string
    Internship_Country?: string
    skills: string[]
    requirements: string[]
    applicationsCount: number
}

// ─── Component ────────────────────────────────────────────────────────────────
function Company() {
    const { language, t } = useApp()
    const router = useRouter()

    const [activeListings, setActiveListings] = useState<ActiveListing[]>([])
    const [recentApplicants, setRecentApplicants] = useState<RecentApplicant[]>([])
    const [stats, setStats] = useState({
        activeListingsCount: 0,
        totalApplicantsCount: 0,
        hiredInterns: 0
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // ─── Modal State ──────────────────────────────────────────────────────────
    const [showModal, setShowModal] = useState(false)
    const [selectedIntern, setSelectedIntern] = useState<InternDetails | null>(null)
    const [detailsLoading, setDetailsLoading] = useState(false)
    const [detailsError, setDetailsError] = useState<string | null>(null)

    useEffect(() => {
        fetchDashboardData()
    }, [language])

    // ─── Fetch Dashboard ──────────────────────────────────────────────────────
    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            setError(null)
            const token = localStorage.getItem('token')

            const res = await api.get('/api/company/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = res.data?.data || res.data
            setActiveListings(data.activeListings || [])
            setRecentApplicants(data.recentApplicants || [])
            setStats(data.stats || {
                activeListingsCount: 0,
                totalApplicantsCount: 0,
                hiredInterns: 0
            })
        } catch (err: any) {
            if (err.response?.status === 401) {
                router.push('/login')
                return
            }
            console.warn('[fetchDashboardData] API failed, falling back to mock:', err)
            setActiveListings([
                { id: 1, title: 'Frontend Developer Intern', location: 'Cairo', payStatus: 'Paid', applicants: 45 },
                { id: 2, title: 'Backend Developer Intern', location: 'Alexandria', payStatus: 'Paid', applicants: 32 },
                { id: 3, title: 'UI/UX Designer Intern', location: 'Cairo', payStatus: 'Unpaid', applicants: 28 }
            ])
            setRecentApplicants([
                { id: 1, internId: 1, name: 'Ahmed Khaled', role: 'Frontend Developer', timeAgo: '2 hours ago', status: 'Pending' },
                { id: 2, internId: 2, name: 'Sara Mohamed', role: 'Backend Developer', timeAgo: '5 hours ago', status: 'Reject' },
                { id: 3, internId: 3, name: 'Omar Hassan', role: 'UI/UX Designer', timeAgo: '1 day ago', status: 'Accept' }
            ])
            setStats({ activeListingsCount: 8, totalApplicantsCount: 156, hiredInterns: 23 })
        } finally {
            await new Promise(r => setTimeout(r, 200))
            setLoading(false)
        }
    }

    // ─── View Details ─────────────────────────────────────────────────────────
    const handleViewDetails = async (internId: number) => {
        try {
            setDetailsLoading(true)
            setDetailsError(null)
            setShowModal(true)
            setSelectedIntern(null)
            const token = localStorage.getItem('token')
            const res = await api.get(`/api/company/view/details/${internId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = res.data?.Data || res.data
            setSelectedIntern(data)
        } catch (err: any) {
            if (err.response?.status === 401) {
                router.push('/login')
                return
            }
            setDetailsError('Failed to load internship details')
        } finally {
            setDetailsLoading(false)
        }
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setSelectedIntern(null)
        setDetailsError(null)
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────
    const getInitials = (name: string) =>
        name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

    // ─── Loading / Error ──────────────────────────────────────────────────────
    if (loading) return <LoadingScreen />

    if (error) {
        return (
            <div className={styles.errorContainer}>
                {t.errorLoading}
                <button onClick={fetchDashboardData} className={styles.retryButton}>{t.retry}</button>
            </div>
        )
    }

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className={`${styles.appLayout} ${language === 'ar' ? styles.rtl : ''}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className={styles.glow} aria-hidden="true" />
            <div className={styles.glowSecondary} aria-hidden="true" />
            <div className={styles.glowTertiary} aria-hidden="true" />

            <div
                className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
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
                    <Link href="/company/dashboard" className={`${styles.navItem} ${styles.active}`} onClick={() => setSidebarOpen(false)}>
                        <LayoutDashboard size={20} /><span>{t.dashboard}</span>
                    </Link>
                    <Link href="/company/internships" className={styles.navItem} onClick={() => setSidebarOpen(false)}>
                        <Briefcase size={20} /><span>{t.internships}</span>
                    </Link>
                    <Link href="/company/applicants" className={styles.navItem} onClick={() => setSidebarOpen(false)}>
                        <Users size={20} /><span>{t.applicants}</span>
                    </Link>
                    <Link href="/company/profile" className={styles.navItem} onClick={() => setSidebarOpen(false)}>
                        <UserCircle size={20} /><span>{t.profile}</span>
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
                    <div className={styles.topBarActions}>
                        <button
                            className={styles.hamburgerBtn}
                            onClick={() => setSidebarOpen(prev => !prev)}
                            title="Toggle Sidebar"
                            aria-label="Toggle Sidebar"
                        >
                            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                        <TopBarControls />
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
                        <button className={styles.postButton} onClick={() => router.push('/company/post-internship')}>
                            {t.postNewInternship}
                        </button>
                    </div>
                    <div className={styles.listingsGrid}>
                        {activeListings.length > 0 ? (
                            activeListings.map(listing => (
                                <div key={listing.id} className={styles.listingItem}>
                                    <div className={styles.listingLeft}>
                                        <h3 className={styles.listingTitle}>{listing.title}</h3>
                                        <div className={styles.listingDetails}>
                                            <span className={styles.listingLoc}>
                                                <MapPin size={14} />{listing.location}
                                            </span>
                                            <span className={`${styles.payBadge} ${listing.payStatus === 'Paid' ? styles.paid : styles.unpaid}`}>
                                                {listing.payStatus === 'Paid' ? t.paid : t.unpaid}
                                            </span>
                                            <span className={styles.listingApps}>{listing.applicants} {t.applicants}</span>
                                        </div>
                                    </div>
                                    <button
                                        className={styles.viewDetailsBtn}
                                        onClick={() => handleViewDetails(listing.id)}
                                    >
                                        {t.viewDetails}
                                    </button>
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
                            recentApplicants.map(applicant => (
                                <div key={applicant.id} className={styles.applicationItem}>
                                    <div className={styles.applicantLeft}>
                                        <div className={styles.applicantAvatar}>
                                            {getInitials(applicant.name)}
                                        </div>
                                        <div className={styles.applicantInfo}>
                                            <h3 className={styles.applicantName}>{applicant.name}</h3>
                                            <p className={styles.applicantRole}>{applicant.role}</p>
                                        </div>
                                    </div>
                                    <div className={styles.applicantRight}>
                                        <div className={styles.appMeta}>
                                            <span className={styles.timeAgo}>
                                                {applicant.timeAgo.includes('hours')
                                                    ? `${applicant.timeAgo.split(' ')[0]} ${t.hoursAgo}`
                                                    : applicant.timeAgo.includes('day')
                                                        ? `${applicant.timeAgo.split(' ')[0]} ${t.daysAgo}`
                                                        : applicant.timeAgo}
                                            </span>
                                            <span className={`${styles.appStatus} ${styles[applicant.status]}`}>
                                                {applicant.status === 'Pending'
                                                    ? t.pending
                                                    : applicant.status === 'Accept'
                                                        ? t.statusAccepted
                                                        : t.statusRejected}
                                            </span>
                                        </div>
                                        <div className={styles.actionButtons}>
                                            <button className={styles.cvBtn} title={t.downloadCv}>
                                                <Download size={14} /> CV
                                            </button>
                                            {applicant.status === 'Pending' && (
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

            {/* ─── Details Modal ──────────────────────────────────────────────── */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.modalClose} onClick={handleCloseModal} title="Close Details" aria-label="Close Details">
                            <X size={20} />
                        </button>

                        {detailsLoading && (
                            <div className={styles.modalLoading}>
                                <div className={styles.spinner} />
                                <p>Loading...</p>
                            </div>
                        )}

                        {detailsError && (
                            <div className={styles.modalError}>
                                <p>{detailsError}</p>
                            </div>
                        )}

                        {selectedIntern && !detailsLoading && (
                            <>
                                <div className={styles.modalHeader}>
                                    <h2 className={styles.modalTitle}>{selectedIntern.title}</h2>
                                    <div className={styles.modalBadges}>
                                        <span className={`${styles.payBadge} ${selectedIntern.IsPaid ? styles.paid : styles.unpaid}`}>
                                            {selectedIntern.IsPaid ? t.paid : t.unpaid}
                                        </span>
                                        <span className={`${styles.statusBadge} ${selectedIntern.IsOpen ? styles.open : styles.closed}`}>
                                            {selectedIntern.IsOpen ? 'Open' : 'Closed'}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.modalBody}>
                                    <p className={styles.modalDescription}>{selectedIntern.description}</p>

                                    <div className={styles.modalGrid}>
                                        <div className={styles.modalField}>
                                            <span className={styles.fieldLabel}>Duration</span>
                                            <span className={styles.fieldValue}>{selectedIntern.duration} weeks</span>
                                        </div>
                                        <div className={styles.modalField}>
                                            <span className={styles.fieldLabel}>Location Type</span>
                                            <span className={styles.fieldValue}>{selectedIntern.locationType}</span>
                                        </div>
                                        {selectedIntern.Internship_City && (
                                            <div className={styles.modalField}>
                                                <span className={styles.fieldLabel}>City</span>
                                                <span className={styles.fieldValue}>{selectedIntern.Internship_City}</span>
                                            </div>
                                        )}
                                        {selectedIntern.Internship_Country && (
                                            <div className={styles.modalField}>
                                                <span className={styles.fieldLabel}>Country</span>
                                                <span className={styles.fieldValue}>{selectedIntern.Internship_Country}</span>
                                            </div>
                                        )}
                                        {selectedIntern.IsPaid && selectedIntern.price && (
                                            <div className={styles.modalField}>
                                                <span className={styles.fieldLabel}>Stipend</span>
                                                <span className={styles.fieldValue}>${selectedIntern.price}</span>
                                            </div>
                                        )}
                                        <div className={styles.modalField}>
                                            <span className={styles.fieldLabel}>Applications</span>
                                            <span className={styles.fieldValue}>{selectedIntern.applicationsCount}</span>
                                        </div>
                                        <div className={styles.modalField}>
                                            <span className={styles.fieldLabel}>Deadline</span>
                                            <span className={styles.fieldValue}>
                                                {new Date(selectedIntern.DeadlineDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className={styles.modalField}>
                                            <span className={styles.fieldLabel}>Posted</span>
                                            <span className={styles.fieldValue}>
                                                {new Date(selectedIntern.CreatedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {selectedIntern.skills.length > 0 && (
                                        <div className={styles.modalSection}>
                                            <h4 className={styles.sectionLabel}>Skills</h4>
                                            <div className={styles.tagsList}>
                                                {selectedIntern.skills.map((skill, i) => (
                                                    <span key={i} className={styles.tag}>{skill}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedIntern.requirements.length > 0 && (
                                        <div className={styles.modalSection}>
                                            <h4 className={styles.sectionLabel}>Requirements</h4>
                                            <div className={styles.tagsList}>
                                                {selectedIntern.requirements.map((req, i) => (
                                                    <span key={i} className={styles.tag}>{req}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Company
