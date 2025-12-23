"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, DollarSign, Bell, Search, Filter, Download } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { AdminPageHeader } from "@/components/admin/page-header"

// Mock data
interface Log {
  id: string
  type: 'activity' | 'payment' | 'notification'
  action: string
  details: string
  user: string
  ip?: string
  amount?: number
  status?: 'success' | 'failed' | 'pending'
  createdAt: Date
}

const mockLogs: Log[] = [
  {
    id: "log1",
    type: "activity",
    action: "تسجيل دخول",
    details: "تم تسجيل الدخول بنجاح",
    user: "فاطمة علي",
    ip: "192.168.1.1",
    createdAt: new Date("2024-01-28T10:30:00")
  },
  {
    id: "log2",
    type: "payment",
    action: "دفع رسوم دورة",
    details: "دورة البرمجة الأساسية",
    user: "علي أحمد",
    amount: 50000,
    status: "success",
    createdAt: new Date("2024-01-28T09:15:00")
  },
  {
    id: "log3",
    type: "notification",
    action: "إرسال إعلان",
    details: "صيانة مجدولة للمنصة",
    user: "أحمد المدير",
    status: "success",
    createdAt: new Date("2024-01-27T15:00:00")
  },
  {
    id: "log4",
    type: "payment",
    action: "محاولة دفع فاشلة",
    details: "رصيد غير كافي",
    user: "سارة خالد",
    amount: 80000,
    status: "failed",
    createdAt: new Date("2024-01-27T14:30:00")
  },
  {
    id: "log5",
    type: "activity",
    action: "تحديث ملف شخصي",
    details: "تغيير الصورة الشخصية",
    user: "محمد أحمد",
    ip: "192.168.1.5",
    createdAt: new Date("2024-01-26T11:20:00")
  }
]

export default function AdminLogs() {
  const [logs, setLogs] = useState<Log[]>(mockLogs)
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredLogs = logs.filter(log => {
    const matchesType = typeFilter === "all" || log.type === typeFilter
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const getStatusBadge = (status: Log['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">نجاح</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">فشل</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">قيد المعالجة</Badge>
      default:
        return null
    }
  }

  const getTypeIcon = (type: Log['type']) => {
    switch (type) {
      case 'activity':
        return <Activity className="h-4 w-4 text-blue-500" />
      case 'payment':
        return <DollarSign className="h-4 w-4 text-green-500" />
      case 'notification':
        return <Bell className="h-4 w-4 text-yellow-500" />
    }
  }

  const getTypeLabel = (type: Log['type']) => {
    switch (type) {
      case 'activity': return 'نشاط'
      case 'payment': return 'مدفوعات'
      case 'notification': return 'تنبيهات'
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="سجلات النظام"
        description="مراقبة نشاط النظام والعمليات المالية والتنبيهات"
        action={
          <Button variant="outline">
            <Download className="h-4 w-4 ml-2" />
            تصدير السجلات
          </Button>
        }
      />

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث في السجلات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="نوع السجل" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع السجلات</SelectItem>
                <SelectItem value="activity">النشاطات</SelectItem>
                <SelectItem value="payment">المدفوعات</SelectItem>
                <SelectItem value="notification">التنبيهات</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>أحدث السجلات</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>النوع</TableHead>
                <TableHead>الإجراء</TableHead>
                <TableHead>المستخدم</TableHead>
                <TableHead>التفاصيل</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>التاريخ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(log.type)}
                      <span className="text-sm">{getTypeLabel(log.type)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {log.details}
                      {log.amount && ` (${log.amount.toLocaleString()} ريال)`}
                      {log.ip && ` - IP: ${log.ip}`}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {formatDate(log.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}