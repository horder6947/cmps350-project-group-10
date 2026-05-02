import * as followRepo from "@/repos/follow";
import * as postRepo from "@/repos/post";
import * as userRepo from "@/repos/user";

async function readProfile(id) {
  const profile = await userRepo.getUserProfile(id);
  if (!profile) return null;

  const [followersCount, followingCount, postsCount] = await Promise.all([
    followRepo.getFollowersCount(id),
    followRepo.getFollowingCount(id),
    postRepo.getUserPostsCount(id),
  ]);

  return {
    ...profile,
    followersCount: followersCount ?? 0,
    followingCount: followingCount ?? 0,
    postsCount: postsCount ?? 0,
  };
}

export async function GET(_request, context) {
  try {
    const params = await context.params;
    const id = params.id;
    if (!id)
      return Response.json({ error: "Missing user id" }, { status: 400 });

    const data = await readProfile(id);
    if (!data)
      return Response.json({ error: "User not found" }, { status: 404 });
    return Response.json(data);
  } catch (error) {
    console.error("GET /api/users/[id] failed:", error);
    return Response.json({ error: "Unable to load user" }, { status: 500 });
  }
}

export async function PATCH(request, context) {
  try {
    const params = await context.params;
    const id = params.id;
    if (!id)
      return Response.json({ error: "Missing user id" }, { status: 400 });

    const body = await request.json();
    const username =
      typeof body.username === "string" ? body.username.trim() : "";
    const bio = typeof body.bio === "string" ? body.bio : "";

    if (username) await userRepo.changeUsername(id, username);
    await userRepo.changeBio(id, bio);

    const data = await readProfile(id);
    if (!data)
      return Response.json({ error: "User not found" }, { status: 404 });
    return Response.json(data);
  } catch (error) {
    console.error("PATCH /api/users/[id] failed:", error);
    return Response.json({ error: "Unable to update user" }, { status: 500 });
  }
}
