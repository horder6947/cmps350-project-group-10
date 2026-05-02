import * as comment from "@/repos/comment";
import * as follow from "@/repos/follow";
import * as like from "@/repos/like";
import * as post from "@/repos/post";
import prisma from "@/repos/prisma";
import * as user from "@/repos/user";

// 1. Average number of followers per user
// 2. ⁠average number of posts per user
// 3. ⁠average likes per post
// 4. ⁠average comments per post
// 5. ⁠top 5 most liked posts
// 6. ⁠new users this month

/** Totals used by the statistics UI (follow rows = follow relationships in DB). */
export async function getFollowerSummary() {
  const [totalFollowRelations, totalUsers] = await Promise.all([
    follow.getTotalFollowerCount(),
    user.getUserCount(),
  ]);
  const averageFollowersPerUser =
    totalUsers !== 0
      ? Number((totalFollowRelations / totalUsers).toFixed(2))
      : 0;
  return {
    averageFollowersPerUser,
    totalFollowers: totalFollowRelations,
    totalUsers,
  };
}

export async function getAverageFollowersPerUser() {
  const s = await getFollowerSummary();
  return s.averageFollowersPerUser;
}

export async function getAveragePostsPerUser() {
  const postsCount = await post.getTotalPostsCount();
  const usersCount = await user.getUserCount();
  if (usersCount !== 0) return postsCount / usersCount;
  return 0;
}

export async function getAverageLikesPerPost() {
  const likesCount = await like.getTotalLikes();
  const postsCount = await post.getTotalPostsCount();
  if (postsCount !== 0) return likesCount / postsCount;
  return 0;
}

export async function getAverageCommentsPerPost() {
  const commentsCount = await comment.getCommentsCount();
  const postsCount = await post.getTotalPostsCount();
  if (postsCount !== 0) return commentsCount / postsCount;
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
            username: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      take: p_count,
      orderBy: {
        likes: {
          _count: "desc",
        },
      },
    });
    return result.map((row) => ({
      id: row.id,
      post_content: row.post_content,
      date_created: row.date_created,
      author: row.author,
      likesCount: row._count.likes,
      commentsCount: row._count.comments,
    }));
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getNewUsers() {
  try {
    const result = await prisma.user.findMany({
      where: {
        date_created: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });
    return result;
  } catch (e) {
    console.error(e);
    return [];
  }
}
