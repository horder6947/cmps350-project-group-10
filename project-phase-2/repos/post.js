import prisma from "@/repos/prisma";

export async function getPost(p_postid) {
    try {
        const result = await prisma.post.findUnique({
            where: {
                id: p_postid,
            }
        });
        return result;
    } catch (e) { console.error(e); }
}

export async function getTotalPostsCount() {
    return (await prisma.post.aggregate({
        _count: true,
    }))._count;
}

export async function getPostsByAuthor(p_authorid) {
    try {
        const result = await prisma.post.findMany({
            where: {
                author_id: p_authorid,
            }
        });
        return result;
    } catch (e) { console.error(e); }
}

export async function getUserPostsCount(p_authorid) {
    try {
        const result = await prisma.post.aggregate({
            where: {
                author_id: p_authorid,
            },
            _count: true
        });
        return result._count;
    } catch (e) { console.error(e); }
}

export async function getAllPosts() {
    try {
        const result = await prisma.post.findMany();
        return result;
    } catch (e) { console.error(e); }
}

export async function getFollowingPosts(p_userid) {
    try {
        const result = await prisma.post.findMany({
            where: {
                author: {
                    followers: {
                        some: {
                            follower_id: p_userid,
                        },
                    },
                },
            }
        });
        return result;
    } catch (e) { console.error(e); }
}

export async function createPost(p_authorid, p_postContent) {
    try {
        const result = await prisma.post.create({
            data: {
                author_id: p_authorid,
                post_content: p_postContent,
            },
            select: {
                id: true,
            }
        });
        return result.id;
    } catch (e) { console.error(e); }
}

export async function deletePost(p_postid) {
    try {
        const result = await prisma.post.delete({
            where: {
                id: p_postid,
            }
        });
        return true;
    } catch (e) { console.error(e); return false; }
}