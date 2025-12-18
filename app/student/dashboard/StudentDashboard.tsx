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
  Star
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import styles from './DashboardStyle.module.css'

function StudentDashboard() {
  const { theme, toggleTheme, language, setLanguage, t } = useApp()
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const router = useRouter()

  const [internships, setInternships] = useState<any[]>([])
  const [mentors, setMentors] = useState<any[]>([])
  const [stats, setStats] = useState({
    appliedInternships: 0,
    sessionsBooked: 0,
    upcomingSession: 'No sessions'
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Mock data - load instantly
      setInternships([
        {
          id: 1,
          title: 'Frontend Developer',
          company: 'Tech Corp',
          location: 'Cairo',
          match: 95
        },
        {
          id: 2,
          title: 'UI/UX Designer',
          company: 'Digital Solutions',
          location: 'Alexandria',
          match: 88
        },
        {
          id: 3,
          title: 'Full Stack Developer',
          company: 'Innovation Hub',
          location: 'Remote',
          match: 82
        }
      ])

      setMentors([
        {
          id: 1,
          name: 'Dr. Ahmed Hassan',
          field: 'Software Engineering',
          rating: 4.9,
          experience: '15 years',
          available: true
        },
        {
          id: 2,
          name: 'Eng. Sara Mohamed',
          field: 'Data Science',
          rating: 4.8,
          experience: '10 years',
          available: true
        },
        {
          id: 3,
          name: 'Prof. Karim Ali',
          field: 'AI & Machine Learning',
          rating: 4.7,
          experience: '12 years',
          available: false
        }
      ])

      setStats({
        appliedInternships: 12,
        sessionsBooked: 8,
        upcomingSession: 'Tomorrow 3PM'
      })

      setLoading(false)
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err)
      setError('Failed to load dashboard data. Please try again.')
      setLoading(false)
    }
  }

  const handleApplyInternship = async (internshipId: number) => {
    alert('Application submitted successfully!')
    fetchDashboardData()
  }

  const handleBookSession = async (mentorId: number) => {
    alert('Session booked successfully!')
    fetchDashboardData()
  }

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
        <button onClick={fetchDashboardData} style={{ marginLeft: '1rem', padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className={styles.appLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <div className={styles.backButton} onClick={() => router.push('/')}>
            <ChevronLeft size={20} />
          </div>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>IW</div>
            <span className={styles.logoText}>InternWay</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <Link href="/student/dashboard" className={`${styles.navItem} ${styles.active}`}>
            <LayoutDashboard size={20} />
            <span>{t.dashboard}</span>
          </Link>
          <Link href="/student/internships" className={styles.navItem}>
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
        {/* Top Bar */}
        <header className={styles.topBar}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{t.welcomeBack}</h1>
            <p className={styles.pageSubtitle}>{t.careerJourney}</p>
          </div>

          {/* Controls */}
          <div className={styles.topBarControls}>
            <div className={styles.languageWrapper}>
              <button
                className={styles.iconButton}
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                title="Change Language"
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

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Briefcase size={24} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>{t.internshipsApplied}</div>
              <div className={styles.statValue}>{stats.appliedInternships}</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Video size={24} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>{t.sessionsBooked}</div>
              <div className={styles.statValue}>{stats.sessionsBooked}</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Star size={24} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>{t.upcomingSession}</div>
              <div className={styles.statValue}>{stats.upcomingSession}</div>
            </div>
          </div>
        </div>

        {/* Recommended Internships */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t.recommendedInternships}</h2>
          <div className={styles.cardsGrid}>
            {internships.length > 0 ? (
              internships.map((internship) => (
                <div key={internship.id} className={styles.card}>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{internship.title}</h3>
                    <p className={styles.cardSubtitle}>{internship.company} • {internship.location}</p>
                    <div className={styles.matchBadge}>
                      {internship.match}% {t.match}
                    </div>
                  </div>
                  <button
                    className={styles.primaryButton}
                    onClick={() => handleApplyInternship(internship.id)}
                  >
                    {t.applyNow}
                  </button>
                </div>
              ))
            ) : (
              <p className={styles.emptyMessage}>{t.noRecommendedInternships}</p>
            )}
          </div>
        </section>

        {/* Recommended Mentors */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t.recommendedMentors}</h2>
          <div className={styles.mentorsGrid}>
            {mentors.length > 0 ? (
              mentors.map((mentor) => (
                <div key={mentor.id} className={styles.mentorCard}>
                  <div className={styles.mentorAvatar}>
                    <UserCircle size={48} />
                  </div>
                  <div className={styles.mentorInfo}>
                    <h3 className={styles.mentorName}>{mentor.name}</h3>
                    <p className={styles.mentorField}>{mentor.field}</p>
                    <div className={styles.mentorRating}>
                      <Star size={14} />
                      <span>{mentor.rating} • {mentor.experience}</span>
                    </div>
                  </div>
                  <button
                    className={mentor.available ? styles.primaryButton : styles.disabledButton}
                    disabled={!mentor.available}
                    onClick={() => mentor.available && handleBookSession(mentor.id)}
                  >
                    {mentor.available ? t.bookSession : t.unavailable}
                  </button>
                </div>
              ))
            ) : (
              <p className={styles.emptyMessage}>{t.noRecommendedMentors}</p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default StudentDashboard