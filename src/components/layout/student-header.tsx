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

// Mock student for header
const mockStudent = {
    name: "علي أحمد",
    avatar: "/avatars/student-avatar.jpg",
}

interface StudentHeaderProps {
  onMenuClick: () => void
}

export function StudentHeader({ onMenuClick }: StudentHeaderProps) {
  const { logout } = useAuth()
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
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border border-gray-200">
                <AvatarImage src={mockStudent.avatar} alt={mockStudent.name} />
                <AvatarFallback>{mockStudent.name[0]}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{mockStudent.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  student@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/profile">الملف الشخصي</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link href="/student/notifications">الإشعارات</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
                onClick={() => logout()}
                className="text-red-600 focus:text-red-600 cursor-pointer"
            >
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
