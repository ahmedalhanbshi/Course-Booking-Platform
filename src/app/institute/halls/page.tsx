"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { toast } from "sonner"
import ExploreHallsPage from "@/app/student/explore/halls/page"
import InstituteRoomBookings from "@/app/institute/room-bookings/page"

interface Hall {
  id: string
  name: string
  capacity: number
  location: string
  locationUrl: string
  type: "قاعة محاضرات" | "قاعة اجتماعات" | "معمل" | "ورشة عمل"
  hourlyRate: number
  description: string
  image: string
  features: Array<"wifi" | "projector" | "screen" | "computers">
}

const mockHalls: Hall[] = [
  {
    id: "hall-1",
    name: "القاعة الرئيسية",
    type: "قاعة محاضرات",
    location: "الدور الأرضي • الجناح الشرقي",
    locationUrl: "",
    capacity: 80,
    hourlyRate: 18000,
    image:
      "https://images.unsplash.com/photo-1760121788536-9797394e210e?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    features: ["wifi", "projector", "screen"],
    description: "قاعة واسعة للمحاضرات والفعاليات الكبرى مع تجهيزات عرض متكاملة."
  },
  {
    id: "hall-2",
    name: "قاعة الاجتماعات الذكية",
    type: "قاعة اجتماعات",
    location: "الدور الأول • الجناح الغربي",
    locationUrl: "",
    capacity: 18,
    hourlyRate: 12000,
    image:
      "https://images.unsplash.com/photo-1766802981801-4b4a9a1d8f1c?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    features: ["wifi", "screen"],
    description: "مساحة مريحة لاجتماعات الفرق مع شاشة تفاعلية وإضاءة هادئة."
  },
  {
    id: "hall-3",
    name: "معمل الحاسب المتقدم",
    type: "معمل",
    location: "الدور الثاني • الجناح الشرقي",
    locationUrl: "",
    capacity: 30,
    hourlyRate: 15000,
    image:
      "https://images.unsplash.com/photo-1725274032244-9a8f0fa1e9a7?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    features: ["wifi", "projector", "computers"],
    description: "معمل مجهز لأعمال التدريب العملي مع أجهزة حديثة وشبكة قوية."
  },
  {
    id: "hall-4",
    name: "قاعة التدريب (ج)",
    type: "قاعة محاضرات",
    location: "الدور الأول • الجناح الشرقي",
    locationUrl: "",
    capacity: 40,
    hourlyRate: 14000,
    image:
      "https://images.unsplash.com/photo-1670348060135-d4c6662b4138?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    features: ["wifi", "projector"],
    description: "قاعة متوسطة مناسبة للدورات وورش العمل القصيرة."
  }
]

