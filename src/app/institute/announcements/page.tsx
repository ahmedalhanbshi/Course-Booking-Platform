"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Megaphone, Plus, Trash2, Edit, Calendar, Users, Bell, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

// Announcement Type Definition
interface Announcement {
    id: string;
    title: string;
    content: string;
    targetAudience: string;
    selectedRecipients: string[];
    category: string;
    priority: string;
    status: string;
    createdAt: string;
    author: string;
    attachment: string | null;
    scheduledDate: string;
    scheduledTime: string;
}

// Mock data for announcements
const mockAnnouncements: Announcement[] = [
    {
        id: "1",
        title: "تحديث سياسة الحضور",
        content: "نود إعلامكم بأنه تم تحديث سياسة الحضور والغياب للمعهد. يرجى الاطلاع على التفاصيل في لوحة المعلومات.",
        targetAudience: "all", // all, all_trainers, all_students, specific_trainers, specific_students, specific_all
        selectedRecipients: [],
        category: "policy",
        priority: "high",
        status: "published",
        createdAt: "2023-11-25",
        author: "الإدارة",
        attachment: null as string | null,
        scheduledDate: "",
        scheduledTime: ""
    },
    {
        id: "2",
        title: "عطلة رسمية",
        content: "بمناسبة اليوم الوطني، سيكون المعهد مغلقاً يوم الأحد القادم.",
        targetAudience: "all",
        selectedRecipients: [],
        category: "holiday",
        priority: "normal",
        status: "scheduled",
        createdAt: "2023-11-20",
        author: "الموارد البشرية",
        attachment: null,
        scheduledDate: "2023-11-30",
        scheduledTime: "09:00"
    },
    {
        id: "3",
        title: "اجتماع المدربين الشهري",
        content: "تذكير بموعد الاجتماع الشهري للمدربين يوم الخميس القادم في القاعة الرئيسية.",
        targetAudience: "all_trainers",
        selectedRecipients: [],
        category: "event",
        priority: "normal",
        status: "published",
        createdAt: "2023-11-15",
        author: "الإدارة الأكاديمية",
        attachment: null,
        scheduledDate: "",
        scheduledTime: ""
    }
]

// Mock data for users
const mockTrainers = [
    { id: "t1", name: "أحمد محمد" },
    { id: "t2", name: "سارة علي" },
    { id: "t3", name: "خالد عمر" },
]

const mockStudents = [
    { id: "s1", name: "محمد عبدالله" },
    { id: "s2", name: "فاطمة حسن" },
    { id: "s3", name: "نورة سعيد" },
    { id: "s4", name: "عبدالرحمن خالد" },
    { id: "s5", name: "ريم احمد" },
]

