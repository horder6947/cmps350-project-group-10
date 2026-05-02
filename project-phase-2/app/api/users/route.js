import * as followRepo from "@/repos/follow";
import * as postRepo from "@/repos/post";
import * as userRepo from "@/repos/user";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const viewerId = searchParams.get("viewerId")?.trim() || "";

    const users = await userRepo.getAllUsers();
    const followingSet = new Set();

    if (viewerId) {
      const following = (await followRepo.getFollowing(viewerId)) ?? [];
      for (const row of following) followingSet.add(row.followee_id);
    }

    const enriched = await Promise.all(
      users.map(async (u) => {
        const [followersCount, followingCount, postsCount] = await Promise.all([
          followRepo.getFollowersCount(u.id),
          followRepo.getFollowingCount(u.id),
          postRepo.getUserPostsCount(u.id),
        ]);
        return {
          ...u,
          followersCount: followersCount ?? 0,
          followingCount: followingCount ?? 0,
          postsCount: postsCount ?? 0,
          isFollowing: followingSet.has(u.id),
        };
      }),
    );

    return Response.json({ users: enriched });
  } catch (error) {
    console.error("GET /api/users failed:", error);
    return Response.json({ error: "Unable to load users" }, { status: 500 });
  }
}
