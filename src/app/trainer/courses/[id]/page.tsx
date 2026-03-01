"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Save, Send, Trash2, ArrowLeft, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { trainerService } from "@/lib/trainer-service"

export default function EditTrainerCoursePage() {
    const router = useRouter()
    const params = useParams()
    const courseId = params.id as string

    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const [courseData, setCourseData] = useState<any>(null)
    const [currentObjective, setCurrentObjective] = useState("")
    const [currentPrerequisite, setCurrentPrerequisite] = useState("")
    const [currentTag, setCurrentTag] = useState("")

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true)
                const data = await trainerService.getTrainerCourseById(courseId)
                // Normalize dates for <input type="date">
                setCourseData({
                    ...data,
                    startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
                    endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '',
                })
            } catch (err: any) {
                toast.error(err?.response?.data?.message || "فشل في تحميل بيانات الدورة")
                router.push('/trainer/courses')
            } finally {
                setLoading(false)
            }
        }
        if (courseId) fetchCourse()
    }, [courseId, router])

    const handleSubmit = async () => {
        if (!courseData) return
        try {
            setIsSubmitting(true)
            await trainerService.updateTrainerCourse(courseId, {
                title: courseData.title,
                shortDescription: courseData.shortDescription,
                description: courseData.description,
                price: courseData.price,
                duration: courseData.duration,
                maxStudents: courseData.maxStudents,
                startDate: courseData.startDate,
                endDate: courseData.endDate,
                categoryId: courseData.categoryId,
                objectives: courseData.objectives,
                prerequisites: courseData.prerequisites,
                tags: courseData.tags,
            })
            toast.success("تم تحديث الدورة بنجاح")
            router.push('/trainer/courses')
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "فشل في تحديث الدورة")
        } finally {
            setIsSubmitting(false)
        }
    }

    // ---- List helpers ----
    const addObjective = () => {
        if (currentObjective.trim()) {
            setCourseData((prev: any) => ({ ...prev, objectives: [...prev.objectives, currentObjective.trim()] }))
            setCurrentObjective("")
        }
    }
    const removeObjective = (i: number) =>
        setCourseData((prev: any) => ({ ...prev, objectives: prev.objectives.filter((_: any, idx: number) => idx !== i) }))

    const addPrerequisite = () => {
        if (currentPrerequisite.trim()) {
            setCourseData((prev: any) => ({ ...prev, prerequisites: [...prev.prerequisites, currentPrerequisite.trim()] }))
            setCurrentPrerequisite("")
        }
    }
    const removePrerequisite = (i: number) =>
        setCourseData((prev: any) => ({ ...prev, prerequisites: prev.prerequisites.filter((_: any, idx: number) => idx !== i) }))

    const addTag = () => {
        if (currentTag.trim() && !courseData.tags.includes(currentTag.trim())) {
            setCourseData((prev: any) => ({ ...prev, tags: [...prev.tags, currentTag.trim()] }))
            setCurrentTag("")
        }
    }
    const removeTag = (tag: string) =>
        setCourseData((prev: any) => ({ ...prev, tags: prev.tags.filter((t: string) => t !== tag) }))

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!courseData) return null

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active': return 'نشط'
            case 'draft': return 'مسودة'
            case 'completed': return 'مكتمل'
            case 'cancelled': return 'ملغي'
            default: return status
        }
    }

    return (
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <Button variant="ghost" size="sm" asChild className="hover:bg-blue-50 hover:text-blue-600 group">
                        <Link href="/trainer/courses">
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            العودة إلى القائمة
                        </Link>
                    </Button>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    تعديل الدورة: {courseData.title}
                </h1>
                <p className="text-gray-600">تعديل تفاصيل الدورة ومحتواها</p>
            </div>

            {/* Course Status Badge */}
            <Card className="mb-8">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold mb-1">حالة الدورة</h3>
                            <p className="text-sm text-gray-600">
                                {courseData.status === 'active' ? 'الدورة نشطة ومتاحة للطلاب' :
                                    courseData.status === 'draft' ? 'الدورة مسودة وغير منشورة' :
                                        'الدورة قيد المراجعة'}
                            </p>
                        </div>
                        <Badge variant={courseData.status === 'active' ? 'default' : 'secondary'}
                            className={courseData.status === 'active' ? 'bg-green-600' : ''}>
                            {getStatusLabel(courseData.status)}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-8">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>المعلومات الأساسية</CardTitle>
                        <CardDescription>أدخل المعلومات الأساسية للدورة</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">عنوان الدورة *</Label>
                            <Input
                                id="title"
                                value={courseData.title}
                                onChange={e => setCourseData((prev: any) => ({ ...prev, title: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="shortDescription">وصف مختصر</Label>
                            <Textarea
                                id="shortDescription"
                                value={courseData.shortDescription}
                                onChange={e => setCourseData((prev: any) => ({ ...prev, shortDescription: e.target.value }))}
                                rows={2}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">الوصف التفصيلي</Label>
                            <Textarea
                                id="description"
                                value={courseData.description}
                                onChange={e => setCourseData((prev: any) => ({ ...prev, description: e.target.value }))}
                                rows={4}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing & Dates */}
                <Card>
                    <CardHeader>
                        <CardTitle>التسعير والتواريخ</CardTitle>
                        <CardDescription>حدد سعر الدورة ومواعيدها</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">السعر (ر.ي) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={courseData.price}
                                    onChange={e => setCourseData((prev: any) => ({ ...prev, price: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration">المدة (ساعة)</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    value={courseData.duration}
                                    onChange={e => setCourseData((prev: any) => ({ ...prev, duration: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maxStudents">الحد الأقصى للطلاب</Label>
                                <Input
                                    id="maxStudents"
                                    type="number"
                                    value={courseData.maxStudents}
                                    onChange={e => setCourseData((prev: any) => ({ ...prev, maxStudents: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">تاريخ البداية</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={courseData.startDate}
                                    onChange={e => setCourseData((prev: any) => ({ ...prev, startDate: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">تاريخ النهاية</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={courseData.endDate}
                                    onChange={e => setCourseData((prev: any) => ({ ...prev, endDate: e.target.value }))}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Objectives */}
                <Card>
                    <CardHeader>
                        <CardTitle>أهداف الدورة</CardTitle>
                        <CardDescription>ما سيتعلمه الطلاب من هذه الدورة</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="أدخل هدف الدورة"
                                value={currentObjective}
                                onChange={e => setCurrentObjective(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                            />
                            <Button type="button" onClick={addObjective}>إضافة</Button>
                        </div>
                        {courseData.objectives?.length > 0 && (
                            <div className="space-y-2">
                                {courseData.objectives.map((obj: string, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <span>{obj}</span>
                                        <Button type="button" variant="ghost" size="sm" onClick={() => removeObjective(i)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Prerequisites */}
                <Card>
                    <CardHeader>
                        <CardTitle>المتطلبات المسبقة</CardTitle>
                        <CardDescription>ما يحتاجه الطلاب قبل التسجيل في الدورة</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="مثال: معرفة أساسية في HTML و CSS"
                                value={currentPrerequisite}
                                onChange={e => setCurrentPrerequisite(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
                            />
                            <Button type="button" onClick={addPrerequisite}>إضافة</Button>
                        </div>
                        {courseData.prerequisites?.length > 0 && (
                            <div className="space-y-2">
                                {courseData.prerequisites.map((p: string, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <span>{p}</span>
                                        <Button type="button" variant="ghost" size="sm" onClick={() => removePrerequisite(i)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                    <CardHeader>
                        <CardTitle>الكلمات المفتاحية</CardTitle>
                        <CardDescription>أضف كلمات مفتاحية لتسهيل البحث عن الدورة</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="أدخل كلمة مفتاحية"
                                value={currentTag}
                                onChange={e => setCurrentTag(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            />
                            <Button type="button" onClick={addTag}>إضافة</Button>
                        </div>
                        {courseData.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {courseData.tags.map((tag: string) => (
                                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-red-500">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end pb-8">
                    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                        <DialogTrigger asChild>
                            <Button variant="destructive" type="button">
                                <Trash2 className="mr-2 h-4 w-4" />
                                حذف الدورة
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>تأكيد الحذف</DialogTitle>
                                <DialogDescription>
                                    هل أنت متأكد من حذف هذه الدورة؟ هذا الإجراء لا يمكن التراجع عنه.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>إلغاء</Button>
                                <Button variant="destructive" onClick={() => { setShowDeleteDialog(false); router.push('/trainer/courses') }}>حذف</Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Button variant="outline" type="button" onClick={handleSubmit} disabled={isSubmitting}>
                        <Save className="mr-2 h-4 w-4" />
                        {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </Button>

                    <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                        <Send className="mr-2 h-4 w-4" />
                        {isSubmitting ? 'جاري التحديث...' : 'تحديث الدورة'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
