const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.findMany({ select: { name: true, avatar: true } }).then(r => console.log(r)).catch(e => console.error(e)).finally(() => prisma.$disconnect());