export default function InstituteAnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<typeof mockAnnouncements[0] | null>(null)

    const [editingId, setEditingId] = useState<string | null>(null)

    // Form state
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: "",
        content: "",
        recipientType: "all", // 'all' | 'specific'
        targetGroup: "both", // 'both' | 'trainers' | 'students'
        category: "general",
        priority: "normal",
        selectedRecipients: [] as string[],
        attachment: null as File | null,
        scheduledDate: "",
        scheduledTime: ""
    })

    const handleCreateAnnouncement = () => {
        let targetAudience = "all"
        if (newAnnouncement.recipientType === "all") {
            if (newAnnouncement.targetGroup === "trainers") targetAudience = "all_trainers"
            else if (newAnnouncement.targetGroup === "students") targetAudience = "all_students"
            else targetAudience = "all"
        } else {
            if (newAnnouncement.targetGroup === "trainers") targetAudience = "specific_trainers"
            else if (newAnnouncement.targetGroup === "students") targetAudience = "specific_students"
            else targetAudience = "specific_all"
        }

        if (editingId) {
            setAnnouncements(announcements.map(a => a.id === editingId ? {
                ...a,
                title: newAnnouncement.title,
                content: newAnnouncement.content,
                targetAudience,
                selectedRecipients: newAnnouncement.selectedRecipients,
                category: newAnnouncement.category,
                priority: newAnnouncement.priority,
                scheduledDate: newAnnouncement.scheduledDate,
                scheduledTime: newAnnouncement.scheduledTime,
                attachment: newAnnouncement.attachment ? URL.createObjectURL(newAnnouncement.attachment) : a.attachment
            } : a))
            toast.success("تم تحديث الإعلان بنجاح")
        } else {
            const announcement = {
                id: Math.random().toString(36).substr(2, 9),
                title: newAnnouncement.title,
                content: newAnnouncement.content,
                targetAudience,
                selectedRecipients: newAnnouncement.selectedRecipients,
                category: newAnnouncement.category,
                priority: newAnnouncement.priority,
                status: "published",
                createdAt: new Date().toISOString().split('T')[0],
                author: "الإدارة",
                scheduledDate: newAnnouncement.scheduledDate,
                scheduledTime: newAnnouncement.scheduledTime,
                attachment: newAnnouncement.attachment ? URL.createObjectURL(newAnnouncement.attachment) : null
            }
            setAnnouncements([announcement, ...announcements])
            toast.success("تم إنشاء الإعلان بنجاح")
        }

        setIsCreateDialogOpen(false)
        setNewAnnouncement({
            title: "",
            content: "",
            recipientType: "all",
            targetGroup: "both",
            category: "general",
            priority: "normal",
            selectedRecipients: [],
            attachment: null,
            scheduledDate: "",
            scheduledTime: ""
        })
        setEditingId(null)
    }

    const handleEditClick = (announcement: typeof mockAnnouncements[0]) => {
        setEditingId(announcement.id)

        let recipientType = "all"
        let targetGroup = "both"

        if (announcement.targetAudience.startsWith("specific")) {
            recipientType = "specific"
            if (announcement.targetAudience.includes("trainers")) targetGroup = "trainers"
            else if (announcement.targetAudience.includes("students")) targetGroup = "students"
            else targetGroup = "both"
        } else {
            recipientType = "all"
            if (announcement.targetAudience.includes("trainers")) targetGroup = "trainers"
            else if (announcement.targetAudience.includes("students")) targetGroup = "students"
            else targetGroup = "both"
        }

        setNewAnnouncement({
            title: announcement.title,
            content: announcement.content,
            recipientType,
            targetGroup,
            category: announcement.category,
            priority: announcement.priority,
            selectedRecipients: announcement.selectedRecipients,
            attachment: null,
            scheduledDate: announcement.scheduledDate || "",
            scheduledTime: announcement.scheduledTime || ""
        })
        setIsCreateDialogOpen(true)
    }

    const handleDeleteAnnouncement = () => {
        if (selectedAnnouncement) {
            setAnnouncements(announcements.filter(a => a.id !== selectedAnnouncement.id))
            setIsDeleteDialogOpen(false)
            setSelectedAnnouncement(null)
            toast.success("تم حذف الإعلان بنجاح")
        }
    }

    const getAudienceLabel = (announcement: typeof mockAnnouncements[0]) => {
        switch (announcement.targetAudience) {
            case 'all': return 'الجميع'
            case 'all_trainers': return 'جميع المدربين'
            case 'all_students': return 'جميع الطلاب'
            case 'specific_trainers': return `${announcement.selectedRecipients.length} مدربين`
            case 'specific_students': return `${announcement.selectedRecipients.length} طلاب`
            case 'specific_all': return `${announcement.selectedRecipients.length} مستخدمين`
            default: return announcement.targetAudience
        }
    }

    const toggleRecipient = (id: string) => {
        setNewAnnouncement(prev => {
            const isSelected = prev.selectedRecipients.includes(id)
            return {
                ...prev,
                selectedRecipients: isSelected
                    ? prev.selectedRecipients.filter(rid => rid !== id)
                    : [...prev.selectedRecipients, id]
            }
        })
    }

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'general': return 'عام'
            case 'event': return 'فعالية'
            case 'urgent': return 'عاجل'
            case 'maintenance': return 'صيانة'
            case 'holiday': return 'عطلة'
            case 'policy': return 'تحديث سياسات'
            default: return category
        }
    }

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'high': return <Badge variant="destructive">مهم</Badge>
            case 'critical': return <Badge variant="destructive" className="animate-pulse">طارئ</Badge>
            default: return <Badge variant="secondary">عادي</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">إعلانات المعهد</h1>
                    <p className="text-gray-600 mt-2">إدارة ونشر الإعلانات للمدربين والطلاب</p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
                    setIsCreateDialogOpen(open)
                    if (!open) {
                        setNewAnnouncement({
                            title: "",
                            content: "",
                            recipientType: "all",
                            targetGroup: "both",
                            category: "general",
                            priority: "normal",
                            selectedRecipients: [],
                            attachment: null,
                            scheduledDate: "",
                            scheduledTime: ""
                        })
                        setEditingId(null)
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            إعلان جديد
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>{editingId ? "تعديل الإعلان" : "إنشاء إعلان جديد"}</DialogTitle>
                            <DialogDescription>
                                قم بتعبئة تفاصيل الإعلان الجديد للنشر
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">عنوان الإعلان</Label>
                                <Input
                                    id="title"
                                    placeholder="مثال: تحديث سياسة الحضور"
                                    value={newAnnouncement.title}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="content">نص الإعلان</Label>
                                <Textarea
                                    id="content"
                                    placeholder="اكتب نص الإعلان هنا..."
                                    value={newAnnouncement.content}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="category">تصنيف الإعلان</Label>
                                    <Select
                                        value={newAnnouncement.category}
                                        onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, category: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر التصنيف" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="general">عام</SelectItem>
                                            <SelectItem value="event">فعالية</SelectItem>
                                            <SelectItem value="urgent">عاجل</SelectItem>
                                            <SelectItem value="maintenance">صيانة</SelectItem>
                                            <SelectItem value="holiday">عطلة</SelectItem>
                                            <SelectItem value="policy">تحديث سياسات</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="priority">الأهمية</Label>
                                    <Select
                                        value={newAnnouncement.priority}
                                        onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, priority: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر الأهمية" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="normal">عادي</SelectItem>
                                            <SelectItem value="high">مهم</SelectItem>
                                            <SelectItem value="critical">طارئ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="date">تاريخ النشر</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={newAnnouncement.scheduledDate}
                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, scheduledDate: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="time">وقت النشر</Label>
                                    <Input
                                        id="time"
                                        type="time"
                                        value={newAnnouncement.scheduledTime}
                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, scheduledTime: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="attachment">مرفقات</Label>
                                <Input
                                    id="attachment"
                                    type="file"
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, attachment: e.target.files ? e.target.files[0] : null })}
                                />
                            </div>

                            <div className="grid gap-4 border rounded-md p-4">
                                <Label className="text-base">الجمهور المستهدف</Label>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>طريقة الإرسال</Label>
                                        <RadioGroup
                                            value={newAnnouncement.recipientType}
                                            onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, recipientType: value, selectedRecipients: [] })}
                                            className="flex gap-4"
                                        >
                                            <div className="flex items-center space-x-2 space-x-reverse">
                                                <RadioGroupItem value="all" id="rt-all" />
                                                <Label htmlFor="rt-all" className="font-normal cursor-pointer">الجميع</Label>
                                            </div>
                                            <div className="flex items-center space-x-2 space-x-reverse">
                                                <RadioGroupItem value="specific" id="rt-specific" />
                                                <Label htmlFor="rt-specific" className="font-normal cursor-pointer">محدد</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>الفئة المستهدفة</Label>
                                        <div className="flex gap-4">
                                            <div className="flex items-center space-x-2 space-x-reverse">
                                                <Checkbox
                                                    id="tg-trainers"
                                                    checked={newAnnouncement.targetGroup === 'trainers' || newAnnouncement.targetGroup === 'both'}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setNewAnnouncement({
                                                                ...newAnnouncement,
                                                                targetGroup: newAnnouncement.targetGroup === 'students' ? 'both' : 'trainers',
                                                                selectedRecipients: []
                                                            })
                                                        } else {
                                                            setNewAnnouncement({
                                                                ...newAnnouncement,
                                                                targetGroup: newAnnouncement.targetGroup === 'both' ? 'students' : 'both',
                                                                selectedRecipients: []
                                                            })
                                                        }
                                                    }}
                                                />
                                                <Label htmlFor="tg-trainers" className="font-normal cursor-pointer">المدربين</Label>
                                            </div>
                                            <div className="flex items-center space-x-2 space-x-reverse">
                                                <Checkbox
                                                    id="tg-students"
                                                    checked={newAnnouncement.targetGroup === 'students' || newAnnouncement.targetGroup === 'both'}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setNewAnnouncement({
                                                                ...newAnnouncement,
                                                                targetGroup: newAnnouncement.targetGroup === 'trainers' ? 'both' : 'students',
                                                                selectedRecipients: []
                                                            })
                                                        } else {
                                                            setNewAnnouncement({
                                                                ...newAnnouncement,
                                                                targetGroup: newAnnouncement.targetGroup === 'both' ? 'trainers' : 'both',
                                                                selectedRecipients: []
                                                            })
                                                        }
                                                    }}
                                                />
                                                <Label htmlFor="tg-students" className="font-normal cursor-pointer">الطلاب</Label>
                                            </div>
                                        </div>
                                    </div>

                                    {newAnnouncement.recipientType === 'specific' && (
                                        <div className="space-y-4 pt-2 border-t">
                                            {(newAnnouncement.targetGroup === 'trainers' || newAnnouncement.targetGroup === 'both') && (
                                                <div className="space-y-2">
                                                    <Label className="text-sm text-muted-foreground">اختر المدربين</Label>
                                                    <ScrollArea className="h-[120px] border rounded-md p-2">
                                                        <div className="space-y-2">
                                                            {mockTrainers.map(trainer => (
                                                                <div key={trainer.id} className="flex items-center space-x-2 space-x-reverse">
                                                                    <Checkbox
                                                                        id={`trainer-${trainer.id}`}
                                                                        checked={newAnnouncement.selectedRecipients.includes(trainer.id)}
                                                                        onCheckedChange={() => toggleRecipient(trainer.id)}
                                                                    />
                                                                    <Label htmlFor={`trainer-${trainer.id}`} className="font-normal cursor-pointer">
                                                                        {trainer.name}
                                                                    </Label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </ScrollArea>
                                                </div>
                                            )}

                                            {(newAnnouncement.targetGroup === 'students' || newAnnouncement.targetGroup === 'both') && (
                                                <div className="space-y-2">
                                                    <Label className="text-sm text-muted-foreground">اختر الطلاب</Label>
                                                    <ScrollArea className="h-[120px] border rounded-md p-2">
                                                        <div className="space-y-2">
                                                            {mockStudents.map(student => (
                                                                <div key={student.id} className="flex items-center space-x-2 space-x-reverse">
                                                                    <Checkbox
                                                                        id={`student-${student.id}`}
                                                                        checked={newAnnouncement.selectedRecipients.includes(student.id)}
                                                                        onCheckedChange={() => toggleRecipient(student.id)}
                                                                    />
                                                                    <Label htmlFor={`student-${student.id}`} className="font-normal cursor-pointer">
                                                                        {student.name}
                                                                    </Label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </ScrollArea>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreateAnnouncement}>
                                {editingId ? "حفظ التغييرات" : "نشر الإعلان"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">إجمالي الإعلانات</CardTitle>
                        <Megaphone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{announcements.length}</div>
                        <p className="text-xs text-muted-foreground">إعلان منشور</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">إعلانات نشطة</CardTitle>
                        <Bell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{announcements.filter(a => a.status === 'published').length}</div>
                        <p className="text-xs text-muted-foreground">يظهر حالياً للمستخدمين</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">الوصول</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,234</div>
                        <p className="text-xs text-muted-foreground">مشاهدة للإعلانات</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>سجل الإعلانات</CardTitle>
                    <CardDescription>عرض وإدارة الإعلانات السابقة والحالية</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>العنوان</TableHead>
                                <TableHead>التصنيف</TableHead>
                                <TableHead>الأهمية</TableHead>
                                <TableHead>الجمهور</TableHead>
                                <TableHead>تاريخ النشر</TableHead>
                                <TableHead>الحالة</TableHead>
                                <TableHead className="text-left">الإجراءات</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {announcements.map((announcement) => (
                                <TableRow key={announcement.id}>
                                    <TableCell>
                                        <div className="font-medium">{announcement.title}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-[300px]">{announcement.content}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{getCategoryLabel(announcement.category)}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {getPriorityBadge(announcement.priority)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-gray-500" />
                                            {getAudienceLabel(announcement)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                            {announcement.createdAt}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={announcement.status === 'published' ? 'default' : 'secondary'}>
                                            {announcement.status === 'published' ? 'منشور' : 'مجدول'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(announcement)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => {
                                                    setSelectedAnnouncement(announcement)
                                                    setIsDeleteDialogOpen(true)
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>تأكيد الحذف</DialogTitle>
                        <DialogDescription>
                            هل أنت متأكد من رغبتك في حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>إلغاء</Button>
                        <Button variant="destructive" onClick={handleDeleteAnnouncement}>حذف</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
