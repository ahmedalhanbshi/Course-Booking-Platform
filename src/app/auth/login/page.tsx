"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, AlertCircle } from "lucide-react"
import { getRequestErrorMessage } from "@/lib/request-error"

type DemoRole = "student" | "trainer" | "institute" | "admin"

type DemoAccount = {
  role: DemoRole
  label: string
  email: string
  password: string
}

const getEnv = (value?: string) => value?.trim() || ""
const demoPasswordDefault = getEnv(process.env.NEXT_PUBLIC_DEMO_PASSWORD)

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "student",
    label: "طالب",
    email: getEnv(process.env.NEXT_PUBLIC_DEMO_STUDENT_EMAIL),
    password: getEnv(process.env.NEXT_PUBLIC_DEMO_STUDENT_PASSWORD) || demoPasswordDefault,
  },
  {
    role: "trainer",
    label: "مدرب",
    email: getEnv(process.env.NEXT_PUBLIC_DEMO_TRAINER_EMAIL),
    password: getEnv(process.env.NEXT_PUBLIC_DEMO_TRAINER_PASSWORD) || demoPasswordDefault,
  },
  {
    role: "institute",
    label: "معهد",
    email: getEnv(process.env.NEXT_PUBLIC_DEMO_INSTITUTE_EMAIL),
    password: getEnv(process.env.NEXT_PUBLIC_DEMO_INSTITUTE_PASSWORD) || demoPasswordDefault,
  },
  {
    role: "admin",
    label: "مسؤول",
    email: getEnv(process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL),
    password: getEnv(process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD) || demoPasswordDefault,
  },
].filter((account) => account.email && account.password)

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, user, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const registered = searchParams.get("registered")
  useEffect(() => {
    if (registered === "true") {
      setSuccessMessage("تم إنشاء حسابك بنجاح! يرجى تسجيل الدخول")
    }
  }, [registered])

  const role = searchParams.get("role") as DemoRole | null
  useEffect(() => {
    if (!role) return

    const demoAccount = DEMO_ACCOUNTS.find((account) => account.role === role)
    if (demoAccount) {
      setFormData({
        email: demoAccount.email,
        password: demoAccount.password,
      })
    }
  }, [role])

  useEffect(() => {
    if (user && !authLoading) {
      switch (user.role) {
        case "STUDENT":
          router.push("/student/dashboard")
          break
        case "TRAINER":
          router.push("/trainer/dashboard")
          break
        case "INSTITUTE_ADMIN":
          router.push("/institute/dashboard")
          break
        case "PLATFORM_ADMIN":
          router.push("/admin/dashboard")
          break
        default:
          router.push("/")
      }
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await login(formData.email, formData.password)
    } catch (err: unknown) {
      console.error("Login error:", err)
      setError(getRequestErrorMessage(err, "حدث خطأ أثناء تسجيل الدخول"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
          <CardDescription>أدخل بيانات حسابك للمتابعة</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {successMessage && (
              <Alert className="bg-green-50 text-green-900 border-green-200">
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">كلمة المرور</Label>
                <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري التحقق...
                </>
              ) : (
                "دخول"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">حسابات تجريبية</span>
              </div>
            </div>

            {DEMO_ACCOUNTS.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map((account) => (
                  <Button
                    key={account.role}
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData({ email: account.email, password: account.password })}
                  >
                    {account.label}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">الحسابات التجريبية غير مفعلة في هذه البيئة.</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            ليس لديك حساب؟{" "}
            <Link href="/auth/register" className="text-primary hover:underline">
              إنشاء حساب جديد
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
