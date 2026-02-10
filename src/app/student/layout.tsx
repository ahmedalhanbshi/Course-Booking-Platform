"use client"

import { useState } from "react"
import { StudentSidebar } from "@/components/layout/student-sidebar"
import { StudentHeader } from "@/components/layout/student-header"
import { cn } from "@/lib/utils"

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-background flex gap-4" dir="rtl">
            {/* Fixed Sidebar */}
            <div 
                className={cn(
                    "transition-all duration-300 ease-in-out border-l border-gray-100 dark:border-slate-800 overflow-hidden",
                    isSidebarOpen ? "w-72 opacity-100" : "w-0 opacity-0"
                )}
            >
                <div className="w-72 h-full"> {/* Inner container to maintain width while parent animates */}
                    <StudentSidebar />
                </div>
            </div>
            
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen flex flex-col min-w-0">
                <StudentHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                <div className="flex-1 w-full max-w-[1200px] mx-auto px-5 py-4">
                    {children}
                </div>
            </main>
        </div>
    )
}
