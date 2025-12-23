"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, Clock, MapPin, Video, ChevronLeft, ChevronRight } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"
import { User } from "@/types"

// Mock user
const mockUser: User = {
    id: "1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    role: 'student' as const,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
}

// Mock sessions data
const mockSessions = [
    {
        id: "1",
        title: "Hooks في React",
        courseTitle: "تعلم React من الصفر",
        startTime: new Date("2025-01-20T14:00:00"),
        endTime: new Date("2025-01-20T16:00:00"),
        type: "online",
        link: "https://meet.google.com/abc-defg-hij"
    },
    {
        id: "2",
        title: "مبادئ التصميم الأساسية",
        courseTitle: "تصميم واجهات المستخدم",
        startTime: new Date("2025-01-22T10:00:00"),
        endTime: new Date("2025-01-22T12:00:00"),
        type: "in_person",
        location: "قاعة المحاضرات الأولى"
    },
    {
        id: "3",
        title: "إدارة الحالة (State Management)",
        courseTitle: "تعلم React من الصفر",
        startTime: new Date("2025-01-25T14:00:00"),
        endTime: new Date("2025-01-25T16:00:00"),
        type: "online",
        link: "https://meet.google.com/xyz-uvw-123"
    },
    {
        id: "4",
        title: "الألوان والخطوط",
        courseTitle: "تصميم واجهات المستخدم",
        startTime: new Date("2025-01-27T10:00:00"),
        endTime: new Date("2025-01-27T12:00:00"),
        type: "in_person",
        location: "قاعة المحاضرات الثانية"
    }
]

export default function StudentSchedulePage() {
    const [currentDate, setCurrentDate] = useState(new Date("2025-01-20"))

    // Group sessions by date
    const sessionsByDate = mockSessions.reduce((acc, session) => {
        const dateKey = session.startTime.toISOString().split('T')[0]
        if (!acc[dateKey]) {
            acc[dateKey] = []
        }
        acc[dateKey].push(session)
        return acc
    }, {} as Record<string, typeof mockSessions>)

    const sortedDates = Object.keys(sessionsByDate).sort()

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">جدول الدروس</h1>
                    <p className="text-gray-600">تابع مواعيد دروسك القادمة</p>
                </div>

            </div>

            <div className="space-y-8">
                {sortedDates.map((dateStr) => (
                    <div key={dateStr}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-600" />
                            {formatDate(new Date(dateStr), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </h3>

                        <div className="grid gap-4">
                            {sessionsByDate[dateStr].map((session) => (
                                <Card key={session.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex gap-4">
                                                <div className="flex-shrink-0 w-16 h-16 bg-blue-50 rounded-lg flex flex-col items-center justify-center text-blue-600">
                                                    <span className="text-sm font-bold">{formatTime(session.startTime)}</span>
                                                    <span className="text-xs text-blue-400">إلى</span>
                                                    <span className="text-sm font-bold">{formatTime(session.endTime)}</span>
                                                </div>

                                                <div>
                                                    <h4 className="text-lg font-bold text-gray-900 mb-1">{session.title}</h4>
                                                    <p className="text-sm text-gray-600 mb-2">{session.courseTitle}</p>

                                                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            {session.type === 'online' ? (
                                                                <Video className="h-4 w-4" />
                                                            ) : (
                                                                <MapPin className="h-4 w-4" />
                                                            )}
                                                            <span>
                                                                {session.type === 'online' ? 'أونلاين' : session.location}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-4 w-4" />
                                                            <span>ساعتان</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                {session.type === 'online' ? (
                                                    <Button asChild>
                                                        <a href={session.link} target="_blank" rel="noopener noreferrer">
                                                            انضم للدرس
                                                        </a>
                                                    </Button>
                                                ) : (
                                                    <Badge variant="secondary" className="text-base px-4 py-1">
                                                        حضوري
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
