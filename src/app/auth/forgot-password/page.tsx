"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Phone, ArrowRight, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'request' | 'sent'>('request')
  const [method, setMethod] = useState<'email' | 'phone'>('email')

  if (step === 'sent') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">تم إرسال الرمز</CardTitle>
            <CardDescription>
              {method === 'email'
                ? 'تم إرسال رمز إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'
                : 'تم إرسال رمز إعادة تعيين كلمة المرور إلى رقم هاتفك'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-gray-600">
              يرجى التحقق من {method === 'email' ? 'بريدك الإلكتروني' : 'رسائلك النصية'} والنقر على الرابط لإعادة تعيين كلمة المرور
            </div>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/auth/reset-password">
                انتقل إلى صفحة إعادة التعيين
              </Link>
            </Button>

            <Button
              className="w-full"
              onClick={() => setStep('request')}
            >
              إرسال رمز آخر
            </Button>

            <div className="text-center">
              <Link href="/auth/login" className="text-primary hover:underline text-sm">
                العودة إلى تسجيل الدخول
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">نسيت كلمة المرور؟</CardTitle>
          <CardDescription>
            أدخل بريدك الإلكتروني أو رقم هاتفك وسنرسل لك رمز إعادة التعيين
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={method} onValueChange={(value) => setMethod(value as 'email' | 'phone')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">البريد الإلكتروني</TabsTrigger>
              <TabsTrigger value="phone">رقم الهاتف</TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4">
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
            </TabsContent>

            <TabsContent value="phone" className="space-y-4">
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
            </TabsContent>
          </Tabs>

          <Button
            className="w-full"
            size="lg"
            onClick={() => setStep('sent')}
          >
            إرسال رمز إعادة التعيين
            <ArrowRight className="mr-2 h-4 w-4" />
          </Button>

          <div className="text-center text-sm">
            تذكرت كلمة المرور؟{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              تسجيل الدخول
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}