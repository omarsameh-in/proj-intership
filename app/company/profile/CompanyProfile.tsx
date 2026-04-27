'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Briefcase,
  Users,
  ChevronLeft,
  Globe,
  Moon,
  Sun,
  LogOut,
  Check,
  Building2,
  MapPin,
  Mail,
  Phone,
  Save,
  Edit,
  X,
  Menu,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import styles from './Companyprofilestyle.module.css'
import api from '../../lib/api'
import Notification from '../../components/Notification/Notification'
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen'


interface CompanyData {
  name: string
  industry: string
  size: string
  foundedYear: string
  website: string
  description: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  linkedin: string
  twitter: string
  facebook: string
  instagram: string
}

const defaultData: CompanyData = {
  name: 'Tech Corp',
  industry: 'Technology & Software',
  size: '50-200 employees',
  foundedYear: '2010',
  website: 'www.techcorp.com',
  description:
    'We are a leading technology company specializing in innovative software solutions. Our mission is to empower businesses through cutting-edge technology and exceptional talent.',
  email: 'info@techcorp.com',
  phone: '+20 2 1234 5678',
  address: '123 Tech Street, Smart Village, Cairo, Egypt',
  city: 'Cairo',
  country: 'Egypt',
  linkedin: 'linkedin.com/company/techcorp',
  twitter: 'twitter.com/techcorp',
  facebook: 'facebook.com/techcorp',
  instagram: 'instagram.com/techcorp',
}

interface FieldProps {
  label: string
  field: keyof CompanyData
  type?: string
  icon?: React.ReactNode
  textarea?: boolean
  isEditing: boolean
  value: string
  onChange: (field: keyof CompanyData, value: string) => void
  instruction?: string
}

function Field({ label, field, type = 'text', icon, textarea = false, isEditing, value, onChange, instruction }: FieldProps) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>{label}</label>
      {textarea ? (
        <textarea
          className={`${styles.textarea} ${!isEditing ? styles.readOnly : ''}`}
          value={value}
          onChange={e => onChange(field, e.target.value)}
          readOnly={!isEditing}
          rows={4}
          title={label}
        />
      ) : (
        <div className={styles.inputWrapper}>
          {icon && <span className={styles.inputIcon}>{icon}</span>}
          <input
            type={type}
            className={`${styles.input} ${icon ? styles.withIcon : ''} ${!isEditing ? styles.readOnly : ''}`}
            value={value}
            onChange={e => onChange(field, e.target.value)}
            readOnly={!isEditing}
            title={label}
          />
        </div>
      )}
      {isEditing && instruction && (
        <small className={styles.instructionText}>{instruction}</small>
      )}
    </div>
  )
}

