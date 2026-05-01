import prisma from "@/repos/prisma";

export async function getFollowers(p_userid) {
    try {
        const result = await prisma.follows.findMany({
            where: {
                followee_id: p_userid,
            }
        });
        return result;
    } catch (e) { console.error(e); }
}

export async function getFollowing(p_userid) {
    try {
        const result = await prisma.follows.findMany({
            where: {
                follower_id: p_userid,
            }
        });
        return result;
    } catch (e) { console.error(e); }
}

export async function getFollowersCount(p_userid) {
    try {
        const result = await prisma.follows.aggregate({
            where: {
                followee_id: p_userid,
            },
            _count: true,
        });
        return result._count;
    } catch (e) { console.error(e); }
}

export async function getFollowingCount(p_userid) {
    try {
        const result = await prisma.follows.aggregate({
            where: {
                follower_id: p_userid,
            },
            _count: true,
        });
        return result._count;
    } catch (e) { console.error(e); }
}

export async function follow(p_followerid, p_followeeid) {
    try {
        const result = await prisma.follows.create({
            data: {
                follower_id: p_followerid,
                followee_id: p_followeeid,
            }
        });
        return true;
    } catch (e) { console.error(e); return false; }
}

export async function unfollow(p_followerid, p_followeeid) {
    try {
        const result = await prisma.follows.delete({
            where: {
                follower_id: p_followerid,
                followee_id: p_followeeid,
            }
        });
        return true;
    } catch (e) { console.error(e); return false; }
}