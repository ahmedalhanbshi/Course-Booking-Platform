import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.room.findMany().then(res => console.dir(res.map(r => ({ name: r.name, image: r.image })), { depth: null })).finally(() => prisma.$disconnect());
