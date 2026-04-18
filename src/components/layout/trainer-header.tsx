"use client"

import { SharedTopBar } from "@/components/layout/shared-top-bar"

interface TrainerHeaderProps {
  isSidebarOpen?: boolean
  onMenuClick: () => void
}

export function TrainerHeader({ onMenuClick }: TrainerHeaderProps) {
  return (
    <SharedTopBar
      onMenuClick={onMenuClick}
      homeHref="/trainer"
      profileHref="/trainer/profile"
      notificationsHref="/trainer/notifications"
      searchPlaceholder="ابحث في لوحة المدرب"
      resolveSearchBase={(pathname) => {
        if (pathname.startsWith("/trainer/students")) return "/trainer/students"
        return "/trainer/courses"
      }}
    />
  )
}
