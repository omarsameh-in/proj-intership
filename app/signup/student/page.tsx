'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowLeft, faUser, faEnvelope, faLock,
    faUniversity, faGraduationCap, faBook, faCalendarDays, faCloudArrowUp
} from '@fortawesome/free-solid-svg-icons'
import { Globe, Moon, Sun, Check } from 'lucide-react'
import styles from '../signup.module.css'
import { useApp } from '../../context/AppContext'
import api from '../../lib/api'

export default function StudentSignupPage() {
    const { theme, toggleTheme, language, setLanguage, t } = useApp()
    const router = useRouter()
    const [showLanguageMenu, setShowLanguageMenu] = useState(false)
    const [formData, setFormData] = useState({
        fullName: '', email: '', password: '', confirmPassword: '',
        university: '', college: '', degree: '', major: '', gradYear: '', cvFile: null as File | null
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)

    const changeLanguage = (lang: 'en' | 'ar') => {
        setLanguage(lang)
        setShowLanguageMenu(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target
        if (name === 'cvFile' && files) {
            setFormData({ ...formData, cvFile: files[0] })
            if (errors.cvFile) setErrors({ ...errors, cvFile: '' })
        } else {
            setFormData({ ...formData, [name]: value })
            if (errors[name]) setErrors({ ...errors, [name]: '' })
        }
    }

    const validateForm = () => {
        let newErrors: Record<string, string> = {}
        if (!formData.fullName.trim()) newErrors.fullName = "Required"
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.email) newErrors.email = "Required"
        else if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email"
        if (formData.password.length < 8) newErrors.password = "Min 8 chars"
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Mismatch"
        if (!formData.confirmPassword.trim()) newErrors.confirmPassword = "Required"
        if (!formData.university.trim()) newErrors.university = "Required"
        if (!formData.college.trim()) newErrors.college = "Required"
        if (!formData.major.trim()) newErrors.major = "Required"
        if (formData.cvFile && formData.cvFile.size > 5 * 1024 * 1024) newErrors.cvFile = "Max 5MB"
        if (!formData.cvFile) newErrors.cvFile = "Required"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            setLoading(true)
            try {
                const payload = new FormData()

                // Append all fields
                payload.append('fullName', formData.fullName)
                payload.append('email', formData.email)
                payload.append('password', formData.password)
                payload.append('university', formData.university)
                payload.append('college', formData.college)
                payload.append('degree', formData.degree)
                payload.append('major', formData.major)
                payload.append('gradYear', formData.gradYear)

                if (formData.cvFile) {
                    payload.append('cvFile', formData.cvFile)
                }

                await api.post('/auth/register/student', payload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })

                alert("Account Created Successfully!")
                router.push('/login')
            } catch (error: any) {
                console.error("Registration Error:", error)
                const msg = error.response?.data?.message || 'Registration failed. Please try again.'
                alert(msg)
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <div className={styles.formContainer} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <button type="button" className={styles.backArrow} onClick={() => router.back()}>
                <FontAwesomeIcon icon={faArrowLeft} style={{ transform: language === 'ar' ? 'rotate(180deg)' : 'none' }} />
            </button>

            <div className={styles.themeToggle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="position-relative">
                    <button
                        type="button"
                        onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem' }}
                    >
                        <Globe size={18} />
                    </button>
                    <div className={`language-menu ${showLanguageMenu ? 'show' : ''}`} style={{ top: '100%', right: language === 'ar' ? 'auto' : 0, left: language === 'ar' ? 0 : 'auto', marginTop: '5px' }}>
                        <div
                            className={`language-option ${language === 'en' ? 'active' : ''}`}
                            onClick={() => changeLanguage('en')}
                        >
                            {language === 'en' && <Check size={16} className="me-2" style={{ display: 'inline' }} />}
                            {language !== 'en' && <span className="me-2" style={{ width: '16px', display: 'inline-block' }}></span>}
                            English
                        </div>
                        <div
                            className={`language-option ${language === 'ar' ? 'active' : ''}`}
                            onClick={() => changeLanguage('ar')}
                        >
                            {language === 'ar' && <Check size={16} className="me-2" style={{ display: 'inline' }} />}
                            {language !== 'ar' && <span className="me-2" style={{ width: '16px', display: 'inline-block' }}></span>}
                            العربية
                        </div>
                    </div>
                </div>
                <button onClick={toggleTheme} type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem' }}>
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>

            <div className={styles.signupCard}>
                <h2>{t.createAccount}</h2>
                <p>{t.startJourney}</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label>{t.fullName}</label>
                    <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
                    <input
                        type="text" name="fullName" placeholder=""
                        value={formData.fullName} onChange={handleChange}
                        style={errors.fullName ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.fullName && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.fullName}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label>{t.emailLabel}</label>
                    <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
                    <input
                        type="email" name="email" placeholder=""
                        value={formData.email} onChange={handleChange}
                        style={errors.email ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.email && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.email}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label>{t.passwordLabel}</label>
                    <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                    <input
                        type="password" name="password" placeholder="••••••••"
                        value={formData.password} onChange={handleChange}
                        style={errors.password ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.password && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.password}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label>{t.confirmPassword}</label>
                    <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                    <input
                        type="password" name="confirmPassword" placeholder="••••••••"
                        value={formData.confirmPassword} onChange={handleChange}
                        style={errors.confirmPassword ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.confirmPassword && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.confirmPassword}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label>{t.university}</label>
                    <FontAwesomeIcon icon={faUniversity} className={styles.inputIcon} />
                    <input
                        type="text" name="university" placeholder=""
                        value={formData.university} onChange={handleChange}
                        style={errors.university ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.university && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.university}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label>{t.college}</label>
                    <FontAwesomeIcon icon={faGraduationCap} className={styles.inputIcon} />
                    <input
                        type="text" name="college" placeholder=""
                        value={formData.college} onChange={handleChange}
                        style={errors.college ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.college && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.college}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label>{t.degree}</label>
                    <FontAwesomeIcon icon={faGraduationCap} className={styles.inputIcon} />
                    <input
                        type="text" name="degree" placeholder=""
                        value={formData.degree} onChange={handleChange}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>{t.major}</label>
                    <FontAwesomeIcon icon={faBook} className={styles.inputIcon} />
                    <input
                        type="text" name="major" placeholder=""
                        value={formData.major} onChange={handleChange}
                        style={errors.major ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.major && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.major}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label>{t.gradYear}</label>
                    <FontAwesomeIcon icon={faCalendarDays} className={styles.inputIcon} />
                    <input
                        type="text" name="gradYear" placeholder=""
                        value={formData.gradYear} onChange={handleChange}
                    />
                </div>

                <div className={styles.fileUpload}>
                    <label>{t.uploadCv}</label>

                    <div className={styles.uploadArea} onClick={() => document.getElementById('cv-upload')?.click()}>
                        <FontAwesomeIcon icon={faCloudArrowUp} />
                        <p>{t.clickToUpload}</p>
                        <span>{t.maxSize}</span>
                        {formData.cvFile && <p style={{ color: '#2563eb', marginTop: '10px' }}>Selected: {formData.cvFile.name}</p>}

                        <input
                            id="cv-upload"
                            type="file" name="cvFile" accept=".pdf,.doc,.docx"
                            onChange={handleChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                    {errors.cvFile && <span style={{ color: '#ef4444', fontSize: '12px', display: 'block', marginTop: '5px' }}>{errors.cvFile}</span>}
                </div>

                <div className={styles.buttonGroup}>
                    <button type="button" className={styles.backBtn} onClick={() => router.back()}>
                        {t.back}
                    </button>
                    <button type="submit" className={styles.btn} disabled={loading}>
                        {loading ? 'Creating...' : t.createAccount}
                    </button>
                </div>

                <div className={styles.signinText}>
                    {t.alreadyHaveAccount} <Link href="/login">{t.login}</Link>
                </div>
            </form>
        </div>
    )
}
