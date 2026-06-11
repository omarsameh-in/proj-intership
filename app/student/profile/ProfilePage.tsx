'use client'

import { useEffect,  useState } from 'react'
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
    Upload,
    Plus,
    X,
    User,
    GraduationCap,
    Edit
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import TopBarControls from '../../components/TopBarControls/TopBarControls'
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen'
import styles from './ProfileStyle.module.css'

function ProfilePage() {
    const { theme, toggleTheme, language, setLanguage, t } = useApp()
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 200)
        return () => clearTimeout(timer)
    }, [])

    const [profileData, setProfileData] = useState({
        name: "Ahmed Mohamed",
        email: "ahmed@example.com",
        phoneNumber: "+20 123 456 7890",
        location: "Cairo, Egypt",
        university: "Cairo University",
        college: "Faculty of Engineering",
        major: "Computer Science",
        graduationYear: "2025",
        skills: ["React", "TypeScript", "Node.js", "Python"],
    })
    const [editData, setEditData] = useState({ ...profileData })
    const [isEditing, setIsEditing] = useState(false)
    const [newSkill, setNewSkill] = useState("")
    const [cvFile, setCvFile] = useState<File | null>(null)

    const handleEdit = () => {
        setEditData({ ...profileData })
        setIsEditing(true)
    }

    const handleCancel = () => {
        setIsEditing(false)
    }

    const handleSaveProfile = () => {
        setProfileData({ ...editData })
        setIsEditing(false)
    }

    const handleFieldChange = (field: keyof Omit<typeof editData, 'skills'>, value: string) => {
        setEditData(prev => ({ ...prev, [field]: value }))
    }

    const displayed = isEditing ? editData : profileData

    const handleSkillAdd = () => {
        if (newSkill && !editData.skills.includes(newSkill)) {
            setEditData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }))
            setNewSkill("")
        }
    }

    const handleSkillRemove = (skillToRemove: string) => {
        setEditData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }))
    }

    if (loading) {
        return <LoadingScreen />
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && (file.type === 'application/pdf' ||
            file.type === 'application/msword' ||
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
            setCvFile(file)
        } else {
            alert('Please upload a PDF, DOC, or DOCX file')
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()

        const file = e.dataTransfer.files?.[0]
        if (file && (file.type === 'application/pdf' ||
            file.type === 'application/msword' ||
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
            setCvFile(file)
        } else {
            alert('Please upload a PDF, DOC, or DOCX file')
        }
    }

    const handleUploadClick = () => {
        document.getElementById('cv-file-input')?.click()
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
                    <Link href="/student/mentorships" className={styles.navItem}>
                        <Users size={20} />
                        <span>{t.mentorships}</span>
                    </Link>
                    <Link href="/student/profile" className={`${styles.navItem} ${styles.active}`}>
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
                        <h1 className={styles.pageTitle}>{t.myProfile}</h1>
                        <p className={styles.pageSubtitle}>{t.updateInfo}</p>
                    </div>

                    <TopBarControls />
                </header>

                <div className={styles.editBarTop}>
                    {!isEditing ? (
                        <button className={styles.editProfileBtn} onClick={handleEdit}>
                            <Edit size={16} />
                            {t.editProfile}
                        </button>
                    ) : (
                        <div className={styles.editActionBtns}>
                            <button className={styles.cancelEditBtn} onClick={handleCancel}>
                                <X size={16} />
                                {t.cancel ?? 'Cancel'}
                            </button>
                            <button className={styles.saveEditBtn} onClick={handleSaveProfile}>
                                <Check size={16} />
                                {t.saveChanges}
                            </button>
                        </div>
                    )}
                </div>

                <div className={styles.card}>
                    <div className={styles.profileSection}>
                        {/* Personal Information Section */}
                        <div className={styles.sectionContainer}>
                            <div className={styles.sectionHeader}>
                                <User size={20} />
                                <h3>{t.personalInformation}</h3>
                            </div>
                            <div className={styles.twoColumnGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>{t.fullNameLabel}</label>
                                    <input type="text" className={styles.input} value={displayed.name}
                                        onChange={(e) => handleFieldChange('name', e.target.value)}
                                        readOnly={!isEditing} placeholder={t.fullNameLabel} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>{t.emailAddress}</label>
                                    <input type="email" className={styles.input} value={displayed.email}
                                        onChange={(e) => handleFieldChange('email', e.target.value)}
                                        readOnly={!isEditing} placeholder={t.emailPlaceholder} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>{t.phoneNumberLabel}</label>
                                    <input type="tel" className={styles.input} value={displayed.phoneNumber}
                                        onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
                                        readOnly={!isEditing} placeholder={t.phoneNumberPlaceholder} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>{t.locationLabel}</label>
                                    <input type="text" className={styles.input} value={displayed.location}
                                        onChange={(e) => handleFieldChange('location', e.target.value)}
                                        readOnly={!isEditing} placeholder={t.locationPlaceholder} />
                                </div>
                            </div>
                        </div>

                        {/* Education Section */}
                        <div className={styles.sectionContainer}>
                            <div className={styles.sectionHeader}>
                                <GraduationCap size={20} />
                                <h3>{t.education}</h3>
                            </div>
                            <div className={styles.twoColumnGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>{t.universityLabel}</label>
                                    <input type="text" className={styles.input} value={displayed.university}
                                        onChange={(e) => handleFieldChange('university', e.target.value)}
                                        readOnly={!isEditing} placeholder={t.universityPlaceholder} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>{t.collegeLabel}</label>
                                    <input type="text" className={styles.input} value={displayed.college}
                                        onChange={(e) => handleFieldChange('college', e.target.value)}
                                        readOnly={!isEditing} placeholder={t.collegePlaceholder} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>{t.majorLabel}</label>
                                    <input type="text" className={styles.input} value={displayed.major}
                                        onChange={(e) => handleFieldChange('major', e.target.value)}
                                        readOnly={!isEditing} placeholder={t.majorPlaceholder} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>{t.graduationYearLabel}</label>
                                    <input type="text" className={styles.input} value={displayed.graduationYear}
                                        onChange={(e) => handleFieldChange('graduationYear', e.target.value)}
                                        readOnly={!isEditing} placeholder={t.graduationYearPlaceholder} />
                                </div>
                            </div>
                        </div>

                        {/* Upload CV Section */}
                        <div className={styles.sectionContainer}>
                            <h3 className={styles.uploadSectionTitle}>{t.uploadCvTitle}</h3>
                            <input
                                id="cv-file-input"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileSelect}
                                className={styles.hiddenFileInput}
                                aria-label={t.uploadCvTitle}
                            />
                            <div
                                className={styles.uploadArea}
                                onClick={handleUploadClick}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                <Upload size={48} className={styles.uploadIcon} />
                                {cvFile ? (
                                    <>
                                        <p className={styles.uploadText}>{t.fileSelected} {cvFile.name}</p>
                                        <p className={styles.uploadSubtext}>{t.clickToChange}</p>
                                    </>
                                ) : (
                                    <>
                                        <p className={styles.uploadText}>{t.dragDropCv}</p>
                                        <p className={styles.uploadSubtext}>{t.clickBrowse}</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Skills Section */}
                        <div className={styles.sectionContainer}>
                            <h3 className={styles.uploadSectionTitle}>{t.skillsLabel}</h3>
                            <div className={styles.skillsContainer}>
                                {displayed.skills.map((skill) => (
                                    <span key={skill} className={styles.skillBadge}>
                                        {skill}
                                        {isEditing && (
                                            <button className={styles.removeSkillBtn} onClick={() => handleSkillRemove(skill)} title={`Remove ${skill}`}>
                                                <X size={14} />
                                            </button>
                                        )}
                                    </span>
                                ))}
                            </div>

                            {isEditing && (
                                <div className={styles.addSkillContainer}>
                                    <input type="text" className={styles.input} placeholder={t.addSkillPlaceholder}
                                        value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSkillAdd()} />
                                    <button className={styles.addButton} onClick={handleSkillAdd}>{t.addButton}</button>
                                </div>
                            )}
                        </div>

                        {/* No bottom save button - handled by editBarTop */}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ProfilePage
