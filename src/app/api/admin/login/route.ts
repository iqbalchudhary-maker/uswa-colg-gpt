import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { username, password } = await req.json();
  
  const admin = await prisma.admin.findUnique({
    where: { username }
  });

  // Simple match (Note: Real projects mein password hashing use karein)
  if (admin && admin.password === password) {
    return NextResponse.json({ success: true });
  }
  
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}