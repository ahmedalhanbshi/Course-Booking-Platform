"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { instituteService } from "@/lib/institute-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowRight, Save, X, Plus, ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { getFileUrl } from "@/lib/utils"

export default function EditCoursePage() {
    const params = useParams()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([])
    const [trainers, setTrainers] = useState<{ id: string, name: string }[]>([])

    const [courseData, setCourseData] = useState({
        title: "",
        categoryId: "",
        shortDescription: "",
        description: "",
        price: "",
        duration: "",
        minStudents: "",
        maxStudents: "",
        startDate: "",
        endDate: "",
        trainerId: "",
        status: "",
        image: "",
        objectives: [] as string[],
        prerequisites: [] as string[],
        tags: [] as string[]
    })

    // Helper inputs
    const [currentObjective, setCurrentObjective] = useState("")
    const [currentPrerequisite, setCurrentPrerequisite] = useState("")
    const [currentTag, setCurrentTag] = useState("")

    // Image Upload
    const [isImageDragging, setIsImageDragging] = useState(false)
    const [imagePreviewUrl, setImagePreviewUrl] = useState("")
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const [course, cats, trns] = await Promise.all([
                    instituteService.getCourseById(params.id as string),
                    instituteService.getCategories(),
                    instituteService.getTrainers()
                ])

                setCategories(cats)
                setTrainers(trns)

                // Populate form
                setCourseData({
                    title: course.title,
                    categoryId: course.categoryId || "",
                    shortDescription: course.shortDescription || "",
                    description: course.description || "",
                    price: course.price.toString(),
                    duration: course.duration.toString(),
                    minStudents: course.minStudents.toString(),
                    maxStudents: course.maxStudents.toString(),
                    startDate: course.startDate ? new Date(course.startDate).toISOString().split('T')[0] : "",
                    endDate: course.endDate ? new Date(course.endDate).toISOString().split('T')[0] : "",
                    trainerId: course.trainer?.id || "",
                    status: course.status,
                    image: course.image || "",
                    objectives: course.objectives || [],
                    prerequisites: course.prerequisites || [],
                    tags: course.tags || []
                })

                if (course.image) {
                    setImagePreviewUrl(getFileUrl(course.image))
                }

            } catch (err: any) {
                toast.error("فشل في تحميل بيانات الدورة")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            fetchData()
        }
    }, [params.id])

    const handleFile = (file?: File | null) => {
        if (!file) return
        if (!file.type.startsWith("image/")) {
            toast.error("يرجى اختيار ملف صورة صحيح")
            return
        }
        const previewUrl = URL.createObjectURL(file)
        setImagePreviewUrl(previewUrl)
        setSelectedImageFile(file)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setSubmitting(true)

            const formData = new FormData()
            Object.entries(courseData).forEach(([key, value]) => {
                if (key === 'objectives' || key === 'tags' || key === 'prerequisites') {
                    formData.append(key, JSON.stringify(value))
                } else if (key !== 'image') {
                    formData.append(key, String(value))
                }
            })

            if (selectedImageFile) {
                formData.append('image', selectedImageFile)
            }

            await instituteService.updateCourse(params.id as string, formData)
            toast.success("تم تحديث الدورة بنجاح")
            router.push(`/institute/courses/${params.id}`)
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "فشل في تحديث الدورة")
        } finally {
            setSubmitting(false)
        }
    }

    const addObjective = () => {
        if (currentObjective.trim()) {
            setCourseData(prev => ({
                ...prev,
                objectives: [...prev.objectives, currentObjective.trim()]
            }))
            setCurrentObjective("")
        }
    }

    const removeObjective = (index: number) => {
        setCourseData(prev => ({
            ...prev,
            objectives: prev.objectives.filter((_, i) => i !== index)
        }))
    }

    const addPrerequisite = () => {
        if (currentPrerequisite.trim()) {
            setCourseData(prev => ({
                ...prev,
                prerequisites: [...prev.prerequisites, currentPrerequisite.trim()]
            }))
            setCurrentPrerequisite("")
        }
    }

    const removePrerequisite = (index: number) => {
        setCourseData(prev => ({
            ...prev,
            prerequisites: prev.prerequisites.filter((_, i) => i !== index)
        }))
    }

    const addTag = () => {
        if (currentTag.trim() && !courseData.tags.includes(currentTag.trim())) {
            setCourseData(prev => ({
                ...prev,
                tags: [...prev.tags, currentTag.trim()]
            }))
            setCurrentTag("")
        }
    }

    const removeTag = (tagToRemove: string) => {
        setCourseData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="mr-2">جاري تحميل البيانات...</span>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowRight className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">تعديل الدورة: {courseData.title}</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>المعلومات الأساسية</CardTitle>
                        <CardDescription>قم بتعديل المعلومات الرئيسية للدورة</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">عنوان الدورة</Label>
                                <Input
                                    id="title"
                                    value={courseData.title}
                                    onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">الفئة</Label>
                                <Select
                                    value={courseData.categoryId}
                                    onValueChange={(val) => setCourseData({ ...courseData, categoryId: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="اختر الفئة" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((c) => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="shortDesc">وصف مختصر</Label>
                            <Textarea
                                id="shortDesc"
                                value={courseData.shortDescription}
                                onChange={(e) => setCourseData({ ...courseData, shortDescription: e.target.value })}
                                rows={2}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="desc">الوصف التفصيلي</Label>
                            <Textarea
                                id="desc"
                                value={courseData.description}
                                onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                                rows={5}
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-semibold">صورة الدورة</Label>
                            <div
                                className={`relative h-48 w-full max-w-sm overflow-hidden rounded-2xl border-2 border-dashed bg-slate-50/60 transition-colors ${isImageDragging ? "ring-2 ring-blue-500 ring-offset-2 border-blue-300" : "border-slate-200"
                                    }`}
                                onDragOver={(event) => {
                                    event.preventDefault()
                                    setIsImageDragging(true)
                                }}
                                onDragLeave={() => setIsImageDragging(false)}
                                onDrop={(event) => {
                                    event.preventDefault()
                                    setIsImageDragging(false)
                                    handleFile(event.dataTransfer.files?.[0])
                                }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={(event) => {
                                        handleFile(event.target.files?.[0])
                                        event.currentTarget.value = ""
                                    }}
                                />
                                {imagePreviewUrl ? (
                                    <>
                                        <img
                                            src={imagePreviewUrl}
                                            alt="Preview"
                                            className="h-full w-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                                        <div className="absolute inset-x-3 bottom-3 flex items-center justify-end gap-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="secondary"
                                                className="h-8 bg-white/95 hover:bg-white"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    fileInputRef.current?.click()
                                                }}
                                            >
                                                تغيير
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center cursor-pointer">
                                        <ImageIcon className="h-8 w-8 text-slate-400" />
                                        <p className="text-sm font-medium text-slate-700">اسحب الصورة أو اضغط للرفع</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </CardContent>
                </Card>

                {/* Schedule & Price */}
                <Card>
                    <CardHeader>
                        <CardTitle>المواعيد والتسعير</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">السعر (ر.ي)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={courseData.price}
                                    onChange={(e) => setCourseData({ ...courseData, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration">المدة (ساعة)</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    value={courseData.duration}
                                    onChange={(e) => setCourseData({ ...courseData, duration: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="trainer">المدرب</Label>
                                <Select
                                    value={courseData.trainerId}
                                    onValueChange={(val) => setCourseData({ ...courseData, trainerId: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="اختر المدرب" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {trainers.map((t) => (
                                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">تاريخ البدء</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={courseData.startDate}
                                    onChange={(e) => setCourseData({ ...courseData, startDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">تاريخ الانتهاء</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={courseData.endDate}
                                    onChange={(e) => setCourseData({ ...courseData, endDate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="minStudents">الحد الأدنى للطلاب</Label>
                                <Input
                                    id="minStudents"
                                    type="number"
                                    value={courseData.minStudents}
                                    onChange={(e) => setCourseData({ ...courseData, minStudents: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maxStudents">الحد الأقصى للطلاب</Label>
                                <Input
                                    id="maxStudents"
                                    type="number"
                                    value={courseData.maxStudents}
                                    onChange={(e) => setCourseData({ ...courseData, maxStudents: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">حالة الدورة</Label>
                            <Select
                                value={courseData.status}
                                onValueChange={(val) => setCourseData({ ...courseData, status: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="اختر الحالة" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DRAFT">مسودة (Draft)</SelectItem>
                                    <SelectItem value="ACTIVE">نشطة (Active)</SelectItem>
                                    <SelectItem value="COMPLETED">مكتملة (Completed)</SelectItem>
                                    <SelectItem value="CANCELLED">ملغية (Cancelled)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Objectives, Prerequisites & Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">أهداف الدورة</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="أضف هدف..."
                                    value={currentObjective}
                                    onChange={(e) => setCurrentObjective(e.target.value)}
                                    className="h-8 text-sm"
                                />
                                <Button type="button" size="sm" onClick={addObjective}><Plus className="h-4 w-4" /></Button>
                            </div>
                            <div className="space-y-2">
                                {courseData.objectives.map((obj, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                                        <span>{obj}</span>
                                        <Button type="button" variant="ghost" size="sm" onClick={() => removeObjective(i)} className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"><X className="h-3 w-3" /></Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">المتطلبات السابقة</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="أضف متطلب..."
                                    value={currentPrerequisite}
                                    onChange={(e) => setCurrentPrerequisite(e.target.value)}
                                    className="h-8 text-sm"
                                />
                                <Button type="button" size="sm" onClick={addPrerequisite}><Plus className="h-4 w-4" /></Button>
                            </div>
                            <div className="space-y-2">
                                {courseData.prerequisites.map((req, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                                        <span>{req}</span>
                                        <Button type="button" variant="ghost" size="sm" onClick={() => removePrerequisite(i)} className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"><X className="h-3 w-3" /></Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="text-base">الكلمات المفتاحية</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input placeholder="أضف كلمة..." value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} className="h-8 text-sm" />
                                <Button type="button" size="sm" onClick={addTag}><Plus className="h-4 w-4" /></Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {courseData.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                        {tag}
                                        <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => removeTag(tag)} />
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end gap-4">
                    <Button variant="outline" type="button" onClick={() => router.back()}>إلغاء</Button>
                    <Button type="submit" disabled={submitting}>
                        {submitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                        حفظ التغييرات
                    </Button>
                </div>
            </form>
        </div>
    )
}
