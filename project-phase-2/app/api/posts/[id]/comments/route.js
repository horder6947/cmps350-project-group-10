import * as commentRepo from "@/repos/comment";

export async function GET(_request, context) {
  try {
    const params = await context.params;
    const postId = params.id;
    if (!postId) {
      return Response.json({ error: "post id is required" }, { status: 400 });
    }

    const comments = (await commentRepo.getCommentsByPostID(postId)) ?? [];
    return Response.json({ comments, commentsCount: comments.length });
  } catch (error) {
    console.error("GET /api/posts/[id]/comments failed:", error);
    return Response.json({ error: "Unable to load comments" }, { status: 500 });
  }
}

export async function POST(request, context) {
  try {
    const params = await context.params;
    const postId = params.id;
    const body = await request.json();
    const authorId =
      typeof body.authorId === "string" ? body.authorId.trim() : "";
    const comment = typeof body.comment === "string" ? body.comment.trim() : "";
    if (!postId || !authorId || !comment) {
      return Response.json(
        { error: "post id, authorId, and comment are required" },
        { status: 400 },
      );
    }

    const id = await commentRepo.commentOnPost(authorId, postId, comment);
    if (!id) {
      return Response.json({ error: "Could not add comment" }, { status: 500 });
    }

    const commentsCount =
      (await commentRepo.getCommentsByPostID(postId))?.length ?? 0;
    return Response.json({ id, commentsCount });
  } catch (error) {
    console.error("POST /api/posts/[id]/comments failed:", error);
    return Response.json({ error: "Unable to add comment" }, { status: 500 });
  }
}
