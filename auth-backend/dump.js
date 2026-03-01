const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function run() {
    const c = await p.course.findFirst({
        where: { title: { contains: 'jdwidj' } },
        include: { sessions: true }
    });
    console.dir(c, { depth: null });
}

run()
    .catch(console.error)
    .finally(() => p.$disconnect());
