import * as follow from "@/repos/follow";
import * as stats from "@/repos/statistics";
import * as user from "@/repos/user";

function formatAvg(n) {
  if (n == null || Number.isNaN(Number(n))) return "0.00";
  return Number(n).toFixed(2);
}

export async function GET() {
  try {
    const [raw, averageFollowersPerUserTotals] = await Promise.all([
      stats.getAverageFollowersPerUser(),
      stats.getAverageFollowersPerUserTotals(),
    ]);

    if (raw && typeof raw === "object" && "totalUsers" in raw) {
      const a = raw.averageFollowersPerUser;
      const averageFollowersPerUser =
        typeof a === "string" ? a : formatAvg(a);
      return Response.json({
        averageFollowersPerUser,
        averageFollowersPerUserTotals: formatAvg(averageFollowersPerUserTotals),
        totalFollowers: raw.totalFollowers,
        totalUsers: raw.totalUsers,
      });
    }

    const [totalFollowers, totalUsers] = await Promise.all([
      follow.getTotalFollowerCount(),
      user.getUserCount(),
    ]);

    return Response.json({
      averageFollowersPerUser: formatAvg(raw ?? 0),
      averageFollowersPerUserTotals: formatAvg(averageFollowersPerUserTotals),
      totalFollowers,
      totalUsers,
    });
  } catch (e) {
    console.error("GET /api/statistics/average-followers failed:", e);
    return Response.json(
      { error: "Unable to load average followers" },
      { status: 500 },
    );
  }
}
