import { getAverageFollowersPerUser } from "@/repos/statistics";


export async function GET() {

  try {
    
    const stats = await getAverageFollowersPerUser();

    return Response.json(stats);


  }
  
  catch (err) {
    
    console.error("GET /api/statistics/average-followers failed:", err);

    
    return Response.json({ error: "Unable to load average followers" }, { status: 500 });
  }
}
