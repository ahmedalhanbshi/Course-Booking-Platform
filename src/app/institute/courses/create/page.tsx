"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { Save, Send, Trash2, ArrowLeft, Upload, X, MapPin, Users, Building, Globe, User } from "lucide-react"

// Mock data
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

const mockHalls = [
  {
    id: "1",
    name: "القاعة الرئيسية (أ)",
    capacity: 50,
    location: "الدور الأول - الجناح الشرقي"
  },
  {
    id: "2",
    name: "معمل الحاسب (1)",
    capacity: 25,
    location: "الدور الثاني - الجناح الغربي"
  },
  {
    id: "3",
    name: "قاعة الاجتماعات (ب)",
    capacity: 15,
    location: "الدور الأرضي - قرب الإدارة"
  },
  {
    id: "4",
    name: "القاعة التدريبية (ج)",
    capacity: 30,
    location: "الدور الأول - الجناح الشرقي"
  }
]

// Mock trainers
const availableTrainers = [
  { id: "trainer1", name: "فاطمة علي" },
  { id: "trainer2", name: "محمد أحمد" },
  { id: "trainer3", name: "سارة خالد" },
  { id: "trainer4", name: "ياسر عمر" },
]

export default function InstituteCreateCoursePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [courseData, setCourseData] = useState({
    title: "",
    category: "",
    shortDescription: "",
    description: "",
    deliveryType: "",
    price: "",
    maxStudents: "",
    startDate: "",
    endDate: "",
    instituteId: "",
    prerequisites: "",
    objectives: [] as string[],
    tags: [] as string[],
    hallId: "",
    onlinePlatform: "",
    meetingLink: "",
    startTime: "",
    endTime: "",
    trainerId: "" // Added trainerId
  })

  const [currentObjective, setCurrentObjective] = useState("")
  const [currentTag, setCurrentTag] = useState("")
  
  const platforms = [
    { value: "zoom", label: "Zoom" },
    { value: "teams", label: "Microsoft Teams" },
    { value: "meet", label: "Google Meet" },
    { value: "webex", label: "Webex" },
    { value: "other", label: "أخرى" }
  ]

  const handleSubmit = async (action: 'draft' | 'publish') => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)

    if (action === 'publish') {
      router.push('/institute/courses')
    } else {
      alert('تم حفظ الدورة كمسودة')
    }
  }

  const handleDelete = () => {
    setShowDeleteDialog(false)
    router.push('/institute/courses')
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
    const basicValid = courseData.title &&
      courseData.category &&
      courseData.shortDescription &&
      courseData.description &&
      courseData.deliveryType &&
      courseData.price &&
      courseData.startDate &&
      courseData.endDate

    if (courseData.deliveryType === 'in_person' || courseData.deliveryType === 'hybrid') {
      return basicValid && courseData.hallId
    }

    return basicValid
  }

  const selectedHall = mockHalls.find(h => h.id === courseData.hallId)

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/institute/courses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              العودة للدورات
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          إنشاء دورة جديدة
        </h1>
        <p className="text-gray-600">
          أدخل تفاصيل الدورة الجديدة لإضافتها إلى المنصة
        </p>
      </div>

      <form className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>المعلومات الأساسية</CardTitle>
            <CardDescription>أدخل المعلومات الأساسية للدورة والمدرب المسؤول</CardDescription>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {/* Added Instructor Selection Field */}
              <div className="space-y-2">
                <Label htmlFor="trainer">اختيار المدرب (اختياري)</Label>
                <Select value={courseData.trainerId} onValueChange={(value) => setCourseData(prev => ({ ...prev, trainerId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="مدرب الدورة" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTrainers.map(trainer => (
                      <SelectItem key={trainer.id} value={trainer.id}>
                        {trainer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">يمكنك تعيين المدرب لاحقاً إذا لم يتم تحديده الآن.</p>
              </div>
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


        {/* Location & Hall Selection */}
        <Card>
          <CardHeader>
            <CardTitle>المكان والقاعة</CardTitle>
            <CardDescription>حدد مكان إقامة الدورة والقاعة المخصصة</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-6">
               {(courseData.deliveryType === 'online' || courseData.deliveryType === 'hybrid') && (
                 <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <Globe className="h-5 w-5 text-blue-500" />
                      <h3 className="font-semibold text-gray-900">تفاصيل الحضور عن بعد</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <Label htmlFor="platform">المنصة المستخدمة *</Label>
                         <Select value={courseData.onlinePlatform} onValueChange={(value) => setCourseData(prev => ({ ...prev, onlinePlatform: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر المنصة" />
                            </SelectTrigger>
                            <SelectContent>
                               {platforms.map(p => (
                                 <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                               ))}
                            </SelectContent>
                         </Select>
                      </div>
                      <div className="space-y-2">
                         <Label htmlFor="meetingLink">رابط الاجتماع / القاعة الافتراضية</Label>
                         <Input 
                            id="meetingLink" 
                            placeholder="https://zoom.us/j/..." 
                            value={courseData.meetingLink}
                            onChange={(e) => setCourseData(prev => ({ ...prev, meetingLink: e.target.value }))}
                         />
                      </div>
                    </div>
                 </div>
               )}

               {courseData.deliveryType === 'hybrid' && <div className="border-t border-dashed my-4"></div>}

               {(courseData.deliveryType === 'in_person' || courseData.deliveryType === 'hybrid') && (
                 <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <MapPin className="h-5 w-5 text-green-500" />
                      <h3 className="font-semibold text-gray-900">تفاصيل الحضور المباشر</h3>
                    </div>

                    <div className="space-y-4">
                       <Label htmlFor="hall" className="mb-2 block">اختيار القاعة *</Label>
                       <Select value={courseData.hallId} onValueChange={(value) => setCourseData(prev => ({ ...prev, hallId: value }))}>
                         <SelectTrigger>
                           <SelectValue placeholder="اختر القاعة المناسبة" />
                         </SelectTrigger>
                         <SelectContent>
                           {mockHalls.map(hall => (
                             <SelectItem key={hall.id} value={hall.id}>
                               {hall.name} (السعة: {hall.capacity})
                             </SelectItem>
                           ))}
                         </SelectContent>
                       </Select>

                       {selectedHall && (
                         <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-md mt-4 flex items-start gap-3 border border-gray-200 dark:border-gray-700">
                           <Building className="h-5 w-5 text-gray-500 mt-0.5" />
                           <div>
                             <p className="font-medium text-sm text-gray-900 dark:text-white">{selectedHall.name}</p>
                             <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                               <span className="flex items-center gap-1">
                                 <Users className="h-3 w-3" />
                                 السعة: {selectedHall.capacity}
                               </span>
                               <span className="flex items-center gap-1">
                                 <MapPin className="h-3 w-3" />
                                 {selectedHall.location}
                               </span>
                             </div>
                           </div>
                         </div>
                       )}
                    </div>
                 </div>
               )}

               {!courseData.deliveryType && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500">
                    الرجاء تحديد طريقة التقديم لعرض خيارات المكان.
                  </div>
               )}
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
                  <Label htmlFor="startTime">وقت البداية *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={courseData.startTime}
                    onChange={(e) => setCourseData(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="endDate">تاريخ النهاية *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={courseData.endDate}
                    onChange={(e) => setCourseData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">وقت النهاية *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={courseData.endTime}
                    onChange={(e) => setCourseData(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
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
                إلغاء
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>تأكيد الإلغاء</DialogTitle>
                <DialogDescription>
                  هل أنت متأكد من إلغاء إنشاء الدورة؟ سيتم فقدان جميع البيانات المدخلة.
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  تراجع
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  تأكيد الإلغاء
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
            حفظ كمسودة
          </Button>

          <Button
            type="button"
            onClick={() => handleSubmit('publish')}
            disabled={!isFormValid() || isSubmitting}
          >
            <Send className="mr-2 h-4 w-4" />
            {isSubmitting ? 'جاري النشر...' : 'نشر الدورة'}
          </Button>
        </div>
      </form>
    </div>
  )
}
