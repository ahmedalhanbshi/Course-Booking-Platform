"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Lock, User, Globe, Moon, Shield } from "lucide-react"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // In real app, show success toast
    }, 1000)
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          الإعدادات
        </h1>
        <p className="text-muted-foreground mt-2">
          تحكم في إعدادات حسابك وتفضيلاتك الشخصية
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-[600px] h-12">
          <TabsTrigger value="account" className="gap-2">
            <User className="h-4 w-4" />
            الحساب
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            الإشعارات
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Moon className="h-4 w-4" />
            المظهر
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2">
            <Shield className="h-4 w-4" />
            الخصوصية
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>معلومات الحساب</CardTitle>
              <CardDescription>قم بتحديث معلومات الاتصال والبيانات الشخصية الخاصة بك</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>الاسم الكامل</Label>
                  <Input defaultValue="أحمد محمد" />
                </div>
                <div className="space-y-2">
                  <Label>البريد الإلكتروني</Label>
                  <Input defaultValue="ahmed@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>رقم الهاتف</Label>
                  <Input defaultValue="0500000000" />
                </div>
                <div className="space-y-2">
                  <Label>تاريخ الميلاد</Label>
                  <Input type="date" />
                </div>
              </div>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تغيير كلمة المرور</CardTitle>
              <CardDescription>قم بتغيير كلمة المرور الخاصة بك بشكل دوري للحفاظ على أمان حسابك</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>كلمة المرور الحالية</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>كلمة المرور الجديدة</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>تأكيد كلمة المرور الجديدة</Label>
                <Input type="password" />
              </div>
              <Button onClick={handleSave} variant="outline" disabled={loading}>
                تحديث كلمة المرور
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تفضيلات الإشعارات</CardTitle>
              <CardDescription>تحكم في الإشعارات التي تود استلامها</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="course-updates" className="flex flex-col space-y-1">
                  <span>تحديثات الدورات</span>
                  <span className="font-normal text-xs text-muted-foreground">تلقي إشعارات عند إضافة محتوى جديد للدورات المسجل بها</span>
                </Label>
                <Switch id="course-updates" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="assignments" className="flex flex-col space-y-1">
                  <span>الواجبات والاختبارات</span>
                  <span className="font-normal text-xs text-muted-foreground">تلقي تذكيرات بمواعيد تسليم الواجبات والاختبارات</span>
                </Label>
                <Switch id="assignments" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="marketing" className="flex flex-col space-y-1">
                  <span>العروض والتخفيضات</span>
                  <span className="font-normal text-xs text-muted-foreground">تلقي رسائل حول الخصومات والدورات الجديدة المقترحة</span>
                </Label>
                <Switch id="marketing" />
              </div>
              <Button onClick={handleSave} disabled={loading}>
                حفظ التفضيلات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>المظهر واللغة</CardTitle>
              <CardDescription>خصص تجربة الاستخدام الخاصة بك</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>اللغة (Language)</Label>
                <Select defaultValue="ar">
                  <SelectTrigger>
                    <SelectValue placeholder="اختر اللغة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="en">English (Coming Soon)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                  <span>الوضع الليلي</span>
                  <span className="font-normal text-xs text-muted-foreground">تفعيل الوضع المظلم لراحة العين</span>
                </Label>
                <Switch id="dark-mode" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>الخصوصية والأمان</CardTitle>
              <CardDescription>التحكم في ظهور ملفك الشخصي وبياناتك</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="public-profile" className="flex flex-col space-y-1">
                  <span>الملف الشخصي عام</span>
                  <span className="font-normal text-xs text-muted-foreground">السماح للآخرين برؤية ملفي الشخصي وإنجازاتي</span>
                </Label>
                <Switch id="public-profile" defaultChecked />
              </div>
             <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="show-progress" className="flex flex-col space-y-1">
                  <span>إظهار التقدم</span>
                  <span className="font-normal text-xs text-muted-foreground">السماح بعرض تقدمي في الدورات في لائحة المتصدرين</span>
                </Label>
                <Switch id="show-progress" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
