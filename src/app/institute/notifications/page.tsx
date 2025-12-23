"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Calendar, UserPlus, Info, CheckCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock notifications data
const notifications = [
    {
        id: 1,
        title: "طلب حجز قاعة جديد",
        message: "قام المدرب أحمد بطلب حجز القاعة الرئيسية (أ) لدورة تطوير الويب.",
        time: "منذ 15 دقيقة",
        type: "booking",
        read: false
    },
    {
        id: 2,
        title: "تسجيل طالب جديد",
        message: "تم تسجيل طالب جديد في دورة التصميم الجرافيكي.",
        time: "منذ ساعة",
        type: "registration",
        read: false
    },
    {
        id: 3,
        title: "تحديث النظام",
        message: "سيتم إجراء صيانة دورية للنظام يوم الجمعة القادم.",
        time: "منذ يومين",
        type: "system",
        read: true
    },
    {
        id: 4,
        title: "اكتمال عدد الطلاب",
        message: "اكتمل عدد الطلاب في دورة الأمن السيبراني.",
        time: "منذ 3 أيام",
        type: "info",
        read: true
    }
]

const getIcon = (type: string) => {
    switch (type) {
        case 'booking': return Calendar
        case 'registration': return UserPlus
        case 'system': return AlertCircle
        default: return Info
    }
}

const getIconColor = (type: string) => {
    switch (type) {
        case 'booking': return "text-blue-500 bg-blue-100"
        case 'registration': return "text-green-500 bg-green-100"
        case 'system': return "text-orange-500 bg-orange-100"
        default: return "text-gray-500 bg-gray-100"
    }
}

export default function InstituteNotificationsPage() {
    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-primary/10 p-3 rounded-xl">
                    <Bell className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold">الإشعارات</h1>
            </div>

            <div className="space-y-4">
                {notifications.map((notification) => {
                    const Icon = getIcon(notification.type)
                    const iconColorClass = getIconColor(notification.type)

                    return (
                        <Card key={notification.id} className={`transition-colors ${!notification.read ? 'bg-blue-50/50 border-blue-100' : ''}`}>
                            <CardContent className="p-4 flex items-start gap-4">
                                <div className={`p-2 rounded-full ${iconColorClass}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                            {notification.title}
                                        </h3>
                                        <span className="text-xs text-gray-500">{notification.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {notification.message}
                                    </p>
                                </div>
                                {!notification.read && (
                                    <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}

                {notifications.length === 0 && (
                    <Card>
                        <CardContent>
                            <div className="text-center py-10 text-muted-foreground">
                                لا توجد إشعارات جديدة
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
