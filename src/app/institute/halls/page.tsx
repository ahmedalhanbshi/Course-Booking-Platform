"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, MapPin, Users, Wifi, Projector, Edit, Trash2, Building2, Calendar, CheckCircle, XCircle, Clock, User, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { RoomBooking } from "@/types"
import { formatDate, formatTime } from "@/lib/utils"

// --- Mock Data: Halls (from halls/manage) ---
interface Hall {
    id: string;
    name: string;
    capacity: number;
    location: string;
    facilities: string[];
    status: string;
    type: string;
    building?: string;
    floor?: string;
    description?: string;
}

const mockHalls: Hall[] = [
    {
        id: "1",
        name: "القاعة الرئيسية",
        capacity: 50,
        location: "الدور الأرضي",
        facilities: ["projector", "wifi", "whiteboard", "ac"],
        status: "available",
        type: "lecture",
        description: "القاعة الرئيسية للمحاضرات الكبيرة"
    },
    {
        id: "2",
        name: "معمل الحاسب 1",
        capacity: 25,
        location: "الدور الأول",
        facilities: ["computers", "wifi", "projector", "ac"],
        status: "maintenance",
        type: "lab",
        description: "معمل مجهز بأحدث أجهزة الحاسب"
    },
    {
        id: "3",
        name: "قاعة الاجتماعات",
        capacity: 15,
        location: "الدور الثاني",
        facilities: ["wifi", "screen", "ac"],
        status: "occupied",
        type: "meeting",
        description: "قاعة اجتماعات صغيرة"
    }
]

// --- Mock Data: Bookings (from room-bookings) ---
const mockBookings: RoomBooking[] = [
  {
    id: "1",
    roomId: "1",
    sessionId: "session1",
    startTime: new Date("2024-01-15T10:00:00"),
    endTime: new Date("2024-01-15T12:00:00"),
    status: "pending",
    requestedById: "trainer1",
    notes: "حاجة لشاشة عرض كبيرة",
    initialConfirmation: true,
    paymentConfirmation: false,
    createdAt: new Date()
  },
  {
    id: "2",
    roomId: "2",
    sessionId: "session2",
    startTime: new Date("2024-01-15T14:00:00"),
    endTime: new Date("2024-01-15T16:00:00"),
    status: "approved",
    requestedById: "trainer2",
    approvedById: "admin1",
    notes: "تم تخصيص القاعة 203",
    initialConfirmation: true,
    paymentConfirmation: true,
    createdAt: new Date()
  },
  {
    id: "3",
    roomId: "1",
    sessionId: "session3",
    startTime: new Date("2024-01-16T09:00:00"),
    endTime: new Date("2024-01-16T11:00:00"),
    status: "rejected",
    requestedById: "trainer3",
    approvedById: "admin1",
    notes: "القاعة محجوزة مسبقاً",
    initialConfirmation: false,
    paymentConfirmation: false,
    createdAt: new Date()
  }
]

const mockRooms = [
  { id: "1", name: "قاعة 101" },
  { id: "2", name: "قاعة 203" },
  { id: "3", name: "قاعة 305" }
]

