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
    Star,
    Search,
    Calendar,
    Eye,
    X
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import TopBarControls from '../../components/TopBarControls/TopBarControls'
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen'
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
    longBio?: string
    stats?: {
        totalSessions: number
        avgResponseTime: string
        menteesHired: number
    }
    field?: string
    availableSlots?: string[]
}

const mockMentors: Mentor[] = [
    {
        id: 1,
        name: 'Dr. Ahmed Hassan',
        title: 'Senior Software Engineer',
        expertise: ['React', 'Node.js', 'System Design', 'Career Growth'],
        experience: 15,
        rating: 4.9,
        reviews: 127,
        bio: 'Passionate about mentoring young developers and helping them navigate their career paths.',
        longBio: 'Passionate about mentoring young developers and helping them navigate their career paths. I have over 15 years of experience building scalable web applications and leading engineering teams at top tech companies. My mentoring style focuses on practical, hands-on learning and preparing you for real-world engineering challenges.',
        stats: {
            totalSessions: 342,
            avgResponseTime: '< 2 hours',
            menteesHired: 45
        },
        field: 'Software Engineering',
        availableSlots: ['Tomorrow 3:00 PM', 'Monday 10:00 AM', 'Wednesday 2:00 PM'],
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
        longBio: 'Helping aspiring data scientists break into the field with practical guidance. With 10 years in data warehousing, predictive modeling, and analytics, I guide students through building portfolio projects, understanding machine learning pipelines, and preparing for technical interviews.',
        stats: {
            totalSessions: 210,
            avgResponseTime: '< 3 hours',
            menteesHired: 28
        },
        field: 'Data Science',
        availableSlots: ['Dec 28, 10:00 AM', 'Dec 29, 4:00 PM'],
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
        longBio: 'Research-focused mentor specializing in cutting-edge AI technologies, deep learning, and natural language processing. I have guided numerous academic and industry projects, helping researchers transition theory into practical models.',
        stats: {
            totalSessions: 180,
            avgResponseTime: '< 5 hours',
            menteesHired: 15
        },
        field: 'AI & ML',
        availableSlots: [],
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
        longBio: 'Helping designers build stunning portfolios and land their dream jobs. Dedicated UI/UX designer with 8 years of experience. We will focus on user research, wireframing, design systems in Figma, and how to present your design decisions to stakeholders.',
        stats: {
            totalSessions: 295,
            avgResponseTime: '< 1 hour',
            menteesHired: 38
        },
        field: 'Design',
        availableSlots: ['Dec 27, 2:00 PM', 'Dec 30, 11:00 AM'],
        nextAvailable: {
            date: 'Dec 27',
            time: '2PM'
        },
        isAvailable: true
    }
]

