import { getFollowerSummary } from "@/repos/statistics";

export async function GET() {
  try {
    const data = await getFollowerSummary();
    return Response.json(data);
  } catch (err) {
    console.error("GET /api/statistics/average-followers failed:", err);
    return Response.json({ error: "Unable to load average followers" }, { status: 500 });
  }
}
