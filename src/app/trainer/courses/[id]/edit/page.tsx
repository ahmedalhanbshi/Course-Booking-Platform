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
import { Save, Send, Trash2, ArrowLeft, X, Loader2, AlertCircle, UploadCloud, Banknote, Plus } from "lucide-react"
import { toast } from "sonner"
import { trainerService } from "@/lib/trainer-service"
import { getFileUrl } from "@/lib/utils"
import Image from "next/image"
import { useRef } from "react"

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

    const [resubmitFile, setResubmitFile] = useState<File | null>(null)
    const [resubmitPreview, setResubmitPreview] = useState<string>("")
    const [isResubmitting, setIsResubmitting] = useState(false)

    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleResubmit = async () => {
        if (!resubmitFile || !courseData.roomBooking?.id) return
        try {
            setIsResubmitting(true)
            await trainerService.resubmitBookingPayment(courseId, courseData.roomBooking.id, resubmitFile)
            toast.success("تم إعادة إرسال طلب الحجز بنجاح")
            // Refresh data
            const data = await trainerService.getTrainerCourseById(courseId)
            setCourseData({
                ...data,
                startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
                endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '',
            })
            setResubmitFile(null)
            setResubmitPreview("")
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "فشل في إعادة الإرسال")
        } finally {
            setIsResubmitting(false)
        }
    }

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
                if (data.image) {
                    setImagePreview(getFileUrl(data.image))
                }
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

            const formData = new FormData()
            formData.append('title', courseData.title)
            formData.append('shortDescription', courseData.shortDescription || '')
            formData.append('description', courseData.description || '')
            formData.append('price', courseData.price.toString())
            formData.append('duration', courseData.duration.toString())
            formData.append('maxStudents', courseData.maxStudents.toString())
            formData.append('startDate', courseData.startDate)
            formData.append('endDate', courseData.endDate)
            formData.append('categoryId', courseData.categoryId || '')
            formData.append('objectives', JSON.stringify(courseData.objectives))
            formData.append('prerequisites', JSON.stringify(courseData.prerequisites))
            formData.append('tags', JSON.stringify(courseData.tags))

            if (imageFile) {
                formData.append('image', imageFile)
            }

            await trainerService.updateTrainerCourse(courseId, formData)
            toast.success("تم تحديث الدورة بنجاح")
            router.push('/trainer/courses')
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "فشل في تحديث الدورة")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
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

    const handleDelete = async () => {
        try {
            setIsSubmitting(true)
            await trainerService.deleteCourse(courseId)
            toast.success("تم حذف الدورة بنجاح")
            router.push('/trainer/courses')
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "فشل في حذف الدورة")
        } finally {
            setIsSubmitting(false)
            setShowDeleteDialog(false)
        }
    }

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
                        <Link href={`/trainer/courses/${courseId}`}>
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            العودة إلى التفاصيل
                        </Link>
                    </Button>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    تعديل الدورة: {courseData.title}
                </h1>
                <p className="text-gray-600">تعديل تفاصيل الدورة ومحتواها</p>
            </div>

            {/* Rejection Alert & Resubmission */}
            {courseData.roomBooking?.status === 'rejected' && (
                <Card className="mb-8 border-red-200 bg-red-50/30">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 text-red-700">
                            <AlertCircle className="h-5 w-5" />
                            <CardTitle className="text-lg">تم رفض طلب حجز القاعة</CardTitle>
                        </div>
                        <CardDescription className="text-red-600 font-medium mt-1">
                            سبب الرفض: {courseData.roomBooking.rejectionReason || "لم يتم ذكر سبب محدد"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-700">
                            يمكنك تعديل بيانات الدورة أو إعادة إرفاق سند دفع جديد للمراجعة مرة أخرى.
                        </p>

                        <div className="flex flex-col md:flex-row gap-4 items-start">
                            <div className="relative h-40 w-full md:w-64 rounded-lg border-2 border-dashed border-red-200 overflow-hidden bg-white flex items-center justify-center cursor-pointer hover:bg-red-50 transition-colors"
                                onClick={() => document.getElementById('resubmit-input')?.click()}>
                                {resubmitPreview ? (
                                    <img src={resubmitPreview} alt="New Receipt" className="h-full w-full object-contain" />
                                ) : (
                                    <div className="flex flex-col items-center text-gray-400">
                                        <UploadCloud className="h-8 w-8 mb-2" />
                                        <span className="text-xs">إرفاق سند جديد</span>
                                    </div>
                                )}
                                <input
                                    id="resubmit-input"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setResubmitFile(e.target.files[0])
                                            setResubmitPreview(URL.createObjectURL(e.target.files[0]))
                                        }
                                    }}
                                />
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="bg-white p-3 rounded border border-red-100 text-xs text-gray-600">
                                    <h5 className="font-bold flex items-center gap-1 mb-1"><Banknote className="h-3 w-3" /> بيانات الحساب البنكي للتسديد:</h5>
                                    <p>بنك الإنماء - آيبان: SA56 0500 0012 3456 7890 1234</p>
                                    <p className="mt-1">المبلغ المطلوب: {courseData.roomBooking.totalPrice?.toLocaleString()} ر.ي</p>
                                </div>
                                <Button
                                    onClick={handleResubmit}
                                    disabled={!resubmitFile || isResubmitting}
                                    className="w-full md:w-auto bg-red-600 hover:bg-red-700"
                                >
                                    {isResubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                                    إعادة إرسال سند الدفع للمراجعة
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Course Status Badge */}
            <Card className="mb-8">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold mb-1">حالة الدورة</h3>
                            <p className="text-sm text-gray-600">
                                {courseData.status === 'active' ? 'الدورة نشطة ومتاحة للطلاب' :
                                    courseData.status === 'draft' ? 'الدورة مسودة وغير منشورة' :
                                        courseData.roomBooking?.status === 'pending_approval' ? 'بانتظار موافقة المعهد على حجز القاعة' :
                                            courseData.roomBooking?.status === 'rejected' ? 'طلب الحجز مرفوض - يرجى مراجعة السبب' :
                                                'الدورة قيد المراجعة'}
                            </p>
                        </div>
                        <Badge variant={courseData.status === 'active' ? 'default' : (courseData.roomBooking?.status === 'rejected' ? 'destructive' : 'secondary')}
                            className={courseData.status === 'active' ? 'bg-green-600' : ''}>
                            {courseData.roomBooking?.status === 'rejected' ? 'مرفوض' : getStatusLabel(courseData.status)}
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
                        <div className="space-y-4">
                            <Label>صورة الدورة</Label>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <div
                                    className="relative h-32 w-48 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {imagePreview ? (
                                        <Image src={imagePreview} alt="Course Preview" fill className="object-cover" unoptimized />
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-400">
                                            <Plus className="h-8 w-8 mb-2" />
                                            <span className="text-xs">إضافة صورة</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <p className="text-sm text-gray-500">
                                        تغيير صورة الدورة التدريبية. يفضل أن تكون صورتك بصيغة JPG أو PNG وبجودة عالية.
                                    </p>
                                    <div className="flex gap-2">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                                            تغيير الصورة
                                        </Button>
                                        {imageFile && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => {
                                                    setImageFile(null)
                                                    setImagePreview(courseData.image ? getFileUrl(courseData.image) : "")
                                                }}
                                            >
                                                إلغاء التغيير
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
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
                            <Button variant="destructive" type="button" disabled={isSubmitting}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                حذف الدورة
                            </Button>
                        </DialogTrigger>
                        <DialogContent dir="rtl">
                            <DialogHeader className="text-right">
                                <DialogTitle>تأكيد الحذف</DialogTitle>
                                <DialogDescription>
                                    هل أنت متأكد من حذف هذه الدورة؟ هذا الإجراء لا يمكن التراجع عنه.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isSubmitting}>إلغاء</Button>
                                <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    حذف نهائي
                                </Button>
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
