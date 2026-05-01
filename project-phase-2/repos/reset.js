import prisma from "@/repos/prisma";

await prisma.like.deleteMany();
await prisma.comment.deleteMany();
await prisma.follows.deleteMany();
await prisma.post.deleteMany();
await prisma.user.deleteMany();