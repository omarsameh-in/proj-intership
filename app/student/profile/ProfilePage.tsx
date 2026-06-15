'use client'
import { useEffect, useState } from 'react'
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
    Edit,
    Menu
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import TopBarControls from '../../components/TopBarControls/TopBarControls'
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen'
import styles from './ProfileStyle.module.css'
import api from '../../lib/api'

interface RawProfile {
    fullName:   string | null
    email:      string
    phone:      string | null
    university: string | null
    college:    string | null
    major:      string | null
    location:   string | null
    gradYear:   string | null
    skills:     string[] | null
}

// UI-facing shape (used by the JSX — field names match the component)
interface ProfileData {
    name:           string
    email:          string
    phoneNumber:    string
    location:       string
    university:     string
    college:        string
    major:          string
    graduationYear: string
    skills:         string[]
}

// ─────────────────────────────────────────────────────────────────────────────
// NORMALISER — convert backend shape -> UI shape
// ─────────────────────────────────────────────────────────────────────────────

function normaliseProfile(raw: RawProfile): ProfileData {
    return {
        name:           raw.fullName   ?? '',
        email:          raw.email      ?? '',
        phoneNumber:    raw.phone      ?? '',
        location:       raw.location   ?? '',
        university:     raw.university ?? '',
        college:        raw.college    ?? '',
        major:          raw.major      ?? '',
        graduationYear: raw.gradYear   ?? '',
        skills:         Array.isArray(raw.skills) ? raw.skills.filter(Boolean) : [],
    }
}

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

