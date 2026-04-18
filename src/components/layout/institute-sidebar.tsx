"use client"

import { BookOpen, Building2, Calendar, Home, Megaphone, UserCheck, Users } from "lucide-react"
import { SharedSidebar } from "@/components/layout/shared-sidebar"
import type { SharedNavLink } from "@/components/layout/shared-navigation-item"

const instituteLinks: SharedNavLink[] = [
  { href: "/institute/dashboard", label: "الصفحة الرئيسية", icon: Home, match: ["exact:/institute/dashboard"] },
  {
    href: "/institute/courses",
    label: "إدارة الدورات",
    icon: BookOpen,
    match: ["exact:/institute/courses", "starts:/institute/courses/"],
  },
  { href: "/institute/schedule", label: "جدول الجلسات", icon: Calendar, match: ["starts:/institute/schedule"] },
  { href: "/institute/students", label: "إدارة الطلاب", icon: Users, match: ["starts:/institute/students"] },
  { href: "/institute/enrollments", label: "طلبات التسجيل", icon: UserCheck, match: ["starts:/institute/enrollments"] },
  { href: "/institute/staff", label: "إدارة المدربين", icon: Users, match: ["starts:/institute/staff"] },
  {
    href: "/institute/halls",
    label: "إدارة القاعات",
    icon: Building2,
    match: ["starts:/institute/halls", "starts:/institute/room-bookings"],
  },
  { href: "/institute/announcements", label: "الإعلانات", icon: Megaphone, match: ["starts:/institute/announcements"] },
]

interface InstituteSidebarProps {
  collapsed: boolean
}

export function InstituteSidebar({ collapsed }: InstituteSidebarProps) {
  return <SharedSidebar collapsed={collapsed} links={instituteLinks} />
}
