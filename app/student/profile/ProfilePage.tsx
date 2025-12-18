'use client'

import { useState } from 'react'
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
    GraduationCap
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import styles from './ProfileStyle.module.css'

function ProfilePage() {
    const { theme, toggleTheme, language, setLanguage, t } = useApp()
    const [showLanguageMenu, setShowLanguageMenu] = useState(false)
    const router = useRouter()

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

    const [newSkill, setNewSkill] = useState("")
    const [cvFile, setCvFile] = useState<File | null>(null)

    const handleSkillAdd = () => {
        if (newSkill && !profileData.skills.includes(newSkill)) {
            setProfileData({ ...profileData, skills: [...profileData.skills, newSkill] })
            setNewSkill("")
        }
    }

    const handleSkillRemove = (skillToRemove: string) => {
        setProfileData({
            ...profileData,
            skills: profileData.skills.filter((skill) => skill !== skillToRemove),
        })
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

    const handleSaveProfile = () => {
        alert(t.profileSaved)
    }

    const changeLanguage = (lang: 'en' | 'ar') => {
        setLanguage(lang)
        setShowLanguageMenu(false)
    }

    return (
        <div className={styles.appLayout}>
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
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        placeholder={t.fullNameLabel}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>{t.emailAddress}</label>
                                    <input
                                        type="email"
                                        className={styles.input}
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        placeholder={t.emailPlaceholder}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>{t.phoneNumberLabel}</label>
                                    <input
                                        type="tel"
                                        className={styles.input}
                                        value={profileData.phoneNumber}
                                        onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                                        placeholder={t.phoneNumberPlaceholder}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>{t.locationLabel}</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={profileData.location}
                                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                        placeholder={t.locationPlaceholder}
                                    />
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
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={profileData.university}
                                        onChange={(e) => setProfileData({ ...profileData, university: e.target.value })}
                                        placeholder={t.universityPlaceholder}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>{t.collegeLabel}</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={profileData.college}
                                        onChange={(e) => setProfileData({ ...profileData, college: e.target.value })}
                                        placeholder={t.collegePlaceholder}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>{t.majorLabel}</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={profileData.major}
                                        onChange={(e) => setProfileData({ ...profileData, major: e.target.value })}
                                        placeholder={t.majorPlaceholder}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>{t.graduationYearLabel}</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={profileData.graduationYear}
                                        onChange={(e) => setProfileData({ ...profileData, graduationYear: e.target.value })}
                                        placeholder={t.graduationYearPlaceholder}
                                    />
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
                                {profileData.skills.map((skill) => (
                                    <span key={skill} className={styles.skillBadge}>
                                        {skill}
                                        <button
                                            className={styles.removeSkillBtn}
                                            onClick={() => handleSkillRemove(skill)}
                                            title={`Remove ${skill}`}
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>

                            <div className={styles.addSkillContainer}>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder={t.addSkillPlaceholder}
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSkillAdd()}
                                />
                                <button className={styles.addButton} onClick={handleSkillAdd}>
                                    {t.addButton}
                                </button>
                            </div>
                        </div>

                        {/* Save Button */}
                        <button className={styles.gradientSaveButton} onClick={handleSaveProfile}>
                            {t.saveChanges}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ProfilePage
