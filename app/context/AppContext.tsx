'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations, Language } from '../locales/translations'

type Theme = 'light' | 'dark'

export interface Slot {
    id: number
    day: string
    time: string
}

interface AppContextType {
    theme: Theme
    language: Language
    toggleTheme: () => void
    setLanguage: (lang: Language) => void
    t: typeof translations.en
    slots: Slot[]
    setSlots: (slots: Slot[]) => void
    addSlots: (newSlots: Slot[]) => void
    deleteSlot: (id: number) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light')
    const [language, setLanguage] = useState<Language>('en')
    const [mounted, setMounted] = useState(false)
    const [slots, setSlots] = useState<Slot[]>([
        { id: 1, day: 'Monday, Jan 22',    time: '10:00 AM - 11:30 AM' },
        { id: 2, day: 'Wednesday, Jan 24', time: '2:00 PM - 4:00 PM' },
        { id: 3, day: 'Friday, Jan 26',    time: '1:00 PM - 2:00 PM' },
    ])

    const addSlots = (newSlots: Slot[]) => setSlots(prev => [...prev, ...newSlots])
    const deleteSlot = (id: number) => setSlots(prev => prev.filter(s => s.id !== id))

    useEffect(() => {
        // Load saved preferences
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme') as Theme
            const savedLanguage = localStorage.getItem('language') as Language

            if (savedTheme) setTheme(savedTheme)
            if (savedLanguage) setLanguage(savedLanguage)
        }
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        // Apply theme
        document.documentElement.setAttribute('data-theme', theme)
        if (theme === 'light') {
            document.body.classList.add('light-mode')
        } else {
            document.body.classList.remove('light-mode')
        }
        
        // Apply language
        document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr')
        document.documentElement.setAttribute('lang', language)
        
        // Save to localStorage only on client
        if (typeof window !== 'undefined') {
            localStorage.setItem('theme', theme)
            localStorage.setItem('language', language)
        }
    }, [theme, language, mounted])

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }

    const value = {
        theme,
        language,
        toggleTheme,
        setLanguage,
        t: translations[language],
        slots,
        setSlots,
        addSlots,
        deleteSlot
    }

    // Prevent hydration mismatch by rendering nothing until mounted
    // or render with default values but ensure consistency
    // Always render provider to support SSG/SSR
    return (
        <AppContext.Provider value={value}>
            {mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
        </AppContext.Provider>
    )
}

export function useApp() {
    const context = useContext(AppContext)
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider')
    }
    return context
}
