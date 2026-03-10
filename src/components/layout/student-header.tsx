"use client"

import Link from "next/link"
import { Bell, Heart, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { getFileUrl } from "@/lib/utils"

interface StudentHeaderProps {
  onMenuClick: () => void
}

export function StudentHeader({ onMenuClick }: StudentHeaderProps) {
  const { user, logout } = useAuth()

  const avatarSrc = getFileUrl(user?.avatar) || "/images/placeholder.png"

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
      {/* Menu Toggle (Visible/Useful mainly when needed, but good to have always) */}
      <Button variant="ghost" size="icon" onClick={onMenuClick} className="text-gray-500 hover:text-gray-900">
        <Menu className="h-5 w-5" />
        <span className="sr-only">القائمة</span>
      </Button>

      <div className="mr-auto flex items-center gap-2">
        {/* Wishlist */}
        <Button variant="ghost" size="icon" asChild className="rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50">
          <Link href="/student/wishlist" title="الدورات المفضلة">
            <Heart className="h-5 w-5" />
            <span className="sr-only">الدورات المفضلة</span>
          </Link>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" asChild className="rounded-full text-gray-500 hover:text-primary hover:bg-primary/10">
          <Link href="/student/notifications" title="الإشعارات">
            <Bell className="h-5 w-5" />
            <span className="sr-only">الإشعارات</span>
          </Link>
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="pl-2 pr-1 py-1 h-auto rounded-full hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border border-gray-200">
                  <AvatarImage src={avatarSrc} alt={user?.name ?? ""} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {user?.name?.charAt(0) ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900 leading-none mb-1">{user?.name ?? "—"}</p>
                  <p className="text-[10px] text-blue-600 font-bold leading-none uppercase">طالب</p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1 text-right">
                <p className="text-sm font-medium leading-none">{user?.name ?? "—"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email ?? "—"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="text-right">
              <Link href="/student/profile" className="w-full">الملف الشخصي</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="text-right">
              <Link href="/student/notifications" className="w-full">الإشعارات</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="text-red-600 focus:text-red-600 cursor-pointer text-right flex justify-end"
            >
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
