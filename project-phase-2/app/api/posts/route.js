import * as postRepo from "@/repos/post";
import prisma from "@/repos/prisma";

function mapPost(row, likedByMe = false) {
  return {
    id: row.id,
    post_content: row.post_content,
    date_created: row.date_created,
    author: row.author,
    likesCount: row._count?.likes ?? 0,
    commentsCount: row._count?.comments ?? 0,
    likedByMe,
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get("authorId");
    const viewerId = searchParams.get("viewerId")?.trim() || "";
    const followingOnly = searchParams.get("followingOnly") === "1";
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 50, 1),
      100,
    );

    const rows = authorId
      ? await postRepo.getPostsByAuthorForFeed(authorId, limit)
      : followingOnly && viewerId
        ? await postRepo.getFollowingPostsForFeed(viewerId, limit)
        : await postRepo.getPostsForFeed(limit);

    const likedByPostId = new Set();
    if (viewerId && rows.length > 0) {
      const likes = await prisma.like.findMany({
        where: {
          liker_id: viewerId,
          post_id: { in: rows.map((r) => r.id) },
        },
        select: { post_id: true },
      });
      for (const row of likes) likedByPostId.add(row.post_id);
    }

    return Response.json({
      posts: rows.map((row) => mapPost(row, likedByPostId.has(row.id))),
    });
  } catch (error) {
    console.error("GET /api/posts failed:", error);
    return Response.json({ error: "Unable to load posts" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const authorId =
      typeof body.authorId === "string" ? body.authorId.trim() : "";
    const post_content =
      typeof body.post_content === "string" ? body.post_content.trim() : "";

    if (!authorId || !post_content) {
      return Response.json(
        { error: "authorId and post_content are required" },
        { status: 400 },
      );
    }

    const id = await postRepo.createPost(authorId, post_content);
    if (!id) {
      return Response.json({ error: "Could not create post" }, { status: 500 });
    }

    return Response.json({ id });
  } catch (error) {
    console.error("POST /api/posts failed:", error);
    return Response.json({ error: "Unable to create post" }, { status: 500 });
  }
}
