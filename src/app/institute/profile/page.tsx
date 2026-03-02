"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, Building, Eye, EyeOff, MapPin, Globe, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { instituteService } from "@/lib/institute-service"
import { getFileUrl } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

export default function InstituteProfilePage() {
    const { updateUser } = useAuth()
    const [user, setUser] = useState({
        id: "",
        name: "",
        email: "",
        phone: "",
        role: "institute_admin",
        avatar: "",
        instituteName: "",
        instituteLogo: "",
        instituteAddress: "",
        instituteWebsite: "",
        instituteDescription: "",
        verificationStatus: ""
    })
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [activeTab, setActiveTab] = useState("personal")
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const logoFileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await instituteService.getProfile()
                if (data) {
                    setUser({
                        ...user,
                        ...data,
                        phone: data.phone || "",
                        instituteAddress: data.instituteAddress || "",
                        instituteWebsite: data.instituteWebsite || "",
                        instituteDescription: data.instituteDescription || ""
                    })
                }
            } catch (error) {
                console.error("Failed to fetch profile", error)
                toast.error("فشل في تحميل بيانات الملف الشخصي")
            } finally {
                setIsLoading(false)
            }
        }
        fetchProfile()
    }, [])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setAvatarFile(file)
            setUser({ ...user, avatar: URL.createObjectURL(file) })
            setIsEditing(true) // auto-enable editing mode so they can save
        }
    }

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setLogoFile(file)
            setUser({ ...user, instituteLogo: URL.createObjectURL(file) })
            setIsEditing(true) // auto-enable editing mode so they can save
        }
    }

    const handleSave = async () => {
        try {
            setIsSaving(true)
            const formData = new FormData()
            formData.append("name", user.name)
            formData.append("phone", user.phone)
            formData.append("instituteName", user.instituteName)
            formData.append("instituteAddress", user.instituteAddress)
            formData.append("instituteWebsite", user.instituteWebsite)
            formData.append("instituteDescription", user.instituteDescription)
            if (avatarFile) {
                formData.append("avatar", avatarFile)
            }
            if (logoFile) {
                formData.append("logo", logoFile)
            }

            const data = await instituteService.updateProfile(formData)

            if (data?.avatar) {
                setUser({ ...user, avatar: data.avatar })
                updateUser({ name: user.name, avatar: data.avatar })
            } else {
                updateUser({ name: user.name })
            }

            toast.success("تم تحديث البيانات بنجاح")
            setIsEditing(false)
            setAvatarFile(null)
            setLogoFile(null)
        } catch (error) {
            console.error(error)
            toast.error("حدث خطأ أثناء حفظ البيانات")
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        )
    }

    const renderPersonalInfo = () => (
        <Card>
            <CardHeader>
                <CardTitle>المعلومات الشخصية</CardTitle>
                <CardDescription>إدارة معلومات حسابك الشخصية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        {user.avatar ? (
                            <AvatarImage src={getFileUrl(user.avatar)} alt={user.name} className="object-cover" />
                        ) : (
                            <AvatarFallback className="text-lg">
                                {user.name.charAt(0)}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />
                        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                            تغيير الصورة
                        </Button>
                        <p className="text-sm text-gray-500 mt-1">
                            JPG, PNG أو GIF. الحد الأقصى 2MB
                        </p>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">الاسم الكامل</Label>
                        <div className="relative">
                            <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                id="name"
                                value={user.name}
                                onChange={(e) => setUser({ ...user, name: e.target.value })}
                                disabled={!isEditing}
                                className="pr-10"
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
                                value={user.email}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                                disabled={!isEditing}
                                className="pr-10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">رقم الهاتف</Label>
                        <div className="relative">
                            <Phone className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                id="phone"
                                value={user.phone}
                                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                disabled={!isEditing}
                                className="pr-10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>نوع الحساب</Label>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                                مدير معهد
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
                            </Button>
                            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                                إلغاء
                            </Button>
                        </>
                    ) : (
                        <Button onClick={() => setIsEditing(true)}>تعديل المعلومات</Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )

    const renderInstituteInfo = () => (
        <Card>
            <CardHeader>
                <CardTitle>بيانات المعهد</CardTitle>
                <CardDescription>إدارة المعلومات العامة للمعهد</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Institute Logo */}
                <div className="flex items-center gap-4">
                    <Avatar className="h-24 w-24 border-2 border-slate-100">
                        {user.instituteLogo ? (
                            <AvatarImage src={getFileUrl(user.instituteLogo)} alt={user.instituteName} className="object-cover" />
                        ) : (
                            <AvatarFallback className="text-xl bg-slate-50 text-slate-400">
                                {user.instituteName?.charAt(0) || <Building className="h-8 w-8 text-slate-300" />}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={logoFileInputRef}
                            onChange={handleLogoChange}
                        />
                        <Button variant="outline" size="sm" onClick={() => logoFileInputRef.current?.click()}>
                            تغيير شعار المعهد
                        </Button>
                        <p className="text-sm text-gray-500 mt-1">
                            JPG, PNG أو GIF. الحد الأقصى 2MB
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="instituteName">اسم المعهد</Label>
                        <div className="relative">
                            <Building className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                id="instituteName"
                                value={user.instituteName}
                                onChange={(e) => setUser({ ...user, instituteName: e.target.value })}
                                disabled={!isEditing}
                                className="pr-10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="instituteWebsite">الموقع الإلكتروني</Label>
                        <div className="relative">
                            <Globe className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                id="instituteWebsite"
                                value={user.instituteWebsite}
                                onChange={(e) => setUser({ ...user, instituteWebsite: e.target.value })}
                                disabled={!isEditing}
                                className="pr-10"
                            />
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-2">
                        <Label htmlFor="instituteAddress">العنوان</Label>
                        <div className="relative">
                            <MapPin className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                id="instituteAddress"
                                value={user.instituteAddress}
                                onChange={(e) => setUser({ ...user, instituteAddress: e.target.value })}
                                disabled={!isEditing}
                                className="pr-10"
                            />
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-2">
                        <Label htmlFor="instituteDescription">وصف المعهد</Label>
                        <Textarea
                            id="instituteDescription"
                            value={user.instituteDescription}
                            onChange={(e) => setUser({ ...user, instituteDescription: e.target.value })}
                            disabled={!isEditing}
                            rows={3}
                        />
                    </div>
                </div>

                {/* Action Buttons (Replicated for convenience) */}
                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
                            </Button>
                            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                                إلغاء
                            </Button>
                        </>
                    ) : (
                        <Button onClick={() => setIsEditing(true)}>تعديل المعلومات</Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )

    const renderPasswordChange = () => (
        <Card>
            <CardHeader>
                <CardTitle>تغيير كلمة المرور</CardTitle>
                <CardDescription>تأكد من استخدام كلمة مرور قوية وآمنة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="current-password">كلمة المرور الحالية</Label>
                    <div className="relative">
                        <Input
                            id="current-password"
                            type={showPassword ? "text" : "password"}
                            className="pr-10"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                            )}
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                    <Input
                        id="new-password"
                        type="password"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirm-password">تأكيد كلمة المرور الجديدة</Label>
                    <Input
                        id="confirm-password"
                        type="password"
                    />
                </div>

                <Button>تغيير كلمة المرور</Button>
            </CardContent>
        </Card>
    )

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">الملف الشخصي</h1>
                <p className="text-gray-600 mt-2">إدارة معلومات حسابك وبيانات المعهد</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="personal">المعلومات الشخصية</TabsTrigger>
                    <TabsTrigger value="institute">بيانات المعهد</TabsTrigger>
                    <TabsTrigger value="security">كلمة المرور</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="mt-6">
                    {renderPersonalInfo()}
                </TabsContent>

                <TabsContent value="institute" className="mt-6">
                    {renderInstituteInfo()}
                </TabsContent>

                <TabsContent value="security" className="mt-6">
                    {renderPasswordChange()}
                </TabsContent>
            </Tabs>
        </div>
    )
}
