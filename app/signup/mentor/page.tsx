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
            <div className={styles.glow} aria-hidden="true" />
            <div className={styles.glowSecondary} aria-hidden="true" />
            <div className={styles.glowTertiary} aria-hidden="true" />
            <button type="button" className={styles.backArrow} onClick={() => router.back()} title={language === 'ar' ? 'العودة' : 'Back'}>
                <FontAwesomeIcon icon={faArrowLeft} className={language === 'ar' ? styles.rotate180 : ''} />
            </button>

            <div className={styles.themeToggle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="position-relative">
                    <button
                        type="button"
                        onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                        className={styles.iconToggleBtn}
                        title={language === 'ar' ? 'تغيير اللغة' : 'Change Language'}
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
                <button
                    onClick={toggleTheme}
                    type="button"
                    className={styles.iconToggleBtn}
                    title={language === 'ar' ? 'تبديل المظهر' : 'Toggle Theme'}
                >
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
                        type="text" name="fullName" placeholder={t.fullName}
                        title={t.fullName}
                        value={formData.fullName} onChange={handleChange}
                        className={errors.fullName ? styles.inputError : ''}
                    />
                    {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label>{t.emailLabel}</label>
                    <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
                    <input
                        type="email" name="email" placeholder={t.emailLabel}
                        title={t.emailLabel}
                        value={formData.email} onChange={handleChange}
                        className={errors.email ? styles.inputError : ''}
                    />
                    {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label>{t.passwordLabel}</label>
                    <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                    <input
                        type="password" name="password" placeholder="••••••••"
                        title={t.passwordLabel}
                        value={formData.password} onChange={handleChange}
                        className={errors.password ? styles.inputError : ''}
                    />
                    {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label>{t.confirmPassword}</label>
                    <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                    <input
                        type="password" name="confirmPassword" placeholder="••••••••"
                        title={t.confirmPassword}
                        value={formData.confirmPassword} onChange={handleChange}
                        className={errors.confirmPassword ? styles.inputError : ''}
                    />
                    {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label>{t.expertise}</label>
                    <FontAwesomeIcon icon={faStar} className={styles.inputIcon} />
                    <input
                        type="text" name="expertise" placeholder={t.expertise}
                        title={t.expertise}
                        value={formData.expertise} onChange={handleChange}
                        className={errors.expertise ? styles.inputError : ''}
                    />
                    {errors.expertise && <span className={styles.errorText}>{errors.expertise}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label>{t.yearsExperience}</label>
                    <FontAwesomeIcon icon={faBriefcase} className={styles.inputIcon} />
                    <input
                        type="number" name="yearsExperience" placeholder={t.yearsExperience} min="0"
                        title={t.yearsExperience}
                        value={formData.yearsExperience} onChange={handleChange}
                        className={errors.yearsExperience ? styles.inputError : ''}
                    />
                    {errors.yearsExperience && <span className={styles.errorText}>{errors.yearsExperience}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label>{t.jobTitle}</label>
                    <FontAwesomeIcon icon={faAddressCard} className={styles.inputIcon} />
                    <input
                        type="text" name="jobTitle" placeholder={t.jobTitle}
                        title={t.jobTitle}
                        value={formData.jobTitle} onChange={handleChange}
                        className={errors.jobTitle ? styles.inputError : ''}
                    />
                    {errors.jobTitle && <span className={styles.errorText}>{errors.jobTitle}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label>{t.linkedin}</label>
                    <FontAwesomeIcon icon={faLink} className={styles.inputIcon} />
                    <input
                        type="url" name="linkedin" placeholder="https://linkedin.com/in/..."
                        title={t.linkedin}
                        value={formData.linkedin} onChange={handleChange}
                        className={errors.linkedin ? styles.inputError : ''}
                    />
                    {errors.linkedin && <span className={styles.errorText}>{errors.linkedin}</span>}
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
