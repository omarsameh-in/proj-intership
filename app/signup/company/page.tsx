'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowLeft, faEnvelope, faLock,
    faBuilding, faBriefcase, faMapMarkerAlt, faLocationArrow, faLink
} from '@fortawesome/free-solid-svg-icons'
import { Globe, Moon, Sun, Check } from 'lucide-react'
import styles from '../signup.module.css'
import { useApp } from '../../context/AppContext'
import api from '../../lib/api'

export default function CompanySignupPage() {
    const { theme, toggleTheme, language, setLanguage, t } = useApp()
    const router = useRouter()
    const [showLanguageMenu, setShowLanguageMenu] = useState(false)
    const [formData, setFormData] = useState({
        email: '', password: '', confirmPassword: '',
        companyName: '', industry: '', location: '', address: '', webSite: '', description: ''
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)

    const changeLanguage = (lang: 'en' | 'ar') => {
        setLanguage(lang)
        setShowLanguageMenu(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        if (errors[name]) setErrors({ ...errors, [name]: '' })
    }

    const validateForm = () => {
        let newErrors: Record<string, string> = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.email) newErrors.email = "Required"
        else if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email"

        if (formData.password.length < 8) newErrors.password = "Min 8 chars"
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Mismatch"
        if (!formData.confirmPassword.trim()) newErrors.confirmPassword = "Required"

        if (!formData.companyName.trim()) newErrors.companyName = "Required"
        if (!formData.industry.trim()) newErrors.industry = "Required"
        if (!formData.location.trim()) newErrors.location = "Required"

        const urlRegex = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/
        if (formData.webSite.trim() && !urlRegex.test(formData.webSite.trim())) {
            newErrors.webSite = "Invalid URL"
        }

        if (formData.description.trim().length < 20) newErrors.description = "Min 20 chars"

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

                await api.post('/auth/register/company', payload)

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
                <h2>{t.createCompanyAccount}</h2>
                <p>{t.companyProfile}</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label>{t.workEmail}</label>
                    <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
                    <input
                        type="email" name="email" placeholder={t.workEmail}
                        title={t.workEmail}
                        value={formData.email} onChange={handleChange}
                        className={errors.email ? styles.inputError : ''}
                    />
                    {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label>{t.companyName}</label>
                    <FontAwesomeIcon icon={faBuilding} className={styles.inputIcon} />
                    <input
                        type="text" name="companyName" placeholder={t.companyName}
                        title={t.companyName}
                        value={formData.companyName} onChange={handleChange}
                        className={errors.companyName ? styles.inputError : ''}
                    />
                    {errors.companyName && <span className={styles.errorText}>{errors.companyName}</span>}
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
                    <label>{t.industry}</label>
                    <FontAwesomeIcon icon={faBriefcase} className={styles.inputIcon} />
                    <input
                        type="text" name="industry" placeholder={t.industry}
                        title={t.industry}
                        value={formData.industry} onChange={handleChange}
                        className={errors.industry ? styles.inputError : ''}
                    />
                    {errors.industry && <span className={styles.errorText}>{errors.industry}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label>{t.location}</label>
                    <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.inputIcon} />
                    <input
                        type="text" name="location" placeholder={t.location}
                        title={t.location}
                        value={formData.location} onChange={handleChange}
                        className={errors.location ? styles.inputError : ''}
                    />
                    {errors.location && <span className={styles.errorText}>{errors.location}</span>}
                </div>

                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <label>{t.website}</label>
                    <FontAwesomeIcon icon={faLink} className={styles.inputIcon} />
                    <input
                        type="url" name="webSite" placeholder="https://www.company.com"
                        title={t.website}
                        value={formData.webSite} onChange={handleChange}
                        className={errors.webSite ? styles.inputError : ''}
                    />
                    {errors.webSite && <span className={styles.errorText}>{errors.webSite}</span>}
                </div>

                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <label className={styles.optional}>{t.address}</label>
                    <FontAwesomeIcon icon={faLocationArrow} className={styles.inputIcon} />
                    <input
                        type="text" name="address" placeholder={t.address}
                        title={t.address}
                        value={formData.address} onChange={handleChange}
                    />
                </div>

                <div className={styles.textareaGroup}>
                    <label>{t.companyOverview}</label>
                    <textarea
                        name="description"
                        placeholder={t.companyPlaceholder}
                        title={t.companyOverview}
                        value={formData.description}
                        onChange={handleChange}
                        className={errors.description ? styles.inputError : ''}
                    ></textarea>
                    <div className={styles.charCount}>{formData.description.length} chars</div>
                    {errors.description && <span className={styles.errorText}>{errors.description}</span>}
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
