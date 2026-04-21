"use client"

import { FormEvent, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Bell, Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useNotifications } from "@/contexts/notification-context"
import { getFileUrl } from "@/lib/utils"
import { SharedUserMenu } from "@/components/layout/shared-user-menu"
import type { UserRole } from "@/types"

interface SharedTopBarProps {
  onMenuClick?: () => void
  homeHref?: string
  profileHref?: string
  notificationsHref?: string
  searchPlaceholder?: string
  resolveSearchBase?: (pathname: string) => string
}

interface TopBarSearchProps {
  searchPlaceholder: string
  resolveSearchBase?: (pathname: string) => string
}

// Inner component that calls useSearchParams – must be wrapped in Suspense by its parent.
function TopBarSearch({ searchPlaceholder, resolveSearchBase }: TopBarSearchProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchFromQuery = searchParams.get("search")?.trim() ?? ""

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!resolveSearchBase) return
    const formData = new FormData(event.currentTarget)
    const rawValue = formData.get("search")
    const query = typeof rawValue === "string" ? rawValue.trim() : ""
    const targetBase = resolveSearchBase(pathname)
    router.push(query ? `${targetBase}?search=${encodeURIComponent(query)}` : targetBase)
  }

  return (
    <form onSubmit={submitSearch} className="mx-auto w-full min-w-0 max-w-2xl">
      <div className="relative group">
        <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-500 dark:text-slate-400" />
        <input
          key={searchFromQuery}
          name="search"
          defaultValue={searchFromQuery}
          type="search"
          placeholder={searchPlaceholder}
          className="h-10 w-full rounded-full border border-slate-300 bg-slate-50 shadow-sm pr-11 pl-4 text-sm text-slate-900 placeholder:text-slate-500 outline-none transition hover:border-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400 dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:bg-slate-950 dark:focus:ring-blue-500/20"
        />
      </div>
    </form>
  )
}

export function SharedTopBar({
  onMenuClick,
  homeHref = "/",
  profileHref = "#",
  notificationsHref = "#",
  searchPlaceholder = "ابحث في المنصة",
  resolveSearchBase,
}: SharedTopBarProps) {
  const { user, logout } = useAuth()
  const { unreadCount } = useNotifications()

  const avatarSrc = getFileUrl(user?.avatar) || "/images/placeholder.png"
  const unreadLabel = unreadCount > 9 ? "9+" : String(unreadCount)

  const getRoleLabel = (role?: UserRole) => {
    switch (role) {
      case "STUDENT":
        return "طالب"
      case "TRAINER":
        return "مدرب"
      case "INSTITUTE_ADMIN":
        return "معهد"
      case "PLATFORM_ADMIN":
        return "مسؤول"
      default:
        return "حساب"
    }
  }

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="flex h-full items-center gap-3 px-3 md:px-5 lg:px-6" dir="rtl">
        <div className="flex shrink-0 items-center gap-2">
          {onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="h-10 w-10 rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              title="تصغير أو توسيع القائمة الجانبية"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">القائمة</span>
            </Button>
          )}
          <Link href={homeHref} className="inline-flex items-center gap-2.5 px-1 py-1 text-slate-900 dark:text-white">
            <span className="relative h-10 w-10 shrink-0">
              <Image src="/images/logo.png" alt="منصة دال" fill className="object-contain" />
            </span>
            <span className="hidden text-lg font-bold tracking-tight sm:inline">منصة دال</span>
          </Link>
        </div>

        {/* Search – wrapped in Suspense because TopBarSearch calls useSearchParams */}
        <Suspense fallback={<div className="mx-auto w-full min-w-0 max-w-2xl" />}>
          <TopBarSearch
            searchPlaceholder={searchPlaceholder}
            resolveSearchBase={resolveSearchBase}
          />
        </Suspense>

        <div className="flex shrink-0 items-center gap-1 md:gap-2">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="relative h-10 w-10 rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <Link href={notificationsHref} title="الإشعارات">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -left-0.5 min-w-[18px] rounded-full bg-red-600 px-1 text-center text-[10px] font-bold leading-[18px] text-white">
                  {unreadLabel}
                </span>
              )}
              <span className="sr-only">الإشعارات</span>
            </Link>
          </Button>

          <SharedUserMenu
            name={user?.name ?? "الحساب"}
            email={user?.email}
            roleLabel={getRoleLabel(user?.role)}
            avatarSrc={avatarSrc}
            profileHref={profileHref}
            notificationsHref={notificationsHref}
            onLogout={logout}
          />
        </div>
      </div>
    </header>
  )
}
