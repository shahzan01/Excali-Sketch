import { PrismaClient } from "@prisma/client";

const prismaClientSingelton = () => {
  return new PrismaClient();
};

type PrismaClientSingelton = ReturnType<typeof prismaClientSingelton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingelton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingelton();
export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
