import prisma from "@/repos/prisma";
import { getFollowersCount } from "@/repos/follow";


export async function getAverageFollowersPerUser() {

  try {

    const userList = await prisma.user.findMany({ select: { id: true } });


    if (!userList || userList.length === 0) {
      return { averageFollowersPerUser: 0, totalFollowers: 0, totalUsers: 0 };
    }


    const followerCounts = await Promise.all(
      userList.map(async (user) => {
        const result = await getFollowersCount(user.id);

        return typeof result === "number" ? result : result?._count || 0;
      })
    );


    const totalFollowers = followerCounts.reduce((sum, n) => sum + n, 0);
    const totalUsers = userList.length;
    const averageFollowersPerUser = totalUsers > 0 ? (totalFollowers / totalUsers).toFixed(2) : 0;

    return { averageFollowersPerUser, totalFollowers, totalUsers };


  } catch (err) {

    console.error("Error in getAverageFollowersPerUser:", err);
    throw err;
  }
}

export async function getAveragePostsPerUser() {
  const postsCount = await prisma.post.aggregate({
    _count: true,
  });
  const usersCount = await prisma.user.aggregate({
    _count: true
  });
  if (usersCount !== 0)
    return postsCount / usersCount;
  return 0;
}