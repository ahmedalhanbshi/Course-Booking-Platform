"use client"

import { SharedTopBar } from "@/components/layout/shared-top-bar"

interface StudentHeaderProps {
  onMenuClick: () => void
}

export function StudentHeader({ onMenuClick }: StudentHeaderProps) {
  return (
    <SharedTopBar
      onMenuClick={onMenuClick}
      homeHref="/student"
      profileHref="/student/profile"
      notificationsHref="/student/notifications"
      searchPlaceholder="ابحث في المنصة"
      resolveSearchBase={(pathname) =>
        pathname.startsWith("/student/institutes") ? "/student/institutes" : "/student/courses"
      }
    />
  )
}

