const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
    const courses = await prisma.course.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: { id: true, title: true, status: true, sessions: { select: { id: true, type: true, roomId: true, roomBookingId: true } }, roomBookings: { select: { id: true, roomId: true } } }
    });
    console.log("RECENT COURSES:", JSON.stringify(courses, null, 2));
}
run().catch(console.error).finally(() => prisma.$disconnect());
