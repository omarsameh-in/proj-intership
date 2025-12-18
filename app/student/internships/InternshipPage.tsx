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
  Clock
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import styles from './InternshipsStyle.module.css'

function InternshipPage() {
  const { theme, toggleTheme, language, setLanguage, t } = useApp()
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const router = useRouter()

  const [internships, setInternships] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    fetchInternships()
  }, [])

  const fetchInternships = async () => {
    try {
      setLoading(true)
      setError(null)

      // Mock data - load instantly
      setInternships([
        {
          id: 1,
          title: 'Frontend Developer Intern',
          company: 'Tech Corp',
          avatar: 'TC',
          avatarColor: '#5B8DEF',
          location: 'Cairo',
          workType: 'Remote',
          duration: '3 months',
          salary: '$ 5,000 EGP/month',
          deadline: 'Dec 30, 2024',
          matchScore: 95,
          skills: ['React', 'TypeScript', 'CSS'],
        },
        {
          id: 2,
          title: 'UI/UX Designer Intern',
          company: 'Digital Solutions',
          avatar: 'DS',
          avatarColor: '#9D7CEF',
          location: 'Alexandria',
          workType: 'Hybrid',
          duration: '4 months',
          salary: '$ 4,500 EGP/month',
          deadline: 'Jan 15, 2025',
          matchScore: 88,
          skills: ['Figma', 'Adobe XD', 'Prototyping'],
        },
        {
          id: 3,
          title: 'Full Stack Developer',
          company: 'Innovation Hub',
          avatar: 'IH',
          avatarColor: '#8B5FE8',
          location: 'Remote',
          workType: 'Remote',
          duration: '6 months',
          salary: '$ Unpaid',
          salaryColor: '#EF5B5B',
          deadline: 'Jan 20, 2025',
          matchScore: 82,
          skills: ['Node.js', 'MongoDB', 'React'],
        },
        {
          id: 4,
          title: 'Data Analyst Intern',
          company: 'Startup Labs',
          avatar: 'SL',
          avatarColor: '#7C9FEF',
          location: 'Giza',
          workType: 'On-site',
          duration: '3 months',
          salary: '$ 6,000 EGP/month',
          salaryColor: '#10B981',
          deadline: 'Dec 25, 2024',
          matchScore: 75,
          skills: ['Python', 'SQL', 'Excel'],
        },
      ])
      setLoading(false)
    } catch (err: any) {
      console.error('Error fetching internships:', err)
      setError('Failed to load internships. Please try again.')
      setLoading(false)
    }
  }

  const handleApply = async (internshipId: number) => {
    alert('Application submitted successfully!')
  }

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLocation = locationFilter === 'all' || internship.location.toLowerCase() === locationFilter.toLowerCase()
    const matchesType = typeFilter === 'all' || internship.workType.toLowerCase() === typeFilter.toLowerCase()
    return matchesSearch && matchesLocation && matchesType
  })

  const changeLanguage = (lang: 'en' | 'ar') => {
    setLanguage(lang)
    setShowLanguageMenu(false)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ color: '#9ca3af' }}>Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', color: '#ef4444' }}>
        {error}
        <button onClick={fetchInternships} style={{ marginLeft: '1rem' }}>Retry</button>
      </div>
    )
  }

  return (
    <div className={styles.appLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
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
          <Link href="/student/dashboard" className={styles.navItem}>
            <LayoutDashboard size={20} />
            <span>{t.dashboard}</span>
          </Link>
          <Link href="/student/internships" className={`${styles.navItem} ${styles.active}`}>
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
          <Link href="/student/sessions" className={styles.navItem}>
            <Video size={20} />
            <span>{t.mySessions}</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.topBar}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{t.browseInternships}</h1>
            <p className={styles.pageSubtitle}>{t.perfectOpportunity}</p>
          </div>

          <div className={styles.topBarControls}>
            <div className={styles.languageWrapper}>
              <button className={styles.iconButton} onClick={() => setShowLanguageMenu(!showLanguageMenu)} title="Change Language">
                <Globe size={20} />
              </button>
              <div className={`${styles.languageMenu} ${showLanguageMenu ? styles.show : ''}`}>
                <div className={`${styles.languageOption} ${language === 'en' ? styles.active : ''}`} onClick={() => changeLanguage('en')}>
                  {language === 'en' && <Check size={16} />}
                  English
                </div>
                <div className={`${styles.languageOption} ${language === 'ar' ? styles.active : ''}`} onClick={() => changeLanguage('ar')}>
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
            <button className={styles.iconButton} onClick={() => router.push('/')} title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Search and Filters */}
        <div className={styles.searchSection}>
          <div className={styles.searchFilterRow}>
            <div className={styles.searchBar}>
              <Search size={20} className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder={t.searchInternships}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Location Filter */}
            <select
              className={styles.filterSelect}
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              aria-label="Filter by location"
            >
              <option value="all">{t.allLocations}</option>
              <option value="cairo">Cairo</option>
              <option value="alexandria">Alexandria</option>
              <option value="giza">Giza</option>
              <option value="remote">Remote</option>
            </select>

            {/* Type Filter */}
            <select
              className={styles.filterSelect}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter by work type"
            >
              <option value="all">{t.allTypes}</option>
              <option value="remote">{t.remote}</option>
              <option value="hybrid">{t.hybrid}</option>
              <option value="on-site">{t.onSite}</option>
            </select>
          </div>
        </div>

        {/* Internships List */}
        <div className={styles.internshipsGrid}>
          {filteredInternships.map((internship) => (
            <div key={internship.id} className={styles.internshipCard}>
              {/* Avatar */}
              <div
                className={styles.companyAvatar}
                style={{ backgroundColor: internship.avatarColor }}
              >
                {internship.avatar}
              </div>

              {/* Main Content */}
              <div className={styles.cardMainContent}>
                <div className={styles.cardHeader}>
                  <div>
                    <h3 className={styles.internshipTitle}>{internship.title}</h3>
                    <p className={styles.companyName}>{internship.company}</p>
                  </div>
                </div>

                <div className={styles.metaRow}>
                  <div className={styles.metaItem}>
                    <MapPin size={14} />
                    <span>{internship.location} • {internship.workType}</span>
                  </div>
                  <div
                    className={styles.metaItem}
                    style={{ color: internship.salaryColor || '#10B981' }}
                  >
                    <span>{internship.salary}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Clock size={14} />
                    <span>{internship.duration}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className={styles.skillsRow}>
                  {internship.skills.map((skill: string, index: number) => (
                    <span key={index} className={styles.skillBadge}>{skill}</span>
                  ))}
                </div>

                <div className={styles.deadlineText}>
                  {t.deadline}: {internship.deadline}
                </div>

                {/* Action Buttons */}
                <div className={styles.cardActions}>
                  <button
                    className={styles.applyButton}
                    onClick={() => handleApply(internship.id)}
                  >
                    {t.applyNow}
                  </button>
                  <button className={styles.detailsButton}>
                    View Details
                  </button>
                </div>
              </div>

              {/* Match Score */}
              <div className={styles.matchScore}>
                <div className={styles.matchPercentage}>{internship.matchScore}%</div>
                <div className={styles.matchLabel}>Match Score</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default InternshipPage
