'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  Search,
  MapPin,
  DollarSign,
  Calendar,
  FileText,
  Edit2,
  Trash2,
  XCircle,
  RotateCcw,
  Plus,
  ChevronLeft,
  Menu,
  X,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import TopBarControls from '../../components/TopBarControls/TopBarControls'
import styles from './InternshipsStyle.module.css'
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen'

interface Internship {
  id: number
  title: string
  city?: string
  isPaid: 'Paid' | 'Unpaid'
  salary?: string
  deadline: string
  applicants: number
  status: 'Open' | 'Closed'
  workType: 'Remote' | 'Onsite' | 'Hybrid'
}

const MOCK_INTERNSHIPS: Internship[] = [
  {
    id: 1,
    title: 'Frontend Developer Intern',
    workType: 'Remote',
    isPaid: 'Paid',
    salary: '5,000 EGP/month',
    deadline: '2024-12-30',
    applicants: 45,
    status: 'Open',
  },
  {
    id: 2,
    title: 'Backend Developer Intern',
    city: 'Alexandria',
    workType: 'Onsite',
    isPaid: 'Paid',
    salary: '5,500 EGP/month',
    deadline: '2025-01-15',
    applicants: 32,
    status: 'Closed',
  },
]

function MyInternshipPage() {
  const { language, t } = useApp()
  const router = useRouter()

  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // ── Reopen modal state ───────────────────────────────────────────────────
  const [reopenModalOpen, setReopenModalOpen] = useState(false)
  const [reopenTargetId, setReopenTargetId] = useState<number | null>(null)
  const [reopenDeadline, setReopenDeadline] = useState('')

  // ── Fetch Internships ──────────────────────────────────────────────────────
  const fetchInternships = async () => {
    try {
      setLoading(true)
      setError(null)

      // ── BACKEND INTEGRATION ───────────────────────────────────────────────
      // Expected endpoint: GET /company/internships
      // Expected response: Internship[]
      //
      // const token = localStorage.getItem('token')
      // const res = await fetch('/api/company/internships', {
      //   headers: { Authorization: `Bearer ${token}` },
      // })
      // if (!res.ok) throw new Error('Failed to fetch internships')
      // const data = await res.json()
      // setInternships(data)
      // ────────────────────────────────────────────────

      await new Promise(r => setTimeout(r, 400))
      setInternships(MOCK_INTERNSHIPS)
    } catch (err: any) {
      setError(err.message || t.failedToLoadInternships)
    } finally {
      setLoading(false)
    }
  }

  // ── Close posting ──────────────────────────────────────────────────────────
  const handleClosePosting = async (id: number) => {
    if (!confirm(t.confirmClosePosting)) return
    try {
      // ── BACKEND INTEGRATION ───────────────────────────────────────────────
      // const token = localStorage.getItem('token')
      // await fetch(`/api/company/internships/${id}/close`, {
      //   method: 'PATCH',
      //   headers: { Authorization: `Bearer ${token}` },
      // })
      // ─────────────────────────────────────────────────────────────────────

      setInternships(prev => prev.map(i => i.id === id ? { ...i, status: 'Closed' } : i))
    } catch (err: any) {
      alert(err.message || t.failedToClose)
    }
  }

  // ── Reopen posting ────────────────────────────────────────────────────────
  const handleOpenReopenModal = (id: number) => {
    setReopenTargetId(id)
    const current = internships.find(i => i.id === id)
    setReopenDeadline(current?.deadline || '')
    setReopenModalOpen(true)
  }

  const handleCloseReopenModal = () => {
    setReopenModalOpen(false)
    setReopenTargetId(null)
    setReopenDeadline('')
  }

  useEffect(() => {
    fetchInternships()
  }, [])

  const handleReopen = async () => {
    if (!reopenTargetId) return
    const id = reopenTargetId

    // If the old deadline already passed, a new deadline is required.
    const current = internships.find(i => i.id === id)
    const oldDeadlineExpired = current ? new Date(current.deadline) < new Date() : false

    if (oldDeadlineExpired && !reopenDeadline) {
      alert(t.pleaseSelectDeadline)
      return
    }

    const payload: { deadline: string | null } = {
      deadline: reopenDeadline || null,
    }

    try {
      // ── BACKEND INTEGRATION ───────────────────────────────────────────────
      // Expected endpoint: PATCH /company/internships/:id/reopen
      // const token = localStorage.getItem('token')
      // await fetch(`/api/company/internships/${id}/reopen`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(payload),
      // })
      // ─────────────────────────────────────────────────────────────────────

      setInternships(prev => prev.map(i => i.id === id ? { ...i, status: 'Open', deadline: payload.deadline || i.deadline } : i))
      handleCloseReopenModal()
    } catch (err: any) {
      alert(err.message || t.failedToReopen)
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    if (!confirm(t.confirmDelete)) return
    try {
      // ── BACKEND INTEGRATION ───────────────────────────────────────────────
      // const token = localStorage.getItem('token')
      // await fetch(`/api/company/internships/${id}`, {
      //   method: 'DELETE',
      //   headers: { Authorization: `Bearer ${token}` },
      // })
      // ─────────────────────────────────────────────────────────────────────

      setInternships(prev => prev.filter(i => i.id !== id))
    } catch (err: any) {
      alert(err.message || t.failedToDelete)
    }
  }

  const handleEdit = (id: number) => {
    router.push(`/company/post-internship?id=${id}`)
  }

  // ── View Applications → pass internshipId so page shows only that internship's applicants
  const handleViewApplications = (id: number) => {
    router.push(`/company/applicants?internId=${id}`)
  }

  const filtered = internships.filter(i =>
    i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (i.city || i.workType || '').toLowerCase().includes(searchQuery.toLowerCase())
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

          {filtered.map(internship => {
            const isPaid = internship.isPaid === 'Paid' || (internship.isPaid as any) === true
            return (
              <div key={internship.id} className={styles.internshipCard}>
                <span className={`${styles.statusBadge} ${internship.status === 'Open' ? styles.statusActive : styles.statusClosed}`}>
                  {internship.status === 'Open' ? t.active : t.closed}
                </span>

                <div className={styles.cardTop}>
                  <h3 className={styles.cardTitle}>{internship.title}</h3>
                  <div className={styles.cardMeta}>
                    <span className={styles.metaItem}>
                      <MapPin size={14} />
                      {internship.workType === 'Onsite' && internship.city
                        ? `${internship.city} (${t.onSite})`
                        : internship.workType === 'Remote'
                          ? t.remote
                          : t.hybrid}
                    </span>
                    <span className={`${styles.metaItem} ${isPaid ? styles.paidColor : styles.unpaidColor}`}>
                      <DollarSign size={14} />
                      {isPaid ? (internship.salary || t.paid) : t.unpaid}
                    </span>
                    <span className={styles.metaItem}>
                      <Calendar size={14} /> {t.deadline}: {formatDeadline(internship.deadline)}
                    </span>
                  </div>
                </div>

                <div className={styles.statsRow}>
                  <div className={styles.statBox}>
                    <span className={styles.statLabel}>{t.applicants}</span>
                    <span className={styles.statValue}><FileText size={16} /> {internship.applicants}</span>
                  </div>
                  <div className={styles.statBox}>
                    <span className={styles.statLabel}>{t.status}</span>
                    <span className={styles.statValue}>{isPaid ? t.paid : t.unpaid}</span>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <button className={styles.viewBtn} onClick={() => handleViewApplications(internship.id)}>
                    {t.viewApplicants} ({internship.applicants})
                  </button>
                  <button className={styles.editBtn} onClick={() => handleEdit(internship.id)}>
                    <Edit2 size={15} /> {t.edit}
                  </button>
                  {internship.status === 'Open' ? (
                    <button className={styles.closeBtn} onClick={() => handleClosePosting(internship.id)}>
                      <XCircle size={15} /> {t.closePosting}
                    </button>
                  ) : (
                    <button className={styles.closeBtn} onClick={() => handleOpenReopenModal(internship.id)}>
                      <RotateCcw size={15} /> {t.reopenPosting}
                    </button>
                  )}
                  <button className={styles.deleteBtn} onClick={() => handleDelete(internship.id)}>
                    <Trash2 size={15} /> {t.delete}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* ── Reopen Modal ───────────────────────────────────────────────── */}
      {reopenModalOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseReopenModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>
              {t.reopenPosting}
            </h3>

            <label htmlFor="reopen-deadline-input" className={styles.modalLabel}>
              {t.deadline}
            </label>
            <input
              id="reopen-deadline-input"
              type="date"
              value={reopenDeadline}
              onChange={e => setReopenDeadline(e.target.value)}
              className={styles.modalInput}
              title="Deadline Date"
            />

            <div className={styles.modalBtnGroup}>
              <button
                onClick={handleCloseReopenModal}
                className={styles.cancelBtn}
              >
                {t.cancel}
              </button>
              <button
                onClick={handleReopen}
                className={styles.confirmBtn}
              >
                {t.ok}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyInternshipPage