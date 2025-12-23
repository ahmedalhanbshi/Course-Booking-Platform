"use client"

import Link from "next/link"
import { Bell, User, Menu, LogOut, Sun, Moon, Heart } from "lucide-react"
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

// Mock trainer for header
const mockTrainer = {
    name: "فاطمة المدربة",
    email: "trainer@demo.com",
    avatar: "/images/avatar-2.png",
}

interface TrainerHeaderProps {
  onMenuClick: () => void
}

export function TrainerHeader({ onMenuClick }: TrainerHeaderProps) {
  const { logout } = useAuth()
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
      {/* Menu Toggle */}
      <Button variant="ghost" size="icon" onClick={onMenuClick} className="text-gray-500 hover:text-gray-900 lg:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">القائمة</span>
      </Button>

      {/* Left Side: Profile & Notifications - As requested, keeping them on the left */}
      <div className="mr-auto flex items-center gap-2">
        
        {/* Wishlist */}
        <Button variant="ghost" size="icon" asChild className="rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50">
            <Link href="/trainer/wishlist" title="قائمة الرغبات">
                <Heart className="h-5 w-5" />
                <span className="sr-only">قائمة الرغبات</span>
            </Link>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" asChild className="rounded-full text-gray-500 hover:text-primary hover:bg-primary/10">
            <Link href="/trainer/notifications" title="الإشعارات">
                <Bell className="h-5 w-5" />
                <span className="sr-only">الإشعارات</span>
            </Link>
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border border-gray-200">
                <AvatarImage src={mockTrainer.avatar} alt={mockTrainer.name} />
                <AvatarFallback>TA</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{mockTrainer.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {mockTrainer.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/profile">الملف الشخصي</Link>
            </DropdownMenuItem>
             <DropdownMenuItem asChild>
                <Link href="/trainer/notifications">الإشعارات</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
                onClick={() => logout()}
                className="text-red-600 focus:text-red-600 cursor-pointer"
            >
              <LogOut className="ml-2 h-4 w-4" />
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
