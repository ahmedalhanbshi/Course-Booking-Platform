import nodemailer from 'nodemailer';

interface MailOptions {
    to: string;
    subject: string;
    html: string;
}

class MailerService {
    private transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || '',
        },
        tls: { rejectUnauthorized: false },
    });

    private wrapHtml(title: string, body: string): string {
        return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
  body{font-family:Segoe UI,Arial,sans-serif;background:#f5f7fa;margin:0;padding:0;direction:rtl}
  .container{max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.08)}
  .header{background:linear-gradient(135deg,#4f46e5,#06b6d4);padding:32px 24px;text-align:center}
  .header h1{color:#fff;margin:0;font-size:22px}
  .body{padding:32px 24px;color:#374151}
  .body p{line-height:1.7;margin:0 0 16px}
  .card{background:#f0f4ff;border-right:4px solid #4f46e5;border-radius:8px;padding:16px;margin:16px 0}
  .btn{display:inline-block;background:#4f46e5;color:#fff!important;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0}
  .footer{background:#f9fafb;padding:20px 24px;text-align:center;color:#9ca3af;font-size:13px;border-top:1px solid #e5e7eb}
</style></head>
<body>
<div class="container">
  <div class="header"><h1>🔔 ${title}</h1></div>
  <div class="body">${body}</div>
  <div class="footer">منصة حجز الدورات — جميع الحقوق محفوظة</div>
</div>
</body></html>`;
    }

    async send(opts: MailOptions): Promise<void> {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return; // silently skip if unconfigured
        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_FROM || `"منصة الدورات" <${process.env.SMTP_USER}>`,
                to: opts.to,
                subject: opts.subject,
                html: opts.html,
            });
        } catch (err) {
            console.error('[Mailer] Failed to send email:', err);
        }
    }

    // ── Enrollment ─────────────────────────────────────────────────
    async sendEnrollmentPreliminaryAccepted(to: string, studentName: string, courseTitle: string) {
        await this.send({
            to,
            subject: `✅ تم قبولك مبدئياً في دورة "${courseTitle}"`,
            html: this.wrapHtml('قبول مبدئي', `
                <p>مرحباً <strong>${studentName}</strong>،</p>
                <div class="card">
                    <p>🎉 يسعدنا إخبارك بأنه تم قبولك مبدئياً في دورة <strong>${courseTitle}</strong>.</p>
                </div>
                <p>الخطوة التالية هي إتمام عملية الدفع. يرجى الدخول إلى منصتنا وإرفاق سند الدفع لإكمال التسجيل.</p>
                <a class="btn" href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/student/courses">إكمال التسجيل</a>
            `),
        });
    }

    async sendEnrollmentFinalAccepted(to: string, studentName: string, courseTitle: string) {
        await this.send({
            to,
            subject: `🎓 تم قبولك نهائياً في دورة "${courseTitle}"`,
            html: this.wrapHtml('قبول نهائي', `
                <p>مرحباً <strong>${studentName}</strong>،</p>
                <div class="card">
                    <p>🎉 تهانينا! تم تأكيد تسجيلك نهائياً في دورة <strong>${courseTitle}</strong>.</p>
                </div>
                <p>يمكنك الآن الوصول إلى محتوى الدورة والجلسات التدريبية من لوحة التحكم الخاصة بك.</p>
                <a class="btn" href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/student/courses">ابدأ التعلم</a>
            `),
        });
    }

    async sendEnrollmentRejected(to: string, studentName: string, courseTitle: string, reason?: string) {
        await this.send({
            to,
            subject: `❌ تم رفض طلب تسجيلك في دورة "${courseTitle}"`,
            html: this.wrapHtml('رفض التسجيل', `
                <p>مرحباً <strong>${studentName}</strong>،</p>
                <p>نأسف لإعلامك بأنه تم رفض طلب تسجيلك في دورة <strong>${courseTitle}</strong>.</p>
                ${reason ? `<div class="card"><p><strong>السبب:</strong> ${reason}</p></div>` : ''}
                <p>يمكنك التواصل مع الدعم إذا كان لديك أي استفسار، أو التقدم لدورات أخرى.</p>
                <a class="btn" href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/courses">استعرض الدورات</a>
            `),
        });
    }

    async sendPaymentApproved(to: string, studentName: string, courseTitle: string) {
        await this.send({
            to,
            subject: `💳 تم قبول دفعتك لدورة "${courseTitle}"`,
            html: this.wrapHtml('قبول الدفعة', `
                <p>مرحباً <strong>${studentName}</strong>،</p>
                <div class="card"><p>✅ تم التحقق من دفعتك لدورة <strong>${courseTitle}</strong> والموافقة عليها.</p></div>
                <p>تسجيلك مكتمل الآن. نتمنى لك تجربة تعليمية رائعة!</p>
                <a class="btn" href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/student/courses">دوراتي</a>
            `),
        });
    }

    async sendPaymentRejected(to: string, studentName: string, courseTitle: string, reason?: string) {
        await this.send({
            to,
            subject: `⚠️ تم رفض دفعتك لدورة "${courseTitle}"`,
            html: this.wrapHtml('رفض الدفعة', `
                <p>مرحباً <strong>${studentName}</strong>،</p>
                <p>نأسف لإعلامك بأنه تم رفض سند الدفع المرفق لدورة <strong>${courseTitle}</strong>.</p>
                ${reason ? `<div class="card"><p><strong>السبب:</strong> ${reason}</p></div>` : ''}
                <p>يرجى إعادة رفع سند الدفع الصحيح من خلال لوحة التحكم.</p>
                <a class="btn" href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/student/courses">رفع السند</a>
            `),
        });
    }

    async sendSessionReminder(to: string, studentName: string, courseTitle: string, sessionTopic: string, startTime: Date) {
        const timeStr = startTime.toLocaleString('ar-SA', { dateStyle: 'full', timeStyle: 'short' });
        await this.send({
            to,
            subject: `⏰ تذكير: جلسة "${sessionTopic}" تبدأ بعد ساعة`,
            html: this.wrapHtml('تذكير بالجلسة', `
                <p>مرحباً <strong>${studentName}</strong>،</p>
                <div class="card">
                    <p>🔔 تذكير: لديك جلسة تدريبية خلال ساعة!</p>
                    <p><strong>الدورة:</strong> ${courseTitle}</p>
                    <p><strong>موضوع الجلسة:</strong> ${sessionTopic}</p>
                    <p><strong>الوقت:</strong> ${timeStr}</p>
                </div>
                <a class="btn" href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/student/courses">دخول الجلسة</a>
            `),
        });
    }

    // ── Trainer ────────────────────────────────────────────────────
    async sendNewEnrollmentRequest(to: string, trainerName: string, studentName: string, courseTitle: string) {
        await this.send({
            to,
            subject: `📝 طلب تسجيل جديد في دورة "${courseTitle}"`,
            html: this.wrapHtml('طلب تسجيل جديد', `
                <p>مرحباً <strong>${trainerName}</strong>،</p>
                <div class="card"><p>👤 قدّم الطالب <strong>${studentName}</strong> طلب تسجيل في دورتك <strong>${courseTitle}</strong>.</p></div>
                <p>يرجى مراجعة الطلب والرد عليه من لوحة التحكم.</p>
                <a class="btn" href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/trainer/students">مراجعة الطلبات</a>
            `),
        });
    }

    async sendPaymentReceiptSubmitted(to: string, recipientName: string, studentName: string, courseTitle: string) {
        await this.send({
            to,
            subject: `💰 رُفع إيصال دفع لدورة "${courseTitle}"`,
            html: this.wrapHtml('إيصال دفع جديد', `
                <p>مرحباً <strong>${recipientName}</strong>،</p>
                <div class="card"><p>📤 أرفق الطالب <strong>${studentName}</strong> إيصال دفع لدورة <strong>${courseTitle}</strong>.</p></div>
                <p>يرجى المراجعة والتحقق من الإيصال في أقرب وقت.</p>
                <a class="btn" href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/trainer/students">مراجعة الإيصال</a>
            `),
        });
    }

    async sendAccountApproved(to: string, name: string, role: string) {
        await this.send({
            to,
            subject: `✅ تم قبول حسابك كـ${role}`,
            html: this.wrapHtml('قبول الحساب', `
                <p>مرحباً <strong>${name}</strong>،</p>
                <div class="card"><p>🎉 يسعدنا إخبارك بأنه تم مراجعة حسابك والموافقة عليه كـ<strong>${role}</strong> في منصتنا.</p></div>
                <p>يمكنك الآن تسجيل الدخول والبدء في استخدام جميع مميزات المنصة.</p>
                <a class="btn" href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/login">تسجيل الدخول</a>
            `),
        });
    }

    async sendAccountRejected(to: string, name: string, role: string, reason?: string) {
        await this.send({
            to,
            subject: `❌ تم رفض طلب تسجيلك كـ${role}`,
            html: this.wrapHtml('رفض الحساب', `
                <p>مرحباً <strong>${name}</strong>،</p>
                <p>نأسف لإعلامك بأنه تم رفض طلب تسجيلك كـ<strong>${role}</strong>.</p>
                ${reason ? `<div class="card"><p><strong>السبب:</strong> ${reason}</p></div>` : ''}
                <p>يمكنك التواصل مع الدعم لمزيد من التفاصيل.</p>
            `),
        });
    }

    async sendNewBookingRequest(to: string, instituteName: string, trainerName: string, roomName: string) {
        await this.send({
            to,
            subject: `🏛️ طلب حجز قاعة جديد: "${roomName}"`,
            html: this.wrapHtml('طلب حجز جديد', `
                <p>مرحباً <strong>${instituteName}</strong>،</p>
                <div class="card"><p>👤 طلب المدرب <strong>${trainerName}</strong> حجز قاعة <strong>${roomName}</strong>.</p></div>
                <p>يرجى مراجعة الطلب والرد عليه من لوحة التحكم.</p>
                <a class="btn" href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/institute/bookings">مراجعة الطلبات</a>
            `),
        });
    }

    async sendBookingApproved(to: string, recipientName: string, roomName: string) {
        await this.send({
            to,
            subject: `✅ تم قبول حجز القاعة "${roomName}"`,
            html: this.wrapHtml('قبول الحجز', `
                <p>مرحباً <strong>${recipientName}</strong>،</p>
                <div class="card"><p>🏛️ تمت المراجعة والموافقة على حجزك لقاعة <strong>${roomName}</strong>.</p></div>
                <a class="btn" href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/trainer/bookings">تفاصيل الحجز</a>
            `),
        });
    }

    async sendBookingRejected(to: string, recipientName: string, roomName: string, reason?: string) {
        await this.send({
            to,
            subject: `❌ تم رفض حجز القاعة "${roomName}"`,
            html: this.wrapHtml('رفض الحجز', `
                <p>مرحباً <strong>${recipientName}</strong>،</p>
                <p>نأسف لإعلامك بأنه تم رفض طلب حجز قاعة <strong>${roomName}</strong>.</p>
                ${reason ? `<div class="card"><p><strong>السبب:</strong> ${reason}</p></div>` : ''}
                <a class="btn" href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/trainer/halls">استعراض القاعات</a>
            `),
        });
    }
}

export const mailerService = new MailerService();
