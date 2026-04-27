'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  Globe,
  Moon,
  Sun,
  LogOut,
  Check,
  ChevronLeft,
  Plus,
  X,
  Menu
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import styles from './PostInternshipStyle.module.css'
import Notification from '../../components/Notification/Notification'
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen'


const EGYPT_GOVERNORATES = [
  'Cairo', 'Giza', 'Alexandria', 'Dakahlia', 'Red Sea',
  'Beheira', 'Fayoum', 'Gharbia', 'Ismailia', 'Menofia',
  'Minya', 'Qaliubiya', 'New Valley', 'Suez', 'Aswan',
  'Asyut', 'Beni Suef', 'Port Said', 'Damietta', 'Sharqia',
  'South Sinai', 'Kafr El Sheikh', 'Matrouh', 'Luxor', 'Qena',
  'North Sinai', 'Sohag',
]

interface PostFormData {
  title: string
  description: string
  duration: string
  workType: 'Remote' | 'On-site' | 'Hybrid'
  governorate: string
  deadline: string
  isPaid: 'paid' | 'unpaid'
  stipend: string
}

function PostInternshipContent() {
  const { theme, toggleTheme, language, setLanguage, t } = useApp()
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')
  const isEditMode = !!editId
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEditMode)
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})

  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState<PostFormData>({
    title: '', description: '', duration: '',
    workType: 'Remote', governorate: '',
    deadline: '', isPaid: 'unpaid', stipend: '',
  })

  const [requirements, setRequirements] = useState<string[]>([''])
  const [skills, setSkills] = useState<string[]>([''])

  useEffect(() => {
    if (!isEditMode) return
    const loadInternship = async () => {
      try {
        setFetching(true)
        await new Promise(r => setTimeout(r, 200))
        setForm({
          title: 'Frontend Developer Intern',
          description: 'Work on our main product frontend.',
          duration: '3 months',
          workType: 'Remote',
          governorate: '',
          deadline: '2024-12-30',
          isPaid: 'paid',
          stipend: '5,000 EGP/month',
        })
        setRequirements(['Strong knowledge of React', 'TypeScript experience'])
        setSkills(['React', 'TypeScript', 'CSS'])
      } catch {
        alert(t.failedToLoadInternshipData)
        router.push('/company/myinternships')
      } finally {
        setFetching(false)
      }
    }
    loadInternship()
  }, [editId, isEditMode, router])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleRequirementChange = (idx: number, value: string) => {
    setRequirements(prev => prev.map((r, i) => i === idx ? value : r))
  }
  const addRequirement = () => setRequirements(prev => [...prev, ''])
  const removeRequirement = (idx: number) => {
    if (requirements.length === 1) return
    setRequirements(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSkillChange = (idx: number, value: string) => {
    setSkills(prev => prev.map((s, i) => i === idx ? value : s))
  }
  const addSkill = () => setSkills(prev => [...prev, ''])
  const removeSkill = (idx: number) => {
    if (skills.length === 1) return
    setSkills(prev => prev.filter((_, i) => i !== idx))
  }

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (!form.title.trim()) e.title = t.titleRequired
    if (!form.description.trim()) e.description = t.descriptionRequired
    if (!form.duration) e.duration = t.durationRequired
    if (!form.workType) e.workType = t.workTypeRequired
    if (form.workType === 'On-site' && !form.governorate) e.governorate = t.governorateRequired
    if (!form.deadline) e.deadline = t.deadlineRequired
    const validSkills = skills.filter(s => s.trim())
    if (validSkills.length === 0) e.skills = t.skillRequired
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 200))
      alert(isEditMode ? t.internshipUpdatedSuccess : t.internshipPublishedSuccess)
      router.push('/company/myinternships')
    } catch {
      alert(isEditMode ? t.failedToUpdateInternship : t.failedToPublishInternship)
    } finally {
      setLoading(false)
    }
  }

  const changeLanguage = (lang: 'en' | 'ar') => { setLanguage(lang); setShowLanguageMenu(false) }

  if (fetching) {
    return <LoadingScreen />
  }

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
          <div className={styles.logo}>
            <button className={styles.backBtn} onClick={() => router.push('/company/internships')} title={t.back}>
              <ChevronLeft size={18} />
            </button>
            <div className={styles.logoIcon}>IW</div>
            <span className={styles.logoText}>{t.appName}</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <Link href="/company/dashboard" className={styles.navItem} onClick={() => setSidebarOpen(false)}>
            <LayoutDashboard size={20} /><span>{t.dashboard}</span>
          </Link>
          <Link href="/company/internships" className={`${styles.navItem} ${styles.active}`} onClick={() => setSidebarOpen(false)}>
            <Briefcase size={20} /><span>{t.myInternships}</span>
          </Link>
          <Link href="/company/applicants" className={styles.navItem} onClick={() => setSidebarOpen(false)}>
            <Users size={20} /><span>{t.applicants}</span>
          </Link>
          <Link href="/company/profile" className={styles.navItem} onClick={() => setSidebarOpen(false)}>
            <Building2 size={20} /><span>{t.companyProfileNav}</span>
          </Link>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topBar}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{isEditMode ? t.editInternship : t.postNewInternship}</h1>
            <p className={styles.pageSubtitle}>
              {isEditMode ? t.updateInternshipDetails : t.createNewInternshipOpportunity}
            </p>
          </div>

          <div className={styles.topBarControls}>
            <button
              className={styles.hamburgerBtn}
              onClick={() => setSidebarOpen(prev => !prev)}
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className={styles.languageWrapper}>
              <button className={styles.iconButton} onClick={() => setShowLanguageMenu(!showLanguageMenu)} title={t.changeLanguage}><Globe size={20} /></button>
              <div className={`language-menu ${showLanguageMenu ? 'show' : ''}`}>
                {(['en', 'ar'] as const).map(lang => (
                  <div key={lang} className={`language-option ${language === lang ? 'active' : ''}`} onClick={() => changeLanguage(lang)}>
                    {language === lang && <Check size={16} />}{lang === 'en' ? 'English' : 'العربية'}
                  </div>
                ))}
              </div>
            </div>
            <button className={styles.iconButton} onClick={toggleTheme} title={t.toggleTheme}>{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</button>

            <Notification />

            <button className={styles.iconButton} onClick={() => router.push('/')} title={t.logout}><LogOut size={20} /></button>
          </div>
        </header>

        <div className={styles.formWrapper}>
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.formRow}>
              <div className={`${styles.formGroup} ${errors.title ? styles.hasError : ''}`}>
                <label>{t.internshipTitle}</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder={t.internshipTitlePlaceholder}
                />
                {errors.title && <span className={styles.fieldError}>{errors.title}</span>}
              </div>
              <div className={`${styles.formGroup} ${errors.workType ? styles.hasError : ''}`}>
                <label>{t.workTypeLabel}</label>
                <select name="workType" value={form.workType} onChange={handleChange} title={t.workTypeLabel}>
                  <option value="Remote">{t.remote}</option>
                  <option value="Hybrid">{t.hybrid}</option>
                  <option value="On-site">{t.onSite}</option>
                </select>
                {errors.workType && <span className={styles.fieldError}>{errors.workType}</span>}
              </div>
            </div>

            <div className={`${styles.formGroup} ${errors.description ? styles.hasError : ''}`}>
              <label>{t.descriptionLabel}</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder={t.descriptionPlaceholder}
                rows={5}
              />
              {errors.description && <span className={styles.fieldError}>{errors.description}</span>}
            </div>

            <div className={styles.formRow}>
              {form.workType === 'On-site' ? (
                <div className={`${styles.formGroup} ${errors.governorate ? styles.hasError : ''}`}>
                  <label>{t.locationLabel}</label>
                  <select name="governorate" value={form.governorate} onChange={handleChange} title={t.locationLabel}>
                    <option value="">{t.selectGovernorate}</option>
                    {EGYPT_GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  {errors.governorate && <span className={styles.fieldError}>{errors.governorate}</span>}
                </div>
              ) : (
                <div className={styles.formGroup}>
                  <label>{t.locationLabel}</label>
                  <input value={form.workType === 'Remote' ? t.remote : t.hybrid} disabled className={styles.disabledInput} title={t.locationLabel} />
                </div>
              )}

              <div className={`${styles.formGroup} ${errors.duration ? styles.hasError : ''}`}>
                <label>{t.duration}</label>
                <select name="duration" value={form.duration} onChange={handleChange} title={t.duration}>
                  <option value="">{t.selectDuration}</option>
                  <option value="1 month">{t.oneMonth}</option>
                  <option value="2 months">{t.twoMonths}</option>
                  <option value="3 months">{t.threeMonths}</option>
                  <option value="6 months">{t.sixMonths}</option>
                </select>
                {errors.duration && <span className={styles.fieldError}>{errors.duration}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>{t.stipendOptional}</label>
                <input
                  name="stipend"
                  value={form.stipend}
                  onChange={handleChange}
                  placeholder={t.stipendPlaceholder}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={`${styles.formGroup} ${errors.deadline ? styles.hasError : ''}`}>
                <label>{t.applicationDeadline}</label>
                <input type="date" name="deadline" value={form.deadline} min={today} onChange={handleChange} title={t.applicationDeadline} />
                {errors.deadline && <span className={styles.fieldError}>{errors.deadline}</span>}
              </div>
              <div className={styles.formGroup}>
                <label>{t.compensation}</label>
                <select name="isPaid" value={form.isPaid} onChange={handleChange} title={t.compensation}>
                  <option value="unpaid">{t.unpaid}</option>
                  <option value="paid">{t.paid}</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>{t.requirements}</label>
              <div className={styles.dynamicList}>
                {requirements.map((req, idx) => (
                  <div key={idx} className={styles.dynamicItem}>
                    <input
                      value={req}
                      onChange={e => handleRequirementChange(idx, e.target.value)}
                      placeholder={t.enterRequirement}
                    />
                    {requirements.length > 1 && (
                      <button type="button" className={styles.removeItemBtn} onClick={() => removeRequirement(idx)} title={t.delete}>
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" className={styles.addItemBtn} onClick={addRequirement}>
                <Plus size={16} /> {t.addRequirement}
              </button>
            </div>

            <div className={`${styles.formGroup} ${errors.skills ? styles.hasError : ''}`}>
              <label>{t.requiredSkills}</label>
              <div className={styles.dynamicList}>
                {skills.map((skill, idx) => (
                  <div key={idx} className={styles.dynamicItem}>
                    <input
                      value={skill}
                      onChange={e => handleSkillChange(idx, e.target.value)}
                      placeholder={t.enterSkill}
                    />
                    {skills.length > 1 && (
                      <button type="button" className={styles.removeItemBtn} onClick={() => removeSkill(idx)} title={t.delete}>
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" className={styles.addItemBtn} onClick={addSkill}>
                <Plus size={16} /> {t.addSkillBtn}
              </button>
              {errors.skills && <span className={styles.fieldError}>{errors.skills}</span>}
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.cancelBtn} onClick={() => router.push('/company/myinternships')}>
                {t.cancel}
              </button>
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading
                  ? (isEditMode ? t.updating : t.publishing)
                  : (isEditMode ? t.updateInternship : t.postNewInternship)}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default function PostInternshipPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostInternshipContent />
    </Suspense>
  )
}
