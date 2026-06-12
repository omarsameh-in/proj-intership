'use client'
import React, { useState, useRef, useEffect } from 'react'
import { User, Briefcase, Clock, Save, Trash2, Edit, Upload, X, Plus, FileText, CheckCircle, Calendar } from 'lucide-react'
import { useApp, Slot } from '../../context/AppContext'
import TopBarControls from '../../components/TopBarControls/TopBarControls'
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen'
import styles from './ProfileSettings.module.css'
import api from '../../lib/api'

// ============================================================
//  TYPES
// ============================================================
interface PendingSlot {
    id: number
    day: string
    time: string
}

// ============================================================
//  CONFIG
// ============================================================
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://your-api.com'

const authHeader = (): Record<string, string> => ({
    'Content-Type': 'application/json',
})

// ============================================================
//  API CALLS
// ============================================================
async function saveSlots(slots: PendingSlot[]): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/mentor/slots`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ slots }),
    })
    if (!res.ok) throw new Error('Failed to save slots')
}

// ============================================================
//  MANAGEMENT SETTINGS MODAL
// ============================================================
function ManagementModal({ onClose }: { onClose: () => void }) {
    const { slots, addSlots, deleteSlot } = useApp()

    const [day, setDay]   = useState('')
    const [time, setTime] = useState('')
    const [pendingSlots, setPendingSlots] = useState<PendingSlot[]>([])
    const [saving, setSaving] = useState(false)
    const [error, setError]   = useState<string | null>(null)

    const handleAddSlot = () => {
        if (!day || !time) return
        const date = new Date(day)
        const displayDay = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
        const [h, m]  = time.split(':').map(Number)
        const ampm    = h >= 12 ? 'PM' : 'AM'
        const hour12  = h % 12 || 12
        const displayTime = `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`

        setPendingSlots(prev => [
            ...prev,
            { id: Date.now(), day: displayDay, time: displayTime },
        ])
        setDay('')
        setTime('')
    }

    const handleRemovePending = (id: number) => {
        setPendingSlots(prev => prev.filter(s => s.id !== id))
    }

    const handleSave = async () => {
        setSaving(true)
        setError(null)
        try {
            if (pendingSlots.length > 0) {
                await saveSlots(pendingSlots)
                addSlots(pendingSlots.map(s => ({ id: s.id, day: s.day, time: s.time })))
            }
            onClose()
        } catch {
            setError('Failed to save. Please try again.')
            setSaving(false)
        }
    }

    return (
        <div
            className={styles.overlay}
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className={styles.modal}>
                {/* Header */}
                <div className={styles.modalHeaderInner}>
                    <div className={styles.modalTitleRow}>
                        <h2 className={styles.modalTitle}>Management Settings</h2>
                        <button onClick={onClose} className={styles.closeBtn} title="Close"><X size={20} /></button>
                    </div>
                    <p className={styles.modalSubtitle}>
                        Configure your free slots, session pricing, and platform details.
                    </p>
                    <hr className={styles.modalDivider} />
                </div>

                {/* Scrollable Content */}
                <div className={styles.modalBody}>

                    {/* Add Free Slot */}
                    <div className={styles.addSlotSection}>
                        <h3 className={styles.addSlotTitle}>Add Free Slot</h3>
                        <div className={styles.addSlotGrid}>
                            <div>
                                <label className={styles.addSlotLabel}>Day</label>
                                <input
                                    type="date"
                                    value={day}
                                    onChange={e => setDay(e.target.value)}
                                    className={styles.addSlotInput}
                                    aria-label="Day"
                                />
                            </div>
                            <div>
                                <label className={styles.addSlotLabel}>Time</label>
                                <input
                                    type="time"
                                    value={time}
                                    onChange={e => setTime(e.target.value)}
                                    className={styles.addSlotInputSecondary}
                                    aria-label="Time"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleAddSlot}
                            disabled={!day || !time}
                            className={`${styles.addSlotBtn} ${!day || !time ? styles.addSlotBtnDisabled : styles.addSlotBtnEnabled}`}
                        >
                            <Plus size={16} /> Add Slot
                        </button>
                    </div>

                    {/* Pending Slots */}
                    {pendingSlots.length > 0 && (
                        <div className={styles.pendingSection}>
                            <h3 className={styles.pendingSectionTitle}>
                                New Slots to be Added ({pendingSlots.length})
                            </h3>
                            <div className={styles.pendingList}>
                                {pendingSlots.map(slot => (
                                    <div key={slot.id} className={styles.pendingItem}>
                                        <div className={styles.pendingItemLeft}>
                                            <Calendar size={15} color="#3b82f6" />
                                            <span className={styles.pendingItemDay}>{slot.day}</span>
                                        </div>
                                        <div className={styles.pendingItemRight}>
                                            <span className={styles.pendingItemTime}>{slot.time}</span>
                                            <button onClick={() => handleRemovePending(slot.id)} className={styles.pendingDeleteBtn} title="Remove Slot">
                                                <Trash2 size={15} color="#ef4444" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <hr className={styles.modalDivider} />

                    {/* Session Details */}
                    <div className={styles.sessionDetailsSection}>
                        <h3 className={styles.sessionDetailsTitle}>Session Details</h3>
                        <div className={styles.formField}>
                            <label htmlFor="session-type" className={styles.formLabel}>Session Type</label>
                            <select id="session-type" className={styles.formSelect} title="Session Type">
                                <option>Paid Sessions</option>
                                <option>Free Sessions</option>
                                <option>Both</option>
                            </select>
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="hourly-rate" className={styles.formLabel}>Session Salary / Hourly Rate (EGP)</label>
                            <input id="hourly-rate" type="number" defaultValue="500" className={styles.formInput} />
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="session-duration" className={styles.formLabel}>Default Session Duration (minutes)</label>
                            <input id="session-duration" type="number" defaultValue="60" className={styles.formInput} />
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="meeting-platform" className={styles.formLabel}>Meeting Platform</label>
                            <select id="meeting-platform" className={styles.formSelect} title="Meeting Platform">
                                <option>Zoom</option>
                                <option>Google Meet</option>
                                <option>Microsoft Teams</option>
                            </select>
                        </div>
                    </div>

                    {error && <div className={styles.errorBox}>{error}</div>}
                </div>

                {/* Footer */}
                <div className={styles.modalFooter}>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`${styles.modalSaveBtn} ${saving ? styles.modalSaveBtnDisabled : styles.modalSaveBtnActive}`}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ============================================================
//  CV UPLOAD ZONE
// ============================================================
function CVUploadZone() {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [isDragging, setIsDragging]     = useState(false)

    const acceptedTypes = '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    const handleFile   = (file: File) => setUploadedFile(file)
    const handleDrop   = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) handleFile(f) }

    return (
        <>
            <input ref={fileInputRef} type="file" accept={acceptedTypes} className={styles.hidden} onChange={handleChange} aria-label="Upload CV" />
            {uploadedFile ? (
                <div className={styles.uploadedFile}>
                    <FileText size={28} color="#22c55e" />
                    <div className={styles.flexGrow}>
                        <p className={styles.uploadedFileName}>{uploadedFile.name}</p>
                        <p className={styles.uploadedFileSize}>{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <CheckCircle size={20} color="#22c55e" />
                    <button onClick={() => setUploadedFile(null)} className={styles.removeFileBtn} title="Remove File">
                        <X size={18} />
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`${styles.dropZone} ${isDragging ? styles.dropZoneDragging : styles.dropZoneDefault}`}
                >
                    <Upload size={36} strokeWidth={1.5} color="#3b4f7c" />
                    <div className={styles.textCenter}>
                        <p className={styles.dropZoneTitle}>Drag and drop your CV here</p>
                        <p className={styles.dropZoneSubtitle}>or click to browse (PDF, DOC, DOCX)</p>
                    </div>
                </div>
            )}
        </>
    )
}

// ============================================================
//  EDIT PROFILE MODAL
// ============================================================
function EditProfileModal({ onClose }: { onClose: () => void }) {
    const fields = [
        { label: 'Full Name',           value: 'Dr. Ahmed Hassan' },
        { label: 'Email',               value: 'ahmed.hassan@example.com' },
        { label: 'Phone Number',        value: '+20 123 456 7890' },
        { label: 'Location',            value: 'Cairo, Egypt' },
        { label: 'Current Job Title',   value: 'Senior Software Engineer' },
        { label: 'Years of Experience', value: '15' },
        { label: 'LinkedIn Profile',    value: 'linkedin.com/in/ahmedhassan' },
    ]

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeaderInner}>
                    <div className={styles.modalTitleRow}>
                        <h2 className={styles.modalTitle}>Edit Profile</h2>
                        <button onClick={onClose} className={styles.closeBtn} title="Close"><X size={20} /></button>
                    </div>
                    <p className={styles.modalSubtitle}>Update your personal and professional info.</p>
                    <hr className={styles.modalDivider} />
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.flexColumn}>
                        {fields.map(f => (
                            <div key={f.label}>
                                <label className={styles.fieldLabel}>{f.label}</label>
                                <input defaultValue={f.value} className={styles.fieldInput} aria-label={f.label} />
                            </div>
                        ))}
                        <div>
                            <label className={styles.fieldLabel}>Bio</label>
                            <textarea
                                defaultValue="Passionate about mentoring young developers..."
                                className={styles.fieldTextarea}
                                aria-label="Bio"
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.modalFooter}>
                    <button onClick={onClose} className={`${styles.modalSaveBtn} ${styles.modalSaveBtnActive}`}>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    )
}

// ============================================================
//  PROFILE FIELD
// ============================================================
function ProfileField({ label, value, onChange, isEditing }: { label: string; value: string; onChange: (v: string) => void; isEditing: boolean }) {
    return (
        <div className={styles.widthFull}>
            <label className={styles.fieldLabel}>{label}</label>
            <input
                value={value}
                onChange={e => onChange(e.target.value)}
                className={`${styles.fieldInput} ${!isEditing ? styles.fieldReadOnly : ''}`}
                readOnly={!isEditing}
                aria-label={label}
            />
        </div>
    )
}

// ============================================================
//  MAIN PAGE
// ============================================================
export default function ProfileSettings() {
    const { slots, deleteSlot, language } = useApp()
    const [showManagement, setShowManagement]   = useState(false)
    const [isEditing, setIsEditing]             = useState(false)
    const [loading, setLoading]                 = useState(true)

    const defaultProfile = {
        fullName:    'Dr. Ahmed Hassan',
        email:       'ahmed.hassan@example.com',
        phone:       '+20 123 456 7890',
        location:    'Cairo, Egypt',
        jobTitle:    'Senior Software Engineer',
        experience:  '15',
        linkedin:    'linkedin.com/in/ahmedhassan',
        bio:         'Passionate about mentoring young developers and helping them navigate their career paths. With 15 years in the industry, I specialize in software architecture and team leadership.',
    }

    const [profileData, setProfileData] = useState(defaultProfile)
    const [editData, setEditData] = useState(defaultProfile)

    const fetchProfile = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const res = await api.get('/api/mentor/profile', {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = res.data?.data || res.data
            setProfileData(data)
            setEditData(data)
        } catch (err: any) {
            console.warn('[fetchProfile] API failed, falling back to localStorage/mock:', err)
            const saved = localStorage.getItem('mentorProfile')
            const profile = saved ? JSON.parse(saved) : defaultProfile
            setProfileData(profile)
            setEditData(profile)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    const handleEdit = () => {
        setEditData({ ...profileData })
        setIsEditing(true)
    }

    const handleCancel = () => {
        setIsEditing(false)
    }

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token')
            await api.put('/api/mentor/profile', editData, {
                headers: { Authorization: `Bearer ${token}` }
            })
        } catch (err: any) {
            console.warn('[handleSave] API failed, saving locally:', err)
        }
        setProfileData({ ...editData })
        localStorage.setItem('mentorProfile', JSON.stringify(editData))
        setIsEditing(false)
    }
    const handleChange = (field: keyof typeof editData, value: string) => {
        setEditData(prev => ({ ...prev, [field]: value }))
    }

    const displayed = isEditing ? editData : profileData

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <>
            {showManagement && <ManagementModal onClose={() => setShowManagement(false)} />}

            <div className={styles.page}>
                <div className={styles.container}>

                    <div className={styles.pageHeader}>
                        <div>
                            <h1 className={styles.pageTitle}>
                                {language === 'ar' ? 'إعدادات الملف الشخصي' : 'Profile Settings'}
                            </h1>
                            <p className={styles.pageSubtitle}>
                                {language === 'ar' ? 'إدارة معلومات ملفك الشخصي كمرشد' : 'Manage your mentor profile information'}
                            </p>
                        </div>
                        <div className={styles.flexCenter}>
                            <TopBarControls />
                        </div>
                    </div>

                    <div className={styles.sectionsStack}>

                        <div className={styles.editBarTop}>
                            {!isEditing ? (
                                <button onClick={handleEdit} className={styles.editProfileBtn} title={language === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}>
                                    <Edit size={16} /> {language === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}
                                </button>
                            ) : (
                                <div className={styles.editActionBtns}>
                                    <button onClick={handleCancel} className={styles.cancelEditBtn}>
                                        <X size={16} /> {language === 'ar' ? 'إلغاء' : 'Cancel'}
                                    </button>
                                    <button onClick={handleSave} className={styles.saveEditBtn}>
                                        <Save size={16} /> {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Personal Information */}
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <User size={20} color="#1e293b" />
                                <h2 className={styles.sectionTitle}>Personal Information</h2>
                            </div>
                            <div className={styles.twoColGrid}>
                                <ProfileField label="Full Name"    value={displayed.fullName}   onChange={v => handleChange('fullName', v)}   isEditing={isEditing} />
                                <ProfileField label="Email"        value={displayed.email}       onChange={v => handleChange('email', v)}       isEditing={isEditing} />
                                <ProfileField label="Phone Number" value={displayed.phone}       onChange={v => handleChange('phone', v)}       isEditing={isEditing} />
                                <ProfileField label="Location"     value={displayed.location}    onChange={v => handleChange('location', v)}    isEditing={isEditing} />
                            </div>
                        </section>

                        {/* Professional Information */}
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <Briefcase size={20} color="#1e293b" />
                                <h2 className={styles.sectionTitle}>Professional Information</h2>
                            </div>
                            <div className={`${styles.twoColGrid} ${styles.marginBottom20}`}>
                                <ProfileField label="Current Job Title"   value={displayed.jobTitle}   onChange={v => handleChange('jobTitle', v)}   isEditing={isEditing} />
                                <ProfileField label="Years of Experience" value={displayed.experience} onChange={v => handleChange('experience', v)} isEditing={isEditing} />
                                <div className={styles.fullWidth}>
                                    <ProfileField label="LinkedIn Profile" value={displayed.linkedin}   onChange={v => handleChange('linkedin', v)}   isEditing={isEditing} />
                                </div>
                            </div>
                            <div>
                                <label className={styles.fieldLabel}>Bio</label>
                                <textarea
                                    className={`${styles.fieldTextarea} ${!isEditing ? styles.fieldReadOnly : ''}`}
                                    value={displayed.bio}
                                    onChange={e => handleChange('bio', e.target.value)}
                                    readOnly={!isEditing}
                                    aria-label="Bio"
                                />
                            </div>
                        </section>

                        {/* Upload CV */}
                        <section className={styles.section}>
                            <h2 className={`${styles.sectionTitle} ${styles.marginBottom16}`}>Upload CV</h2>
                            <CVUploadZone />
                        </section>

                        {/* Availability & Preferences */}
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <Clock size={20} color="#1e293b" />
                                <h2 className={styles.sectionTitle}>Availability & Preferences</h2>
                            </div>
                            <p className={styles.slotHint}>Available Free Slots</p>
                            <div className={styles.slotsList}>
                                {slots.map(slot => (
                                    <div key={slot.id} className={styles.slotItem}>
                                        <div className={styles.slotLeft}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                            </svg>
                                            <span className={styles.slotDay}>{slot.day}</span>
                                        </div>
                                        <div className={styles.slotRight}>
                                            <span className={styles.slotTime}>{slot.time}</span>
                                            <button onClick={() => deleteSlot(slot.id)} className={styles.slotDeleteBtn} title="Delete Slot">
                                                <Trash2 size={17} color="#ef4444" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {slots.length === 0 && (
                                    <p className={styles.slotsEmpty}>No available slots yet. Add one below.</p>
                                )}
                            </div>
                            <button onClick={() => setShowManagement(true)} className={styles.manageBtn}>
                                <Edit size={15} /> Manage Availability & Preferences
                            </button>
                        </section>

                    </div>
                </div>
            </div>
        </>
    )
}
