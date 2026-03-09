import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const history = await prisma.chatHistory.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}