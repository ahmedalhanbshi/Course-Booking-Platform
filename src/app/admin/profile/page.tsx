"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, Shield, Lock, Save } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/page-header"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

export default function AdminProfilePage() {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    // Mock state for profile form
    const [profileForm, setProfileForm] = useState({
        name: user?.name || "مدير النظام",
        email: user?.email || "admin@example.com",
        phone: user?.phone || "0500000000",
        avatar: user?.avatar || ""
    })

    // Mock state for password form
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsLoading(false)
        toast.success("تم تحديث الملف الشخصي بنجاح")
    }

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("كلمات المرور غير متطابقة")
            return
        }
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsLoading(false)
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
        toast.success("تم تغيير كلمة المرور بنجاح")
    }

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="الملف الشخصي"
                description="إدارة معلومات حسابك الشخصي وإعدادات الأمان"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Summary Card */}
                <Card className="md:col-span-1">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={profileForm.avatar} />
                                <AvatarFallback className="text-2xl">{profileForm.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>
                        <CardTitle>{profileForm.name}</CardTitle>
                        <CardDescription className="flex items-center justify-center gap-1 mt-1">
                            <Shield className="h-3 w-3" />
                            مسؤول النظام
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Mail className="h-4 w-4" />
                                <span>{profileForm.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="h-4 w-4" />
                                <span>{profileForm.phone}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Settings Tabs */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>إعدادات الحساب</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="general" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-8">
                                <TabsTrigger value="general">المعلومات الأساسية</TabsTrigger>
                                <TabsTrigger value="security">الأمان وكلمة المرور</TabsTrigger>
                            </TabsList>

                            <TabsContent value="general">
                                <form onSubmit={handleProfileUpdate} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">الاسم الكامل</Label>
                                        <div className="relative">
                                            <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="name"
                                                className="pr-9"
                                                value={profileForm.name}
                                                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">البريد الإلكتروني</Label>
                                        <div className="relative">
                                            <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                className="pr-9"
                                                value={profileForm.email}
                                                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">رقم الهاتف</Label>
                                        <div className="relative">
                                            <Phone className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="phone"
                                                className="pr-9"
                                                value={profileForm.phone}
                                                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="avatar">رابط الصورة الشخصية</Label>
                                        <Input
                                            id="avatar"
                                            value={profileForm.avatar}
                                            onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                                            placeholder="https://example.com/avatar.jpg"
                                        />
                                    </div>

                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
                                        <Save className="mr-2 h-4 w-4" />
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="security">
                                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="current-password">كلمة المرور الحالية</Label>
                                        <div className="relative">
                                            <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="current-password"
                                                type="password"
                                                className="pr-9"
                                                value={passwordForm.currentPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                                        <div className="relative">
                                            <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="new-password"
                                                type="password"
                                                className="pr-9"
                                                value={passwordForm.newPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                                        <div className="relative">
                                            <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="confirm-password"
                                                type="password"
                                                className="pr-9"
                                                value={passwordForm.confirmPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? "جاري التحديث..." : "تحديث كلمة المرور"}
                                        <Save className="mr-2 h-4 w-4" />
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
