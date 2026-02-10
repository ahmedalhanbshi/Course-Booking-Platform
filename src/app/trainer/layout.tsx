"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { TrainerSidebar } from "@/components/layout/trainer-sidebar"
import { TrainerHeader } from "@/components/layout/trainer-header"
import { cn } from "@/lib/utils"
// ...
export default function TrainerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const pathname = usePathname()
    const isHallsPage = pathname?.startsWith("/trainer/halls")

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50" dir="rtl">
            <div className="flex relative">
                 {/* Sidebar Wrapper */}
                <div 
                    className={cn(
                        "sticky top-0 h-screen transition-all duration-300 ease-in-out z-40",
                        isSidebarOpen ? "w-72 opacity-100 translate-x-0" : "w-0 opacity-0 translate-x-10 overflow-hidden"
                    )}
                >
                    <TrainerSidebar />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                                <TrainerHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                    
                    <main className={cn("flex-1", isHallsPage ? "px-6 pb-8 pt-0 md:px-8 md:pt-0" : "p-6 md:p-8")}>
                        <div className="container mx-auto max-w-7xl">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
