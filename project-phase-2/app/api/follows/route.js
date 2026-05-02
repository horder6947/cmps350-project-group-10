import * as followRepo from "@/repos/follow";

export async function POST(request) {
  try {
    const body = await request.json();
    const followerId =
      typeof body.followerId === "string" ? body.followerId.trim() : "";
    const followeeId =
      typeof body.followeeId === "string" ? body.followeeId.trim() : "";
    if (!followerId || !followeeId) {
      return Response.json(
        { error: "followerId and followeeId are required" },
        { status: 400 },
      );
    }
    if (followerId === followeeId) {
      return Response.json(
        { error: "Cannot follow yourself" },
        { status: 400 },
      );
    }

    const ok = await followRepo.follow(followerId, followeeId);
    if (!ok) {
      return Response.json({ error: "Could not follow user" }, { status: 409 });
    }

    const followersCount =
      (await followRepo.getFollowersCount(followeeId)) ?? 0;
    return Response.json({ followed: true, followersCount });
  } catch (error) {
    console.error("POST /api/follows failed:", error);
    return Response.json({ error: "Unable to follow" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const followerId = searchParams.get("followerId")?.trim() || "";
    const followeeId = searchParams.get("followeeId")?.trim() || "";
    if (!followerId || !followeeId) {
      return Response.json(
        { error: "followerId and followeeId are required" },
        { status: 400 },
      );
    }

    const ok = await followRepo.unfollow(followerId, followeeId);
    if (!ok) {
      return Response.json(
        { error: "Could not unfollow user" },
        { status: 409 },
      );
    }

    const followersCount =
      (await followRepo.getFollowersCount(followeeId)) ?? 0;
    return Response.json({ followed: false, followersCount });
  } catch (error) {
    console.error("DELETE /api/follows failed:", error);
    return Response.json({ error: "Unable to unfollow" }, { status: 500 });
  }
}
