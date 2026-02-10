'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Globe, Moon, Sun, Check } from 'lucide-react'

type Language = 'en' | 'ar'
type Theme = 'dark' | 'light'

const translations = {
    en: {
        title: "Reset Your Password",
        subtitle: "Enter your new password below.",
        newPasswordLabel: "New Password *",
        newPasswordPlaceholder: "Enter new password",
        confirmPasswordLabel: "Confirm Password *",
        confirmPasswordPlaceholder: "Confirm new password",
        resetButton: "Reset Password",
        backToLogin: "Back to Login",
        successTitle: "Password Reset Successful",
        successMessage: "Your password has been reset successfully. You can now login with your new password.",
        errorTitle: "Error",
        passwordRequired: "Password is required",
        passwordTooShort: "Password must be at least 8 characters",
        passwordMismatch: "Passwords do not match",
        invalidToken: "Invalid or expired reset link",
        tokenRequired: "Reset token is missing",
    },
    ar: {
        title: "إعادة تعيين كلمة المرور",
        subtitle: "أدخل كلمة المرور الجديدة أدناه.",
        newPasswordLabel: "كلمة المرور الجديدة *",
        newPasswordPlaceholder: "أدخل كلمة المرور الجديدة",
        confirmPasswordLabel: "تأكيد كلمة المرور *",
        confirmPasswordPlaceholder: "أكد كلمة المرور الجديدة",
        resetButton: "إعادة تعيين كلمة المرور",
        backToLogin: "العودة لتسجيل الدخول",
        successTitle: "تم إعادة تعيين كلمة المرور بنجاح",
        successMessage: "تم إعادة تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.",
        errorTitle: "خطأ",
        passwordRequired: "كلمة المرور مطلوبة",
        passwordTooShort: "يجب أن تكون كلمة المرور 8 أحرف على الأقل",
        passwordMismatch: "كلمات المرور غير متطابقة",
        invalidToken: "رابط إعادة التعيين غير صالح أو منتهي الصلاحية",
        tokenRequired: "رمز إعادة التعيين مفقود",
    },
}

