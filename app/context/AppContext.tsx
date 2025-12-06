'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations, Language } from '../locales/translations'

type Theme = 'light' | 'dark'

interface AppContextType {
    theme: Theme
    language: Language
    toggleTheme: () => void
    setLanguage: (lang: Language) => void
    t: typeof translations.en
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light')
    const [language, setLanguage] = useState<Language>('en')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // Load saved preferences
        const savedTheme = localStorage.getItem('theme') as Theme
        const savedLanguage = localStorage.getItem('language') as Language

        if (savedTheme) setTheme(savedTheme)
        if (savedLanguage) setLanguage(savedLanguage)
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
        localStorage.setItem('theme', theme)

        // Apply language
        document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr')
        document.documentElement.setAttribute('lang', language)
        localStorage.setItem('language', language)
    }, [theme, language, mounted])

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }

    const value = {
        theme,
        language,
        toggleTheme,
        setLanguage,
        t: translations[language]
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
