'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
    Calendar, Clock, Video, Check, X,
    Loader2, CheckCircle, RefreshCw,
    ChevronRight, ExternalLink, BookOpen, Menu
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import TopBarControls from '../../components/TopBarControls/TopBarControls'
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen'
import styles from './SessionsPage.module.css'
import api from '../../lib/api'

// ============================================================
//  TYPES
// ============================================================
type SessionStatus = 'Pending' | 'Confirmed' | 'Declined' | 'Completed' | 'Cancelled' | 'Expired' | 'Started' | 'InProgress'

interface Session {
    id: number
    title: string
    student: string
    studentUniversity?: string
    studentMajor?: string
    studentProfileId?: number
    status: SessionStatus
    date: string
    duration: string
    meetingLink?: string
    notes?: string
    currentDate: string
    currentTime: string
}

interface AvailableSlot {
    id: number
    displayDate: string
    displayTime: string
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
async function updateSessionStatus(id: number, status: string): Promise<void> {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        if (status === 'Confirmed') {
            await api.put(`/Mentor/MySessions/confirmsession/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
        } else {
            await api.delete(`/Mentor/MySessions/cancelSession/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
        }
    } catch (err) {
        console.warn('[updateSessionStatus] API failed, updating local state only:', err)
    }
}

async function rescheduleSession(sessionId: number, slotId: number): Promise<void> {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        await api.put(`/Mentor/MySessions/rescheduleSession/${sessionId}/${slotId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
    } catch (err) {
        console.warn('[rescheduleSession] API failed, updating local state only:', err)
    }
}

// ============================================================
//  MOCK DATA
// ============================================================
const MOCK_SESSIONS: Session[] = [
    {
        id: 1, title: 'Portfolio Review', student: 'Ahmed Mohamed',
        studentUniversity: 'Cairo University', studentMajor: 'Software Engineering',
        studentProfileId: 1, status: 'Confirmed',
        date: 'Jan 17, 2:00 PM', duration: '1 hour',
        meetingLink: 'https://zoom.us/j/example',
        notes: 'I need help reviewing my portfolio before applying to jobs.',
        currentDate: 'Jan 17', currentTime: '2:00 PM – 3:00 PM',
    },
    {
        id: 2, title: 'Resume Review', student: 'Sara Ali',
        studentUniversity: 'Ain Shams University', studentMajor: 'Computer Science',
        studentProfileId: 2, status: 'Pending',
        date: 'Tomorrow, 10:00 AM', duration: '45 min',
        notes: 'Please help me improve my resume for software engineering roles.',
        currentDate: 'Tomorrow', currentTime: '10:00 AM – 10:45 AM',
    },
    {
        id: 3, title: 'Technical Discussion', student: 'Layla Ibrahim',
        studentUniversity: 'Alexandria University', studentMajor: 'UI/UX Design',
        studentProfileId: 3, status: 'Completed',
        date: 'Jan 15, 2024', duration: '1 hour',
        currentDate: 'Jan 15', currentTime: '1:00 PM – 2:00 PM',
    },
    {
        id: 4, title: 'Mock Cancelled Session', student: 'Omar Hassan',
        studentUniversity: 'Cairo University', studentMajor: 'Engineering',
        status: 'Cancelled', date: 'Jan 10, 2024', duration: '1 hour',
        notes: 'Session cancelled by user.',
        currentDate: 'Jan 10', currentTime: '2:00 PM – 3:00 PM',
    },
    {
        id: 5, title: 'Mock Expired Session', student: 'Mariam Ali',
        studentUniversity: 'GUC', studentMajor: 'Management',
        status: 'Expired', date: 'Jan 05, 2024', duration: '30 min',
        notes: 'Session expired request.',
        currentDate: 'Jan 05', currentTime: '10:00 AM – 10:30 AM',
    },
]

// ============================================================
//  STATUS BADGE
// ============================================================
function StatusBadge({ status }: { status: SessionStatus }) {
    const cls: Record<SessionStatus, string> = {
        Confirmed: styles.badgeConfirmed,
        Pending: styles.badgePending,
        Declined: styles.badgeDeclined,
        Completed: styles.badgeCompleted,
        Cancelled: styles.badgeCancelled,
        Expired: styles.badgeExpired,
        Started: styles.badgeConfirmed,
        InProgress: styles.badgeConfirmed,
    }
    return <span className={`${styles.badge} ${cls[status] || styles.badgePending}`}>{status}</span>
}

// ============================================================
//  VIEW DETAILS MODAL
// ============================================================
function ViewDetailsModal({ session, onClose }: {
    session: Session
    onClose: () => void
}) {
    const [details, setDetails] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem('token')
                const res = await api.get(`/Mentor/MySessions/viewdetails/${session.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            } catch (err) {
                console.warn('Failed to fetch session details, using mock details from parent:', err)
                setDetails({
                    topic: session.title || 'Mentorship Session',
                    notes: 'Please prepare your resume and questions before the session.',
                    platformLink: 'https://zoom.us/j/1234567890',
                    student: {
                        name: session.student,
                        university: session.studentUniversity || 'Cairo University',
                        major: session.studentMajor || 'Computer Science'
                    }
                })
            } finally {
                setLoading(false)
            }
        }
        fetchDetails()
    }, [session.id])

    const isConfirmed = session.status === 'Confirmed'
    const studentName = details?.student?.name || session.student
    const university = details?.student?.university || session.studentUniversity || ''
    const major = details?.student?.major || session.studentMajor || ''
    const topic = details?.topic || session.title
    const notes = details?.notes || session.notes
    const meetingLink = details?.platformLink || session.meetingLink

    return (
        <div
            className={styles.overlay}
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className={styles.detailsModal}>
                {/* Header */}
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Session Details</h2>
                    <button onClick={onClose} className={styles.closeBtn} title="Close">
                        <X size={18} />
                    </button>
                </div>

                {loading ? (
                    <div className={styles.loadingState} style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <Loader2 size={24} className="animate-spin" />
                        <span>Loading session details...</span>
                    </div>
                ) : error ? (
                    <div className={styles.errorState} style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>{error}</div>
                ) : (
                    <div className={styles.modalBody}>
                        {/* Student Info */}
                        <div className={styles.studentInfoCard}>
                            <div className={styles.studentInfoLeft}>
                                <div className={styles.studentAvatar}>{studentName.charAt(0)}</div>
                                <div>
                                    <p className={styles.studentName}>{studentName}</p>
                                    {university && (
                                        <p className={styles.studentUniversity}>{university}</p>
                                    )}
                                    {major && (
                                        <p className={styles.studentMajor}>{major}</p>
                                    )}
                                </div>
                            </div>
                            {session.studentProfileId && (
                                <button className={styles.viewProfileBtn}>
                                    View Profile <ChevronRight size={13} />
                                </button>
                            )}
                        </div>

                        {/* Session Info Grid */}
                        <div>
                            <p className={styles.infoSectionLabel}>Session Info</p>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoCell}>
                                    <p className={styles.infoCellLabel}>Title</p>
                                    <p className={styles.infoCellValue}>{topic}</p>
                                </div>
                                <div className={styles.infoCell}>
                                    <p className={styles.infoCellLabel}>Status</p>
                                    <StatusBadge status={session.status} />
                                </div>
                                <div className={styles.infoCell}>
                                    <p className={styles.infoCellLabel}>Date & Time</p>
                                    <div className={styles.infoCellMeta}>
                                        <Calendar size={12} color="#3b82f6" />
                                        <span>{session.date}</span>
                                    </div>
                                </div>
                                <div className={styles.infoCell}>
                                    <p className={styles.infoCellLabel}>Duration</p>
                                    <div className={styles.infoCellMeta}>
                                        <Clock size={12} color="#3b82f6" />
                                        <span>{session.duration}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        {notes && (
                            <div>
                                <p className={styles.infoSectionLabel}>Notes from Student</p>
                                <div className={styles.notesBox}>
                                    <BookOpen size={14} color="#3b82f6" style={{ marginTop: 2, flexShrink: 0 }} />
                                    <p className={styles.notesText}>&quot;{notes}&quot;</p>
                                </div>
                            </div>
                        )}

                        {/* Meeting Link */}
                        {isConfirmed && meetingLink && (
                            <div>
                                <p className={styles.infoSectionLabel}>Session Link</p>
                                <Link
                                    href={meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.meetingLink}
                                >
                                    <div className={styles.meetingLinkIcon}>
                                        <Video size={16} color="white" />
                                    </div>
                                    <div className={styles.meetingLinkBody}>
                                        <p className={styles.meetingLinkTitle}>Join Meeting</p>
                                        <p className={styles.meetingLinkUrl}>{meetingLink}</p>
                                    </div>
                                    <ExternalLink size={14} className={styles.meetingLinkArrow} />
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className={styles.detailsModalFooter}>
                    <button onClick={onClose} className={styles.closeFullBtn}>Close</button>
                </div>
            </div>
        </div>
    )
}

// ============================================================
//  RESCHEDULE MODAL
// ============================================================
function RescheduleModal({ session, onClose, onSuccess }: {
    session: Session
    onClose: () => void
    onSuccess: (sessionId: number, slotId: number, newSlot: AvailableSlot) => void
}) {
    const [slots, setSlots] = useState<AvailableSlot[]>([])
    const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null)
    const [loadingSlots, setLoadingSlots] = useState(true)
    const [confirming, setConfirming] = useState(false)
    const [done, setDone] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchRescheduleSlots = async () => {
            try {
                setLoadingSlots(true)
                const token = localStorage.getItem('token')
                const res = await api.get('/Mentor/MySessions/rescheduleSession', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const data = res.data?.data || res.data || []
                const mapped = data.map((s: any) => ({
                    id: s.slotId,
                    displayDate: `${s.day}, ${s.date}`,
                    displayTime: `${s.startTime} - ${s.endTime}`
                }))
                setSlots(mapped)
            } catch (err) {
                console.warn('Failed to fetch reschedule slots, using mock slots:', err)
                setSlots([
                    { id: 101, displayDate: 'Monday, Jan 29', displayTime: '10:00 AM - 11:30 AM' },
                    { id: 102, displayDate: 'Wednesday, Jan 31', displayTime: '2:00 PM - 4:00 PM' },
                    { id: 103, displayDate: 'Friday, Feb 2', displayTime: '1:00 PM - 2:00 PM' }
                ])
            } finally {
                setLoadingSlots(false)
            }
        }
        fetchRescheduleSlots()
    }, [session.id])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose])

    const handleConfirm = async () => {
        if (!selectedSlot) return
        setConfirming(true)
        setError(null)
        try {
            await rescheduleSession(session.id, selectedSlot.id)
            setDone(true)
            setTimeout(() => { onSuccess(session.id, selectedSlot.id, selectedSlot); onClose() }, 1200)
        } catch {
            setError('Something went wrong. Please try again.')
            setConfirming(false)
        }
    }



    return (
        <div
            className={styles.overlay}
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className={styles.rescheduleModal}>
                {/* Header */}
                <div className={styles.rescheduleHeader}>
                    <div>
                        <p className={styles.rescheduleEyebrow}>Rescheduling</p>
                        <h2 className={styles.rescheduleTitle}>{session.title}</h2>
                        <p className={styles.rescheduleStudent}>{session.student}</p>
                    </div>
                    <button onClick={onClose} className={styles.closeBtn} title="Close">
                        <X size={18} />
                    </button>
                </div>

                {/* Current Slot */}
                <div className={styles.currentSlotBar}>
                    <div className={styles.currentSlotBox}>
                        <Calendar size={13} color="#94a3b8" />
                        <span className={styles.currentSlotLabel}>Current:</span>
                        <span className={styles.currentSlotValue}>
                            {session.currentDate} · {session.currentTime}
                        </span>
                    </div>
                    <p className={styles.slotSelectHint}>Select a new available slot for this session</p>
                    <hr className={styles.divider} />
                </div>

                {/* Slots List */}
                <div className={styles.slotsScrollArea}>
                    {loadingSlots && (
                        <div className={styles.loadingState}>
                            <Loader2 size={24} className="animate-spin" />
                            <span>Loading available slots...</span>
                        </div>
                    )}
                    {error && !loadingSlots && (
                        <div className={styles.errorState}>{error}</div>
                    )}
                    {!loadingSlots && !error && slots.length === 0 && (
                        <p className={styles.emptyState}>No available slots at the moment.</p>
                    )}
                    {!loadingSlots && !error && slots.map(slot => {
                        const isSelected = selectedSlot?.id === slot.id
                        return (
                            <div
                                key={slot.id}
                                onClick={() => setSelectedSlot(slot)}
                                className={`${styles.slotItem} ${isSelected ? styles.slotItemSelected : styles.slotItemDefault}`}
                            >
                                <div className={styles.slotItemLeft}>
                                    <div className={`${styles.slotIconBox} ${isSelected ? styles.slotIconBoxSelected : styles.slotIconBoxDefault}`}>
                                        <Calendar size={16} color={isSelected ? '#3b82f6' : '#94a3b8'} />
                                    </div>
                                    <div>
                                        <p className={styles.slotDate}>{slot.displayDate}</p>
                                        <div className={styles.slotTimeMeta}>
                                            <Clock size={11} color="#94a3b8" />
                                            <span>{slot.displayTime}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className={`${styles.slotSelectBadge} ${isSelected ? styles.slotSelectBadgeSelected : styles.slotSelectBadgeDefault}`}>
                                    {isSelected ? 'Selected' : 'Select'}
                                </span>
                            </div>
                        )
                    })}
                </div>

                {/* Selected Slot Summary */}
                {selectedSlot && (
                    <div className={styles.selectedSummary}>
                        <div>
                            <p className={styles.summaryLabel}>New Date</p>
                            <p className={styles.summaryValue}>{selectedSlot.displayDate}</p>
                        </div>
                        <div className={styles.summaryDivider} />
                        <div>
                            <p className={styles.summaryLabel}>New Time</p>
                            <p className={styles.summaryValue}>{selectedSlot.displayTime}</p>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className={styles.rescheduleFooter}>
                    <button onClick={onClose} className={styles.rescheduleCancelBtn}>Cancel</button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedSlot || confirming || done}
                        className={`${styles.rescheduleConfirmBtn} ${done
                                ? styles.confirmBtnDone
                                : (!selectedSlot || confirming)
                                    ? styles.confirmBtnDisabled
                                    : styles.confirmBtnDefault
                            }`}
                    >
                        {done
                            ? <><CheckCircle size={16} /> Rescheduled!</>
                            : confirming
                                ? <><Loader2 size={16} className="animate-spin" /> Confirming...</>
                                : 'Confirm Reschedule'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ============================================================
//  SESSION CARD
// ============================================================
function SessionCard({ session, onViewDetails, onReschedule, onUpdate }: {
    session: Session
    onViewDetails: () => void
    onReschedule: () => void
    onUpdate: (id: number, status: string) => Promise<void>
}) {
    const [loadingAction, setLoadingAction] = useState<string | null>(null)
    const isConfirmed = session.status === 'Confirmed'
    const isPending = session.status === 'Pending'

    const handleAction = async (status: string) => {
        setLoadingAction(status)
        await onUpdate(session.id, status)
        setLoadingAction(null)
    }

    const handleStartMeeting = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await api.get(`/Mentor/MySessions/joinMeeting/${session.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const link = res.data?.link || res.data
            if (link) {
                window.open(link, '_blank', 'noopener,noreferrer')
            } else {
                alert('No meeting link available.')
            }
        } catch (err) {
            console.error('Failed to join meeting:', err)
            alert('Failed to get meeting link.')
        }
    }

    return (
        <div className={styles.sessionCard}>
            <div className={styles.sessionCardTop}>
                <div className={styles.sessionAvatar}>{session.student.charAt(0)}</div>
                <div className={styles.sessionInfo}>
                    <h3 className={styles.sessionTitle}>{session.title}</h3>
                    <p className={styles.sessionStudent}>with {session.student}</p>
                    <div className={styles.sessionMeta}>
                        <span className={styles.sessionMetaItem}>
                            <Calendar size={13} />{session.date}
                        </span>
                        <span className={styles.sessionMetaItem}>
                            <Clock size={13} />{session.duration}
                        </span>
                    </div>
                </div>
                <StatusBadge status={session.status} />
            </div>

            <div className={styles.cardActions}>
                {isConfirmed && (
                    <button onClick={handleStartMeeting} className={styles.btnStartMeeting}>
                        <Video size={14} />
                        Start Meeting
                    </button>
                )}
                {isPending && (
                    <>
                        <button
                            onClick={() => handleAction('Confirmed')}
                            disabled={!!loadingAction}
                            className={styles.btnConfirm}
                        >
                            {loadingAction === 'Confirmed'
                                ? <Loader2 size={14} className="animate-spin" />
                                : <Check size={14} />}
                            Confirm
                        </button>
                        <button
                            onClick={() => handleAction('Declined')}
                            disabled={!!loadingAction}
                            className={styles.btnDecline}
                        >
                            {loadingAction === 'Declined'
                                ? <Loader2 size={14} className="animate-spin" />
                                : <X size={14} />}
                            Decline
                        </button>
                    </>
                )}
                <button onClick={onViewDetails} className={styles.btnViewDetails}>
                    View Details
                </button>
                {(isConfirmed || isPending) && (
                    <button onClick={onReschedule} className={styles.btnReschedule}>
                        <RefreshCw size={13} />
                        Reschedule
                    </button>
                )}
            </div>
        </div>
    )
}

// ============================================================
//  MAIN PAGE
// ============================================================
export default function SessionsPage() {
    const { language, sidebarOpen, setSidebarOpen } = useApp()
    const searchParams = useSearchParams()

    const [sessions, setSessions] = useState<Session[]>([])
    const [loading, setLoading] = useState(true)
    const [pageError, setPageError] = useState<string | null>(null)
    const [detailsSession, setDetailsSession] = useState<Session | null>(null)
    const [rescheduleSession, setRescheduleSession] = useState<Session | null>(null)
    const [statusFilter, setStatusFilter] = useState<'All' | 'Confirmed' | 'Cancelled' | 'Expired' | 'Pending'>('All')

    const filterOptions = [
        { key: 'All', labelAr: 'الكل', labelEn: 'All' },
        { key: 'Confirmed', labelAr: 'مؤكدة', labelEn: 'Confirmed' },
        { key: 'Pending', labelAr: 'قيد الانتظار', labelEn: 'Pending' },
        { key: 'Cancelled', labelAr: 'ملغاة', labelEn: 'Cancelled' },
        { key: 'Expired', labelAr: 'منتهية الصلاحية', labelEn: 'Expired' }
    ] as const

    const filteredSessions = sessions.filter(session => {
        if (statusFilter === 'All') return true
        if (statusFilter === 'Confirmed') return session.status === 'Confirmed'
        if (statusFilter === 'Cancelled') return session.status === 'Cancelled' || session.status === 'Declined'
        if (statusFilter === 'Expired') return session.status === 'Expired'
        if (statusFilter === 'Pending') return session.status === 'Pending'
        return true
    })

    const fetchSessions = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const res = await api.get('/Mentor/MySessions', {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = res.data?.data || res.data || []
            const mapped = data.map((s: any) => ({
                id: s.sessionId,
                title: s.topic || 'Mentorship Session',
                student: s.menteeName || '',
                status: s.status as SessionStatus,
                date: s.formattedDate || '',
                duration: s.duration || '',
                studentProfileId: s.menteeId,
                currentDate: s.formattedDate ? s.formattedDate.split(',')[0] : '',
                currentTime: s.formattedDate ? s.formattedDate.split(',')[1] || '' : '',
            }))
            setSessions(mapped)
        } catch (err: any) {
            console.warn('[fetchSessions] API failed, falling back to MOCK_SESSIONS:', err)
            setSessions(MOCK_SESSIONS)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const loadData = async () => {
            await fetchSessions()
            const rescheduleId = searchParams.get('reschedule')
            if (rescheduleId) {
                const session = MOCK_SESSIONS.find(s => s.studentProfileId === Number(rescheduleId))
                if (session) setRescheduleSession(session)
            }
        }
        loadData()
    }, [searchParams])

    if (loading) {
        return <LoadingScreen />
    }

    const handleUpdateStatus = async (id: number, status: string) => {
        await updateSessionStatus(id, status)
        setSessions(prev =>
            prev.map(s => s.id === id ? { ...s, status: status as SessionStatus } : s)
        )
    }

    const handleRescheduleSuccess = (sessionId: number, _slotId: number, newSlot: AvailableSlot) => {
        setSessions(prev =>
            prev.map(s => s.id === sessionId
                ? {
                    ...s,
                    status: 'Confirmed',
                    date: `${newSlot.displayDate}, ${newSlot.displayTime}`,
                    currentDate: newSlot.displayDate,
                    currentTime: newSlot.displayTime,
                }
                : s
            )
        )
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.pageHeader}>
                    <div>
                        <h1 className={styles.pageTitle}>
                            {language === 'ar' ? 'جلساتي' : 'My Sessions'}
                        </h1>
                        <p className={styles.pageSubtitle}>
                            {language === 'ar' ? 'إدارة الطلبات والجدول الزمني' : 'Manage your session requests and schedule'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button className={styles.hamburgerBtn} onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle menu">
                            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                        <TopBarControls />
                    </div>
                </div>



                {pageError && !loading && (
                    <div className={styles.errorState}>{pageError}</div>
                )}

                {!loading && !pageError && (
                    <>
                        <div className={styles.filterBar}>
                            {filterOptions.map(opt => {
                                const isActive = statusFilter === opt.key
                                const label = language === 'ar' ? opt.labelAr : opt.labelEn
                                return (
                                    <button
                                        key={opt.key}
                                        className={`${styles.filterPill} ${isActive ? styles.filterPillActive : ''}`}
                                        onClick={() => setStatusFilter(opt.key)}
                                    >
                                        {label}
                                    </button>
                                )
                            })}
                        </div>

                        <div className={styles.sessionsList}>
                            {filteredSessions.map(session => (
                                <SessionCard
                                    key={session.id}
                                    session={session}
                                    onViewDetails={() => setDetailsSession(session)}
                                    onReschedule={() => setRescheduleSession(session)}
                                    onUpdate={handleUpdateStatus}
                                />
                            ))}
                            {filteredSessions.length === 0 && (
                                <p className={styles.emptyState}>
                                    {language === 'ar' 
                                        ? 'لا توجد جلسات تطابق هذا التصفية.' 
                                        : 'No sessions found matching this filter.'}
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>

            {detailsSession && (
                <ViewDetailsModal
                    session={detailsSession}
                    onClose={() => setDetailsSession(null)}
                />
            )}

            {rescheduleSession && (
                <RescheduleModal
                    session={rescheduleSession}
                    onClose={() => setRescheduleSession(null)}
                    onSuccess={handleRescheduleSuccess}
                />
            )}
        </div>
    )
}