function ResetPasswordContent() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const [token, setToken] = useState('')
    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [language, setLanguage] = useState<Language>('en')
    const [theme, setTheme] = useState<Theme>('dark')
    const [showLanguageMenu, setShowLanguageMenu] = useState(false)

    const t = translations[language]

    useEffect(() => {
        // Load saved preferences
        const savedLanguage = localStorage.getItem('language') as Language
        const savedTheme = localStorage.getItem('theme') as Theme

        if (savedLanguage) setLanguage(savedLanguage)
        if (savedTheme) setTheme(savedTheme)
    }, [])

    useEffect(() => {
        // Update document direction and theme
        document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr')
        document.documentElement.setAttribute('lang', language)

        if (theme === 'light') {
            document.body.classList.add('light-mode')
        } else {
            document.body.classList.remove('light-mode')
        }
    }, [language, theme])

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
    }

    const changeLanguage = (lang: Language) => {
        setLanguage(lang)
        localStorage.setItem('language', lang)
        setShowLanguageMenu(false)
    }

    useEffect(() => {
        // Extract token and email from URL parameters
        const tokenParam = searchParams.get('token')
        const emailParam = searchParams.get('email')

        if (tokenParam) setToken(tokenParam)
        if (emailParam) setEmail(emailParam)

        if (!tokenParam || !emailParam) {
            setError(t.tokenRequired)
        }
    }, [searchParams, t.tokenRequired])

    const validatePassword = (password: string) => {
        if (!password) {
            return t.passwordRequired
        }
        if (password.length < 8) {
            return t.passwordTooShort
        }
        return ''
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validate new password
        const passwordError = validatePassword(newPassword)
        if (passwordError) {
            setError(passwordError)
            return
        }

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            setError(t.passwordMismatch)
            return
        }

        // Check if token and email exist
        if (!token || !email) {
            setError(t.tokenRequired)
            return
        }

        setIsLoading(true)

        try {
            // TODO: Replace with actual API call
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    email,
                    newPassword,
                }),
            })

            if (response.ok) {
                setIsSubmitted(true)
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    router.push('/login')
                }, 3000)
            } else {
                const data = await response.json()
                setError(data.message || t.invalidToken)
            }
        } catch (err) {
            // For now, simulate success since backend is not ready
            console.log('Reset password request:', { token, email, newPassword })
            setIsSubmitted(true)
            setTimeout(() => {
                router.push('/login')
            }, 3000)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="d-flex min-vh-100 position-relative overflow-hidden">
            <div className="login-glow" aria-hidden="true" />
            <div className="login-glow-secondary" aria-hidden="true" />
            <div className="login-glow-tertiary" aria-hidden="true" />
            {/* Left Panel */}
            <div className="left-panel d-flex flex-column align-items-center justify-content-center position-relative">
                <div className="d-flex flex-column align-items-center gap-4 position-relative z-index-1">
                    <div className="logo-circle">IW</div>
                    <div className="text-center">
                        <h1 className="display-5 fw-bold text-white mb-3">
                            Welcome to InternWay
                        </h1>
                        <p className="text-white fs-5 text-opacity-80">
                            Your journey to the perfect internship starts here
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Panel - Reset Password Form */}
            <div className="login-panel d-flex flex-column align-items-center justify-content-center p-4 position-relative">
                {/* Language and Theme Toggle */}
                <div className="theme-lang-controls position-absolute top-0 end-0 m-4 d-flex align-items-center gap-3">
                    <div className="position-relative">
                        <button
                            className="btn btn-link text-white text-decoration-none p-2"
                            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                            title="Change Language"
                        >
                            <Globe size={20} />
                        </button>
                        <div className={`language-menu ${showLanguageMenu ? 'show' : ''}`}>
                            <div
                                className={`language-option ${language === 'en' ? 'active' : ''}`}
                                onClick={() => changeLanguage('en')}
                            >
                                {language === 'en' && <Check size={16} className="me-2 d-inline" />}
                                {language !== 'en' && <span className="me-2 empty-check-space"></span>}
                                English
                            </div>
                            <div
                                className={`language-option ${language === 'ar' ? 'active' : ''}`}
                                onClick={() => changeLanguage('ar')}
                            >
                                {language === 'ar' && <Check size={16} className="me-2 d-inline" />}
                                {language !== 'ar' && <span className="me-2 empty-check-space"></span>}
                                العربية
                            </div>
                        </div>
                    </div>
                    <button
                        className="btn btn-link text-white text-decoration-none p-2"
                        onClick={toggleTheme}
                        title="Toggle Theme"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>

                <div className="w-100 max-w-28">
                    {!isSubmitted ? (
                        <>
                            {/* Title Section */}
                            <div className="mb-4">
                                <h1 className="h2 fw-bold text-white mb-2">
                                    {t.title}
                                </h1>
                                <p className="text-secondary small">
                                    {t.subtitle}
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                                    <AlertCircle size={20} className="me-2" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit}>
                                {/* New Password Field */}
                                <div className="mb-3">
                                    <label className="form-label text-white small fw-medium d-flex align-items-center gap-2">
                                        <Lock size={16} className="text-secondary" />
                                        <span>{t.newPasswordLabel}</span>
                                    </label>
                                    <div className="position-relative">
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="form-control"
                                            placeholder={t.newPasswordPlaceholder}
                                            disabled={isLoading || !token || !email}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-secondary z-index-10"
                                        >
                                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password Field */}
                                <div className="mb-4">
                                    <label className="form-label text-white small fw-medium d-flex align-items-center gap-2">
                                        <Lock size={16} className="text-secondary" />
                                        <span>{t.confirmPasswordLabel}</span>
                                    </label>
                                    <div className="position-relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="form-control"
                                            placeholder={t.confirmPasswordPlaceholder}
                                            disabled={isLoading || !token || !email}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-secondary z-index-10"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="btn login-btn w-100 py-3 text-white fw-semibold border-0 mb-3"
                                    disabled={isLoading || !token || !email}
                                >
                                    {isLoading ? (
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    ) : null}
                                    {t.resetButton}
                                </button>

                                {/* Back to Login Link */}
                                <div className="text-center">
                                    <Link href="/login" className="text-primary text-decoration-none small">
                                        {t.backToLogin}
                                    </Link>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
                            {/* Success Message */}
                            <div className="text-center">
                                <div className="mb-4">
                                    <CheckCircle size={64} className="text-success mb-3" />
                                    <h1 className="h2 fw-bold text-white mb-2">
                                        {t.successTitle}
                                    </h1>
                                    <p className="text-secondary mb-3">
                                        {t.successMessage}
                                    </p>
                                    <p className="text-secondary small">
                                        Redirecting to login...
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-vh-100 d-flex justify-content-center align-items-center text-white">Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    )
}
