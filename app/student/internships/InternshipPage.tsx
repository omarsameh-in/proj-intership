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
  Globe,
  Moon,
  Sun,
  Bell,
  LogOut,
  Check,
  Search,
  MapPin,
  Clock,
  Menu,
  X,
  AlertCircle,
  ArrowRight,
  Send,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import styles from './InternshipsStyle.module.css'
import Notification from '../../components/Notification/Notification'
import { useAppliedInternships } from '../../hooks/useAppliedInternships'

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface RawInternshipListItem {
  internshipId:   number
  title:          string
  companyName:    string
  durationMonths: number
  locationType:   string
  city:           string
  deadline:       string
  requiredSkills: string[]
  paidStatus:     string
  price:          number
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

const ARABIC_MONTHS: Record<string, number> = {
  'يناير': 0, 'فبراير': 1, 'مارس': 2,  'أبريل': 3,
  'مايو':  4, 'يونيو':  5, 'يوليو': 6, 'أغسطس': 7,
  'سبتمبر': 8, 'أكتوبر': 9, 'نوفمبر': 10, 'ديسمبر': 11,
}

function parseArabicDeadline(raw: string): Date | null {
  try {
    const clean = raw.trim()
    const match = clean.match(/^(\S+)\s+(\d+),?\s+(\d{4})$/)
    if (!match) return null
    const [, monthAr, day, year] = match
    const monthIdx = ARABIC_MONTHS[monthAr]
    if (monthIdx === undefined) return null
    return new Date(Number(year), monthIdx, Number(day), 23, 59, 59)
  } catch {
    return null
  }
}

function normaliseListItem(raw: RawInternshipListItem): Internship {
  if (!raw || typeof raw.internshipId !== 'number') {
    throw new Error(`Invalid list item: ${JSON.stringify(raw)}`)
  }

  const isPaid       = raw.paidStatus?.toLowerCase() !== 'unpaid'
  const deadlineRaw  = raw.deadline?.trim() ?? ''
  const deadlineDate = parseArabicDeadline(deadlineRaw)

  return {
    id:           raw.internshipId,
    title:        raw.title        ?? 'Untitled Position',
    company:      raw.companyName  ?? 'Unknown Company',
    avatar:       initials(raw.companyName ?? 'XX'),
    avatarColor:  colorFromId(raw.internshipId),
    location:     raw.city         ?? 'N/A',
    workType:     raw.locationType ?? 'N/A',
    duration:     raw.durationMonths
                    ? `${raw.durationMonths} month${raw.durationMonths !== 1 ? 's' : ''}`
                    : 'N/A',
    salary:       isPaid ? `${(raw.price ?? 0).toLocaleString()} EGP/month` : 'Unpaid',
    salaryColor:  isPaid ? '#10B981' : '#EF5B5B',
    deadline:     deadlineRaw || 'N/A',
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
// MOCK DATA 
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_RAW_LIST: RawInternshipListItem[] = [
  {
    internshipId:   2,
    title:          'Backend .NET Intern',
    companyName:    'TechNova Solutions Updated',
    durationMonths: 3,
    locationType:   'Remote',
    city:           'Cairo',
    deadline:       'مايو 30, 2026',
    requiredSkills: ['c#', 'asp.net core', 'sql'],
    paidStatus:     'Paid',
    price:          2000,
  },
  {
    internshipId:   3,
    title:          'Front End',
    companyName:    'TechNova Solutions',
    durationMonths: 5,
    locationType:   'Remote',
    city:           'Cairo',
    deadline:       'مايو 30, 2026',
    requiredSkills: ['c#', 'asp.net core', 'sql'],
    paidStatus:     'Unpaid',
    price:          0,
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function InternshipPage() {
  const { theme, toggleTheme, language, setLanguage, t } = useApp()
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isLanguageButton = target.closest('button') && 
                (target.closest('button')?.querySelector('.lucide-globe') || 
                 target.closest('svg')?.classList.contains('lucide-globe') ||
                 target.closest('button')?.getAttribute('title')?.includes('Language') ||
                 target.closest('button')?.getAttribute('title')?.includes('اللغة'));
            const isLanguageMenu = target.closest('.language-menu');
            if (!isLanguageButton && !isLanguageMenu) {
                setShowLanguageMenu(false);
            }
        };
        if (showLanguageMenu) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showLanguageMenu]);

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

  useEffect(() => {
    if (!internships.length) return

    // ── BACKEND─────────
    //
    // const token = localStorage.getItem('token')
    // internships.forEach(async ({ id }) => {
    //   try {
    //     const res = await fetch(`/api/internships/${id}/match-score`, {
    //       headers: { Authorization: `Bearer ${token}` },
    //     })
    //     if (!res.ok) return
    //     const { matchScore } = await res.json()
    //     setInternships(prev =>
    //       prev.map(i => i.id === id ? { ...i, matchScore } : i)
    //     )
    //   } catch { }
    // })

    // ── MOCK match scores ─────────────────────────────────────────────────
    const mockScores: Record<number, number> = { 2: 88, 3: 76 }
    setInternships(prev =>
      prev.map(i => ({ ...i, matchScore: mockScores[i.id] ?? null }))
    )
  }, [internships.length])

  // ─────────────────────────────────────────────────────────────────────────
  // FETCH — GET /api/internships
  // ─────────────────────────────────────────────────────────────────────────

  const fetchInternships = async () => {
    setLoading(true)
    setError(null)

    try {
      // ── BACKEND ───────────────────
      //
      // const token = localStorage.getItem('token')
      // const res = await fetch('/api/internships', {
      //   headers: { Authorization: `Bearer ${token}` },
      // })
      // if (res.status === 401) { router.push('/login'); return }
      // if (res.status === 403) { setError('Not authorised.'); setLoading(false); return }
      // if (!res.ok) throw new Error(`Server error: ${res.status} ${res.statusText}`)
      //
      // const json = await res.json()
      // const rawList: RawInternshipListItem[] = json.data ?? []
      // const validated = rawList
      //   .map((item, idx) => {
      //     try   { return normaliseListItem(item) }
      //     catch (e) { console.warn(`[internships] Skipping item[${idx}]:`, e); return null }
      //   })
      //   .filter(Boolean) as Internship[]
      //
      // ── لما الباك يرجع hasApplied، seed الـ sessionStorage ───────────────
      // validated.forEach(i => { if ((i as any).hasApplied) markApplied(i.id) })
      //
      // setInternships(validated)

      // ── MOCK ──────────────────────────────────────────────────────────────
      await new Promise(r => setTimeout(r, 400))
      setInternships(MOCK_RAW_LIST.map(normaliseListItem))

    } catch (err: any) {
      console.error('[fetchInternships]', err)
      setError(err.message ?? 'Failed to load internships.')
    } finally {
      setLoading(false)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // APPLY — POST /api/internships/:id/apply
  // ─────────────────────────────────────────────────────────────────────────

  const handleApply = async (internshipId: number) => {
    if (applyingIds.has(internshipId)) return
    setApplyingIds(prev => new Set(prev).add(internshipId))

    try {
      // ── BACKEND ───────────────────
      //
      // const token = localStorage.getItem('token')
      // const res = await fetch(`/api/internships/${internshipId}/apply`, {
      //   method:  'POST',
      //   headers: {
      //     Authorization:  `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      // })
      // if (res.status === 401) { router.push('/login'); return }
      // if (!res.ok) {
      //   const body = await res.json().catch(() => ({}))
      //   throw new Error(body.message ?? `Error ${res.status}`)
      // }

      // ── MOCK ──────────────────────────────────────────────────────────────
      await new Promise(r => setTimeout(r, 600))

      // ──────────────────────────────────
      markApplied(internshipId)

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

  const changeLanguage = (lang: 'en' | 'ar') => {
    setLanguage(lang)
    setShowLanguageMenu(false)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ color: '#9ca3af', fontSize: '0.9375rem' }}>Loading internships…</div>
      </div>
    )
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
          <Link href="/student/profile"     className={styles.navItem}><UserCircle size={20} /><span>{t.profile}</span></Link>
          <Link href="/student/sessions"    className={styles.navItem}><Video size={20} /><span>{t.mySessions}</span></Link>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topBar}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{t.browseInternships}</h1>
            <p className={styles.pageSubtitle}>{t.perfectOpportunity}</p>
          </div>

          <div className={styles.topBarControls}>
            <button className={styles.hamburgerBtn} onClick={() => setSidebarOpen(p => !p)} aria-label="Toggle menu">
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div className={styles.languageWrapper}>
              <button className={styles.iconButton} onClick={() => setShowLanguageMenu(p => !p)} title="Change Language">
                <Globe size={20} />
              </button>
              <div className={`${styles.languageMenu} ${showLanguageMenu ? styles.show : ''}`}>
                <div className={`${styles.languageOption} ${language === 'en' ? styles.active : ''}`} onClick={() => changeLanguage('en')}>
                  {language === 'en' && <Check size={16} />} English
                </div>
                <div className={`${styles.languageOption} ${language === 'ar' ? styles.active : ''}`} onClick={() => changeLanguage('ar')}>
                  {language === 'ar' && <Check size={16} />} العربية
                </div>
              </div>
            </div>

            <button className={styles.iconButton} onClick={toggleTheme} title="Toggle Theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Notification />
            <button className={styles.iconButton} onClick={() => router.push('/')} title="Logout">
              <LogOut size={20} />
            </button>
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