import * as userRepo from "@/repos/user";

export async function POST(request) {
  try {
    const body = await request.json();
    const username =
      typeof body.username === "string" ? body.username.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!username || !email || !password) {
      return Response.json(
        { error: "Username, email, and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return Response.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    const id = await userRepo.newUser(username, email, password);
    if (!id) {
      return Response.json(
        { error: "Could not register (email may already be used)" },
        { status: 409 },
      );
    }

    const profile = await userRepo.getUserProfile(id);
    return Response.json({
      user: {
        id: profile.id,
        username: profile.username,
        email: profile.email,
        bio: profile.bio,
      },
    });
  } catch (error) {
    console.error("POST /api/auth/register failed:", error);
    return Response.json({ error: "Registration failed" }, { status: 500 });
  }
}
