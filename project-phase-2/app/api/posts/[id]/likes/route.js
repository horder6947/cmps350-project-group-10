import * as likeRepo from "@/repos/like";

export async function POST(request, context) {
  try {
    const params = await context.params;
    const postId = params.id;
    const body = await request.json();
    const userId = typeof body.userId === "string" ? body.userId.trim() : "";
    const action = typeof body.action === "string" ? body.action : "like";

    if (!postId || !userId) {
      return Response.json(
        { error: "post id and userId are required" },
        { status: 400 },
      );
    }

    const ok =
      action === "unlike"
        ? await likeRepo.unlikePost(postId, userId)
        : await likeRepo.likePost(postId, userId);

    if (!ok) {
      return Response.json({ error: `Could not ${action}` }, { status: 409 });
    }

    const likesCount = (await likeRepo.getLikeCount(postId)) ?? 0;
    return Response.json({ likesCount });
  } catch (error) {
    console.error("POST /api/posts/[id]/likes failed:", error);
    return Response.json({ error: "Unable to update like" }, { status: 500 });
  }
}
