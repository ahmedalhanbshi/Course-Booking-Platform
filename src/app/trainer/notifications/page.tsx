"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, CheckCircle, UserPlus, FileCheck, Star, Megaphone, Clock } from "lucide-react"
import { Notification } from "@/types"
import { formatDate } from "@/lib/utils"

// Mock trainer notifications data
const mockNotifications: Notification[] = [
    {
        id: "1",
        userId: "2",
        title: "طلب تسجيل جديد",
        message: "قام الطالب 'سعيد محمد' بطلب التسجيل في دورة 'تعلم React من الصفر'",
        type: "enrollment",
        isRead: false,
        createdAt: new Date("2025-01-25T10:30:00"),
    },
    {
        id: "2",
        userId: "2",
        title: "تم اعتماد الدورة",
        message: "تم اعتماد دورتك 'تصميم واجهات المستخدم' من قبل إدارة المنصة",
        type: "system",
        isRead: false,
        createdAt: new Date("2025-01-24T14:00:00"),
    },
    {
        id: "3",
        userId: "2",
        title: "تقييم جديد",
        message: "حصلت على تقييم 5 نجوم من الطالب 'أحمد علي' في دورة 'إدارة المشاريع'",
        type: "review",
        isRead: true,
        createdAt: new Date("2025-01-23T09:15:00"),
    },
    {
        id: "4",
        userId: "2",
        title: "تذكير بموعد الدرس",
        message: "لديك درس مباشر في دورة 'تعلم React من الصفر' بعد ساعة واحدة",
        type: "session",
        isRead: true,
        createdAt: new Date("2025-01-22T16:00:00"),
    },
    {
        id: "5",
        userId: "2",
        title: "إعلان للمدربين",
        message: "تم تحديث سياسات الدفع للمدربين. يرجى الاطلاع على التفاصيل في لوحة التحكم",
        type: "announcement",
        isRead: false,
        createdAt: new Date("2025-01-20T11:30:00"),
    }
]

export default function TrainerNotificationsPage() {
    const [notifications, setNotifications] = useState(mockNotifications)
    const [filter, setFilter] = useState<string>("all")

    const getNotificationIcon = (type: Notification['type'] | 'review' | 'system') => {
        switch (type) {
            case 'enrollment': return <UserPlus className="h-5 w-5" />
            case 'system': return <FileCheck className="h-5 w-5" />
            case 'review': return <Star className="h-5 w-5" />
            case 'session': return <Clock className="h-5 w-5" />
            case 'announcement': return <Megaphone className="h-5 w-5" />
            default: return <Bell className="h-5 w-5" />
        }
    }

    const getNotificationColor = (type: Notification['type'] | 'review' | 'system') => {
        switch (type) {
            case 'enrollment': return 'text-blue-600'
            case 'system': return 'text-green-600'
            case 'review': return 'text-yellow-600'
            case 'session': return 'text-orange-600'
            case 'announcement': return 'text-purple-600'
            default: return 'text-gray-600'
        }
    }

    const getTypeLabel = (type: Notification['type'] | 'review' | 'system') => {
        switch (type) {
            case 'enrollment': return 'تسجيل جديد'
            case 'system': return 'النظام'
            case 'review': return 'تقييم'
            case 'session': return 'درس'
            case 'announcement': return 'إعلان'
            default: return type
        }
    }

    const filteredNotifications = notifications.filter(notification => {
        if (filter === "all") return true
        if (filter === "unread") return !notification.isRead
        return notification.type === filter
    })

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(notif =>
            notif.id === id ? { ...notif, isRead: true } : notif
        ))
    }

    const markAllAsRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, isRead: true })))
    }

    const unreadCount = notifications.filter(n => !n.isRead).length

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">إشعارات المدرب</h1>
                    <p className="text-gray-600 mt-2">متابعة طلبات التسجيل وتقييمات الطلاب وتحديثات النظام</p>
                </div>

                {unreadCount > 0 && (
                    <Button onClick={markAllAsRead}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        تحديد الكل كمقروء ({unreadCount})
                    </Button>
                )}
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-gray-500" />
                            <span className="font-medium">تصفية الإشعارات:</span>
                        </div>
                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">جميع الإشعارات</SelectItem>
                                <SelectItem value="unread">غير المقروءة</SelectItem>
                                <SelectItem value="enrollment">طلبات التسجيل</SelectItem>
                                <SelectItem value="system">النظام</SelectItem>
                                <SelectItem value="review">التقييمات</SelectItem>
                                <SelectItem value="announcement">الإعلانات</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications List */}
            <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center py-8">
                                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    لا توجد إشعارات
                                </h3>
                                <p className="text-gray-500">
                                    {filter === "unread"
                                        ? "جميع الإشعارات مقروءة"
                                        : "لا توجد إشعارات في هذه الفئة"
                                    }
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    filteredNotifications.map((notification) => (
                        <Card
                            key={notification.id}
                            className={`transition-colors ${!notification.isRead ? 'bg-blue-50 border-blue-200' : ''}`}
                        >
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-full bg-gray-100 ${getNotificationColor(notification.type as any)}`}>
                                        {getNotificationIcon(notification.type as any)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-gray-900">
                                                        {notification.title}
                                                    </h3>
                                                    <Badge variant="outline" className="text-xs">
                                                        {getTypeLabel(notification.type as any)}
                                                    </Badge>
                                                    {!notification.isRead && (
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    )}
                                                </div>
                                                <p className="text-gray-600 mb-2">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Clock className="h-4 w-4" />
                                                    {formatDate(notification.createdAt)}
                                                </div>
                                            </div>

                                            {!notification.isRead && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => markAsRead(notification.id)}
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
