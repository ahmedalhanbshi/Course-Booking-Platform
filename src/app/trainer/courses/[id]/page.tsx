"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Save, Send, Trash2, ArrowLeft, Upload, X, Eye } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

// Mock user data
const mockUser = {
    id: "2",
    name: "فاطمة علي",
    email: "fatima@example.com",
    role: 'trainer' as const,
}

// Mock course data for editing
const mockCourseData = {
    id: "1",
    title: "تعلم React من الصفر",
    category: "تطوير الويب",
    shortDescription: "دورة شاملة في تعلم React.js مع مشاريع عملية",
    description: "دورة شاملة في تعلم React.js مع مشاريع عملية. ستتعلم أساسيات React، إدارة الحالة، التوجيه، والعديد من المفاهيم المتقدمة من خلال بناء تطبيقات حقيقية.",
    deliveryType: "online",
    price: "29900",
    maxStudents: "50",
    startDate: "2025-02-01",
    endDate: "2025-03-15",
    instituteId: "",
    prerequisites: "معرفة أساسية في HTML و CSS و JavaScript",
    objectives: [
        "فهم أساسيات React ومكوناته",
        "إدارة حالة التطبيق باستخدام Hooks",
        "بناء تطبيقات تفاعلية مع React Router",
        "التعامل مع APIs والحصول على البيانات",
        "نشر التطبيقات على الإنترنت"
    ],
    tags: ["React", "JavaScript", "Frontend"],
    status: "active"
}

const categories = [
    "تطوير الويب",
    "التصميم",
    "إدارة الأعمال",
    "تطوير البرمجيات",
    "التسويق",
    "قواعد البيانات",
    "الذكاء الاصطناعي",
    "الأمن السيبراني"
]

const deliveryTypes = [
    { value: "online", label: "أونلاين" },
    { value: "in_person", label: "حضوري" },
    { value: "hybrid", label: "حضور وأونلاين" }
]

