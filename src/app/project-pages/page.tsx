import fs from "node:fs/promises"
import path from "node:path"
import Link from "next/link"

type RouteItem = {
  group: string
  route: string
  visitPath: string
  isDynamic: boolean
}

const groupLabels: Record<string, string> = {
  root: "الصفحات العامة",
  admin: "لوحة الإدارة",
  auth: "المصادقة",
  courses: "الدورات العامة",
  institute: "حساب المعهد",
  institutes: "صفحات المعاهد",
  notifications: "الإشعارات",
  profile: "الملف الشخصي",
  student: "حساب الطالب",
  trainer: "حساب المدرب",
  unauthorized: "عدم الصلاحية",
  test: "صفحات الاختبار",
}

async function collectPageFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      const nested = await collectPageFiles(fullPath)
      files.push(...nested)
      continue
    }
    if (entry.isFile() && entry.name === "page.tsx") {
      files.push(fullPath)
    }
  }

  return files
}

function routeFromFile(appDir: string, filePath: string): RouteItem {
  const relative = path.relative(appDir, filePath).replace(/\\/g, "/")
  const withoutPage = relative.replace(/\/page\.tsx$/, "")
  const parts = withoutPage.split("/").filter(Boolean)
  const route = parts.length === 0 ? "/" : `/${parts.join("/")}`
  const first = parts[0] ?? "root"
  const isDynamic = /\[.+?\]/.test(route)
  const visitPath = route
    .replace(/\[\[\.\.\.[^\]]+\]\]/g, "sample")
    .replace(/\[\.\.\.[^\]]+\]/g, "sample")
    .replace(/\[[^\]]+\]/g, "1")

  return {
    group: first,
    route,
    visitPath,
    isDynamic,
  }
}

async function getAllRoutes(): Promise<RouteItem[]> {
  const appDir = path.join(process.cwd(), "src", "app")
  const pageFiles = await collectPageFiles(appDir)
  return pageFiles.map((file) => routeFromFile(appDir, file)).sort((a, b) => a.route.localeCompare(b.route))
}

export default async function ProjectPagesIndexPage() {
  const routes = await getAllRoutes()
  const grouped = routes.reduce<Record<string, RouteItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = []
    acc[item.group].push(item)
    return acc
  }, {})
  const groupKeys = Object.keys(grouped).sort((a, b) => a.localeCompare(b))

  return (
    <div className="mx-auto max-w-7xl p-6" dir="rtl">
      <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">فهرس صفحات المشروع</h1>
        <p className="mt-1 text-slate-600">هذه الصفحة تجمع كل ملفات `page.tsx` داخل المشروع تلقائيًا.</p>
        <p className="mt-2 text-sm text-slate-500">
          إجمالي الصفحات: <span className="font-semibold text-slate-800">{routes.length}</span>
        </p>
      </div>

      <div className="space-y-5">
        {groupKeys.map((group) => (
          <section key={group} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">{groupLabels[group] ?? group}</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {grouped[group].length} صفحة
              </span>
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              {grouped[group].map((item) => (
                <div key={item.route} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">{item.route}</p>
                    {item.isDynamic && (
                      <p className="text-xs text-slate-500">رابط ديناميكي - زيارة عبر مسار تجريبي</p>
                    )}
                  </div>
                  <Link
                    href={item.visitPath}
                    className="shrink-0 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    فتح
                  </Link>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

