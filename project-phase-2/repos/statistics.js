import prisma from "@/repos/prisma";
import * as follow from "@/repos/follow";
import * as user from "@/repos/user";
import * as post from "@/repos/post";
import * as comment from "@/repos/comment";
import * as like from "@/repos/like";

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

// 1. Average number of followers per user 
// 2. ⁠average number of posts per user 
// 3. ⁠average likes per post
// 4. ⁠average comments per post
// 5. ⁠top 5 most liked posts
// 6. ⁠new users this month

export async function getAverageFollowersPerUser() {
  const followCount = await follow.getTotalFollowerCount();
  const usersCount = await user.getUserCount();
  if (usersCount !== 0)
    return followCount / usersCount;
  return 0;
}

export async function getAveragePostsPerUser() {
  const postsCount = await post.getTotalPostsCount()
  const usersCount = await user.getUserCount();
  if (usersCount !== 0)
    return postsCount / usersCount;
  return 0;
}

export async function getAverageLikesPerPost() {
  const likesCount = await like.getTotalLikes();
  const postsCount = await post.getTotalPostsCount();
  if (postsCount !== 0)
    return likesCount / postsCount;
  return 0;
}

export async function getAverageCommentsPerPost() {
  const commentsCount = await comment.getCommentsCount();
  const postsCount = await post.getTotalPostsCount()
  if (postsCount !== 0)
    return commentsCount / postsCount;
  return 0;
}

export async function getMostLikedPosts(p_count) {
  try {
    const result = await prisma.post.findMany({
      select: {
        id: true,
        post_content: true,
        date_created: true,
        author: {
          select: {
            id: true,
            username: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      take: p_count,
      orderBy: {
        likes: {
          _count: "desc"
        }
      },
    });
    // Transform to rename and flatten _count
    return result.map(post => ({
      ...post,
      likesCount: post._count.likes,
      _count: undefined // Remove the original _count object
    }));
  } catch (e) { console.error(e); }
}

export async function getNewUsers() {
  try {
    const result = await prisma.user.findMany({
      where: {
        date_created: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });
    return result;
  } catch (e) { console.error(e); }
}