export default function EditCoursePage() {
    const router = useRouter()
    const params = useParams()
    const { user } = useAuth() // Get actual user from context
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Redirect if not authorized
    useEffect(() => {
        // In a real app, we would check if the course belongs to the user
        // For this mock, we'll assume course with ID '1' belongs to user with ID '2' (Fatima)
        // Adjust this logic as needed for your mock data setup
        if (user && user.role === 'trainer' && user.id !== '2') {
            // If user is a trainer but NOT Fatima (id: 2), they shouldn't edit this specific mock course
            // In a real scenario: if (course.instructorId !== user.id) router.push('/trainer/dashboard')
            alert("عذراً، لا يمكنك تعديل دورة لا تملكها")
            router.push('/trainer/dashboard')
        }
    }, [user, router])
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    // In a real app, we would fetch data here based on params.id
    const [courseData, setCourseData] = useState(mockCourseData)

    const [currentObjective, setCurrentObjective] = useState("")
    const [currentTag, setCurrentTag] = useState("")

    const handleSubmit = async (action: 'draft' | 'submit') => {
        setIsSubmitting(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))

        setIsSubmitting(false)

        if (action === 'submit') {
            // Redirect to courses list
            router.push('/trainer/courses')
        } else {
            // Show success message and stay on page
            alert('تم حفظ التغييرات')
        }
    }

    const handleDelete = () => {
        // In real app, this would delete the course
        console.log('Deleting course...')
        setShowDeleteDialog(false)
        router.push('/trainer/courses')
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

    const isFormValid = () => {
        return courseData.title &&
            courseData.category &&
            courseData.shortDescription &&
            courseData.description &&
            courseData.deliveryType &&
            courseData.price &&
            courseData.startDate &&
            courseData.endDate
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

                    <Button variant="ghost" asChild>
                        <Link href={`/courses/${params.id}`} target="_blank">
                            <Eye className="mr-2 h-4 w-4" />
                            معاينة الدورة
                        </Link>
                    </Button>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    تعديل الدورة: {courseData.title}
                </h1>
                <p className="text-gray-600">
                    تعديل تفاصيل الدورة ومحتواها
                </p>
            </div>

            {/* Course Status */}
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
                        <Badge variant={courseData.status === 'active' ? 'default' : 'secondary'} className={courseData.status === 'active' ? 'bg-green-600' : ''}>
                            {courseData.status === 'active' ? 'نشط' :
                                courseData.status === 'draft' ? 'مسودة' :
                                    'قيد المراجعة'}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            <form className="space-y-8">
                {/* Basic Information */}
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
                                placeholder="مثال: تعلم React من الصفر"
                                value={courseData.title}
                                onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">الفئة *</Label>
                            <Select value={courseData.category} onValueChange={(value) => setCourseData(prev => ({ ...prev, category: value }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="اختر فئة الدورة" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(category => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="shortDescription">وصف مختصر *</Label>
                            <Textarea
                                id="shortDescription"
                                placeholder="وصف قصير للدورة (سيظهر في قائمة الدورات)"
                                value={courseData.shortDescription}
                                onChange={(e) => setCourseData(prev => ({ ...prev, shortDescription: e.target.value }))}
                                rows={2}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">الوصف التفصيلي *</Label>
                            <Textarea
                                id="description"
                                placeholder="وصف مفصل للدورة وما ستتعلمه الطلاب"
                                value={courseData.description}
                                onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                                rows={4}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>طريقة التقديم *</Label>
                            <RadioGroup
                                value={courseData.deliveryType}
                                onValueChange={(value) => setCourseData(prev => ({ ...prev, deliveryType: value }))}
                            >
                                <div className="flex gap-6">
                                    {deliveryTypes.map(type => (
                                        <div key={type.value} className="flex items-center space-x-2 space-x-reverse">
                                            <RadioGroupItem value={type.value} id={type.value} />
                                            <Label htmlFor={type.value}>{type.label}</Label>
                                        </div>
                                    ))}
                                </div>
                            </RadioGroup>
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing and Dates */}
                <Card>
                    <CardHeader>
                        <CardTitle>التسعير والتواريخ</CardTitle>
                        <CardDescription>حدد سعر الدورة ومواعيدها</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">السعر (ريال يمني) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder="299"
                                    value={courseData.price}
                                    onChange={(e) => setCourseData(prev => ({ ...prev, price: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="maxStudents">الحد الأقصى للطلاب (اختياري)</Label>
                                <Input
                                    id="maxStudents"
                                    type="number"
                                    placeholder="50"
                                    value={courseData.maxStudents}
                                    onChange={(e) => setCourseData(prev => ({ ...prev, maxStudents: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">تاريخ البداية *</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={courseData.startDate}
                                    onChange={(e) => setCourseData(prev => ({ ...prev, startDate: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endDate">تاريخ النهاية *</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={courseData.endDate}
                                    onChange={(e) => setCourseData(prev => ({ ...prev, endDate: e.target.value }))}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Objectives */}
                <Card>
                    <CardHeader>
                        <CardTitle>أهداف الدورة</CardTitle>
                        <CardDescription>ما سيحصل عليه الطلاب بعد إكمال الدورة</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="أدخل هدف الدورة"
                                value={currentObjective}
                                onChange={(e) => setCurrentObjective(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                            />
                            <Button type="button" onClick={addObjective}>
                                إضافة
                            </Button>
                        </div>

                        {courseData.objectives.length > 0 && (
                            <div className="space-y-2">
                                {courseData.objectives.map((objective, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <span>{objective}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeObjective(index)}
                                        >
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
                    <CardContent>
                        <Textarea
                            placeholder="مثال: معرفة أساسية في HTML و CSS"
                            value={courseData.prerequisites}
                            onChange={(e) => setCourseData(prev => ({ ...prev, prerequisites: e.target.value }))}
                            rows={3}
                        />
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
                                onChange={(e) => setCurrentTag(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            />
                            <Button type="button" onClick={addTag}>
                                إضافة
                            </Button>
                        </div>

                        {courseData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {courseData.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                        {tag}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-4 w-4 p-0 hover:bg-transparent"
                                            onClick={() => removeTag(tag)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Course Image */}
                <Card>
                    <CardHeader>
                        <CardTitle>صورة الدورة</CardTitle>
                        <CardDescription>أضف صورة تعبيرية للدورة</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">اسحب وأفلت الصورة هنا، أو</p>
                            <Button variant="outline">
                                اختر صورة
                            </Button>
                            <p className="text-sm text-gray-500 mt-2">
                                PNG, JPG حتى 2MB
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end">
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
                                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                                    إلغاء
                                </Button>
                                <Button variant="destructive" onClick={handleDelete}>
                                    حذف
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => handleSubmit('draft')}
                        disabled={isSubmitting}
                    >
                        <Save className="mr-2 h-4 w-4" />
                        حفظ التغييرات
                    </Button>

                    <Button
                        type="button"
                        onClick={() => handleSubmit('submit')}
                        disabled={!isFormValid() || isSubmitting}
                    >
                        <Send className="mr-2 h-4 w-4" />
                        {isSubmitting ? 'جاري الإرسال...' : 'تحديث الدورة'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
