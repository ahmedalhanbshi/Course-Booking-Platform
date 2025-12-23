"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, MapPin, Users, Wifi, Projector, Edit, Trash2, Building2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

// Mock data for halls
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

// Mock data for halls
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

export default function InstituteHallsPage() {
    const [halls, setHalls] = useState<Hall[]>(mockHalls)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedHall, setSelectedHall] = useState<typeof mockHalls[0] | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [editingId, setEditingId] = useState<string | null>(null)

    // Form state
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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'available':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">متاح</Badge>
            case 'occupied':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">مشغول</Badge>
            case 'maintenance':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">صيانة</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const filteredHalls = halls.filter(hall =>
        hall.name.includes(searchTerm) || hall.location.includes(searchTerm)
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">إدارة القاعات</h1>
                    <p className="text-gray-600 mt-2">عرض وإدارة القاعات الدراسية والمعامل</p>
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
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <Checkbox id="wifi" checked={newHall.facilities.includes('wifi')} onCheckedChange={() => toggleFacility('wifi')} />
                                        <Label htmlFor="wifi" className="font-normal cursor-pointer">إنترنت لاسلكي (WiFi)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <Checkbox id="projector" checked={newHall.facilities.includes('projector')} onCheckedChange={() => toggleFacility('projector')} />
                                        <Label htmlFor="projector" className="font-normal cursor-pointer">جهاز عرض (Projector)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <Checkbox id="ac" checked={newHall.facilities.includes('ac')} onCheckedChange={() => toggleFacility('ac')} />
                                        <Label htmlFor="ac" className="font-normal cursor-pointer">تكييف</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <Checkbox id="whiteboard" checked={newHall.facilities.includes('whiteboard')} onCheckedChange={() => toggleFacility('whiteboard')} />
                                        <Label htmlFor="whiteboard" className="font-normal cursor-pointer">سبورة ذكية</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <Checkbox id="computers" checked={newHall.facilities.includes('computers')} onCheckedChange={() => toggleFacility('computers')} />
                                        <Label htmlFor="computers" className="font-normal cursor-pointer">أجهزة حاسب</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <Checkbox id="screen" checked={newHall.facilities.includes('screen')} onCheckedChange={() => toggleFacility('screen')} />
                                        <Label htmlFor="screen" className="font-normal cursor-pointer">شاشة عرض</Label>
                                    </div>
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

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="بحث باسم القاعة أو الموقع..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10"
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredHalls.map((hall) => (
                    <Card key={hall.id} className="overflow-hidden">
                        <div className="h-2 bg-primary/10 w-full" />
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{hall.name}</CardTitle>
                                {getStatusBadge(hall.status)}
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
    )
}
