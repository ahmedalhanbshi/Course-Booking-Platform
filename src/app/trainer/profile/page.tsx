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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, Mail, Phone, Eye, EyeOff, Loader2, Camera, X, Plus, ShieldCheck, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { trainerService } from "@/lib/trainer-service"
import { useAuth } from "@/contexts/auth-context"
import { getFileUrl } from "@/lib/utils"

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
    const [form, setForm] = useState({ name: "", phone: "", bio: "", specialties: [] as string[], email: "" })
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

    // Bank Account States
    const [bankAccounts, setBankAccounts] = useState<any[]>([])
    const [isBankAccountsLoading, setIsBankAccountsLoading] = useState(true)
    const [isBankModalOpen, setIsBankModalOpen] = useState(false)
    const [isSavingBank, setIsSavingBank] = useState(false)
    const [editingAccountId, setEditingAccountId] = useState<string | null>(null)
    const [bankForm, setBankForm] = useState({
        bankName: "",
        accountName: "",
        accountNumber: "",
        iban: "",
        isActive: true
    })

    const fetchBankAccounts = async () => {
        try {
            setIsBankAccountsLoading(true)
            const accounts = await trainerService.getBankAccounts()
            setBankAccounts(accounts || [])
        } catch (error) {
            console.error("Failed to fetch bank accounts", error)
            toast.error("فشل في تحميل الحسابات البنكية")
        } finally {
            setIsBankAccountsLoading(false)
        }
    }

    const openBankModal = (account?: any) => {
        if (account) {
            setEditingAccountId(account.id)
            setBankForm({
                bankName: account.bankName,
                accountName: account.accountName,
                accountNumber: account.accountNumber,
                iban: account.iban || "",
                isActive: account.isActive
            })
        } else {
            setEditingAccountId(null)
            setBankForm({
                bankName: "",
                accountName: "",
                accountNumber: "",
                iban: "",
                isActive: true
            })
        }
        setIsBankModalOpen(true)
    }

    const handleSaveBankAccount = async () => {
        if (!bankForm.bankName || !bankForm.accountName || !bankForm.accountNumber) {
            toast.error("يرجى تعبئة جميع الحقول الإلزامية")
            return
        }

        try {
            setIsSavingBank(true)
            if (editingAccountId) {
                await trainerService.updateBankAccount(editingAccountId, bankForm)
                toast.success("تم تحديث الحساب البنكي بنجاح")
            } else {
                await trainerService.addBankAccount(bankForm)
                toast.success("تم إضافة الحساب البنكي بنجاح")
            }
            setIsBankModalOpen(false)
            fetchBankAccounts()
        } catch (error: any) {
            console.error("Error saving bank account:", error)
            toast.error(error.message || "حدث خطأ أثناء حفظ الحساب البنكي")
        } finally {
            setIsSavingBank(false)
        }
    }

    const handleDeleteBankAccount = async (id: string) => {
        if (!confirm("هل أنت متأكد من حذف هذا الحساب البنكي؟")) return

        try {
            await trainerService.deleteBankAccount(id)
            toast.success("تم حذف الحساب البنكي بنجاح")
            fetchBankAccounts()
        } catch (error: any) {
            console.error("Error deleting bank account:", error)
            toast.error(error.message || "حدث خطأ أثناء حذف الحساب الدنكي")
        }
    }

    // Load profile
    useEffect(() => {
        const load = async () => {
            try {
                const data = await trainerService.getProfile()
                setProfile(data)
                setForm({ name: data.name, phone: data.phone ?? "", bio: data.bio ?? "", specialties: data.specialties ?? [], email: data.email ?? "" })
            } catch (err: any) {
                toast.error(err?.response?.data?.message || "فشل في تحميل الملف الشخصي")
            } finally {
                setLoading(false)
            }
        }
        load()
        fetchBankAccounts()
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
        setForm({ name: profile.name, phone: profile.phone, bio: profile.bio, specialties: [...profile.specialties], email: profile.email })
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
                email: form.email,
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

    const persistedAvatarSrc = getFileUrl(profile?.avatar)
    const avatarSrc = avatarPreview || (persistedAvatarSrc ? `${persistedAvatarSrc}?t=${avatarCacheKey}` : "")

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


    const calculateProgress = () => {
        let total = 0
        let filled = 0
        const fields = [
            profile?.name,
            profile?.email,
            profile?.phone,
            profile?.bio,
            profile?.avatar,
            profile?.specialties && profile.specialties.length > 0 ? "has" : ""
        ]
        fields.forEach(f => {
            total++
            if (f && String(f).trim() !== "") filled++
        })
        return Math.round((filled / total) * 100)
    }
    const profileProgress = profile ? calculateProgress() : 0

    return (
        <div className="max-w-4xl mx-auto" dir="rtl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">الملف الشخصي</h1>
                <p className="text-gray-600 mt-2">إدارة معلومات حسابك وإعداداتك</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="security">كلمة المرور</TabsTrigger>
                    <TabsTrigger value="banks">الحسابات البنكية</TabsTrigger>
                    <TabsTrigger value="personal">المعلومات الشخصية</TabsTrigger>
                </TabsList>

                {/* ─── Personal Info Tab ─── */}
                <TabsContent value="personal" className="mt-6 space-y-8" dir="rtl">
                    
                    {/* Header Section + Bio (Combined Card) */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-6">
                        
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            
                            {/* Avatar & Info (Right side) */}
                            <div className="flex items-center gap-6">
                                <div
                                    className={`relative group ${isEditing ? "cursor-pointer" : ""}`}
                                    onClick={() => isEditing && avatarInputRef.current?.click()}
                                >
                                    <Avatar className="h-28 w-28 ring-4 ring-slate-50 dark:ring-slate-800 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 shadow-sm">
                                        <AvatarImage src={avatarSrc} alt={profile.name} className="object-cover" />
                                        <AvatarFallback className="text-3xl bg-primary/10 text-primary font-bold">
                                            {profile.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    {isEditing && (
                                        <div className="absolute inset-0 rounded-full bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all pointer-events-none data-[state=open]:opacity-100">
                                            <Camera className="h-6 w-6 text-white mb-1" />
                                            <span className="text-[10px] text-white font-medium">تغيير الصورة</span>
                                        </div>
                                    )}
                                    <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                </div>
                                
                                <div className="flex flex-col gap-2 text-start">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{profile.name}</h2>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant="secondary" className="px-3 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">مدرب مسجل</Badge>
                                        {profile.verificationStatus && (
                                            <Badge variant={verificationBadgeVariant} className="flex items-center gap-1.5 px-3 bg-white border border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 shadow-sm">
                                                <ShieldCheck className="h-3.5 w-3.5" />
                                                {verificationLabel}
                                            </Badge>
                                        )}
                                        <Badge variant={profile.status === "active" ? "default" : "secondary"} className={profile.status === "active" ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
                                            {profile.status === "active" ? "نشط" : profile.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Left side: Progress & Actions */}
                            <div className="flex flex-col gap-4 items-end min-w-[200px]">
                                <div className="w-full bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <div className="flex justify-between items-center text-sm font-medium mb-2">
                                        <span className="text-slate-600 dark:text-slate-400">اكتمال الملف</span>
                                        <span className="text-primary" dir="ltr">{profileProgress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${profileProgress}%` }} />
                                    </div>
                                </div>

                                <div className="flex justify-end w-full">
                                    {isEditing ? (
                                        <div className="flex gap-2">
                                            <Button variant="outline" onClick={cancelEditing} disabled={isSaving} className="px-4 rounded-lg font-bold">إلغاء</Button>
                                            <Button onClick={handleSave} disabled={isSaving} className="px-6 rounded-lg font-bold shadow-sm">
                                                {isSaving ? <><Loader2 className="me-2 h-4 w-4 animate-spin" />جاري الحفظ...</> : "حفظ التغييرات"}
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button onClick={startEditing} className="px-6 rounded-lg font-bold shadow-sm gap-2 w-full">
                                            <Pencil className="h-4 w-4" />
                                            تعديل المعلومات
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bio inside top card */}
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-start">
                            <Label htmlFor="bio" className="text-slate-800 dark:text-slate-200 font-bold text-lg mb-3 block">النبذة الشخصية</Label>
                            <div className="space-y-3">
                                <Textarea
                                    id="bio"
                                    value={isEditing ? form.bio : profile.bio || ""}
                                    onChange={e => isEditing && setForm({ ...form, bio: e.target.value.substring(0, 300) })}
                                    disabled={!isEditing}
                                    rows={4}
                                    className={`resize-none text-start leading-relaxed text-base ${!isEditing ? "bg-slate-50 dark:bg-slate-800/40 cursor-default shadow-none border-transparent text-slate-800 dark:text-slate-200 p-4" : "p-4"}`}
                                    placeholder="اكتب نبذة مختصرة عن خبرتك والدورات التي تقدمها وما يميز أسلوبك..."
                                />
                                <div className="flex justify-end">
                                    <span className="text-xs font-medium text-slate-400" dir="ltr">
                                        {isEditing ? form.bio.length : (profile.bio?.length || 0)} / 300
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Right side (Colspan-2) Basic Info */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden text-start">
                                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-start">
                                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">المعلومات الأساسية</h3>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        
                                        <div className="space-y-2 text-start">
                                            <Label htmlFor="name" className="text-slate-600 dark:text-slate-400">الاسم الكامل <span className="text-red-500">*</span></Label>
                                            <div className="relative flex items-center">
                                                <User className="absolute start-3 h-5 w-5 text-slate-400 pointer-events-none" />
                                                <Input
                                                    id="name"
                                                    value={isEditing ? form.name : profile.name}
                                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                                    disabled={!isEditing}
                                                    className={`ps-10 text-start ${!isEditing ? "bg-slate-50 dark:bg-slate-800/40 cursor-default shadow-none border-transparent font-medium" : ""}`}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-start">
                                            <Label htmlFor="email" className="text-slate-600 dark:text-slate-400">البريد الإلكتروني</Label>
                                            <div className="relative flex items-center">
                                                <Mail className="absolute start-3 h-5 w-5 text-slate-400 pointer-events-none" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={isEditing ? form.email : profile.email}
                                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                                    disabled={!isEditing}
                                                    className={`ps-10 text-start ${!isEditing ? "bg-slate-50 dark:bg-slate-800/40 cursor-default shadow-none border-transparent font-medium text-slate-800" : ""}`}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-start">
                                            <Label htmlFor="phone" className="text-slate-600 dark:text-slate-400">رقم الهاتف</Label>
                                            <div className="relative flex items-center">
                                                <Phone className="absolute start-3 h-5 w-5 text-slate-400 pointer-events-none" />
                                                <Input
                                                    id="phone"
                                                    value={isEditing ? form.phone : profile.phone || ""}
                                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                                    disabled={!isEditing}
                                                    className={`ps-10 text-start ${!isEditing ? "bg-slate-50 dark:bg-slate-800/40 cursor-default shadow-none border-transparent font-medium text-slate-800" : ""}`}
                                                    placeholder="مثال: +966 5X XXX XXXX"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* CV Section */}
                            {profile.cvUrl && (
                                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden p-6 flex justify-between items-center text-start">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">السيرة الذاتية</h3>
                                        <p className="text-sm text-slate-500 mt-1">النسخة المرفوعة لملفك الشخصي كمدرب</p>
                                    </div>
                                    <Button variant="outline" asChild className="rounded-lg">
                                        <a href={getFileUrl(profile.cvUrl)} target="_blank" rel="noopener noreferrer">
                                            عرض السيرة الذاتية
                                        </a>
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Left side (Colspan-1) Specialties */}
                        <div className="lg:col-span-1 space-y-8">
                             <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 text-start">
                                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-start">
                                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">التخصصات والمهارات</h3>
                                </div>
                                <div className="p-6 flex flex-col gap-4">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {(isEditing ? form.specialties : profile.specialties || []).map(s => (
                                            <Badge key={s} variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                {s}
                                                {isEditing && (
                                                    <button type="button" onClick={() => removeSpecialty(s)} className="rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 p-0.5 transition-colors ms-1">
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                )}
                                            </Badge>
                                        ))}
                                        
                                        {(isEditing ? form.specialties : profile.specialties || []).length === 0 && !isEditing && (
                                            <div className="w-full text-center py-8 px-4 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/30 text-slate-500">
                                                <p className="text-sm mb-4">لا يوجد تخصصات.</p>
                                                <Button size="sm" variant="outline" onClick={startEditing} className="rounded-full">إضافة تخصصك</Button>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {isEditing && (
                                        <div className="pt-5 border-t border-slate-100 dark:border-slate-800">
                                            <Label className="text-xs font-semibold text-slate-500 mb-2 block">أضف تخصص جديد</Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    placeholder="مثال: التصميم الجرافيكي..."
                                                    value={newSpecialty}
                                                    onChange={e => setNewSpecialty(e.target.value)}
                                                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSpecialty() } }}
                                                    className="bg-white flex-1 text-start"
                                                />
                                                <Button type="button" size="icon" onClick={addSpecialty}>
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
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
                                        className="pl-10 text-right"
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
                                        className="pl-10 text-right"
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
                                        className="pl-10 text-right"
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

                            <Button onClick={handlePasswordChange} disabled={isChangingPw} className="mt-2 text-right">
                                {isChangingPw ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />جاري التغيير...</> : "تغيير كلمة المرور"}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ─── Bank Accounts Tab ─── */}
                <TabsContent value="banks" className="mt-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <Button onClick={() => openBankModal()}>إضافة حساب جديد</Button>
                            <div className="text-right">
                                <CardTitle>الحسابات البنكية</CardTitle>
                                <CardDescription>إدارة الحسابات البنكية الخاصة بك لاستقبال المدفوعات.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isBankAccountsLoading ? (
                                <div className="flex h-32 items-center justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                </div>
                            ) : bankAccounts.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                    لا توجد حسابات بنكية مضافة بعد.
                                </div>
                            ) : (
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-right">اسم البنك</TableHead>
                                                <TableHead className="text-right">اسم الحساب</TableHead>
                                                <TableHead className="text-right">رقم الحساب</TableHead>
                                                <TableHead className="text-right">الآيبان (IBAN)</TableHead>
                                                <TableHead className="text-right">الحالة</TableHead>
                                                <TableHead className="text-left w-[120px]">الإجراءات</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {bankAccounts.map((account) => (
                                                <TableRow key={account.id}>
                                                    <TableCell className="font-medium">{account.bankName}</TableCell>
                                                    <TableCell>{account.accountName}</TableCell>
                                                    <TableCell dir="ltr" className="text-right">{account.accountNumber}</TableCell>
                                                    <TableCell dir="ltr" className="text-right">{account.iban || "-"}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={account.isActive ? "default" : "secondary"}>
                                                            {account.isActive ? "نشط" : "غير نشط"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-left">
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="ghost" size="icon" onClick={() => openBankModal(account)}>
                                                                 <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteBankAccount(account.id)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>

            <Dialog open={isBankModalOpen} onOpenChange={setIsBankModalOpen}>
                <DialogContent dir="rtl" className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingAccountId ? "تعديل حساب بنكي" : "إضافة حساب بنكي"}</DialogTitle>
                        <DialogDescription>
                            أدخل تفاصيل الحساب البنكي لاستقبال التحويلات.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="bankName">اسم البنك *</Label>
                            <Input
                                id="bankName"
                                value={bankForm.bankName}
                                onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                                placeholder="مثال: بنك الرياض، البنك الأهلي"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="accountName">اسم صاحب الحساب *</Label>
                            <Input
                                id="accountName"
                                value={bankForm.accountName}
                                onChange={(e) => setBankForm({ ...bankForm, accountName: e.target.value })}
                                placeholder="الاسم كما يظهر في البنك"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="accountNumber">رقم الحساب *</Label>
                            <Input
                                id="accountNumber"
                                value={bankForm.accountNumber}
                                onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                                dir="ltr"
                                className="text-right"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="iban">الآيبان (IBAN)</Label>
                            <Input
                                id="iban"
                                value={bankForm.iban}
                                onChange={(e) => setBankForm({ ...bankForm, iban: e.target.value })}
                                dir="ltr"
                                className="text-right"
                                placeholder="SA..."
                            />
                        </div>
                        {editingAccountId && (
                            <div className="flex items-center gap-2 mt-2">
                                <Label htmlFor="isActive" className="cursor-pointer">حساب نشط؟</Label>
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={bankForm.isActive}
                                    onChange={(e) => setBankForm({ ...bankForm, isActive: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsBankModalOpen(false)}>إلغاء</Button>
                        <Button onClick={handleSaveBankAccount} disabled={isSavingBank}>
                            {isSavingBank ? "جاري الحفظ..." : "حفظ الحساب"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    )
}
