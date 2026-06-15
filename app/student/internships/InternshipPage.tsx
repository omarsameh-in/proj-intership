'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Briefcase,
  Users,
  UserCircle,
  Video,
  ChevronLeft,
  Search,
  MapPin,
  Clock,
  Menu,
  X,
  AlertCircle,
  ArrowRight,
  Check,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import TopBarControls from '../../components/TopBarControls/TopBarControls'
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen'
import styles from './InternshipsStyle.module.css'
import { useAppliedInternships } from '../../hooks/useAppliedInternships'
import api from '../../lib/api'

// ─────────────────────────────────────────────────────────────────────────────
// TYPES — matching backend response shapes
// ─────────────────────────────────────────────────────────────────────────────

// Raw shape of one item from GET /Student/Internships -> data[]
// (lowercase "data" per the Response Guide)
interface RawInternshipListItem {
  internshipId:    number
  title:           string
  companyName:     string
  durationMonths:  number
  locationType:    string            // 'Remote' | 'OnSite' | 'Hybrid'
  city?:           string | null
  deadline:        string            // ISO date string
  requiredSkills:  string[]
  paidStatus:      string            // e.g. 'Paid' | 'Unpaid'
  price?:          number | null
}
// Raw shape of one item from GET /Student/Internships/get/matchscore -> data[]
interface RawMatchScoreItem {
  internshipId: number
  score:        number // 0.0 - 1.0
}

interface Internship {
  id:           number
  title:        string
  company:      string
  avatar:       string
  avatarColor:  string
  location:     string
  workType:     string
  duration:     string
  salary:       string
  salaryColor:  string
  deadline:     string
  deadlineDate: Date | null
  skills:       string[]
  isPaid:       boolean
  matchScore:   number | null
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  '#5B8DEF', '#9D7CEF', '#8B5FE8', '#7C9FEF',
  '#EF5B9D', '#5BCFEF', '#EF9D5B', '#5BEF8D',
]

function colorFromId(id: number): string {
  return AVATAR_COLORS[id % AVATAR_COLORS.length]
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('')
}

// Format an ISO date string into a readable label, e.g. "May 30, 2026"
function formatDeadline(iso: string): { label: string; date: Date | null } {
  if (!iso) return { label: 'N/A', date: null }
  const date = new Date(iso)
  if (isNaN(date.getTime())) return { label: 'N/A', date: null }
  const label = date.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
  return { label, date }
}