function MentorshipsPage() {
    const { t, language } = useApp()
    const router = useRouter()
    const [mentors, setMentors] = useState<Mentor[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedField, setSelectedField] = useState('all')

    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
    const [bookingSlot, setBookingSlot] = useState('')
    const [bookingTopic, setBookingTopic] = useState('')

    useEffect(() => {
        setMentors(mockMentors)
        setLoading(false)
    }, [])

    const handleConfirmBooking = () => {
        if (!bookingSlot || !bookingTopic) {
            alert(t.selectSlotAndTopic)
            return
        }
        alert(`${t.bookingSuccess} ${selectedMentor?.name}!`)
        setIsBookingModalOpen(false)
        setBookingSlot('')
        setBookingTopic('')
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
        return <LoadingScreen />
    }

    return (
        <div className={styles.appLayout}>
            <div className={styles.glow} aria-hidden="true" />
            <div className={styles.glowSecondary} aria-hidden="true" />
            <div className={styles.glowTertiary} aria-hidden="true" />
            <aside className={styles.sidebar}>
                <div className={styles.logoSection}>
                    <div 
                        className={styles.backButton} 
                        onClick={() => {
                            if (selectedMentor) {
                                setSelectedMentor(null)
                            } else {
                                router.push('/student/dashboard')
                            }
                        }} 
                        role="button" 
                        title={selectedMentor ? "Back to Mentors List" : "Back to Dashboard"}
                    >
                        <ChevronLeft size={20} style={{ transform: language === 'ar' ? 'rotate(180deg)' : 'none' }} />
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
                        {selectedMentor ? (
                            <div className={styles.detailBreadcrumb} onClick={() => setSelectedMentor(null)} role="button">
                                <ChevronLeft size={20} className={styles.breadcrumbBackIcon} style={{ transform: language === 'ar' ? 'rotate(180deg)' : 'none' }} />
                                <span className={styles.breadcrumbText}>{t.back}</span>
                            </div>
                        ) : (
                            <>
                                <h1 className={styles.pageTitle}>{t.findMentor}</h1>
                                <p className={styles.pageSubtitle}>{t.connectWithProfessionals}</p>
                            </>
                        )}
                    </div>

                    <TopBarControls />
                </header>

                {selectedMentor ? (
                    /* Mentor Detail View */
                    <div className={styles.detailContainer}>
                        <div className={styles.detailHeaderCard}>
                            <div className={styles.detailHeaderLeft}>
                                <div className={styles.detailAvatar}>
                                    <UserCircle size={80} />
                                </div>
                                <div className={styles.detailHeaderInfo}>
                                    <h2 className={styles.detailName}>{selectedMentor.name}</h2>
                                    <p className={styles.detailTitle}>{selectedMentor.title}</p>
                                    <div className={styles.detailMeta}>
                                        <div className={styles.detailMetaItem}>
                                            <Star size={16} fill="#fbbf24" color="#fbbf24" />
                                            <span className={styles.rating}>{selectedMentor.rating}</span>
                                            <span className={styles.metaText}>({selectedMentor.reviews} {t.reviews})</span>
                                        </div>
                                        <span className={styles.metaDivider}>|</span>
                                        <div className={styles.detailMetaItem}>
                                            <Briefcase size={16} className={styles.metaIcon} />
                                            <span className={styles.metaText}>{selectedMentor.experience} {t.years}</span>
                                        </div>
                                        <span className={styles.metaDivider}>|</span>
                                        <div className={styles.detailMetaItem}>
                                            <Calendar size={16} className={styles.metaIcon} />
                                            <span className={styles.metaText}>{selectedMentor.field || selectedMentor.title}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.detailHeaderRight}>
                                {selectedMentor.isAvailable ? (
                                    <button 
                                        className={styles.detailBookButton}
                                        onClick={() => setIsBookingModalOpen(true)}
                                    >
                                        {t.bookSession}
                                    </button>
                                ) : (
                                    <button className={styles.detailUnavailableButton} disabled>
                                        {t.unavailable}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className={styles.detailBody}>
                            <div className={styles.detailMainContent}>
                                <div className={styles.detailSection}>
                                    <h3 className={styles.detailSectionTitle}>{t.about}</h3>
                                    <p className={styles.detailLongBio}>
                                        {selectedMentor.longBio || selectedMentor.bio}
                                    </p>
                                </div>

                                <div className={styles.detailSection}>
                                    <h3 className={styles.detailSectionTitle}>{t.expertise}</h3>
                                    <div className={styles.detailExpertiseTags}>
                                        {selectedMentor.expertise.map((skill, index) => (
                                            <span key={index} className={styles.detailExpertiseTag}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.detailSidebar}>
                                <div className={styles.statsCard}>
                                    <h3 className={styles.statsCardTitle}>
                                        <Users size={18} className={styles.statsIcon} />
                                        {t.mentorStats}
                                    </h3>
                                    
                                    <div className={styles.statsList}>
                                        <div className={styles.statsItem}>
                                            <span className={styles.statsLabel}>{t.totalSessions}</span>
                                            <span className={styles.statsValue}>
                                                {selectedMentor.stats?.totalSessions || 0}
                                            </span>
                                        </div>
                                        <div className={styles.statsItem}>
                                            <span className={styles.statsLabel}>{t.avgResponseTime}</span>
                                            <span className={styles.statsValue}>
                                                {selectedMentor.stats?.avgResponseTime || 'N/A'}
                                            </span>
                                        </div>
                                        <div className={styles.statsItem}>
                                            <span className={styles.statsLabel}>{t.menteesHired}</span>
                                            <span className={styles.statsValue}>
                                                {selectedMentor.stats?.menteesHired || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Find a Mentor Listing View */
                    <>
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

                        <div className={styles.mentorsGrid}>
                            {filteredMentors.length > 0 ? (
                                filteredMentors.map((mentor) => (
                                    <div 
                                        key={mentor.id} 
                                        className={styles.mentorCardHorizontal}
                                        onClick={() => setSelectedMentor(mentor)}
                                    >
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
                                        <div className={styles.cardActions} onClick={(e) => e.stopPropagation()}>
                                            {mentor.isAvailable ? (
                                                <button
                                                    className={styles.bookButton}
                                                    onClick={() => setSelectedMentor(mentor)}
                                                >
                                                    {t.bookSession}
                                                </button>
                                            ) : (
                                                <button className={styles.unavailableButton} disabled>
                                                    {t.unavailable}
                                                </button>
                                            )}
                                            <button 
                                                className={styles.viewDetailsButton}
                                                onClick={() => setSelectedMentor(mentor)}
                                                title="View Profile"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={styles.emptyMessage}>
                                    {t.noMentorsFound}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>

            {/* Booking Modal Overlay */}
            {isBookingModalOpen && selectedMentor && (
                <div className={styles.modalOverlay} onClick={() => setIsBookingModalOpen(false)}>
                    <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>
                                {t.bookSessionWith} {selectedMentor.name}
                            </h3>
                            <button 
                                className={styles.modalCloseBtn} 
                                onClick={() => setIsBookingModalOpen(false)}
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <p className={styles.modalSubtext}>
                                Select a preferred time slot and topic for your mentorship session.
                            </p>

                            <div className={styles.formGroup}>
                                <label htmlFor="timeSlot" className={styles.formLabel}>
                                    {t.selectTimeSlot}
                                </label>
                                <select
                                    id="timeSlot"
                                    value={bookingSlot}
                                    onChange={(e) => setBookingSlot(e.target.value)}
                                    className={styles.formSelect}
                                >
                                    <option value="">{t.chooseTime}</option>
                                    {selectedMentor.availableSlots && selectedMentor.availableSlots.length > 0 ? (
                                        selectedMentor.availableSlots.map((slot, index) => (
                                            <option key={index} value={slot}>
                                                {slot}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="default">Next Available Slot</option>
                                    )}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="sessionTopic" className={styles.formLabel}>
                                    {t.sessionTopic}
                                </label>
                                <select
                                    id="sessionTopic"
                                    value={bookingTopic}
                                    onChange={(e) => setBookingTopic(e.target.value)}
                                    className={styles.formSelect}
                                >
                                    <option value="">{t.whatDiscuss}</option>
                                    <option value="career">{t.careerGuidance || "Career Guidance"}</option>
                                    <option value="resume">{t.resumeReview || "Resume Review"}</option>
                                    <option value="interview">{t.interviewPrep || "Interview Prep"}</option>
                                    <option value="tech">Technical mentorship / Q&A</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button 
                                className={styles.cancelBtn} 
                                onClick={() => setIsBookingModalOpen(false)}
                            >
                                {t.cancel}
                            </button>
                            <button 
                                className={styles.confirmBtn} 
                                onClick={handleConfirmBooking}
                            >
                                {t.confirmBooking}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MentorshipsPage
