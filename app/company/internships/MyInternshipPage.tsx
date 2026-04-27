'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  Search,
  MapPin,
  DollarSign,
  Calendar,
  Eye,
  FileText,
  Edit2,
  Trash2,
  XCircle,
  Plus,
  Clock,
  ChevronLeft,
  Menu,
  X,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import styles from './InternshipsStyle.module.css'
import Notification from '../../components/Notification/Notification'
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen'


interface Internship {
  id: number
  title: string
  location: string
  city?: string
  isPaid: boolean
  salary?: string
  deadline: string
  duration: string
  skills: string[]
  description: string
  applicants: number
  views: number
  status: 'active' | 'closed'
  workType: 'Remote' | 'On-site' | 'Hybrid'
}

const MOCK_INTERNSHIPS: Internship[] = [
  {
    id: 1,
    title: 'Frontend Developer Intern',
    location: 'Remote',
    workType: 'Remote',
    isPaid: true,
    salary: '5,000 EGP/month',
    deadline: '2024-12-30',
    duration: '3 months',
    skills: ['React', 'TypeScript', 'CSS'],
    description: 'Work on our main product frontend.',
    applicants: 45,
    views: 234,
    status: 'active',
  },
  {
    id: 2,
    title: 'Backend Developer Intern',
    location: 'On-site',
    city: 'Alexandria',
    workType: 'On-site',
    isPaid: true,
    salary: '5,500 EGP/month',
    deadline: '2025-01-15',
    duration: '6 months',
    skills: ['Node.js', 'PostgreSQL'],
    description: 'Build APIs and backend services.',
    applicants: 32,
    views: 189,
    status: 'active',
  },
  {
    id: 3,
    title: 'UI/UX Designer Intern',
    location: 'Remote',
    workType: 'Remote',
    isPaid: false,
    deadline: '2025-01-20',
    duration: '1 month',
    skills: ['Figma', 'Adobe XD'],
    description: 'Design user interfaces for our platform.',
    applicants: 18,
    views: 120,
    status: 'closed',
  },
]

