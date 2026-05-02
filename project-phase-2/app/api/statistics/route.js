import * as follow from "@/repos/follow";
import * as stats from "@/repos/statistics";
import * as user from "@/repos/user";

function formatAvg(n) {
  if (n == null || Number.isNaN(Number(n))) return "0.00";
  return Number(n).toFixed(2);
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const topRaw = url.searchParams.get("top");
    const top = Math.min(50, Math.max(1, parseInt(topRaw ?? "5", 10) || 5));

    const rawFollowers = await stats.getAverageFollowersPerUser();

    let averageFollowersPerUser;
    let totalFollowers;
    let totalUsers;
    if (
      rawFollowers &&
      typeof rawFollowers === "object" &&
      "totalUsers" in rawFollowers
    ) {
      const a = rawFollowers.averageFollowersPerUser;
      averageFollowersPerUser =
        typeof a === "string" ? a : formatAvg(a);
      totalFollowers = rawFollowers.totalFollowers;
      totalUsers = rawFollowers.totalUsers;
    } else {
      const [tf, tu] = await Promise.all([
        follow.getTotalFollowerCount(),
        user.getUserCount(),
      ]);
      totalFollowers = tf;
      totalUsers = tu;
      averageFollowersPerUser = formatAvg(rawFollowers ?? 0);
    }

    const [
      averageFollowersPerUserTotals,
      averagePostsPerUser,
      averageLikesPerPost,
      averageCommentsPerPost,
      topLikedPosts,
      newUsers,
    ] = await Promise.all([
      stats.getAverageFollowersPerUserTotals(),
      stats.getAveragePostsPerUser(),
      stats.getAverageLikesPerPost(),
      stats.getAverageCommentsPerPost(),
      stats.getMostLikedPosts(top),
      stats.getNewUsers(),
    ]);

    return Response.json({
      averageFollowersPerUser,
      totalFollowers,
      totalUsers,
      averageFollowersPerUserTotals: formatAvg(averageFollowersPerUserTotals),
      averagePostsPerUser: formatAvg(averagePostsPerUser),
      averageLikesPerPost: formatAvg(averageLikesPerPost),
      averageCommentsPerPost: formatAvg(averageCommentsPerPost),
      topLikedPosts: topLikedPosts ?? [],
      topLikedLimit: top,
      newUsersCount: Array.isArray(newUsers) ? newUsers.length : 0,
    });
  } catch (e) {
    console.error("GET /api/statistics failed:", e);
    return Response.json({ error: "Unable to load statistics" }, { status: 500 });
  }
}
