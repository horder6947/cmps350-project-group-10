import prisma from "@/repos/prisma";

export async function getCommentsByPostID(p_postid) {
    try {
        const result = await prisma.comment.findMany({
            where: {
                post_id: p_postid,
            }
        });
        return result;
    } catch (e) { console.error(e); }
}

export async function getComment(p_commentid) {
    try {
        const result = await prisma.comment.findUnique({
            where: {
                id: p_commentid,
            }
        });
        return result;
    } catch (e) { console.error(e); }
}

export async function getCommentsCount() {
    return (await prisma.comment.aggregate({
        _count: true
    }))._count;
}

export async function commentOnPost(p_authorid, p_postid, p_comment) {
    try {
        const result = await prisma.comment.create({
            data: {
                author_id: p_authorid,
                post_id: p_postid,
                comment: p_comment,
            },
            select: {
                id: true
            }
        });
        return result.id;
    } catch (e) { console.error(e); }
}

export async function deleteComment(p_commentid) {
    try {
        const result = await prisma.comment.delete({
            where: {
                id: p_commentid,
            }
        });
        return true;
    } catch (e) { console.error(e); return false; }
}