export default function InstituteHallsPage() {
    const [activeTab, setActiveTab] = useState<'halls' | 'bookings'>('halls')

    // --- Halls Management Logic ---
    const [halls, setHalls] = useState<Hall[]>(mockHalls)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedHall, setSelectedHall] = useState<Hall | null>(null)
    const [hallSearchTerm, setHallSearchTerm] = useState("")
    const [editingId, setEditingId] = useState<string | null>(null)

    const [newHall, setNewHall] = useState({
        name: "",
        capacity: "",
        location: "",
        building: "",
        floor: "",
        description: "",
        type: "lecture",
        status: "available",
        facilities: [] as string[]
    })

    const handleCreateHall = () => {
        if (editingId) {
            setHalls(halls.map(h => h.id === editingId ? {
                ...h,
                name: newHall.name,
                capacity: parseInt(newHall.capacity),
                location: `${newHall.building} - ${newHall.floor}`,
                building: newHall.building,
                floor: newHall.floor,
                description: newHall.description,
                facilities: newHall.facilities,
                type: newHall.type,
                status: newHall.status
            } : h))
            toast.success("تم تحديث بيانات القاعة بنجاح")
        } else {
            const hall = {
                id: Math.random().toString(36).substr(2, 9),
                name: newHall.name,
                capacity: parseInt(newHall.capacity),
                location: `${newHall.building} - ${newHall.floor}`,
                building: newHall.building,
                floor: newHall.floor,
                description: newHall.description,
                facilities: newHall.facilities,
                status: newHall.status,
                type: newHall.type
            }
            setHalls([...halls, hall])
            toast.success("تم إضافة القاعة بنجاح")
        }

        setIsCreateDialogOpen(false)
        setNewHall({ name: "", capacity: "", location: "", building: "", floor: "", description: "", type: "lecture", status: "available", facilities: [] })
        setEditingId(null)
    }

    const handleEditClick = (hall: any) => {
        setEditingId(hall.id)
        setNewHall({
            name: hall.name,
            capacity: hall.capacity.toString(),
            location: hall.location,
            building: hall.building || "",
            floor: hall.floor || "",
            description: hall.description || "",
            type: hall.type,
            status: hall.status,
            facilities: hall.facilities
        })
        setIsCreateDialogOpen(true)
    }

    const handleDeleteHall = () => {
        if (selectedHall) {
            setHalls(halls.filter(h => h.id !== selectedHall.id))
            setIsDeleteDialogOpen(false)
            setSelectedHall(null)
            toast.success("تم حذف القاعة بنجاح")
        }
    }

    const toggleFacility = (facility: string) => {
        if (newHall.facilities.includes(facility)) {
            setNewHall({ ...newHall, facilities: newHall.facilities.filter(f => f !== facility) })
        } else {
            setNewHall({ ...newHall, facilities: [...newHall.facilities, facility] })
        }
    }

    const getHallStatusBadge = (status: string) => {
        switch (status) {
            case 'available': return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">متاح</Badge>
            case 'occupied': return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">مشغول</Badge>
            case 'maintenance': return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">صيانة</Badge>
            default: return <Badge variant="outline">{status}</Badge>
        }
    }

    const filteredHalls = halls.filter(hall =>
        hall.name.includes(hallSearchTerm) || hall.location.includes(hallSearchTerm)
    )

    // --- Bookings Management Logic ---
    const [bookings, setBookings] = useState<RoomBooking[]>(mockBookings)
    const [selectedBooking, setSelectedBooking] = useState<RoomBooking | null>(null)
    const [actionDialog, setActionDialog] = useState<{ open: boolean; type: 'approve' | 'reject' | null }>({
        open: false,
        type: null
    })
    const [notes, setNotes] = useState("")
    const [selectedRoom, setSelectedRoom] = useState("")

    const handleApproveBooking = (booking: RoomBooking) => {
        setSelectedBooking(booking)
        setActionDialog({ open: true, type: 'approve' })
        setSelectedRoom(booking.roomId)
    }

    const handleRejectBooking = (booking: RoomBooking) => {
        setSelectedBooking(booking)
        setActionDialog({ open: true, type: 'reject' })
    }

    const executeAction = () => {
        if (!selectedBooking) return

        const updatedBooking: RoomBooking = {
            ...selectedBooking,
            status: actionDialog.type === 'approve' ? 'approved' : 'rejected',
            approvedById: "admin1",
            notes: actionDialog.type === 'approve' ? `تم تخصيص ${mockRooms.find(r => r.id === selectedRoom)?.name}` : notes
        }

        if (actionDialog.type === 'approve') {
            updatedBooking.roomId = selectedRoom
        }

        setBookings(bookings.map(b => b.id === selectedBooking.id ? updatedBooking : b))
        setActionDialog({ open: false, type: null })
        setSelectedBooking(null)
        setNotes("")
        setSelectedRoom("")
        toast.success(actionDialog.type === 'approve' ? "تم قبول الطلب" : "تم رفض الطلب")
    }

    const toggleBookingConfirmation = (id: string, field: 'initialConfirmation' | 'paymentConfirmation') => {
        setBookings(bookings.map(b => {
             if (b.id !== id) return b;
             return { ...b, [field]: !b[field] }
        }))
    }

    const getBookingStatusBadge = (status: RoomBooking['status']) => {
        switch (status) {
            case 'approved': return <Badge className="bg-green-100 text-green-800">مقبول</Badge>
            case 'rejected': return <Badge className="bg-red-100 text-red-800">مرفوض</Badge>
            case 'pending': return <Badge className="bg-yellow-100 text-yellow-800">قيد المراجعة</Badge>
            default: return <Badge variant="secondary">{status}</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">إدارة القاعات</h1>
                    <p className="text-gray-600 mt-2">إدارة القاعات الدراسية وطلبات الحجز</p>
                </div>

                {/* Segmented Control */}
                <div className="bg-gray-100 p-1 rounded-xl flex items-center w-fit">
                    <button
                        onClick={() => setActiveTab('halls')}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                            activeTab === 'halls'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        القاعات
                    </button>
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                            activeTab === 'bookings'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        طلبات الحجز
                    </button>
                </div>
            </div>

            {/* Tab 1: Halls CRUD */}
            {activeTab === 'halls' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between">
                         <div className="relative flex-1 max-w-sm">
                            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="بحث باسم القاعة أو الموقع..."
                                value={hallSearchTerm}
                                onChange={(e) => setHallSearchTerm(e.target.value)}
                                className="pr-10"
                            />
                        </div>
                        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
                            setIsCreateDialogOpen(open)
                            if (!open) {
                                setNewHall({ name: "", capacity: "", location: "", building: "", floor: "", description: "", type: "lecture", status: "available", facilities: [] })
                                setEditingId(null)
                            }
                        }}>
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    إضافة قاعة
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>{editingId ? "تعديل القاعة" : "إضافة قاعة جديدة"}</DialogTitle>
                                    <DialogDescription>
                                        {editingId ? "تعديل بيانات القاعة الحالية" : "أدخل تفاصيل القاعة الجديدة"}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">اسم القاعة</Label>
                                        <Input
                                            id="name"
                                            placeholder="مثال: القاعة الرئيسية"
                                            value={newHall.name}
                                            onChange={(e) => setNewHall({ ...newHall, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="building">المبنى</Label>
                                            <Input
                                                id="building"
                                                placeholder="مثال: المبنى الرئيسي"
                                                value={newHall.building}
                                                onChange={(e) => setNewHall({ ...newHall, building: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="floor">الدور</Label>
                                            <Input
                                                id="floor"
                                                placeholder="مثال: الدور الأول"
                                                value={newHall.floor}
                                                onChange={(e) => setNewHall({ ...newHall, floor: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="capacity">السعة الاستيعابية</Label>
                                            <Input
                                                id="capacity"
                                                type="number"
                                                placeholder="مثال: 50"
                                                value={newHall.capacity}
                                                onChange={(e) => setNewHall({ ...newHall, capacity: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="type">نوع القاعة</Label>
                                            <Select
                                                value={newHall.type}
                                                onValueChange={(value) => setNewHall({ ...newHall, type: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="اختر النوع" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="lecture">قاعة محاضرات</SelectItem>
                                                    <SelectItem value="lab">معمل حاسب</SelectItem>
                                                    <SelectItem value="meeting">قاعة اجتماعات</SelectItem>
                                                    <SelectItem value="workshop">ورشة عمل</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="status">حالة القاعة</Label>
                                        <Select
                                            value={newHall.status}
                                            onValueChange={(value) => setNewHall({ ...newHall, status: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="اختر الحالة" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="available">متاح</SelectItem>
                                                <SelectItem value="occupied">مشغول</SelectItem>
                                                <SelectItem value="maintenance">صيانة</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">وصف القاعة</Label>
                                        <Textarea
                                            id="description"
                                            placeholder="وصف تفصيلي للقاعة ومميزاتها..."
                                            value={newHall.description}
                                            onChange={(e) => setNewHall({ ...newHall, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>التجهيزات</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['wifi', 'projector', 'ac', 'whiteboard', 'computers', 'screen'].map(f => (
                                                <div key={f} className="flex items-center space-x-2 space-x-reverse">
                                                    <Checkbox id={f} checked={newHall.facilities.includes(f)} onCheckedChange={() => toggleFacility(f)} />
                                                    <Label htmlFor={f} className="font-normal cursor-pointer">
                                                        {f === 'wifi' && 'إنترنت لاسلكي'}
                                                        {f === 'projector' && 'جهاز عرض'}
                                                        {f === 'ac' && 'تكييف'}
                                                        {f === 'whiteboard' && 'سبورة ذكية'}
                                                        {f === 'computers' && 'أجهزة حاسب'}
                                                        {f === 'screen' && 'شاشة عرض'}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>إلغاء</Button>
                                    <Button onClick={handleCreateHall}>{editingId ? "حفظ التعديلات" : "إضافة القاعة"}</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredHalls.map((hall) => (
                            <Card key={hall.id} className="overflow-hidden">
                                <div className="h-2 bg-primary/10 w-full" />
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">{hall.name}</CardTitle>
                                        {getHallStatusBadge(hall.status)}
                                    </div>
                                    <CardDescription className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {hall.location}
                                        </div>
                                        {hall.description && (
                                            <span className="text-xs text-gray-500 line-clamp-2">{hall.description}</span>
                                        )}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Users className="h-4 w-4" />
                                                <span>السعة: {hall.capacity} شخص</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Building2 className="h-4 w-4" />
                                                <span>{hall.type === 'lecture' ? 'محاضرات' : hall.type === 'lab' ? 'معمل' : 'اجتماعات'}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {hall.facilities.includes('wifi') && <Badge variant="secondary" className="text-xs"><Wifi className="h-3 w-3 mr-1" /> WiFi</Badge>}
                                            {hall.facilities.includes('projector') && <Badge variant="secondary" className="text-xs"><Projector className="h-3 w-3 mr-1" /> عرض</Badge>}
                                            {hall.facilities.length > 2 && <Badge variant="secondary" className="text-xs">+{hall.facilities.length - 2} المزيد</Badge>}
                                        </div>

                                        <div className="flex items-center justify-end gap-2 pt-2 border-t mt-4">
                                            <Button variant="ghost" size="sm" onClick={() => handleEditClick(hall)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => {
                                                    setSelectedHall(hall)
                                                    setIsDeleteDialogOpen(true)
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>تأكيد الحذف</DialogTitle>
                                <DialogDescription>
                                    هل أنت متأكد من رغبتك في حذف القاعة "{selectedHall?.name}"؟ لا يمكن التراجع عن هذا الإجراء.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>إلغاء</Button>
                                <Button variant="destructive" onClick={handleDeleteHall}>حذف</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            )}

            {/* Tab 2: Bookings Requests (Refactored to Cards) */}
            {activeTab === 'bookings' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="grid gap-6">
                        {bookings.map((booking) => (
                            <Card key={booking.id} className="overflow-hidden border-2 hover:border-blue-100 transition-colors">
                                <CardHeader className="bg-gray-50/50 pb-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-1">دورة البرمجة الأساسية</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <User className="h-4 w-4" />
                                                فاطمة علي
                                            </div>
                                        </div>
                                        {getBookingStatusBadge(booking.status)}
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid md:grid-cols-3 gap-8">
                                        {/* Col 1: Details */}
                                        <div className="space-y-4 border-l pl-4">
                                             <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500">التاريخ والوقت</p>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-blue-600" />
                                                    <span>{formatDate(booking.startTime)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Clock className="h-4 w-4 text-blue-600" />
                                                    <span>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500">القاعة المطلوبة</p>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-gray-600" />
                                                    <span>{mockRooms.find(r => r.id === booking.roomId)?.name}</span>
                                                </div>
                                            </div>
                                            {booking.notes && (
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-500">ملاحظات</p>
                                                    <p className="text-sm text-gray-700 bg-yellow-50 p-2 rounded">{booking.notes}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Col 2: Verification Section (Center) */}
                                        <div className="space-y-6 border-l pl-4 flex flex-col justify-center">
                                            {/* Verification Section - Redesigned to match Student Enrollment Flow */}
                                            <div className="flex flex-col gap-4 py-4 px-5 bg-gray-50/80 rounded-xl border border-gray-100 w-full items-center justify-center">
                                                
                                                <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center">
                                                    {/* Initial Confirmation Toggle */}
                                                    <div 
                                                        onClick={() => booking.status === 'pending' && toggleBookingConfirmation(booking.id, 'initialConfirmation')}
                                                        className={`group flex items-center gap-2 cursor-pointer select-none transition-all ${booking.status !== 'pending' ? 'opacity-70 pointer-events-none' : ''}`}
                                                    >
                                                        <div className={`h-3 w-3 rounded-full transition-colors ${booking.initialConfirmation ? 'bg-green-500 shadow-sm' : 'bg-gray-300 group-hover:bg-gray-400'}`} />
                                                        <span className={`text-sm font-medium transition-colors ${booking.initialConfirmation ? 'text-gray-900' : 'text-gray-500'}`}>
                                                            التأكيد المبدئي
                                                        </span>
                                                        {booking.initialConfirmation && (
                                                            <CheckCircle className="h-4 w-4 text-green-500 animate-in zoom-in spin-in-50 duration-300" />
                                                        )}
                                                    </div>

                                                    <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

                                                    {/* Payment Confirmation Toggle */}
                                                    <div className="flex items-center gap-3">
                                                        <div 
                                                            onClick={() => booking.status === 'pending' && toggleBookingConfirmation(booking.id, 'paymentConfirmation')}
                                                            className={`group flex items-center gap-2 cursor-pointer select-none transition-all ${booking.status !== 'pending' ? 'opacity-70 pointer-events-none' : ''}`}
                                                        >
                                                            <div className={`h-3 w-3 rounded-full transition-colors ${booking.paymentConfirmation ? 'bg-green-500 shadow-sm' : 'bg-gray-300 group-hover:bg-gray-400'}`} />
                                                            <span className={`text-sm font-medium transition-colors ${booking.paymentConfirmation ? 'text-gray-900' : 'text-gray-500'}`}>
                                                                تأكيد الدفع
                                                            </span>
                                                            {booking.paymentConfirmation && (
                                                                <CheckCircle className="h-4 w-4 text-green-500 animate-in zoom-in spin-in-50 duration-300" />
                                                            )}
                                                        </div>
                                                        
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs font-medium"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toast.info("سيتم عرض تفاصيل الدفع هنا")
                                                            }}
                                                        >
                                                            <FileText className="h-3.5 w-3.5 ml-1" />
                                                            تفاصيل الدفع
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Col 3: Actions */}
                                        <div className="flex flex-col justify-center gap-3">
                                            {booking.status === 'pending' ? (
                                                <>
                                                    <Button
                                                        onClick={() => handleApproveBooking(booking)}
                                                        className="w-full bg-green-600 hover:bg-green-700 gap-2"
                                                        disabled={!booking.initialConfirmation || !booking.paymentConfirmation}
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                        قبول الطلب
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => handleRejectBooking(booking)}
                                                        className="w-full border-red-200 text-red-600 hover:bg-red-50 gap-2"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                        رفض الطلب
                                                    </Button>
                                                    {!booking.paymentConfirmation && booking.initialConfirmation && (
                                                        <p className="text-xs text-center text-amber-600 mt-2 bg-amber-50 p-2 rounded">
                                                            بانتظار تأكيد الدفع لإتاحة القبول
                                                        </p>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="text-center p-6 bg-gray-50 rounded-lg border border-dashed">
                                                    <p className="font-medium text-gray-900">
                                                        {booking.status === 'approved' ? 'تم قبول الطلب' : 'تم رفض الطلب'}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        بواسطة: {booking.approvedById || 'الإدارة'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                   </div>

                    <Dialog open={actionDialog.open} onOpenChange={(open) => !open && setActionDialog({ open: false, type: null })}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>
                                    {actionDialog.type === 'approve' ? 'قبول طلب الحجز' : 'رفض طلب الحجز'}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                {selectedBooking && (
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <h4 className="font-medium mb-2">تفاصيل الطلب:</h4>
                                        <div className="space-y-1 text-sm">
                                            <p><strong>الدورة:</strong> دورة البرمجة الأساسية</p>
                                            <p><strong>المدرب:</strong> فاطمة علي</p>
                                            <p><strong>التاريخ:</strong> {formatDate(selectedBooking.startTime)}</p>
                                            <p><strong>الوقت:</strong> {formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}</p>
                                        </div>
                                    </div>
                                )}

                                {actionDialog.type === 'approve' && (
                                    <div>
                                        <Label htmlFor="room-select">اختر القاعة</Label>
                                        <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="اختر قاعة" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {mockRooms.map((room) => (
                                                    <SelectItem key={room.id} value={room.id}>
                                                        {room.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {actionDialog.type === 'reject' && (
                                    <div>
                                        <Label htmlFor="notes">سبب الرفض</Label>
                                        <Textarea
                                            id="notes"
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="اكتب سبب رفض الطلب..."
                                        />
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Button
                                        onClick={executeAction}
                                        className={actionDialog.type === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
                                        disabled={actionDialog.type === 'approve' && !selectedRoom}
                                    >
                                        {actionDialog.type === 'approve' ? 'قبول الطلب' : 'رفض الطلب'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setActionDialog({ open: false, type: null })}
                                    >
                                        إلغاء
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </div>
    )
}
