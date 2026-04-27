
'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  Globe,
  Moon,
  Sun,
  LogOut,
  Check,
  ChevronLeft,
  Search,
  Mail,
  Phone,
  Download,
  Menu,
  X,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import styles from './ApplicationsStyle.module.css'
import Notification from '../../components/Notification/Notification'
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen'


// ─── Types ────────────────────────────────────────────────────────────────────
interface Applicant {
  id: number
  internshipId: number
  name: string
  university: string
  major: string
  email: string
  phone: string
  appliedAt: string
  status: 'pending' | 'accepted' | 'rejected'
  matchPercent: number
  cvUrl?: string
}

const MOCK_APPLICANTS: Applicant[] = [
  {
    id: 1, internshipId: 1,
    name: 'Ahmed Khaled',
    university: 'Cairo University',
    major: 'Computer Science',
    email: 'ahmed@example.com',
    phone: '+20 123 456 7890',
    appliedAt: '2 hours ago',
    status: 'pending',
    matchPercent: 95,
  },
  {
    id: 2, internshipId: 1,
    name: 'Sara Mohamed', university: 'Ain Shams University', major: 'Software Engineering',
    email: 'sara@example.com', phone: '+20 111 222 3333',
    appliedAt: '5 hours ago', status: 'pending', matchPercent: 88,
  },
  {
    id: 3, internshipId: 1,
    name: 'Youssef Ali', university: 'Alexandria University', major: 'IT',
    email: 'youssef@example.com', phone: '+20 100 000 0000',
    appliedAt: '1 day ago', status: 'accepted', matchPercent: 72,
  },
  {
    id: 4, internshipId: 2,
    name: 'Layla Ibrahim', university: 'Cairo University', major: 'Computer Engineering',
    email: 'layla@example.com', phone: '+20 122 333 4444',
    appliedAt: '30 minutes ago', status: 'pending', matchPercent: 91,
  },
  {
    id: 5, internshipId: 2,
    name: 'Omar Hassan', university: 'Helwan University', major: 'Information Systems',
    email: 'omar@example.com', phone: '+20 155 666 7777',
    appliedAt: '3 hours ago', status: 'rejected', matchPercent: 60,
  },
  {
    id: 6, internshipId: 3,
    name: 'Nour Mahmoud', university: 'Future University', major: 'Graphic Design',
    email: 'nour@example.com', phone: '+20 100 888 9999',
    appliedAt: '2 days ago', status: 'pending', matchPercent: 85,
  },
]

