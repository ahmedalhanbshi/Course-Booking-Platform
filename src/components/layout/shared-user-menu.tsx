"use client"

import Link from "next/link"
import { Bell, LogOut, User } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"

interface SharedUserMenuProps {
  name: string
  email?: string
  roleLabel?: string
  avatarSrc: string
  profileHref: string
  notificationsHref: string
  onLogout: () => void
}

export function SharedUserMenu({
  name,
  email,
  roleLabel,
  avatarSrc,
  profileHref,
  notificationsHref,
  onLogout,
}: SharedUserMenuProps) {
  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto rounded-full px-1.5 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
          <div className="flex flex-row-reverse items-center justify-end gap-2 text-right">
            <div className="hidden min-w-0 md:flex md:items-center md:justify-end md:gap-2 text-right">
              <p className="max-w-[200px] truncate text-sm font-medium leading-normal text-slate-700 dark:text-slate-100">
                {name || "الحساب"}
              </p>
              {roleLabel && (
                <Badge variant="role" className="shrink-0">
                  {roleLabel}
                </Badge>
              )}
            </div>
            <Avatar className="h-8 w-8 border border-slate-200 dark:border-slate-700">
              <AvatarImage src={avatarSrc} alt={name} />
              <AvatarFallback className="bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                {name?.charAt(0) ?? "؟"}
              </AvatarFallback>
            </Avatar>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex flex-col space-y-1.5 text-right">
            <div className="flex items-center justify-start gap-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{name || "-"}</p>
              {roleLabel && (
                <Badge variant="role" className="shrink-0">
                  {roleLabel}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{email || "-"}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={profileHref} className="cursor-pointer flex flex-row-reverse items-center justify-end gap-2 text-right w-full">
            <span>الملف الشخصي</span>
            <User className="h-4 w-4 ml-0" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={notificationsHref} className="cursor-pointer flex flex-row-reverse items-center justify-end gap-2 text-right w-full">
            <span>الإشعارات</span>
            <Bell className="h-4 w-4 ml-0" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer flex flex-row-reverse items-center justify-end gap-2 text-right w-full text-red-600 focus:bg-red-50 focus:text-red-600 dark:text-red-400 dark:focus:bg-red-950/40 dark:focus:text-red-300"
        >
          <span>تسجيل الخروج</span>
          <LogOut className="h-4 w-4 ml-0" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
