"use client"

import { BookOpen, Calendar, Heart, Home, LibraryBig, School } from "lucide-react"
import { SharedSidebar } from "@/components/layout/shared-sidebar"
import type { SharedNavLink } from "@/components/layout/shared-navigation-item"

const studentLinks: SharedNavLink[] = [
  { href: "/student", label: "الصفحة الرئيسية", icon: Home, match: ["exact:/student", "starts:/student/dashboard"] },
  {
    href: "/student/courses",
    label: "استعراض الدورات",
    icon: BookOpen,
    match: ["exact:/student/courses", "starts:/student/explore/course"],
  },
  {
    href: "/student/institutes",
    label: "المعاهد",
    icon: School,
    match: ["exact:/student/institutes", "starts:/student/institutes/"],
  },
  {
    href: "/student/my-courses",
    label: "دوراتي",
    icon: LibraryBig,
    match: ["starts:/student/my-courses", "starts:/student/courses/"],
  },
  { href: "/student/schedule", label: "الجدول", icon: Calendar, match: ["starts:/student/schedule"] },
  { href: "/student/wishlist", label: "قائمة الرغبات", icon: Heart, match: ["starts:/student/wishlist"] },
]

interface StudentSidebarProps {
  collapsed: boolean
}

export function StudentSidebar({ collapsed }: StudentSidebarProps) {
  return <SharedSidebar collapsed={collapsed} links={studentLinks} />
}