// ─── Component ────────────────────────────────────────────────────────────────
function ApplicationsContent() {
  const { theme, toggleTheme, language, setLanguage, t } = useApp()
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const internshipId = searchParams.get('internshipId')

  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const fetchApplicants = async () => {
    try {
      setLoading(true)
      setError(null)
      await new Promise(r => setTimeout(r, 200))
      if (internshipId) {
        setApplicants(MOCK_APPLICANTS.filter(a => a.internshipId === Number(internshipId)))
      } else {
        setApplicants(MOCK_APPLICANTS)
      }
    } catch (err: any) {
      setError(err.message || t.failedToLoadApplicants)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplicants()
  }, [internshipId])

  const handleAccept = async (id: number) => {
    try {
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: 'accepted' } : a))
    } catch (err: any) {
      alert(err.message || t.failedToAccept)
    }
  }

  const handleReject = async (id: number) => {
    try {
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a))
    } catch (err: any) {
      alert(err.message || t.failedToReject)
    }
  }

  const handleDownloadCV = (applicant: Applicant) => {
    alert(`${t.downloadingCv} ${applicant.name}`)
  }

  const changeLanguage = (lang: 'en' | 'ar') => { setLanguage(lang); setShowLanguageMenu(false) }

  const filtered = applicants.filter(a => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.major.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  if (loading) {
    return <LoadingScreen />
  }

  if (error) {
    return (
      <div className={styles.appLayout}>
        <div className={styles.loadingCenter}>
          <p className={styles.errorText}>{error}</p>
          <button className={styles.retryBtn} onClick={fetchApplicants}>{t.retry}</button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.appLayout} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.glowSecondary} aria-hidden="true" />
      <div className={styles.glowTertiary} aria-hidden="true" />

      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <button className={styles.backBtn} onClick={() => router.push('/company/internships')} title={t.back}>
              <ChevronLeft size={18} />
            </button>
            <div className={styles.logoIcon}>IW</div>
            <span className={styles.logoText}>{t.appName}</span>
          </div>
        </div>
        <nav className={styles.nav}>
          <Link href="/company/dashboard" className={styles.navItem} onClick={() => setSidebarOpen(false)}>
            <LayoutDashboard size={20} /><span>{t.dashboard}</span>
          </Link>
          <Link href="/company/internships" className={styles.navItem} onClick={() => setSidebarOpen(false)}>
            <Briefcase size={20} /><span>{t.myInternships}</span>
          </Link>
          <Link href="/company/applicants" className={`${styles.navItem} ${styles.active}`} onClick={() => setSidebarOpen(false)}>
            <Users size={20} /><span>{t.applicants}</span>
          </Link>
          <Link href="/company/profile" className={styles.navItem} onClick={() => setSidebarOpen(false)}>
            <Building2 size={20} /><span>{t.companyProfileNav}</span>
          </Link>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topBar}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{t.applicantsPageTitle}</h1>
            <p className={styles.pageSubtitle}>{t.applicantsPageSubtitle}</p>
          </div>
          <div className={styles.topBarControls}>
            <button
              className={styles.hamburgerBtn}
              onClick={() => setSidebarOpen(prev => !prev)}
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div className={styles.languageWrapper}>
              <button className={styles.iconButton} onClick={() => setShowLanguageMenu(!showLanguageMenu)} title={t.changeLanguage}><Globe size={20} /></button>
              <div className={`language-menu ${showLanguageMenu ? 'show' : ''}`}>
                {(['en', 'ar'] as const).map(lang => (
                  <div key={lang} className={`language-option ${language === lang ? 'active' : ''}`} onClick={() => changeLanguage(lang)}>
                    {language === lang && <Check size={16} />}{lang === 'en' ? 'English' : 'العربية'}
                  </div>
                ))}
              </div>
            </div>
            <button className={styles.iconButton} onClick={toggleTheme} title={t.toggleTheme}>{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</button>

            <Notification />

            <button className={styles.iconButton} onClick={() => router.push('/')} title={t.logout}><LogOut size={20} /></button>
          </div>
        </header>

        <div className={styles.searchRow}>
          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder={t.searchApplicants}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            title={t.allApplications}
          >
            <option value="all">{t.allApplications}</option>
            <option value="pending">{t.statusPending}</option>
            <option value="accepted">{t.statusAccepted}</option>
            <option value="rejected">{t.statusRejected}</option>
          </select>
        </div>

        <div className={styles.cardsList}>
          {filtered.length === 0 && (
            <div className={styles.emptyMessage}>{t.noApplicantsFound}</div>
          )}
          {filtered.map(applicant => (
            <div key={applicant.id} className={styles.applicantCard}>
              <div className={styles.cardLeft}>
                <div className={styles.avatar}>{getInitials(applicant.name)}</div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardTopRow}>
                  <div>
                    <h3 className={styles.applicantName}>{applicant.name}</h3>
                    <p className={styles.applicantMeta}>
                      {applicant.university} &bull; {applicant.major}
                    </p>
                  </div>
                  <div className={styles.badges}>
                    <span className={`${styles.statusBadge} ${styles[`status_${applicant.status}`]}`}>
                      {applicant.status === 'pending'
                        ? t.statusPending
                        : applicant.status === 'accepted'
                          ? t.statusAccepted
                          : t.statusRejected}
                    </span>
                    <span className={styles.matchBadge}>
                      {applicant.matchPercent}% {t.match}
                    </span>
                  </div>
                </div>
                <div className={styles.contactRow}>
                  <span className={styles.contactItem}><Mail size={14} /> {applicant.email}</span>
                  <span className={styles.contactItem}><Phone size={14} /> {applicant.phone}</span>
                </div>
                <div className={styles.cardBottomRow}>
                  <span className={styles.appliedAt}>{t.applied} {applicant.appliedAt}</span>
                  <div className={styles.actions}>
                    <button className={styles.downloadBtn} onClick={() => handleDownloadCV(applicant)}>
                      <Download size={14} /> {t.downloadCv}
                    </button>
                    {applicant.status !== 'accepted' && (
                      <button className={styles.acceptBtn} onClick={() => handleAccept(applicant.id)}>
                        {t.accept}
                      </button>
                    )}
                    {applicant.status !== 'rejected' && (
                      <button className={styles.rejectBtn} onClick={() => handleReject(applicant.id)}>
                        {t.rejectApplicant}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

function LoadingFallback() {
  const { t } = useApp()
  return (
    <div className={styles.loadingFallback}>
      <div className={styles.spinnerLarge} />
      <p className={styles.loadingText}>{t.loadingApplicants}</p>
    </div>
  )
}

export default function ApplicationsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ApplicationsContent />
    </Suspense>
  )
}