export default function InstituteHallsPage() {
  const [halls, setHalls] = useState<Hall[]>(mockHalls)
  const [editingHall, setEditingHall] = useState<Hall | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [activeTab, setActiveTab] = useState<"halls" | "bookings">("halls")
  const [isImageDragging, setIsImageDragging] = useState(false)
  const [imagePreviewUrl, setImagePreviewUrl] = useState("")
  const hallImageInputRef = useRef<HTMLInputElement | null>(null)

  const createEmptyHall = (): Hall => ({
    id: `hall-${Date.now()}`,
    name: "",
    type: "قاعة محاضرات",
    location: "",
    locationUrl: "",
    capacity: 0,
    hourlyRate: 0,
    image: "",
    features: [],
    description: ""
  })

  const isValidMapsUrl = (value: string) => {
    if (!value) return true
    try {
      const url = new URL(value)
      if (url.protocol !== "https:") return false
      const host = url.hostname.toLowerCase()
      if (host === "maps.google.com" || host === "maps.app.goo.gl") return true
      if ((host === "google.com" || host === "www.google.com") && url.pathname.startsWith("/maps")) {
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const handleOpenEdit = (hallId: string) => {
    const hall = halls.find((item) => item.id === hallId)
    if (!hall) return
    setIsCreating(false)
    setEditingHall(hall)
    setIsEditOpen(true)
  }

  const handleOpenCreate = () => {
    setIsCreating(true)
    setEditingHall(createEmptyHall())
    setIsEditOpen(true)
  }

  useEffect(() => {
    setImagePreviewUrl(editingHall?.image ?? "")
  }, [editingHall?.image])

  const handleSaveEdit = () => {
    if (!editingHall) return
    if (editingHall.locationUrl && !isValidMapsUrl(editingHall.locationUrl)) {
      toast.error("رابط الموقع غير صالح. استخدم رابط Google Maps يبدأ بـ https://")
      return
    }
    setHalls((prev) => {
      const exists = prev.some((hall) => hall.id === editingHall.id)
      if (exists) {
        return prev.map((hall) => (hall.id === editingHall.id ? { ...editingHall } : hall))
      }
      return [...prev, { ...editingHall }]
    })
    setIsEditOpen(false)
    setIsCreating(false)
    toast.success(isCreating ? "تم إضافة القاعة بنجاح" : "تم تحديث بيانات القاعة بنجاح")
  }

  const handleHallImageFile = (file?: File | null) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("الملف المحدد ليس صورة. يرجى اختيار صورة مناسبة.")
      return
    }
    const previewUrl = URL.createObjectURL(file)
    setEditingHall((prev) => (prev ? { ...prev, image: previewUrl } : prev))
  }

  const editingForm = useMemo(() => {
    if (!editingHall) return null
    return {
      ...editingHall
    }
  }, [editingHall])

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="text-right">
          <h1 className="text-3xl font-bold text-gray-900">إدارة القاعات</h1>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === "halls" && (
            <Button onClick={handleOpenCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة قاعة
            </Button>
          )}
          <div className="bg-gray-100 p-1 rounded-xl flex items-center w-fit">
            <button
              onClick={() => setActiveTab("halls")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "halls"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              القاعات
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "bookings"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              طلبات الحجز
            </button>
          </div>
        </div>
      </div>

      {activeTab === "halls" && (
        <ExploreHallsPage
          hideTitle
          basePath="/institute/halls"
          actionLabel="تعديل"
          onSelectHall={handleOpenEdit}
          hallsData={halls}
        />
      )}
      {activeTab === "bookings" && <InstituteRoomBookings />}

      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open)
          if (!open) {
            setEditingHall(null)
            setIsCreating(false)
            setIsImageDragging(false)
            setImagePreviewUrl("")
          }
        }}
      >
        <DialogContent
          dir="rtl"
          overlayClassName="bg-black/35"
          className="w-[min(980px,92vw)] max-w-[980px] max-h-[82vh] overflow-hidden p-0 [&>button[data-dialog-close='default']]:hidden"
        >
          <div className="flex h-full max-h-[82vh] flex-col">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white px-6 py-4">
              <DialogHeader className="space-y-1 text-right">
                <DialogTitle>{isCreating ? "إضافة قاعة جديدة" : "تعديل بيانات القاعة"}</DialogTitle>
                <DialogDescription>
                  {isCreating ? "أدخل البيانات الأساسية للقاعة الجديدة" : "حدث البيانات الأساسية للقاعة المختارة"}
                </DialogDescription>
              </DialogHeader>
              <DialogClose className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30">
                <X className="h-4 w-4" />
                <span className="sr-only">إغلاق</span>
              </DialogClose>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {editingForm && (
                <div className="grid gap-6 lg:grid-cols-[320px_1fr] [direction:ltr]">
                  <div className="space-y-3 lg:items-start">
                    <Label className="text-sm font-semibold">صورة القاعة</Label>
                    <div
                      className={`relative aspect-square w-full max-w-[320px] overflow-hidden rounded-2xl border-2 border-dashed bg-slate-50/60 transition-shadow ${
                        isImageDragging ? "ring-2 ring-blue-500 ring-offset-2 border-blue-300" : "border-slate-200"
                      }`}
                      onDragOver={(event) => {
                        event.preventDefault()
                        setIsImageDragging(true)
                      }}
                      onDragLeave={() => setIsImageDragging(false)}
                      onDrop={(event) => {
                        event.preventDefault()
                        setIsImageDragging(false)
                        handleHallImageFile(event.dataTransfer.files?.[0])
                      }}
                      onClick={() => hallImageInputRef.current?.click()}
                    >
                      <input
                        ref={hallImageInputRef}
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(event) => {
                          handleHallImageFile(event.target.files?.[0])
                          event.currentTarget.value = ""
                        }}
                      />

                      {imagePreviewUrl ? (
                        <>
                          <img
                            src={imagePreviewUrl}
                            alt={editingForm.name || "صورة القاعة"}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                          <div className="absolute inset-x-3 bottom-3 flex items-center justify-end gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              className="h-8 bg-white/95 hover:bg-white"
                              onClick={(event) => {
                                event.stopPropagation()
                                hallImageInputRef.current?.click()
                              }}
                            >
                              تغيير
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="h-8 bg-white/95 text-slate-700 hover:bg-white"
                              onClick={(event) => {
                                event.stopPropagation()
                                setEditingHall((prev) => (prev ? { ...prev, image: "" } : prev))
                                setImagePreviewUrl("")
                              }}
                            >
                              حذف
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
                          <p className="text-sm font-semibold text-slate-700">اسحب الصورة هنا</p>
                          <span className="text-xs text-slate-400">أو</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="bg-white/90"
                            onClick={(event) => {
                              event.stopPropagation()
                              hallImageInputRef.current?.click()
                            }}
                          >
                            اختيار من الجهاز
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 text-right" dir="rtl">
                    <div className="grid gap-2">
                      <Label htmlFor="hall-name">اسم القاعة</Label>
                      <Input
                        id="hall-name"
                        dir="rtl"
                        className="h-11 text-right"
                        value={editingForm.name}
                        onChange={(event) =>
                          setEditingHall((prev) => (prev ? { ...prev, name: event.target.value } : prev))
                        }
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="hall-capacity">السعة</Label>
                        <Input
                          id="hall-capacity"
                          type="number"
                          dir="rtl"
                          className="h-11 text-right"
                          value={editingForm.capacity}
                          onChange={(event) =>
                            setEditingHall((prev) =>
                              prev ? { ...prev, capacity: Number(event.target.value) } : prev
                            )
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="hall-rate">السعر بالساعة</Label>
                        <Input
                          id="hall-rate"
                          type="number"
                          dir="rtl"
                          className="h-11 text-right"
                          value={editingForm.hourlyRate}
                          onChange={(event) =>
                            setEditingHall((prev) =>
                              prev ? { ...prev, hourlyRate: Number(event.target.value) } : prev
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="grid gap-3">
                      <Label className="text-sm font-semibold">الموقع</Label>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label htmlFor="hall-location-text">نص الموقع</Label>
                          <Input
                            id="hall-location-text"
                            dir="rtl"
                            className="h-11 text-right"
                            placeholder="مثال: صنعاء - التحرير - شارع الزبيري"
                            value={editingForm.location}
                            onChange={(event) =>
                              setEditingHall((prev) =>
                                prev ? { ...prev, location: event.target.value } : prev
                              )
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="hall-location-url">رابط الموقع (Google Maps)</Label>
                          <Input
                            id="hall-location-url"
                            type="url"
                            dir="ltr"
                            className="h-11 text-right"
                            placeholder="https://maps.app.goo.gl/..."
                            value={editingForm.locationUrl ?? ""}
                            onChange={(event) =>
                              setEditingHall((prev) =>
                                prev ? { ...prev, locationUrl: event.target.value } : prev
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="hall-type">نوع القاعة</Label>
                      <Select
                        value={editingForm.type}
                        onValueChange={(value) =>
                          setEditingHall((prev) =>
                            prev ? { ...prev, type: value as Hall["type"] } : prev
                          )
                        }
                      >
                        <SelectTrigger id="hall-type" className="h-11 text-right">
                          <SelectValue placeholder="اختر النوع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="قاعة محاضرات">قاعة محاضرات</SelectItem>
                          <SelectItem value="قاعة اجتماعات">قاعة اجتماعات</SelectItem>
                          <SelectItem value="معمل">معمل</SelectItem>
                          <SelectItem value="ورشة عمل">ورشة عمل</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="hall-description">وصف القاعة</Label>
                      <Textarea
                        id="hall-description"
                        dir="rtl"
                        className="min-h-[96px] text-right"
                        rows={4}
                        value={editingForm.description}
                        onChange={(event) =>
                          setEditingHall((prev) =>
                            prev ? { ...prev, description: event.target.value } : prev
                          )
                        }
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>المميزات</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["wifi", "projector", "screen", "computers"].map((feature) => (
                          <label key={feature} className="flex items-center gap-2 text-sm">
                            <Checkbox
                              checked={editingForm.features.includes(feature as Hall["features"][number])}
                              onCheckedChange={(checked) => {
                                setEditingHall((prev) => {
                                  if (!prev) return prev
                                  const next = checked
                                    ? [...prev.features, feature as Hall["features"][number]]
                                    : prev.features.filter((item) => item !== feature)
                                  return { ...prev, features: next }
                                })
                              }}
                            />
                            <span>
                              {feature === "wifi"
                                ? "WiFi"
                                : feature === "projector"
                                  ? "بروجكتر"
                                  : feature === "screen"
                                    ? "شاشة"
                                    : "أجهزة"}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 z-10 border-t border-slate-100 bg-white px-6 py-4">
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleSaveEdit}>حفظ التغييرات</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
