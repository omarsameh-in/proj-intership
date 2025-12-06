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
                <h2>{t.createCompanyAccount}</h2>
                <p>{t.companyProfile}</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label>{t.workEmail}</label>
                    <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
                    <input
                        type="email" name="email" placeholder=""
                        value={formData.email} onChange={handleChange}
                        style={errors.email ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.email && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.email}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label>{t.companyName}</label>
                    <FontAwesomeIcon icon={faBuilding} className={styles.inputIcon} />
                    <input
                        type="text" name="companyName" placeholder=""
                        value={formData.companyName} onChange={handleChange}
                        style={errors.companyName ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.companyName && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.companyName}</span>}
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
                    <label>{t.industry}</label>
                    <FontAwesomeIcon icon={faBriefcase} className={styles.inputIcon} />
                    <input
                        type="text" name="industry" placeholder=""
                        value={formData.industry} onChange={handleChange}
                        style={errors.industry ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.industry && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.industry}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label>{t.location}</label>
                    <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.inputIcon} />
                    <input
                        type="text" name="location" placeholder=""
                        value={formData.location} onChange={handleChange}
                        style={errors.location ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.location && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.location}</span>}
                </div>

                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <label>{t.website}</label>
                    <FontAwesomeIcon icon={faLink} className={styles.inputIcon} />
                    <input
                        type="url" name="webSite" placeholder="https://www.company.com"
                        value={formData.webSite} onChange={handleChange}
                        style={errors.webSite ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.webSite && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.webSite}</span>}
                </div>

                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <label className={styles.optional}>{t.address}</label>
                    <FontAwesomeIcon icon={faLocationArrow} className={styles.inputIcon} />
                    <input
                        type="text" name="address" placeholder=""
                        value={formData.address} onChange={handleChange}
                    />
                </div>

                <div className={styles.textareaGroup}>
                    <label>{t.companyOverview}</label>
                    <textarea
                        name="description"
                        placeholder={t.companyPlaceholder}
                        value={formData.description}
                        onChange={handleChange}
                        style={errors.description ? { borderColor: '#ef4444' } : {}}
                    ></textarea>
                    <div className={styles.charCount}>{formData.description.length} chars</div>
                    {errors.description && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.description}</span>}
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
