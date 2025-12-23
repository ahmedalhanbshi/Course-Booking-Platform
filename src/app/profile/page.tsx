"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

export default function ProfileRedirectPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth/login')
      } else {
        switch (user.role) {
          case 'student':
            router.push('/student/profile')
            break
          case 'trainer':
            router.push('/trainer/profile')
            break
          case 'institute_admin':
            router.push('/institute/profile')
            break
          case 'platform_admin':
            router.push('/admin/profile')
            break
          default:
            router.push('/')
        }
      }
    }
  }, [user, isLoading, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-gray-500">جاري التوجيه...</p>
      </div>
    </div>
  )
}