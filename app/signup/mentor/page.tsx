'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowLeft, faUser, faEnvelope, faLock,
    faBriefcase, faStar, faLink, faAddressCard
} from '@fortawesome/free-solid-svg-icons'
import { Globe, Moon, Sun, Check } from 'lucide-react'
import styles from '../signup.module.css'
import { useApp } from '../../context/AppContext'
import api from '../../lib/api'

export default function MentorSignupPage() {
    const { theme, toggleTheme, language, setLanguage, t } = useApp()
    const router = useRouter()
    const [showLanguageMenu, setShowLanguageMenu] = useState(false)
    const [formData, setFormData] = useState({
        fullName: '', email: '', password: '', confirmPassword: '',
        expertise: '', yearsExperience: '', jobTitle: '', linkedin: ''
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)

    const changeLanguage = (lang: 'en' | 'ar') => {
        setLanguage(lang)
        setShowLanguageMenu(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        if (errors[name]) setErrors({ ...errors, [name]: '' })
    }

    const validateForm = () => {
        let newErrors: Record<string, string> = {}
        if (!formData.fullName.trim()) newErrors.fullName = "Required"

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.email) newErrors.email = "Required"
        else if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email"

        if (formData.password.length < 8) newErrors.password = "Min 8 chars"
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Mismatch"

        if (!formData.expertise.trim()) newErrors.expertise = "Required"

        if (!formData.yearsExperience) {
            newErrors.yearsExperience = "Required"
        } else if (parseInt(formData.yearsExperience) < 0) {
            newErrors.yearsExperience = "Invalid"
        }

        if (!formData.jobTitle.trim()) newErrors.jobTitle = "Required"

        if (formData.linkedin && !formData.linkedin.startsWith('http')) {
            newErrors.linkedin = "Start with http"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            setLoading(true)
            try {
                // Remove confirmPassword before sending
                const { confirmPassword, ...payload } = formData

                await api.post('/auth/register/mentor', payload)

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
                <h2>{t.createMentorAccount}</h2>
                <p>{t.mentorProfile}</p>
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
                    <label>{t.expertise}</label>
                    <FontAwesomeIcon icon={faStar} className={styles.inputIcon} />
                    <input
                        type="text" name="expertise" placeholder=""
                        value={formData.expertise} onChange={handleChange}
                        style={errors.expertise ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.expertise && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.expertise}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label>{t.yearsExperience}</label>
                    <FontAwesomeIcon icon={faBriefcase} className={styles.inputIcon} />
                    <input
                        type="number" name="yearsExperience" placeholder="" min="0"
                        value={formData.yearsExperience} onChange={handleChange}
                        style={errors.yearsExperience ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.yearsExperience && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.yearsExperience}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label>{t.jobTitle}</label>
                    <FontAwesomeIcon icon={faAddressCard} className={styles.inputIcon} />
                    <input
                        type="text" name="jobTitle" placeholder=""
                        value={formData.jobTitle} onChange={handleChange}
                        style={errors.jobTitle ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.jobTitle && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.jobTitle}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label>{t.linkedin}</label>
                    <FontAwesomeIcon icon={faLink} className={styles.inputIcon} />
                    <input
                        type="url" name="linkedin" placeholder="https://linkedin.com/in/..."
                        value={formData.linkedin} onChange={handleChange}
                        style={errors.linkedin ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.linkedin && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.linkedin}</span>}
                </div>

                <div className={styles.buttonGroup}>
                    <button type="button" className={styles.backBtn} onClick={() => router.back()}>
                        {t.back}
                    </button>
                    <button type="submit" className={styles.btn} disabled={loading}>
                        {loading ? 'Creating...' : t.signup}
                    </button>
                </div>

                <div className={styles.signinText}>
                    {t.alreadyHaveAccount} <Link href="/login">{t.login}</Link>
                </div>
            </form>
        </div>
    )
}
