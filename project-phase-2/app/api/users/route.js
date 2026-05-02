import * as followRepo from "@/repos/follow";
import prisma from "@/repos/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const viewerId = searchParams.get("viewerId")?.trim() || "";

    const [users, followingRows] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          username: true,
          bio: true,
          date_created: true,
          _count: {
            select: {
              followers: true,
              following: true,
              posts: true,
            },
          },
        },
        orderBy: { date_created: "desc" },
      }),
      viewerId ? followRepo.getFollowing(viewerId) : Promise.resolve([]),
    ]);

    const followingSet = new Set(
      (followingRows ?? []).map((r) => r.followee_id),
    );

    const enriched = users.map((u) => ({
      id: u.id,
      username: u.username,
      bio: u.bio,
      date_created: u.date_created,
      followersCount: u._count.followers,
      followingCount: u._count.following,
      postsCount: u._count.posts,
      isFollowing: followingSet.has(u.id),
    }));

    return Response.json({ users: enriched });
  } catch (error) {
    console.error("GET /api/users failed:", error);
    return Response.json({ error: "Unable to load users" }, { status: 500 });
  }
}
