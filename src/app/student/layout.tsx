"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { StudentHeader } from "@/components/layout/student-header"
import { StudentSidebar } from "@/components/layout/student-sidebar"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100" dir="rtl">
      <StudentHeader onMenuClick={() => setIsSidebarCollapsed((prev) => !prev)} />

      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside
          className={cn(
            "sticky top-16 h-[calc(100vh-4rem)] shrink-0 border-l border-slate-200 bg-white transition-all duration-200 dark:border-slate-800 dark:bg-slate-900",
            isSidebarCollapsed ? "w-24" : "w-72"
          )}
        >
          <StudentSidebar collapsed={isSidebarCollapsed} />
        </aside>

        <main className="flex-1 min-w-0 px-4 py-5 md:px-6 lg:px-8 lg:py-6">
          <div className="mx-auto w-full max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  )
}
