import * as stats from "@/repos/statistics";

function round2(n) {
  return Number(Number(n).toFixed(2));
}

export async function GET() {
  try {
    const [
      followerSummary,
      avgPostsRaw,
      avgLikesRaw,
      avgCommentsRaw,
      topPosts,
      newUsers,
    ] = await Promise.all([
      stats.getFollowerSummary(),
      stats.getAveragePostsPerUser(),
      stats.getAverageLikesPerPost(),
      stats.getAverageCommentsPerPost(),
      stats.getMostLikedPosts(5),
      stats.getNewUsers(),
    ]);

    return Response.json({
      ...followerSummary,
      averagePostsPerUser: round2(avgPostsRaw),
      averageLikesPerPost: round2(avgLikesRaw),
      averageCommentsPerPost: round2(avgCommentsRaw),
      topPosts: topPosts ?? [],
      newUsersThisMonth: Array.isArray(newUsers) ? newUsers.length : 0,
    });
  } catch (err) {
    console.error("GET /api/statistics failed:", err);
    return Response.json(
      { error: "Unable to load statistics" },
      { status: 500 },
    );
  }
}
