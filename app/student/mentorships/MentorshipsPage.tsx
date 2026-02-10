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
    Star,
    Search,
    Calendar,
    Clock
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import styles from './MentorshipsStyle.module.css'

interface Mentor {
    id: number
    name: string
    title: string
    expertise: string[]
    experience: number
    rating: number
    reviews: number
    bio: string
    nextAvailable?: {
        date: string
        time: string
    }
    isAvailable: boolean
}

const mockMentors: Mentor[] = [
    {
        id: 1,
        name: 'Dr. Ahmed Hassan',
        title: 'Senior Software Engineer',
        expertise: ['React', 'Node.js', 'System Design', 'Career Growth'],
        experience: 5,
        rating: 4.9,
        reviews: 127,
        bio: 'Passionate about mentoring young developers and helping them navigate their career paths.',
        nextAvailable: {
            date: 'Tomorrow',
            time: '3PM'
        },
        isAvailable: true
    },
    {
        id: 2,
        name: 'Eng. Sara Mohamed',
        title: 'Lead Data Scientist',
        expertise: ['Python', 'Machine Learning', 'Data Analysis', 'AI'],
        experience: 10,
        rating: 4.8,
        reviews: 89,
        bio: 'Helping aspiring data scientists break into the field with practical guidance.',
        nextAvailable: {
            date: 'Dec 28',
            time: '10AM'
        },
        isAvailable: true
    },
    {
        id: 3,
        name: 'Prof. Karim Ali',
        title: 'AI Research Director',
        expertise: ['Deep Learning', 'NLP', 'Computer Vision', 'Research'],
        experience: 12,
        rating: 4.7,
        reviews: 156,
        bio: 'Research-focused mentor specializing in cutting-edge AI technologies.',
        isAvailable: false
    },
    {
        id: 4,
        name: 'Eng. Nour Khaled',
        title: 'UX/UI Design Lead',
        expertise: ['Figma', 'User Research', 'Design Systems', 'Portfolio'],
        experience: 8,
        rating: 4.9,
        reviews: 189,
        bio: 'Helping designers build stunning portfolios and land their dream jobs.',
        nextAvailable: {
            date: 'Dec 27',
            time: '2PM'
        },
        isAvailable: true
    }
]

