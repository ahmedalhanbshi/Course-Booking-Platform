"use client"

import { SharedTopBar } from "@/components/layout/shared-top-bar"

interface InstituteHeaderProps {
  onMenuClick: () => void
}

export function InstituteHeader({ onMenuClick }: InstituteHeaderProps) {
  return (
    <SharedTopBar
      onMenuClick={onMenuClick}
      homeHref="/institute/dashboard"
      profileHref="/institute/profile"
      notificationsHref="/institute/announcements"
      searchPlaceholder="ابحث في حساب المعهد"
      resolveSearchBase={(pathname) => {
        if (pathname.startsWith("/institute/students")) return "/institute/students"
        if (pathname.startsWith("/institute/staff")) return "/institute/staff"
        return "/institute/courses"
      }}
    />
  )
}

