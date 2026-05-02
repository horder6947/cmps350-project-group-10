import * as userRepo from "@/repos/user";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const user = await userRepo.getUserByEmail(email);
    if (!user || user.password !== password) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    return Response.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error("POST /api/auth/login failed:", error);
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}