function MentorshipsPage() {
    const { theme, toggleTheme, language, setLanguage, t } = useApp()
    const [showLanguageMenu, setShowLanguageMenu] = useState(false)
    const router = useRouter()
    const [mentors, setMentors] = useState<Mentor[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedField, setSelectedField] = useState('all')

    useEffect(() => {
        // Load data instantly
        setMentors(mockMentors)
        setLoading(false)
    }, [])

    const handleBookSession = (mentor: Mentor) => {
        alert(`Booking session with ${mentor.name}`)
    }

    const changeLanguage = (lang: 'en' | 'ar') => {
        setLanguage(lang)
        setShowLanguageMenu(false)
    }

    // Filter mentors based on search query and selected field
    const filteredMentors = mentors.filter(mentor => {
        const matchesSearch =
            mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mentor.expertise.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))

        let matchesField = true
        if (selectedField !== 'all') {
            const expertiseStr = mentor.expertise.join(' ').toLowerCase()
            const titleStr = mentor.title.toLowerCase()

            switch (selectedField) {
                case 'software':
                    matchesField = expertiseStr.includes('react') || expertiseStr.includes('node') ||
                        expertiseStr.includes('system') || titleStr.includes('software')
                    break
                case 'data':
                    matchesField = expertiseStr.includes('data') || expertiseStr.includes('python') ||
                        titleStr.includes('data')
                    break
                case 'ai':
                    matchesField = expertiseStr.includes('ai') || expertiseStr.includes('machine') ||
                        expertiseStr.includes('learning') || expertiseStr.includes('deep') ||
                        expertiseStr.includes('nlp') || titleStr.includes('ai')
                    break
                case 'design':
                    matchesField = expertiseStr.includes('design') || expertiseStr.includes('figma') ||
                        expertiseStr.includes('ux') || titleStr.includes('design')
                    break
            }
        }

        return matchesSearch && matchesField
    })

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingText}>Loading...</div>
            </div>
        )
    }

    return (
        <div className={styles.appLayout}>
            <div className={styles.glow} aria-hidden="true" />
            <div className={styles.glowSecondary} aria-hidden="true" />
            <div className={styles.glowTertiary} aria-hidden="true" />
            <aside className={styles.sidebar}>
                <div className={styles.logoSection}>
                    <div className={styles.backButton} onClick={() => router.push('/student/dashboard')} role="button" title="Back to Dashboard">
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
                    <Link href="/student/internships" className={styles.navItem}>
                        <Briefcase size={20} />
                        <span>{t.internships}</span>
                    </Link>
                    <Link href="/student/mentorships" className={`${styles.navItem} ${styles.active}`}>
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

            <main className={styles.mainContent}>
                <header className={styles.topBar}>
                    <div className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>{t.findMentor}</h1>
                        <p className={styles.pageSubtitle}>{t.connectWithProfessionals}</p>
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

                {/* Search and Filter Section */}
                <div className={styles.searchFilterSection}>
                    <div className={styles.searchBarWrapper}>
                        <Search className={styles.searchIcon} size={20} />
                        <input
                            type="text"
                            placeholder={t.searchMentors}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchBar}
                        />
                    </div>
                    <select
                        value={selectedField}
                        onChange={(e) => setSelectedField(e.target.value)}
                        className={styles.filterDropdown}
                        aria-label="Filter by field"
                    >
                        <option value="all">{t.allFields}</option>
                        <option value="software">Software Engineering</option>
                        <option value="data">Data Science</option>
                        <option value="ai">AI & ML</option>
                        <option value="design">Design</option>
                    </select>
                </div>

                {/* Mentors Grid */}
                <div className={styles.mentorsGrid}>
                    {filteredMentors.length > 0 ? (
                        filteredMentors.map((mentor) => (
                            <div key={mentor.id} className={styles.mentorCardHorizontal}>
                                <div className={styles.mentorAvatarLarge}>
                                    <UserCircle size={64} />
                                </div>
                                <div className={styles.mentorDetails}>
                                    <div className={styles.mentorHeader}>
                                        <h3 className={styles.mentorName}>{mentor.name}</h3>
                                        <p className={styles.mentorField}>{mentor.title}</p>
                                    </div>
                                    <div className={styles.mentorMeta}>
                                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                                        <span className={styles.rating}>{mentor.rating}</span>
                                        <span className={styles.metaText}>({mentor.reviews} {t.reviews}) • {mentor.experience}+ {t.years}</span>
                                    </div>
                                    <p className={styles.mentorBio}>{mentor.bio}</p>
                                    <div className={styles.expertiseBadges}>
                                        <span className={styles.expertiseLabel}>{t.expertise}:</span>
                                        {mentor.expertise.map((skill, index) => (
                                            <span key={index} className={styles.expertiseBadge}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                    {mentor.nextAvailable && (
                                        <div className={styles.availabilitySection}>
                                            <Calendar size={14} />
                                            <span className={styles.availabilityLabel}>{t.nextAvailable}:</span>
                                            <span className={styles.availabilityTime}>{mentor.nextAvailable.date} {mentor.nextAvailable.time}</span>
                                        </div>
                                    )}
                                </div>
                                {mentor.isAvailable ? (
                                    <button
                                        className={styles.bookButton}
                                        onClick={() => handleBookSession(mentor)}
                                    >
                                        {t.bookSession}
                                    </button>
                                ) : (
                                    <button className={styles.unavailableButton} disabled>
                                        {t.unavailable}
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyMessage}>
                            {t.noMentorsFound}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default MentorshipsPage
