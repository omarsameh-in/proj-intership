'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
    Calendar, Clock, Video, Check, X,
    Loader2, CheckCircle, RefreshCw,
    ChevronRight, ExternalLink, BookOpen
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import TopBarControls from '../../components/TopBarControls/TopBarControls'
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen'
import styles from './SessionsPage.module.css'

// ============================================================
//  TYPES
// ============================================================
type SessionStatus = 'Pending' | 'Confirmed' | 'Declined' | 'Completed'

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
    const res = await fetch(`${BASE_URL}/api/sessions/${id}/status`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify({ status }),
    })
    if (!res.ok) throw new Error('Failed to update status')
}

async function rescheduleSession(sessionId: number, slotId: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/sessions/${sessionId}/reschedule`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify({ newSlotId: slotId }),
    })
    if (!res.ok) throw new Error('Failed to reschedule')
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
]

// ============================================================
//  STATUS BADGE
// ============================================================
function StatusBadge({ status }: { status: SessionStatus }) {
    const cls: Record<SessionStatus, string> = {
        Confirmed: styles.badgeConfirmed,
        Pending:   styles.badgePending,
        Declined:  styles.badgeDeclined,
        Completed: styles.badgeCompleted,
    }
    return <span className={`${styles.badge} ${cls[status]}`}>{status}</span>
}

// ============================================================
//  VIEW DETAILS MODAL
// ============================================================
function ViewDetailsModal({ session, onClose }: {
    session: Session
    onClose: () => void
}) {
    const isConfirmed = session.status === 'Confirmed'

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

                <div className={styles.modalBody}>
                    {/* Student Info */}
                    <div className={styles.studentInfoCard}>
                        <div className={styles.studentInfoLeft}>
                            <div className={styles.studentAvatar}>{session.student.charAt(0)}</div>
                            <div>
                                <p className={styles.studentName}>{session.student}</p>
                                {session.studentUniversity && (
                                    <p className={styles.studentUniversity}>{session.studentUniversity}</p>
                                )}
                                {session.studentMajor && (
                                    <p className={styles.studentMajor}>{session.studentMajor}</p>
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
                                <p className={styles.infoCellValue}>{session.title}</p>
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
                    {session.notes && (
                        <div>
                            <p className={styles.infoSectionLabel}>Notes from Student</p>
                            <div className={styles.notesBox}>
                                <BookOpen size={14} color="#3b82f6" style={{ marginTop: 2, flexShrink: 0 }} />
                                <p className={styles.notesText}>&quot;{session.notes}&quot;</p>
                            </div>
                        </div>
                    )}

                    {/* Meeting Link */}
                    {isConfirmed && session.meetingLink && (
                        <div>
                            <p className={styles.infoSectionLabel}>Session Link</p>
                            <Link
                                href={session.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.meetingLink}
                            >
                                <div className={styles.meetingLinkIcon}>
                                    <Video size={16} color="white" />
                                </div>
                                <div className={styles.meetingLinkBody}>
                                    <p className={styles.meetingLinkTitle}>Join Meeting</p>
                                    <p className={styles.meetingLinkUrl}>{session.meetingLink}</p>
                                </div>
                                <ExternalLink size={14} className={styles.meetingLinkArrow} />
                            </Link>
                        </div>
                    )}
                </div>

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
        setTimeout(() => {
            setSlots([
                { id: 1, displayDate: 'Wednesday, Jan 24', displayTime: '2:00 PM – 4:00 PM' },
                { id: 2, displayDate: 'Friday, Jan 26',    displayTime: '1:00 PM – 2:00 PM' },
                { id: 3, displayDate: 'Tuesday, Jan 28',   displayTime: '9:00 AM – 10:30 AM' },
            ])
            setLoadingSlots(false)
        }, 800)
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
                        className={`${styles.rescheduleConfirmBtn} ${
                            done 
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
    const isPending   = session.status === 'Pending'

    const handleAction = async (status: string) => {
        setLoadingAction(status)
        await onUpdate(session.id, status)
        setLoadingAction(null)
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
                    <button className={styles.btnStartMeeting}>
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
    const { language } = useApp()
    const searchParams = useSearchParams()

    const [sessions, setSessions]                   = useState<Session[]>([])
    const [loading, setLoading]                     = useState(true)
    const [pageError, setPageError]                 = useState<string | null>(null)
    const [detailsSession, setDetailsSession]       = useState<Session | null>(null)
    const [rescheduleSession, setRescheduleSession] = useState<Session | null>(null)

    useEffect(() => {
        setTimeout(() => {
            setSessions(MOCK_SESSIONS)
            setLoading(false)
            const rescheduleId = searchParams.get('reschedule')
            if (rescheduleId) {
                const session = MOCK_SESSIONS.find(s => s.studentProfileId === Number(rescheduleId))
                if (session) setRescheduleSession(session)
            }
        }, 600)
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
                    <TopBarControls />
                </div>



                {pageError && !loading && (
                    <div className={styles.errorState}>{pageError}</div>
                )}

                {!loading && !pageError && (
                    <div className={styles.sessionsList}>
                        {sessions.map(session => (
                            <SessionCard
                                key={session.id}
                                session={session}
                                onViewDetails={() => setDetailsSession(session)}
                                onReschedule={() => setRescheduleSession(session)}
                                onUpdate={handleUpdateStatus}
                            />
                        ))}
                        {sessions.length === 0 && (
                            <p className={styles.emptyState}>No sessions yet.</p>
                        )}
                    </div>
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
