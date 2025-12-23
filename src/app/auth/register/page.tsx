"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, Phone, User, Building, Upload, FileText, Briefcase, GraduationCap, MapPin, BadgeCheck, FileBadge } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { UserRole } from "@/types"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [role, setRole] = useState<UserRole | "">("")

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'student': return 'طالب'
      case 'trainer': return 'مدرّب'
      case 'institute_admin': return 'مسؤول معهد'
      default: return ''
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">إنشاء حساب جديد</CardTitle>
          <CardDescription>
            انضم إلى منصة حجز الدورات
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{role === 'institute_admin' ? 'اسم المعهد/المؤسسة' : 'الاسم الكامل'}</Label>
            <div className="relative">
              {role === 'institute_admin' ? (
                 <Building className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              ) : (
                 <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              )}
              <Input
                id="name"
                type="text"
                placeholder={role === 'institute_admin' ? 'أدخل اسم المعهد' : 'أدخل اسمك الكامل'}
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
                placeholder="أدخل بريدك الإلكتروني"
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
                type="tel"
                placeholder="أدخل رقم هاتفك"
                className="pr-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">نوع الحساب</Label>
            <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر نوع الحساب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    طالب
                  </div>
                </SelectItem>
                <SelectItem value="trainer">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    مدرّب
                  </div>
                </SelectItem>
                <SelectItem value="institute_admin">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    مسؤول معهد
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dynamic Fields for Trainer */}
          {role === 'trainer' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500 border-r-2 border-primary/20 pr-4 my-4">
               <div className="space-y-2">
                <Label htmlFor="specialization">التخصص</Label>
                <div className="relative">
                  <Briefcase className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="specialization" placeholder="مثال: تطوير الويب، إدارة أعمال..." className="pr-10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">نبذة عن المدرب</Label>
                <div className="relative">
                   <Textarea id="bio" placeholder="تحدث باختصار عن خبراتك ومهاراتك..." className="min-h-[100px]" />
                </div>
              </div>

               <div className="space-y-2">
                <Label htmlFor="cv">السيرة الذاتية (CV)</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-8 w-8 text-gray-400" />
                     <span className="text-sm text-gray-600">ارفع ملف السيرة الذاتية (PDF)</span>
                     <Input id="cv" type="file" accept=".pdf" className="hidden" />
                     <Button type="button" variant="secondary" size="sm" onClick={() => document.getElementById('cv')?.click()}>
                        اختر ملف
                     </Button>
                  </div>
                </div>
              </div>

               <div className="space-y-2">
                <Label htmlFor="certificates">الشهادات</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-center gap-2">
                    <GraduationCap className="h-8 w-8 text-gray-400" />
                     <span className="text-sm text-gray-600">ارفع صور الشهادات (يمكن اختيار أكثر من ملف)</span>
                     <Input id="certificates" type="file" multiple accept="image/*,.pdf" className="hidden" />
                      <Button type="button" variant="secondary" size="sm" onClick={() => document.getElementById('certificates')?.click()}>
                        اختر ملفات
                     </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Fields for Institute */}
          {role === 'institute_admin' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500 border-r-2 border-primary/20 pr-4 my-4">
              <div className="space-y-2">
                <Label htmlFor="license">رقم السجل التجاري / الترخيص</Label>
                <div className="relative">
                  <FileBadge className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="license" placeholder="أدخل رقم السجل التجاري" className="pr-10" />
                </div>
              </div>

              <div className="space-y-2">
                 <Label htmlFor="proof">إثبات الكيان <span className="text-red-500">*</span></Label>
                 <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-center gap-2">
                    <BadgeCheck className="h-8 w-8 text-gray-400" />
                     <span className="text-sm text-gray-600">صورة السجل أو الترخيص (إجباري)</span>
                     <Input id="proof" type="file" accept="image/*,.pdf" className="hidden" />
                      <Button type="button" variant="secondary" size="sm" onClick={() => document.getElementById('proof')?.click()}>
                        اختر ملف
                     </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">العنوان</Label>
                 <div className="relative">
                  <MapPin className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="address" placeholder="المدينة، الحي، الشارع" className="pr-10" />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <div className="relative">
              <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="أدخل كلمة مرور قوية"
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
            <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
            <div className="relative">
              <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="أعد إدخال كلمة المرور"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox id="terms" />
            <Label htmlFor="terms" className="text-sm">
              أوافق على{" "}
              <Link href="/terms" className="text-primary hover:underline">
                الشروط والأحكام
              </Link>{" "}
              و{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                سياسة الخصوصية
              </Link>
            </Label>
          </div>

          <Button className="w-full" size="lg" disabled={!role}>
            إنشاء الحساب
          </Button>

          <div className="text-center text-sm">
            لديك حساب بالفعل؟{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              تسجيل الدخول
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}