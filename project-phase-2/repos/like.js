import prisma from "@/repos/prisma";

export async function getLikeCount(p_postid) {
    try {
        const result = await prisma.like.aggregate({
            where: {
                post_id: p_postid,
            },
            _count: true,
        });
        return result._count;
    } catch (e) { console.error(e); }
}

export async function getTotalLikes() {
    return (await prisma.like.aggregate({
        _count: true
    }))._count;
}

export async function likePost(p_postid, p_likerid) {
    try {
        const result = await prisma.like.create({
            data: {
                liker_id: p_likerid,
                post_id: p_postid,
            }
        });
        return true;
    } catch (e) { console.error(e); return false; }
}

export async function unlikePost(p_postid, p_likerid) {
    try {
        const result = await prisma.like.delete({
            where: {
                liker_id: p_likerid,
                post_id: p_postid,
            }
        });
        return true;
    } catch (e) { console.error(e); return false; }
}