"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Bell, User, Moon, Shield } from "lucide-react"

export default function InstituteSettingsPage() {
  const [loading, setLoading] = useState(false)

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          إعدادات المعهد
        </h1>
        <p className="text-muted-foreground mt-2">
          تحكم في إعدادات حساب المعهد وتفضيلات الطاقم
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-[600px] h-12">
          <TabsTrigger value="account" className="gap-2">
            <User className="h-4 w-4" />
            حساب المعهد
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            الإشعارات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>بيانات المعهد</CardTitle>
              <CardDescription>تحديث معلومات المعهد الرسمية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>اسم المعهد</Label>
                  <Input defaultValue="معهد المستقبل" />
                </div>
                <div className="space-y-2">
                  <Label>البريد الإلكتروني للإدارة</Label>
                  <Input defaultValue="admin@future-institute.com" />
                </div>
                 <div className="space-y-2">
                  <Label>رقم الهاتف</Label>
                  <Input defaultValue="0110000000" />
                </div>
                 <div className="space-y-2">
                  <Label>العنوان</Label>
                  <Input defaultValue="الرياض، المملكة العربية السعودية" />
                </div>
              </div>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