function MyInternshipPage() {
  const { theme, toggleTheme, language, setLanguage, t } = useApp()
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const router = useRouter()

  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const fetchInternships = async () => {
    try {
      setLoading(true)
      setError(null)
      await new Promise(r => setTimeout(r, 200))
      setInternships(MOCK_INTERNSHIPS)
    } catch (err: any) {
      setError(err.message || t.failedToLoadInternships)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInternships()
  }, [])

  const handleClosePosting = async (id: number) => {
    if (!confirm(t.confirmClosePosting)) return
    try {
      setInternships(prev => prev.map(i => i.id === id ? { ...i, status: 'closed' } : i))
    } catch (err: any) {
      alert(err.message || t.failedToClose)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm(t.confirmDelete)) return
    try {
      setInternships(prev => prev.filter(i => i.id !== id))
    } catch (err: any) {
      alert(err.message || t.failedToDelete)
    }
  }

  const handleEdit = (id: number) => {
    router.push(`/company/post-internship?id=${id}`)
  }

  const handleViewApplications = (id: number) => {
    router.push(`/company/applicants?internshipId=${id}`)
  }

  const changeLanguage = (lang: 'en' | 'ar') => { setLanguage(lang); setShowLanguageMenu(false) }

  const filtered = internships.filter(i =>
    i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (i.city || i.location || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDeadline = (dateStr: string) => {
    try { return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }
    catch { return dateStr }
  }

  if (loading) {
    return <LoadingScreen />
  }

  if (error) {
    return (
      <div className={styles.appLayout}>
        <div className={styles.loadingCenter}>
          <p className={styles.errorText}>{error}</p>
          <button className={styles.retryBtn} onClick={fetchInternships}>{t.retry}</button>
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
            <button className={styles.backBtn} onClick={() => router.push('/company/dashboard')} title={t.back}>
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
          <Link href="/company/internships" className={`${styles.navItem} ${styles.active}`} onClick={() => setSidebarOpen(false)}>
            <Briefcase size={20} /><span>{t.myInternships}</span>
          </Link>
          <Link href="/company/applicants" className={styles.navItem} onClick={() => setSidebarOpen(false)}>
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
            <h1 className={styles.pageTitle}>{t.myInternships}</h1>
            <p className={styles.pageSubtitle}>{t.managePostings}</p>
          </div>
          <div className={styles.topBarControls}>
            <button
              className={styles.hamburgerBtn}
              onClick={() => setSidebarOpen(prev => !prev)}
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div className={styles.languageWrapper}>
              <button className={styles.iconButton} onClick={() => setShowLanguageMenu(!showLanguageMenu)} title={t.changeLanguage}>
                <Globe size={20} />
              </button>
              <div className={`language-menu ${showLanguageMenu ? 'show' : ''}`}>
                {(['en', 'ar'] as const).map(lang => (
                  <div key={lang} className={`language-option ${language === lang ? 'active' : ''}`} onClick={() => changeLanguage(lang)}>
                    {language === lang && <Check size={16} />}{lang === 'en' ? 'English' : 'العربية'}
                  </div>
                ))}
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

        <div className={styles.searchRow}>
          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder={t.searchInternships}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button className={styles.postBtn} onClick={() => router.push('/company/post-internship')}>
            <Plus size={18} /> {t.postNewInternship}
          </button>
        </div>

        <div className={styles.cardsList}>
          {filtered.length === 0 && (
            <div className={styles.emptyMessage}>{t.noInternshipsFound}</div>
          )}

          {filtered.map(internship => (
            <div key={internship.id} className={styles.internshipCard}>
              <span className={`${styles.statusBadge} ${internship.status === 'active' ? styles.statusActive : styles.statusClosed}`}>
                {internship.status === 'active' ? t.active : t.closed}
              </span>

              <div className={styles.cardTop}>
                <h3 className={styles.cardTitle}>{internship.title}</h3>
                <div className={styles.cardMeta}>
                  <span className={styles.metaItem}>
                    <MapPin size={14} />
                    {internship.workType === 'On-site' && internship.city
                      ? `${internship.city} (${t.onSite})`
                      : internship.workType === 'Remote'
                        ? t.remote
                        : t.hybrid}
                  </span>
                  <span className={`${styles.metaItem} ${internship.isPaid ? styles.paidColor : styles.unpaidColor}`}>
                    <DollarSign size={14} />
                    {internship.isPaid ? (internship.salary || t.paid) : t.unpaid}
                  </span>
                  <span className={styles.metaItem}>
                    <Calendar size={14} /> {t.deadline}: {formatDeadline(internship.deadline)}
                  </span>
                  <span className={styles.metaItem}>
                    <Clock size={14} /> {internship.duration}
                  </span>
                </div>
                {internship.skills?.length > 0 && (
                  <div className={styles.skillsTags}>
                    {internship.skills.map(skill => (
                      <span key={skill} className={styles.skillTag}>{skill}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.statsRow}>
                <div className={styles.statBox}>
                  <span className={styles.statLabel}>{t.applicants}</span>
                  <span className={styles.statValue}><FileText size={16} /> {internship.applicants}</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statLabel}>{t.views}</span>
                  <span className={styles.statValue}><Eye size={16} /> {internship.views}</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statLabel}>{t.status}</span>
                  <span className={styles.statValue}>{internship.isPaid ? t.paid : t.unpaid}</span>
                </div>
              </div>

              <div className={styles.cardActions}>
                <button className={styles.viewBtn} onClick={() => handleViewApplications(internship.id)}>
                  {t.viewApplicants} ({internship.applicants})
                </button>
                <button className={styles.editBtn} onClick={() => handleEdit(internship.id)}>
                  <Edit2 size={15} /> {t.edit}
                </button>
                {internship.status === 'active' && (
                  <button className={styles.closeBtn} onClick={() => handleClosePosting(internship.id)}>
                    <XCircle size={15} /> {t.closePosting}
                  </button>
                )}
                <button className={styles.deleteBtn} onClick={() => handleDelete(internship.id)}>
                  <Trash2 size={15} /> {t.delete}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default MyInternshipPage