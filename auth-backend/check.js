const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const data = await prisma.enrollment.findMany({
        where: {
            status: { in: ['PRELIMINARY', 'PENDING_PAYMENT', 'ACTIVE'] }
        },
        include: {
            course: { select: { title: true } },
            student: { select: { name: true } }
        }
    });
    console.log(JSON.stringify(data, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
