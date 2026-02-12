"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, FileText, Eye, EyeOff, Plus, Trash2 } from "lucide-react"
import { UserRole } from "@/types"

type BankAccount = {
    id: string
    bankName: string
    beneficiaryName: string
    accountNumber: string
}

const mockUser = {
    id: "2",
    name: "فاطمة علي",
    email: "fatima@example.com",
    phone: "+966507654321",
    role: 'trainer' as UserRole,
    avatar: "",
    bio: "مدربة محترفة في مجال تطوير الويب وتصميم الواجهات",
    cv: "cv.pdf",
    address: "جدة، المملكة العربية السعودية"
}

export default function TrainerProfilePage() {
    const [user, setUser] = useState(mockUser)
    const [isEditing, setIsEditing] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [activeTab, setActiveTab] = useState("personal")
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
        {
            id: "trainer-bank-1",
            bankName: "البنك الأهلي السعودي",
            beneficiaryName: "فاطمة علي",
            accountNumber: "SA4420000001234567890001"
        }
    ])

    const handleSave = () => {
        // In real app, this would make an API call
        setIsEditing(false)
    }

    const handleAddBankAccount = () => {
        setBankAccounts((prev) => [
            ...prev,
            {
                id: `trainer-bank-${Date.now()}`,
                bankName: "",
                beneficiaryName: user.name,
                accountNumber: ""
            }
        ])
    }

    const handleUpdateBankAccount = (
        id: string,
        field: keyof Omit<BankAccount, "id">,
        value: string
    ) => {
        setBankAccounts((prev) =>
            prev.map((account) =>
                account.id === id ? { ...account, [field]: value } : account
            )
        )
    }

    const handleRemoveBankAccount = (id: string) => {
        setBankAccounts((prev) => prev.filter((account) => account.id !== id))
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
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-lg">
                            {user.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <Button variant="outline" size="sm">
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
                                مدرب
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bio">نبذة عني</Label>
                    <Textarea
                        id="bio"
                        value={user.bio}
                        onChange={(e) => setUser({ ...user, bio: e.target.value })}
                        disabled={!isEditing}
                        rows={3}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cv">السيرة الذاتية</Label>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled={!isEditing}>
                            <FileText className="mr-2 h-4 w-4" />
                            رفع السيرة الذاتية
                        </Button>
                        {user.cv && (
                            <span className="text-sm text-gray-500">تم رفع الملف</span>
                        )}
                    </div>
                </div>
                <div className="space-y-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-semibold">الحسابات البنكية</h3>
                            <p className="text-sm text-gray-500">
                                يمكنك إضافة أكثر من حساب بنكي لاستقبال التحويلات.
                            </p>
                        </div>
                        {isEditing && (
                            <Button type="button" variant="outline" size="sm" onClick={handleAddBankAccount}>
                                <Plus className="mr-2 h-4 w-4" />
                                إضافة بنك
                            </Button>
                        )}
                    </div>

                    <div className="space-y-3">
                        {bankAccounts.map((account, index) => (
                            <div key={account.id} className="space-y-3 rounded-md border bg-gray-50 p-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">الحساب البنكي {index + 1}</p>
                                    {isEditing && bankAccounts.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleRemoveBankAccount(account.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="space-y-2">
                                        <Label>اسم البنك</Label>
                                        <Input
                                            value={account.bankName}
                                            onChange={(e) =>
                                                handleUpdateBankAccount(account.id, "bankName", e.target.value)
                                            }
                                            placeholder="مثال: البنك الأهلي السعودي"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>اسم المستفيد</Label>
                                        <Input
                                            value={account.beneficiaryName}
                                            onChange={(e) =>
                                                handleUpdateBankAccount(account.id, "beneficiaryName", e.target.value)
                                            }
                                            placeholder="الاسم حسب الحساب البنكي"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>رقم الحساب / IBAN</Label>
                                        <Input
                                            value={account.accountNumber}
                                            onChange={(e) =>
                                                handleUpdateBankAccount(account.id, "accountNumber", e.target.value)
                                            }
                                            placeholder="SAxxxxxxxxxxxxxxxxxxxx"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <Button onClick={handleSave}>حفظ التغييرات</Button>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
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
                <p className="text-gray-600 mt-2">إدارة معلومات حسابك وإعداداتك</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="personal">المعلومات الشخصية</TabsTrigger>
                    <TabsTrigger value="security">كلمة المرور</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="mt-6">
                    {renderPersonalInfo()}
                </TabsContent>

                <TabsContent value="security" className="mt-6">
                    {renderPasswordChange()}
                </TabsContent>
            </Tabs>
        </div>
    )
}
