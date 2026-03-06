import prisma from '../config/database';

/**
 * Automatically marks sessions as COMPLETED when their end time has passed.
 */
async function autoCompleteSessions() {
    try {
        const now = new Date();
        const result = await prisma.session.updateMany({
            where: {
                status: { in: ['SCHEDULED', 'POSTPONED'] },
                endTime: { lt: now },
            },
            data: { status: 'COMPLETED' },
        });

        if (result.count > 0) {
            console.log(`[Scheduler] ✅ Auto-completed ${result.count} session(s) at ${now.toISOString()}`);
        }
    } catch (err) {
        console.error('[Scheduler] Failed to auto-complete sessions:', err);
    }
}

/**
 * Automatically marks courses as COMPLETED when their endDate has passed.
 */
async function autoCompleteCourses() {
    try {
        const now = new Date();
        const result = await prisma.course.updateMany({
            where: {
                status: { in: ['ACTIVE', 'PENDING_REVIEW'] },
                endDate: { lt: now },
            },
            data: { status: 'COMPLETED' },
        });

        if (result.count > 0) {
            console.log(`[Scheduler] ✅ Auto-completed ${result.count} course(s) at ${now.toISOString()}`);
        }
    } catch (err) {
        console.error('[Scheduler] Failed to auto-complete courses:', err);
    }
}

export function startSessionScheduler() {
    console.log('[Scheduler] Auto-complete scheduler started (runs every minute)');
    // Run immediately on startup
    autoCompleteSessions();
    autoCompleteCourses();
    // Then run every 60 seconds
    setInterval(autoCompleteSessions, 60 * 1000);
    setInterval(autoCompleteCourses, 60 * 1000);
}

