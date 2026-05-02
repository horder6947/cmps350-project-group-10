import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/prisma/client/client";

export default new PrismaClient({
    adapter: new PrismaLibSql({
        url: process.env.TURSO_DATABASE_URL ?? "",
        authToken: process.env.DATABASE_AUTH_TOKEN,
    }),
    log: ["query"],
});