"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { LogIn, UserPlus, LayoutDashboard } from "lucide-react"

export function LandingNavbar() {
  const { user, isAuthenticated } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-100 dark:border-slate-900">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between" dir="rtl">
        
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 group-hover:scale-105 transition-transform">
              <Image src="/images/logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">دال</span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 transition-colors">الرئيسية</Link>
            <Link href="/courses" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">الدورات</Link>
            <Link href="/institutes" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">المعاهد</Link>
          </nav>
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Button className="rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20" asChild>
              <Link href={`/${user?.role.toLowerCase()}/dashboard`}>
                <LayoutDashboard className="ml-2 w-4 h-4" />
                لوحة التحكم
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" className="font-bold text-slate-600 hover:text-blue-600 rounded-2xl hidden sm:flex" asChild>
                <Link href="/auth/login">
                  تسجيل الدخول
                </Link>
              </Button>
              <Button className="rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 px-8" asChild>
                <Link href="/auth/register">
                  إنشاء حساب
                </Link>
              </Button>
            </>
          )}
        </div>

      </div>
    </header>
  )
}

