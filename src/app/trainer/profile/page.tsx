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
import { User, Mail, Phone, Eye, EyeOff, Loader2, Camera, X, Plus, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { trainerService } from "@/lib/trainer-service"
import { useAuth } from "@/contexts/auth-context"

type ProfileData = {
    id: string
    name: string
    email: string
    phone: string
    avatar: string | null
    role: string
    status: string
    createdAt: string
    bio: string
    cvUrl: string | null
    specialties: string[]
    verificationStatus: string | null
}

export default function TrainerProfilePage() {
    const { updateUser } = useAuth()
    const [profile, setProfile] = useState<ProfileData | null>(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [activeTab, setActiveTab] = useState("personal")

    // Editable fields mirror
    const [form, setForm] = useState({ name: "", phone: "", bio: "", specialties: [] as string[] })
    const [newSpecialty, setNewSpecialty] = useState("")
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string>("")
    const [avatarCacheKey, setAvatarCacheKey] = useState<number>(Date.now())
    const avatarInputRef = useRef<HTMLInputElement>(null)

    // Password change
    const [showCurrentPw, setShowCurrentPw] = useState(false)
    const [showNewPw, setShowNewPw] = useState(false)
    const [showConfirmPw, setShowConfirmPw] = useState(false)
    const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
    const [isChangingPw, setIsChangingPw] = useState(false)

    // Load profile
    useEffect(() => {
        const load = async () => {
            try {
                const data = await trainerService.getProfile()
                setProfile(data)
                setForm({ name: data.name, phone: data.phone ?? "", bio: data.bio ?? "", specialties: data.specialties ?? [] })
            } catch (err: any) {
                toast.error(err?.response?.data?.message || "فشل في تحميل الملف الشخصي")
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setAvatarFile(file)
            setAvatarPreview(URL.createObjectURL(file))
        }
    }

    const startEditing = () => {
        if (!profile) return
        setForm({ name: profile.name, phone: profile.phone, bio: profile.bio, specialties: [...profile.specialties] })
        setAvatarFile(null)
        setAvatarPreview("")
        setIsEditing(true)
    }

    const cancelEditing = () => {
        setIsEditing(false)
        setAvatarFile(null)
        setAvatarPreview("")
    }

    const handleSave = async () => {
        if (!form.name.trim()) { toast.error("الاسم مطلوب"); return }
        try {
            setIsSaving(true)
            const updated = await trainerService.updateProfile({
                name: form.name,
                phone: form.phone,
                bio: form.bio,
                specialties: form.specialties,
                avatar: avatarFile ?? undefined,
            })
            setProfile(updated)
            setIsEditing(false)
            setAvatarFile(null)
            setAvatarPreview("")
            setAvatarCacheKey(Date.now()) // bust browser cache for avatar
            // Sync auth context so header avatar/name update immediately
            updateUser({ name: updated.name, avatar: updated.avatar ?? undefined })
            toast.success("تم تحديث الملف الشخصي بنجاح")
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "فشل في تحديث الملف الشخصي")
        } finally {
            setIsSaving(false)
        }
    }

    const handlePasswordChange = async () => {
        if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
            toast.error("يرجى ملء جميع الحقول"); return
        }
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            toast.error("كلمة المرور الجديدة وتأكيدها غير متطابقتين"); return
        }
        if (pwForm.newPassword.length < 8) {
            toast.error("كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل"); return
        }
        try {
            setIsChangingPw(true)
            await trainerService.changePassword(pwForm.currentPassword, pwForm.newPassword)
            toast.success("تم تغيير كلمة المرور بنجاح")
            setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "فشل في تغيير كلمة المرور")
        } finally {
            setIsChangingPw(false)
        }
    }

    const addSpecialty = () => {
        const s = newSpecialty.trim()
        if (s && !form.specialties.includes(s)) {
            setForm(prev => ({ ...prev, specialties: [...prev.specialties, s] }))
            setNewSpecialty("")
        }
    }

    const removeSpecialty = (s: string) =>
        setForm(prev => ({ ...prev, specialties: prev.specialties.filter(x => x !== s) }))

    const avatarSrc = avatarPreview || (profile?.avatar ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${profile.avatar}?t=${avatarCacheKey}` : "")

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="flex h-96 items-center justify-center text-gray-500">
                تعذّر تحميل الملف الشخصي
            </div>
        )
    }

    const verificationBadgeVariant = profile.verificationStatus === "APPROVED"
        ? "default" : profile.verificationStatus === "REJECTED" ? "destructive" : "secondary"
    const verificationLabel = profile.verificationStatus === "APPROVED" ? "موثّق"
        : profile.verificationStatus === "REJECTED" ? "مرفوض" : "قيد المراجعة"

    return (
        <div className="max-w-4xl mx-auto" dir="rtl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">الملف الشخصي</h1>
                <p className="text-gray-600 mt-2">إدارة معلومات حسابك وإعداداتك</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="personal">المعلومات الشخصية</TabsTrigger>
                    <TabsTrigger value="security">كلمة المرور</TabsTrigger>
                </TabsList>

                {/* ─── Personal Info Tab ─── */}
                <TabsContent value="personal" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>المعلومات الشخصية</CardTitle>
                            <CardDescription>إدارة معلومات حسابك الشخصي</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Avatar */}
                            <div className="flex items-center gap-4">
                                <div
                                    className={`relative group ${isEditing ? "cursor-pointer" : ""}`}
                                    onClick={() => isEditing && avatarInputRef.current?.click()}
                                >
                                    <Avatar className="h-24 w-24 ring-2 ring-offset-2 ring-primary/20">
                                        <AvatarImage src={avatarSrc} alt={profile.name} />
                                        <AvatarFallback className="text-xl bg-primary/10 text-primary">
                                            {profile.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    {isEditing && (
                                        <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <Camera className="h-6 w-6 text-white" />
                                        </div>
                                    )}
                                    <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{profile.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="secondary">مدرب</Badge>
                                        {profile.verificationStatus && (
                                            <Badge variant={verificationBadgeVariant} className="flex items-center gap-1">
                                                <ShieldCheck className="h-3 w-3" />
                                                {verificationLabel}
                                            </Badge>
                                        )}
                                    </div>
                                    {isEditing && (
                                        <p className="text-xs text-gray-400 mt-1">انقر على الصورة لتغييرها</p>
                                    )}
                                </div>
                            </div>

                            {/* Basic Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="space-y-2">
                                    <Label htmlFor="name">الاسم الكامل *</Label>
                                    <div className="relative">
                                        <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="name"
                                            value={isEditing ? form.name : profile.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
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
                                            value={profile.email}
                                            disabled
                                            className="pr-10 bg-gray-50"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400">لا يمكن تغيير البريد الإلكتروني</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">رقم الهاتف</Label>
                                    <div className="relative">
                                        <Phone className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="phone"
                                            value={isEditing ? form.phone : profile.phone}
                                            onChange={e => setForm({ ...form, phone: e.target.value })}
                                            disabled={!isEditing}
                                            className="pr-10"
                                            placeholder="+966XXXXXXXXX"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>حالة الحساب</Label>
                                    <div className="flex items-center h-10">
                                        <Badge variant={profile.status === "active" ? "default" : "secondary"}>
                                            {profile.status === "active" ? "نشط" : profile.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="space-y-2">
                                <Label htmlFor="bio">نبذة عني</Label>
                                <Textarea
                                    id="bio"
                                    value={isEditing ? form.bio : profile.bio}
                                    onChange={e => setForm({ ...form, bio: e.target.value })}
                                    disabled={!isEditing}
                                    rows={3}
                                    placeholder="اكتب نبذة مختصرة عن خبرتك ومجالاتك..."
                                />
                            </div>

                            {/* Specialties */}
                            <div className="space-y-2">
                                <Label>التخصصات</Label>
                                <div className="flex flex-wrap gap-2">
                                    {(isEditing ? form.specialties : profile.specialties).map(s => (
                                        <Badge key={s} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                                            {s}
                                            {isEditing && (
                                                <button type="button" onClick={() => removeSpecialty(s)}>
                                                    <X className="h-3 w-3 ml-1 text-gray-500 hover:text-red-500" />
                                                </button>
                                            )}
                                        </Badge>
                                    ))}
                                    {(isEditing ? form.specialties : profile.specialties).length === 0 && (
                                        <span className="text-sm text-gray-400">لا توجد تخصصات مضافة</span>
                                    )}
                                </div>
                                {isEditing && (
                                    <div className="flex gap-2 mt-2">
                                        <Input
                                            placeholder="أضف تخصص جديد..."
                                            value={newSpecialty}
                                            onChange={e => setNewSpecialty(e.target.value)}
                                            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSpecialty() } }}
                                        />
                                        <Button type="button" size="icon" variant="outline" onClick={addSpecialty}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* CV */}
                            {profile.cvUrl && (
                                <div className="space-y-2">
                                    <Label>السيرة الذاتية</Label>
                                    <a
                                        href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${profile.cvUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                                    >
                                        عرض السيرة الذاتية
                                    </a>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2 pt-2 border-t">
                                {isEditing ? (
                                    <>
                                        <Button onClick={handleSave} disabled={isSaving}>
                                            {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />جاري الحفظ...</> : "حفظ التغييرات"}
                                        </Button>
                                        <Button variant="outline" onClick={cancelEditing} disabled={isSaving}>إلغاء</Button>
                                    </>
                                ) : (
                                    <Button onClick={startEditing}>تعديل المعلومات</Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ─── Password Tab ─── */}
                <TabsContent value="security" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>تغيير كلمة المرور</CardTitle>
                            <CardDescription>تأكد من استخدام كلمة مرور قوية وآمنة (8 أحرف على الأقل)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">كلمة المرور الحالية</Label>
                                <div className="relative">
                                    <Input
                                        id="current-password"
                                        type={showCurrentPw ? "text" : "password"}
                                        value={pwForm.currentPassword}
                                        onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                                        className="pl-10"
                                        placeholder="••••••••"
                                    />
                                    <Button type="button" variant="ghost" size="sm" className="absolute left-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowCurrentPw(!showCurrentPw)}>
                                        {showCurrentPw ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                                <div className="relative">
                                    <Input
                                        id="new-password"
                                        type={showNewPw ? "text" : "password"}
                                        value={pwForm.newPassword}
                                        onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
                                        className="pl-10"
                                        placeholder="••••••••"
                                    />
                                    <Button type="button" variant="ghost" size="sm" className="absolute left-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowNewPw(!showNewPw)}>
                                        {showNewPw ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">تأكيد كلمة المرور الجديدة</Label>
                                <div className="relative">
                                    <Input
                                        id="confirm-password"
                                        type={showConfirmPw ? "text" : "password"}
                                        value={pwForm.confirmPassword}
                                        onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                                        className="pl-10"
                                        placeholder="••••••••"
                                    />
                                    <Button type="button" variant="ghost" size="sm" className="absolute left-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowConfirmPw(!showConfirmPw)}>
                                        {showConfirmPw ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                                    </Button>
                                </div>
                                {pwForm.newPassword && pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword && (
                                    <p className="text-xs text-red-500">كلمتا المرور غير متطابقتين</p>
                                )}
                            </div>

                            <Button onClick={handlePasswordChange} disabled={isChangingPw} className="mt-2">
                                {isChangingPw ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />جاري التغيير...</> : "تغيير كلمة المرور"}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
