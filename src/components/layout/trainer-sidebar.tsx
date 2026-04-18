"use client"

import { BookOpen, Calendar, GraduationCap, Home, Users, UserCheck, Megaphone, Building } from "lucide-react"
import { SharedSidebar } from "@/components/layout/shared-sidebar"
import type { SharedNavLink } from "@/components/layout/shared-navigation-item"

const trainerLinks: SharedNavLink[] = [
  { href: "/trainer/dashboard", label: "الصفحة الرئيسية", icon: Home, match: ["exact:/trainer/dashboard", "exact:/trainer"] },
  { href: "/trainer/explore", label: "استعراض الدورات", icon: BookOpen, match: ["starts:/trainer/explore"] },
  { href: "/trainer/courses", label: "إدارة الدورات", icon: GraduationCap, match: ["starts:/trainer/courses"] },
  { href: "/trainer/students", label: "الطلاب", icon: Users, match: ["starts:/trainer/students"] },
  { href: "/trainer/enrollments", label: "طلبات التسجيل", icon: UserCheck, match: ["starts:/trainer/enrollments"] },
  { href: "/trainer/announcements", label: "الإعلانات", icon: Megaphone, match: ["starts:/trainer/announcements"] },
  { href: "/trainer/halls", label: "القاعات", icon: Building, match: ["starts:/trainer/halls"] },
  { href: "/trainer/room-bookings", label: "حجوزاتي", icon: Calendar, match: ["starts:/trainer/room-bookings", "starts:/trainer/schedule"] },
]

interface TrainerSidebarProps {
  collapsed: boolean
}

export function TrainerSidebar({ collapsed }: TrainerSidebarProps) {
  return <SharedSidebar collapsed={collapsed} links={trainerLinks} />
}
