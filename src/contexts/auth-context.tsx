"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, UserRole } from '@/types'

type AuthContextType = {
    user: User | null
    login: (email: string, password: string) => Promise<boolean>
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Check for stored user on mount
        const storedUser = localStorage.getItem('course_platform_user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
        setIsLoading(false)
    }, [])

    const login = async (email: string, password: string) => {
        // Mock authentication logic
        if (password !== '123456') return false

        let userData: User | null = null

        switch (email) {
            case 'student@demo.com':
                userData = {
                    id: '1',
                    name: 'أحمد الطالب',
                    email: 'student@demo.com',
                    role: 'student',
                    status: 'active',
                    avatar: '/images/avatar-1.png',
                    createdAt: new Date()
                }
                break
            case 'trainer@demo.com':
                userData = {
                    id: '2',
                    name: 'فاطمة المدربة',
                    email: 'trainer@demo.com',
                    role: 'trainer',
                    status: 'active',
                    avatar: '/images/avatar-2.png',
                    createdAt: new Date()
                }
                break
            case 'institute@demo.com':
                userData = {
                    id: '3',
                    name: 'معهد المستقبل',
                    email: 'institute@demo.com',
                    role: 'institute_admin',
                    status: 'active',
                    avatar: '/images/avatar-3.png',
                    createdAt: new Date()
                }
                break
            case 'admin@demo.com':
                userData = {
                    id: '4',
                    name: 'مدير النظام',
                    email: 'admin@demo.com',
                    role: 'platform_admin',
                    status: 'active',
                    avatar: '/images/avatar-4.png',
                    createdAt: new Date()
                }
                break
            default:
                return false
        }

        if (userData) {
            setUser(userData)
            localStorage.setItem('course_platform_user', JSON.stringify(userData))
            // Set cookie for middleware
            document.cookie = `course_platform_user=${JSON.stringify(userData)}; path=/; max-age=86400; SameSite=Lax`
            return true
        }

        return false
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('course_platform_user')
        // Remove cookie
        document.cookie = 'course_platform_user=; path=/; max-age=0'
        router.push('/')
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
