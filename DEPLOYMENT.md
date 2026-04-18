# نشر المشروع برابط عام (Frontend + Backend)

هذا المشروع يتكوّن من:
- واجهة: Next.js في جذر المشروع
- خلفية: Express/Prisma داخل `auth-backend`

أفضل مسار سريع:
- الواجهة على **Vercel**
- الخلفية + قاعدة البيانات + Redis على **Render**

---

## 1) نشر الـ Backend على Render

### إنشاء الخدمات
- أنشئ Web Service جديدة من نفس المستودع:
  - `Root Directory`: `auth-backend`
  - `Build Command`: `npm install --include=dev`
  - `Start Command`: `npm run start:render`
  - `Health Check Path`: `/health`

- أنشئ Postgres Database على Render.
- أنشئ Key Value (Redis-compatible) على Render.

> ملاحظة: السكربت `start:render` في المشروع يشغّل:
> `prisma db push --skip-generate && ts-node --transpile-only src/server.ts`

### Environment Variables للـ Backend
ضع هذه المتغيرات في خدمة الـ Backend:

- `NODE_ENV=production`
- `DATABASE_URL=<Render Postgres connection string>`
- `JWT_ACCESS_SECRET=<random strong secret>`
- `JWT_REFRESH_SECRET=<random strong secret>`
- `JWT_ACCESS_EXPIRES_IN=15m`
- `JWT_REFRESH_EXPIRES_IN=7d`
- `FRONTEND_URL=<رابط الواجهة على Vercel>`
- `REDIS_URL=<Render Key Value internal/external URL>`
- `COOKIE_SAME_SITE=none`
- `COOKIE_SECURE=true`

> يمكنك أيضًا استخدام `REDIS_HOST/REDIS_PORT/REDIS_PASSWORD` بدل `REDIS_URL`، لكن `REDIS_URL` أبسط.

---

## 2) نشر الـ Frontend على Vercel

- استورد نفس المستودع في Vercel.
- `Root Directory`: جذر المشروع (افتراضي).
- أضف متغير بيئة:
  - `NEXT_PUBLIC_API_URL=<رابط backend على Render>`

ثم Deploy.

---

## 3) اختبار الرابط العام

بعد اكتمال النشر:
- افتح رابط Vercel (هذا هو الرابط الذي تعطيه لأي شخص للتجربة).
- اختبر:
  - الصفحة الرئيسية
  - تسجيل حساب/تسجيل دخول
  - جلب الدورات والبيانات العامة

إذا ظهر خطأ CORS أو كوكيز:
- تأكد أن `FRONTEND_URL` يطابق دومين Vercel تمامًا.
- تأكد أن `COOKIE_SAME_SITE=none` و `COOKIE_SECURE=true`.

---

## ملاحظة مهمة

تم تجهيز الباك إند لدعم:
- `FRONTEND_URL` كقائمة (يمكنك وضع أكثر من رابط مفصول بفاصلة).
- إعدادات كوكيز مناسبة للنشر عبر دومينات مختلفة.
- `REDIS_URL` مباشرةً لتسهيل الربط مع Render Key Value.
