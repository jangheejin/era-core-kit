// apps/site/app/api/admin/login/route.ts
//POST handler, check pw, check cookie (set/clear cookie)
// apps/site/app/api/admin/login/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const submittedPassword = body?.password as string | undefined;
  const expectedPassword = process.env.ADMIN_DEMO_PASSWORD;

  if (!expectedPassword) {
    return NextResponse.json(
      { error: "Server misconfigured: ADMIN_DEMO_PASSWORD not set." },
      { status: 500 },
    );
  }

  if (!submittedPassword || submittedPassword !== expectedPassword) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });

  // Very simple "session": just a flag cookie
  response.cookies.set("admin_demo", "1", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });

  return response;
}
