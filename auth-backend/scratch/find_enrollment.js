const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const enrollment = await prisma.enrollment.findFirst({
    where: { status: 'ACTIVE', deletedAt: null },
    include: { course: true, student: true }
  });
  console.log(JSON.stringify(enrollment, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