// Map backend location_type values ('OnSite') to the values used by the
// type filter dropdown ('on-site') so filtering keeps working correctly.
function normaliseWorkType(raw: string | null | undefined): string {
  if (!raw) return 'N/A'
  const lower = raw.toLowerCase()
  if (lower === 'onsite' || lower === 'on-site' || lower === 'on site') return 'On-site'
  if (lower === 'remote') return 'Remote'
  if (lower === 'hybrid') return 'Hybrid'
  return raw
}
function normaliseListItem(raw: RawInternshipListItem): Internship {
  if (!raw || typeof raw.internshipId !== 'number') {
    throw new Error(`Invalid list item: ${JSON.stringify(raw)}`)
  }

  const companyName = raw.companyName ?? 'Unknown Company'

  const { label: deadlineLabel, date: deadlineDate } = formatDeadline(raw.deadline)

  const isPaid = (raw.paidStatus ?? '').toLowerCase() !== 'unpaid' && !!raw.price
  const salary = isPaid && raw.price
    ? `${raw.price.toLocaleString()} EGP/month`
    : 'Unpaid'

  return {
    id:           raw.internshipId,
    title:        raw.title ?? 'Untitled Position',
    company:      companyName,
    avatar:       initials(companyName),
    avatarColor:  colorFromId(raw.internshipId),
    location:     raw.city ?? 'N/A',
    workType:     normaliseWorkType(raw.locationType),
    duration:     raw.durationMonths ? `${raw.durationMonths} month${raw.durationMonths !== 1 ? 's' : ''}` : 'N/A',
    salary,
    salaryColor:  isPaid ? '#10B981' : '#EF5B5B',
    deadline:     deadlineLabel,
    deadlineDate,
    skills:       Array.isArray(raw.requiredSkills) ? raw.requiredSkills.filter(Boolean) : [],
    isPaid,
    matchScore:   null,
  }
}
function isDeadlinePassed(date: Date | null): boolean {
  if (!date) return false
  return date < new Date()
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — kept as fallback, now produced directly as `Internship[]`
// so the UI keeps working even before backend integration / on failure.
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_INTERNSHIPS: Internship[] = [
  {
    id: 2,
    title: 'Backend .NET Intern',
    company: 'TechNova Solutions Updated',
    avatar: initials('TechNova Solutions Updated'),
    avatarColor: colorFromId(2),
    location: 'Cairo',
    workType: 'Remote',
    duration: '3 months',
    salary: '2,000 EGP/month',
    salaryColor: '#10B981',
    deadline: 'May 30, 2026',
    deadlineDate: new Date(2026, 4, 30, 23, 59, 59),
    skills: ['c#', 'asp.net core', 'sql'],
    isPaid: true,
    matchScore: 88,
  },
  {
    id: 8,
    title: 'Backend Node js  Intern',
    company: 'TechNova Solutions Updated',
    avatar: initials('TechNova Solutions Updated'),
    avatarColor: colorFromId(2),
    location: 'Cairo',
    workType: 'Remote',
    duration: '3 months',
    salary: '2,000 EGP/month',
    salaryColor: '#10B981',
    deadline: 'May 30, 2026',
    deadlineDate: new Date(2026, 4, 30, 23, 59, 59),
    skills: ['c#', 'js', 'sql'],
    isPaid: true,
    matchScore: 88,
  },
  {
    id: 3,
    title: 'Front End',
    company: 'TechNova Solutions',
    avatar: initials('TechNova Solutions'),
    avatarColor: colorFromId(3),
    location: 'Cairo',
    workType: 'Remote',
    duration: '5 months',
    salary: 'Unpaid',
    salaryColor: '#EF5B5B',
    deadline: 'May 30, 2026',
    deadlineDate: new Date(2026, 4, 30, 23, 59, 59),
    skills: ['c#', 'asp.net core', 'sql'],
    isPaid: false,
    matchScore: 76,
  },
  {
    id: 4,
    title: 'UI/UX Designer Intern',
    company: 'Digital Solutions',
    avatar: initials('Digital Solutions'),
    avatarColor: colorFromId(4),
    location: 'Alexandria',
    workType: 'Hybrid',
    duration: '4 months',
    salary: '4,500 EGP/month',
    salaryColor: '#10B981',
    deadline: 'Jan 15, 2025',
    deadlineDate: new Date(2025, 0, 15, 23, 59, 59),
    skills: ['Figma', 'Adobe XD', 'Prototyping'],
    isPaid: true,
    matchScore: 88,
  },
  {
    id: 5,
    title: 'Full Stack Developer',
    company: 'Innovation Hub',
    avatar: initials('Innovation Hub'),
    avatarColor: colorFromId(5),
    location: 'Remote',
    workType: 'Remote',
    duration: '6 months',
    salary: 'Unpaid',
    salaryColor: '#EF5B5B',
    deadline: 'Jan 20, 2025',
    deadlineDate: new Date(2025, 0, 20, 23, 59, 59),
    skills: ['Node.js', 'MongoDB', 'React'],
    isPaid: false,
    matchScore: 82,
  },
  {
    id: 6,
    title: 'Data Analyst Intern',
    company: 'Startup Labs',
    avatar: initials('Startup Labs'),
    avatarColor: colorFromId(6),
    location: 'Giza',
    workType: 'On-site',
    duration: '3 months',
    salary: '6,000 EGP/month',
    salaryColor: '#10B981',
    deadline: 'Dec 25, 2024',
    deadlineDate: new Date(2024, 11, 25, 23, 59, 59),
    skills: ['Python', 'SQL', 'Excel'],
    isPaid: true,
    matchScore: 75,
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// AUTH HELPERS — refresh-token flow per the Request Guide
// ─────────────────────────────────────────────────────────────────────────────

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) return null

  try {
    const res = await api.post('/auth/refresh-token', { refreshToken })
    const newAccessToken = res.data?.accessToken ?? res.data?.Data?.accessToken
    if (!newAccessToken) return null

    localStorage.setItem('token', newAccessToken)
    if (res.data?.refreshToken) {
      localStorage.setItem('refreshToken', res.data.refreshToken)
    }
    return newAccessToken
  } catch {
    return null
  }
}

function clearAuthAndRedirect(router: ReturnType<typeof useRouter>) {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  router.push('/login')
}

// Wraps a GET request: on 401, tries refresh-token once, retries, else logs out.
async function authedGet(
  url: string,
  router: ReturnType<typeof useRouter>,
  extraConfig: Record<string, any> = {}
): Promise<any | null> {
  const token = localStorage.getItem('token')
  try {
    return await api.get(url, { headers: { Authorization: `Bearer ${token}` }, ...extraConfig })
  } catch (err: any) {
    if (err.response?.status === 401) {
      const newToken = await refreshAccessToken()
      if (!newToken) {
        clearAuthAndRedirect(router)
        return null
      }
      try {
        return await api.get(url, { headers: { Authorization: `Bearer ${newToken}` }, ...extraConfig })
      } catch (retryErr: any) {
        if (retryErr.response?.status === 401) {
          clearAuthAndRedirect(router)
          return null
        }
        throw retryErr
      }
    }
    throw err
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function InternshipPage() {
  const { t } = useApp()

  const router = useRouter()

  const [internships, setInternships]       = useState<Internship[]>([])
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState<string | null>(null)
  const [searchQuery, setSearchQuery]       = useState('')
  const [locationFilter, setLocationFilter] = useState('all')
  const [typeFilter, setTypeFilter]         = useState('all')
  const [sidebarOpen, setSidebarOpen]       = useState(false)
  const [applyingIds, setApplyingIds]       = useState<Set<number>>(new Set())

  // ── shared applied state across pages ────────────────────────────────────
  const { isApplied, markApplied } = useAppliedInternships()

  useEffect(() => { fetchInternships() }, [])

  // ─────────────────────────────────────────────────────────────────────────
  // MATCH SCORES — GET /Student/Internships/get/matchscore
  // Single bulk call, response: { message, data: [{ InternshipId, Score }] }
  // Score is 0.0-1.0 -> convert to 0-100 for display.
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!internships.length) return
    if (internships.every(i => i.matchScore !== null)) return

    const fetchMatchScores = async () => {
      try {
        const res = await authedGet('/Student/Internships/get/matchscore', router)
        if (!res) return // already redirected to /login

        const rawList: RawMatchScoreItem[] | null = res.data?.data ?? null
        if (!rawList) {
          // Data null = no open internships to score against -> leave as is
          return
        }

        const scoreMap = new Map<number, number>()
        rawList.forEach(item => {
          scoreMap.set(item.internshipId, Math.round((item.score ?? 0) * 100))
        })

        setInternships(prev =>
          prev.map(i => ({
            ...i,
            matchScore: scoreMap.has(i.id) ? scoreMap.get(i.id)! : i.matchScore,
          }))
        )
      } catch (err) {
        console.warn('[fetchMatchScores] Failed, keeping existing/mock scores:', err)
      }
    }

    fetchMatchScores()
  }, [internships.length])

  // ─────────────────────────────────────────────────────────────────────────
  // FETCH — GET /Student/Internships
  // Response: { Message, data: [...] } (lowercase "data")
  // ─────────────────────────────────────────────────────────────────────────

  const fetchInternships = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await authedGet('/Student/Internships', router)
      if (!res) return // already redirected to /login

      const rawList: RawInternshipListItem[] | null = res.data?.data ?? res.data?.Data ?? null

      // Data null -> backend has no open internships -> empty state
      if (rawList === null) {
        setInternships([])
        return
      }

      const validated = rawList
        .map((item, idx) => {
          try { return normaliseListItem(item) }
          catch (e) { console.warn(`[internships] Skipping item[${idx}]:`, e); return null }
        })
        .filter(Boolean) as Internship[]

      setInternships(validated)
    } catch (err: any) {
      console.warn('[fetchInternships] Failed, falling back to mock data:', err)
      await new Promise(r => setTimeout(r, 200))
      setInternships(MOCK_INTERNSHIPS)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (internshipId: number) => {
    if (applyingIds.has(internshipId)) return
    setApplyingIds(prev => new Set(prev).add(internshipId))

    const doApply = (accessToken: string | null) =>
      api.post(
        `/Student/Internships/internship/apply/${internshipId}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          transformResponse: (data) => data, // backend returns plain text
        }
      )

    try {
      let token = localStorage.getItem('token')

      try {
        const res = await doApply(token)
        const message = typeof res.data === 'string' ? res.data : 'Application submitted successfully.'
        markApplied(internshipId)
        alert(message)
      } catch (apiErr: any) {
        if (apiErr.response?.status === 401) {
          const newToken = await refreshAccessToken()
          if (!newToken) {
            clearAuthAndRedirect(router)
            return
          }
          try {
            const retryRes = await doApply(newToken)
            const message = typeof retryRes.data === 'string' ? retryRes.data : 'Application submitted successfully.'
            markApplied(internshipId)
            alert(message)
          } catch (retryErr: any) {
            if (retryErr.response?.status === 401) {
              clearAuthAndRedirect(router)
              return
            }
            throw retryErr
          }
        } else if (apiErr.response?.status === 409) {
          // Duplicate application — backend says already applied
          markApplied(internshipId)
          alert('Already applied to this internship.')
        } else if (apiErr.response?.status === 400 || apiErr.response?.status === 404) {
          const msg = typeof apiErr.response?.data === 'string'
            ? apiErr.response.data
            : 'Unable to apply to this internship.'
          alert(msg)
        } else {
          console.warn(`[handleApply] API failed, simulating local success:`, apiErr)
          markApplied(internshipId)
        }
      }
    } catch (err: any) {
      console.error('[handleApply]', err)
      alert(err.message ?? 'Failed to submit application. Please try again.')
    } finally {
      setApplyingIds(prev => {
        const next = new Set(prev)
        next.delete(internshipId)
        return next
      })
    }
  }

  const filteredInternships = internships.filter(i => {
    const q = searchQuery.toLowerCase()
    return (
      (!q || i.title.toLowerCase().includes(q) || i.company.toLowerCase().includes(q)) &&
      (locationFilter === 'all' || i.location.toLowerCase() === locationFilter.toLowerCase()) &&
      (typeFilter === 'all'     || i.workType.toLowerCase()  === typeFilter.toLowerCase())
    )
  })



  if (loading) {
    return <LoadingScreen />
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <AlertCircle size={20} style={{ color: '#ef4444', flexShrink: 0 }} />
        <span style={{ color: '#ef4444' }}>{error}</span>
        <button
          onClick={fetchInternships}
          style={{
            marginLeft: '1rem', padding: '0.5rem 1rem',
            background: '#3b82f6', color: 'white',
            border: 'none', borderRadius: '0.5rem',
            cursor: 'pointer', fontWeight: 600,
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className={styles.appLayout}>
      <div className={styles.glow}          aria-hidden="true" />
      <div className={styles.glowSecondary} aria-hidden="true" />
      <div className={styles.glowTertiary}  aria-hidden="true" />

      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.logoSection}>
          <div className={styles.backButton} onClick={() => router.push('/student/dashboard')}>
            <ChevronLeft size={20} />
          </div>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>IW</div>
            <span className={styles.logoText}>InternWay</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <Link href="/student/dashboard"   className={styles.navItem}><LayoutDashboard size={20} /><span>{t.dashboard}</span></Link>
          <Link href="/student/internships" className={`${styles.navItem} ${styles.active}`}><Briefcase size={20} /><span>{t.internships}</span></Link>
          <Link href="/student/mentorships" className={styles.navItem}><Users size={20} /><span>{t.mentorships}</span></Link>
          <Link href="/student/sessions"    className={styles.navItem}><Video size={20} /><span>{t.mySessions}</span></Link>
          <Link href="/student/profile"     className={styles.navItem}><UserCircle size={20} /><span>{t.profile}</span></Link>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topBar}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{t.browseInternships}</h1>
            <p className={styles.pageSubtitle}>{t.perfectOpportunity}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button className={styles.hamburgerBtn} onClick={() => setSidebarOpen(p => !p)} aria-label="Toggle menu">
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <TopBarControls />
          </div>
        </header>

        <div className={styles.searchSection}>
          <div className={styles.searchFilterRow}>
            <div className={styles.searchBar}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder={t.searchInternships}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <select className={styles.filterSelect} value={locationFilter} onChange={e => setLocationFilter(e.target.value)} aria-label="Filter by location">
              <option value="all">{t.allLocations}</option>
              <option value="cairo">Cairo</option>
              <option value="alexandria">Alexandria</option>
              <option value="giza">Giza</option>
              <option value="remote">Remote</option>
            </select>
            <select className={styles.filterSelect} value={typeFilter} onChange={e => setTypeFilter(e.target.value)} aria-label="Filter by work type">
              <option value="all">{t.allTypes}</option>
              <option value="remote">{t.remote}</option>
              <option value="hybrid">{t.hybrid}</option>
              <option value="on-site">{t.onSite}</option>
            </select>
          </div>
        </div>

        <div className={styles.internshipsGrid}>
          {filteredInternships.length === 0 ? (
            <div className={styles.emptyMessage}>No internships found matching your search.</div>
          ) : (
            filteredInternships.map(internship => {
              const deadlinePassed = isDeadlinePassed(internship.deadlineDate)
              const alreadyApplied = isApplied(internship.id)        // ← من الـ hook
              const isApplying     = applyingIds.has(internship.id)
              const applyDisabled  = deadlinePassed || alreadyApplied || isApplying

              return (
                <div key={internship.id} className={styles.internshipCard}>

                  <div className={styles.companyAvatar} style={{ backgroundColor: internship.avatarColor }}>
                    {internship.avatar}
                  </div>

                  <div className={styles.cardMainContent}>
                    <div className={styles.cardHeader}>
                      <div>
                        <h3 className={styles.internshipTitle}>{internship.title}</h3>
                        <p className={styles.companyName}>{internship.company}</p>
                      </div>
                    </div>

                    <div className={styles.metaRow}>
                      <div className={styles.metaItem}>
                        <MapPin size={13} />
                        <span>{internship.location} · {internship.workType}</span>
                      </div>
                      <div className={styles.metaItem} style={{ color: internship.salaryColor }}>
                        <span>{internship.salary}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <Clock size={13} />
                        <span>{internship.duration}</span>
                      </div>
                    </div>

                    <div className={styles.skillsRow}>
                      {internship.skills.map((skill, i) => (
                        <span key={i} className={styles.skillBadge}>{skill}</span>
                      ))}
                    </div>

                    <div className={styles.deadlineText}>{t.deadline}: {internship.deadline}</div>

                    <div className={styles.cardActions}>
                      <button
                        className={styles.applyButton}
                        onClick={() => handleApply(internship.id)}
                        disabled={applyDisabled}
                        title={
                          deadlinePassed ? 'Deadline has passed' :
                          alreadyApplied ? 'Already applied'     :
                          undefined
                        }
                        style={{
                          display:     'inline-flex',
                          alignItems:  'center',
                          justifyContent: 'center',
                          gap:         6,
                          opacity:     applyDisabled ? 0.5 : 1,
                          cursor:      applyDisabled ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {alreadyApplied ? (
                          <><Check size={14} /> Applied</>
                        ) : isApplying ? (
                          'Applying…'
                        ) : (
                          <> Apply Now</>
                        )}
                      </button>

                      <Link
                        href={`/student/internships/${internship.id}`}
                        className={styles.detailsButton}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                      >
                        View Details <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>

                  <div className={styles.matchScore}>
                    <div className={styles.matchPercentage}>
                      {internship.matchScore !== null ? `${internship.matchScore}%` : '—'}
                    </div>
                    <div className={styles.matchLabel}>Match Score</div>
                  </div>

                </div>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}

export default InternshipPage
