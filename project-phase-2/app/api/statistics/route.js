import * as stats from "@/repos/statistics";

function round2(n) {
  return Number(Number(n).toFixed(2));
}

function parseTopN(request) {
  const { searchParams } = new URL(request.url);
  let n = Number(searchParams.get("topN") ?? "5");
  if (!Number.isFinite(n)) n = 5;
  return Math.min(Math.max(Math.floor(n), 1), 20);
}

export async function GET(request) {
  try {
    const topN = parseTopN(request);
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
      stats.getMostLikedPosts(topN),
      stats.getNewUsers(),
    ]);

    return Response.json({
      ...followerSummary,
      averagePostsPerUser: round2(avgPostsRaw),
      averageLikesPerPost: round2(avgLikesRaw),
      averageCommentsPerPost: round2(avgCommentsRaw),
      topPosts: topPosts ?? [],
      topPostsCount: topN,
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
