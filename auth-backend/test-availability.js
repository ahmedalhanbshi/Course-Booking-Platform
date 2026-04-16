const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    const sessions = await prisma.session.findMany({
        where: { roomId: { not: null } },
        orderBy: { startTime: 'desc' },
        take: 5,
        select: { id: true, startTime: true, endTime: true, roomId: true, course: { select: { title: true, status: true } } }
    });
    console.log("SESSIONS WITH ROOM:", JSON.stringify(sessions, null, 2));
}
run().catch(console.error).finally(() => prisma.$disconnect());