function CompanyProfile() {
  const { theme, toggleTheme, language, setLanguage, t } = useApp()
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const router = useRouter()

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [data, setData] = useState<CompanyData>(defaultData)
  const [editData, setEditData] = useState<CompanyData>(defaultData)

  const fetchProfile = async () => {
    try {
      setLoading(true)
      // For now, use mock data to match the speed of other pages
      // In production, this would be: const res = await api.get('/company/profile')
      const saved = localStorage.getItem('companyProfile')
      const profile = saved ? JSON.parse(saved) : defaultData
      setData(profile)
      setEditData(profile)
    } catch {
      setData(defaultData)
      setEditData(defaultData)
    } finally {
      await new Promise(r => setTimeout(r, 200))
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleEdit = () => {
    setEditData({ ...data })
    setIsEditing(true)
    setSuccess(false)
  }

  const handleCancel = () => {
    setEditData({ ...data })
    setIsEditing(false)
  }

  const handleChange = (field: keyof CompanyData, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const token = localStorage.getItem('token')
      await api.put('/company/profile', editData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setData({ ...editData })
      localStorage.setItem('companyProfile', JSON.stringify(editData))
      setIsEditing(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      localStorage.setItem('companyProfile', JSON.stringify(editData))
      setData({ ...editData })
      setIsEditing(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const changeLanguage = (lang: 'en' | 'ar') => {
    setLanguage(lang)
    setShowLanguageMenu(false)
  }

  if (loading) {
    return <LoadingScreen />
  }

  const displayed = isEditing ? editData : data

  return (
    <div className={styles.appLayout} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.glowSecondary} aria-hidden="true" />
      <div className={styles.glowTertiary} aria-hidden="true" />

      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.logoSection}>
          <div className={styles.backButton} onClick={() => router.push('/')} role="button" title={t.back}>
            <ChevronLeft size={20} />
          </div>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>IW</div>
            <span className={styles.logoText}>{t.appName}</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <Link href="/company/dashboard" className={styles.navItem} onClick={() => setSidebarOpen(false)}>
            <LayoutDashboard size={20} />
            <span>{t.dashboard}</span>
          </Link>
          <Link href="/company/internships" className={styles.navItem} onClick={() => setSidebarOpen(false)}>
            <Briefcase size={20} />
            <span>{t.myInternships}</span>
          </Link>
          <Link href="/company/applicants" className={styles.navItem} onClick={() => setSidebarOpen(false)}>
            <Users size={20} />
            <span>{t.applicants}</span>
          </Link>
          <Link href="/company/profile" className={`${styles.navItem} ${styles.active}`} onClick={() => setSidebarOpen(false)}>
            <Building2 size={20} />
            <span>{t.companyProfileNav}</span>
          </Link>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topBar}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{t.companyProfileNav}</h1>
            <p className={styles.pageSubtitle}>{t.manageCompanyInfo}</p>
          </div>

          <div className={styles.topBarControls}>
            <button
              className={styles.hamburgerBtn}
              onClick={() => setSidebarOpen(prev => !prev)}
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div className={styles.languageWrapper}>
              <button className={styles.iconButton} onClick={() => setShowLanguageMenu(!showLanguageMenu)} title={t.changeLanguage}>
                <Globe size={20} />
              </button>
              <div className={`language-menu ${showLanguageMenu ? 'show' : ''}`}>
                <div className={`language-option ${language === 'en' ? 'active' : ''}`} onClick={() => changeLanguage('en')}>
                  {language === 'en' && <Check size={16} />} English
                </div>
                <div className={`language-option ${language === 'ar' ? 'active' : ''}`} onClick={() => changeLanguage('ar')}>
                  {language === 'ar' && <Check size={16} />} العربية
                </div>
              </div>
            </div>

            <button className={styles.iconButton} onClick={toggleTheme} title={t.toggleTheme}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Notification />

            <button className={styles.iconButton} onClick={() => router.push('/')} title={t.logout}>
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}><Building2 size={20} /> {t.companyInformation}</h2>
          <div className={styles.formGrid}>
            <Field label={t.companyName} field="name" isEditing={isEditing} value={displayed.name} onChange={handleChange} />
            <div className={styles.row}>
              <Field label={t.industry} field="industry" isEditing={isEditing} value={displayed.industry} onChange={handleChange} />
            </div>
            <div className={styles.row}>
              <Field label={t.foundedYear} field="foundedYear" isEditing={isEditing} value={displayed.foundedYear} onChange={handleChange} />
              <Field label={t.website} field="website" icon={<Globe size={16} />} isEditing={isEditing} value={displayed.website} onChange={handleChange} />
            </div>
            <Field label={t.companyDescription} field="description" textarea isEditing={isEditing} value={displayed.description} onChange={handleChange} />
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}><MapPin size={20} /> {t.contactInformation}</h2>
          <div className={styles.formGrid}>
            <div className={styles.row}>
              <Field label={t.companyEmail} field="email" icon={<Mail size={16} />} isEditing={isEditing} value={displayed.email} onChange={handleChange} />
              <Field
                label={t.phoneNumberLabel}
                field="phone"
                icon={<Phone size={16} />}
                isEditing={isEditing}
                value={displayed.phone}
                onChange={handleChange}
                instruction={language === 'ar' ? "يمكنك إضافة كود الدولة (مثال: +201012345678)" : "Include country code (e.g., +201012345678)"}
              />
            </div>
            <Field label={t.officeAddress} field="address" isEditing={isEditing} value={displayed.address} onChange={handleChange} />
            <div className={styles.row}>
              <Field label={t.city} field="city" isEditing={isEditing} value={displayed.city} onChange={handleChange} />
              <Field label={t.country} field="country" isEditing={isEditing} value={displayed.country} onChange={handleChange} />
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}><Globe size={20} /> {t.socialMedia}</h2>
          <div className={styles.formGrid}>
            <div className={styles.row}>
              <Field label="LinkedIn" field="linkedin" isEditing={isEditing} value={displayed.linkedin} onChange={handleChange} />
              <Field label="Twitter" field="twitter" isEditing={isEditing} value={displayed.twitter} onChange={handleChange} />
            </div>
            <div className={styles.row}>
              <Field label="Facebook" field="facebook" isEditing={isEditing} value={displayed.facebook} onChange={handleChange} />
              <Field label="Instagram" field="instagram" isEditing={isEditing} value={displayed.instagram} onChange={handleChange} />
            </div>
          </div>
        </section>

        {success && (
          <div className={styles.successBanner}>
            <Check size={16} />
            {t.profileUpdatedSuccess}
          </div>
        )}

        <div className={styles.editBar}>
          {!isEditing ? (
            <button className={styles.editButton} onClick={handleEdit}>
              <Edit size={16} />
              {t.editProfile}
            </button>
          ) : (
            <button className={styles.cancelButton} onClick={handleCancel}>
              <X size={16} />
              {t.cancel}
            </button>
          )}
        </div>
        {isEditing && (
          <div className={styles.saveBar}>
            <button className={styles.saveButton} onClick={handleSave} disabled={saving}>
              <Save size={18} />
              {saving ? t.saving : t.saveChanges}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default CompanyProfile