import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/prisma/client/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient({
    adapter: new PrismaLibSql({
        url: process.env.DATABASE_URL ?? "",
    }),
    log: ["query"],
});


const users = [];
const posts = [];

const seed1 = async () => {
    try {
        console.log((await prisma.user.create({
            data: {
                username: "testing1",
                email: "testing1@example.com",
                password: "password1",
                bio: "bio1"
            },
            select: {
                id: true
            }
        })).id);
    } catch (e) {
        console.error(e);
    }
}

const seed = async () => {

    // create 100 users, try catch needed if IDs or emails collide
    await Promise.all(
        Array.from({ length: 100 }).map(async () => {
            const myUsername = faker.internet.username();
            try {
                const current_user = await prisma.user.create({
                    data: {
                        username: myUsername,
                        email: faker.internet.email({ firstName: myUsername }),
                        password: faker.internet.password({ memorable: true }),
                        bio: faker.lorem.sentence(4),
                    },
                    select: {
                        id: true,
                    }
                });
                users.push(current_user.id)
            } catch (e) { }
        })
    );

    const users_count = users.length;

    // console.log(users);

    // create 300 posts, assign them to random users
    await Promise.all(
        Array.from({ length: 300 }).map(async () => {
            try {
                posts.push((await prisma.post.create({
                    data: {
                        author_id: users[Math.floor(Math.random() * users_count)],
                        post_content: faker.lorem.sentence(),
                    },
                    select: {
                        id: true
                    }
                })).id);
            } catch (e) { }
        })
    );

    const posts_count = posts.length;

    // create 1500 follow records, random users will follow random users
    await Promise.all(
        Array.from({ length: 1500 }).map(async () => {
            try {
                await prisma.follows.create({
                    data: {
                        follower_id: users[Math.floor(Math.random() * users_count)],
                        followee_id: users[Math.floor(Math.random() * users_count)],
                    }
                });
            } catch (e) { }
        })
    );

    // create 1000 comments, assign to random posts and users
    await Promise.all(
        Array.from({ length: 1000 }).map(async () => {
            try {
                await prisma.comment.create({
                    data: {
                        author_id: users[Math.floor(Math.random() * users_count)],
                        post_id: posts[Math.floor(Math.random() * posts_count)],
                        comment: faker.lorem.sentence(5)
                    }
                });
            } catch (e) { }
        })
    );

    // add 5000 likes to posts, distribute randomly
    await Promise.all(
        Array.from({ length: 5000 }).map(async () => {
            try {
                await prisma.like.create({
                    data: {
                        post_id: posts[Math.floor(Math.random() * posts_count)],
                        liker_id: users[Math.floor(Math.random() * users_count)],
                    }
                });
            } catch (e) { }
        })
    );

};


try {
    await seed();
    await prisma.$disconnect();
} catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
}