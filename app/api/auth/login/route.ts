import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { verifyUser } from "@/server/user/user.service";

const LoginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = LoginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const user = await verifyUser(parsed.data.username, parsed.data.password);

  if (!user) {
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 }
    );
  }

  const token = jwt.sign(
    {
      sub: user.id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return NextResponse.json({
    accessToken: token,
    user,
  });
}