function ProfilePage() {
    const { theme, toggleTheme, language, setLanguage, t } = useApp()
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    const defaultProfile: ProfileData = {
        name:           '',
        email:          '',
        phoneNumber:    '',
        location:       '',
        university:     '',
        college:        '',
        major:          '',
        graduationYear: '',
        skills:         [],
    }

    const [profileData, setProfileData]   = useState<ProfileData>(defaultProfile)
    const [editData, setEditData]         = useState<ProfileData>(defaultProfile)
    const [isEditing, setIsEditing]       = useState(false)
    const [cvFile, setCvFile]             = useState<File | null>(null)
    const [sidebarOpen, setSidebarOpen]   = useState(false)

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        setLoading(true)

        const doFetch = (accessToken: string | null) =>
            api.get('/Student/Profile', {
                headers: { Authorization: `Bearer ${accessToken}` },
            })

        try {
            const token = localStorage.getItem('token')

            try {
                const res = await doFetch(token)
                const raw: RawProfile | null = res.data?.Data ?? res.data?.data ?? null
                if (raw) {
                    const normalised = normaliseProfile(raw)
                    setProfileData(normalised)
                    setEditData(normalised)
                }
            } catch (apiErr: any) {
                if (apiErr.response?.status === 401) {
                    const newToken = await refreshAccessToken()
                    if (!newToken) {
                        clearAuthAndRedirect(router)
                        return
                    }
                    try {
                        const retryRes = await doFetch(newToken)
                        const raw: RawProfile | null = retryRes.data?.Data ?? retryRes.data?.data ?? null
                        if (raw) {
                            const normalised = normaliseProfile(raw)
                            setProfileData(normalised)
                            setEditData(normalised)
                        }
                    } catch (retryErr: any) {
                        if (retryErr.response?.status === 401) {
                            clearAuthAndRedirect(router)
                            return
                        }
                        throw retryErr
                    }
                } else {
                    throw apiErr
                }
            }
        } catch (err: any) {
            console.warn('[fetchProfile] API failed, using default empty profile:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleSaveProfile = async () => {
        const doSave = (accessToken: string | null) => {
            const formData = new FormData()
            formData.append('fullName',   editData.name)
            formData.append('email',      editData.email)
            formData.append('phone',      editData.phoneNumber)
            formData.append('university', editData.university)
            formData.append('college',    editData.college)
            formData.append('major',      editData.major)
            formData.append('gradYear',   editData.graduationYear)
            if (cvFile) formData.append('CvFile', cvFile)

            return api.put('/Student/Profile/SaveChange', formData, {
                headers: {
                    Authorization:  `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
        }

        try {
            const token = localStorage.getItem('token')

            try {
                const res = await doSave(token)
                const info = res.data?.Info ?? res.data?.info
                if (info?.cvChange) {
                    alert('Profile updated!')
                }
                // Update local state with what we sent (backend echoes Data back)
                const updatedRaw: RawProfile | null = res.data?.Data ?? res.data?.data ?? null
                if (updatedRaw) {
                    const normalised = normaliseProfile(updatedRaw)
                    setProfileData(normalised)
                    setEditData(normalised)
                } else {
                    setProfileData({ ...editData })
                }
                setIsEditing(false)
                setCvFile(null)
            } catch (apiErr: any) {
                if (apiErr.response?.status === 401) {
                    const newToken = await refreshAccessToken()
                    if (!newToken) {
                        clearAuthAndRedirect(router)
                        return
                    }
                    try {
                        const retryRes = await doSave(newToken)
                        const updatedRaw: RawProfile | null = retryRes.data?.Data ?? retryRes.data?.data ?? null
                        if (updatedRaw) {
                            const normalised = normaliseProfile(updatedRaw)
                            setProfileData(normalised)
                            setEditData(normalised)
                        } else {
                            setProfileData({ ...editData })
                        }
                        setIsEditing(false)
                        setCvFile(null)
                    } catch (retryErr: any) {
                        if (retryErr.response?.status === 401) {
                            clearAuthAndRedirect(router)
                            return
                        }
                        throw retryErr
                    }
                } else if (apiErr.response?.status === 409) {
                    alert('This email is already in use by another account.')
                } else if (apiErr.response?.status === 400) {
                    alert('Please check your inputs and try again.')
                } else {
                    throw apiErr
                }
            }
        } catch (err: any) {
            console.error('[handleSaveProfile]', err)
            alert(err.message ?? 'Failed to save profile. Please try again.')
        }
    }

    const handleEdit = () => {
        setEditData({ ...profileData })
        setIsEditing(true)
    }

    const handleCancel = () => {
        setIsEditing(false)
        setCvFile(null)
    }

    const handleFieldChange = (field: keyof Omit<typeof editData, 'skills'>, value: string) => {
        setEditData(prev => ({ ...prev, [field]: value }))
    }

    const displayed = isEditing ? editData : profileData
       
    
    const handleSkillRemove = (skillToRemove: string) => {
        setEditData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }))
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

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <div className={styles.appLayout}>
            <div className={styles.glow} aria-hidden="true" />
            <div className={styles.glowSecondary} aria-hidden="true" />
            <div className={styles.glowTertiary} aria-hidden="true" />

            {/* Overlay */}
            <div
                className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
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
                    <Link href="/student/dashboard" className={styles.navItem} onClick={() => setSidebarOpen(false)}>
                        <LayoutDashboard size={20} />
                        <span>{t.dashboard}</span>
                    </Link>
                    <Link href="/student/internships" className={styles.navItem} onClick={() => setSidebarOpen(false)}>
                        <Briefcase size={20} />
                        <span>{t.internships}</span>
                    </Link>
                    <Link href="/student/mentorships" className={styles.navItem} onClick={() => setSidebarOpen(false)}>
                        <Users size={20} />
                        <span>{t.mentorships}</span>
                    </Link>
                    <Link href="/student/profile" className={`${styles.navItem} ${styles.active}`} onClick={() => setSidebarOpen(false)}>
                        <UserCircle size={20} />
                        <span>{t.profile}</span>
                    </Link>
                    <Link href="/student/sessions" className={styles.navItem} onClick={() => setSidebarOpen(false)}>
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

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button className={styles.hamburgerBtn} onClick={() => setSidebarOpen(p => !p)} aria-label="Toggle menu">
                            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                        <TopBarControls />
                    </div>
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

                          
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ProfilePage