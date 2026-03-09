import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const data = await prisma.knowledgeBase.findMany();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { question, answer } = await req.json();
  const res = await prisma.knowledgeBase.create({ data: { question, answer } });
  return NextResponse.json(res);
}

export async function PUT(req: Request) {
  const { id, question, answer } = await req.json();
  const res = await prisma.knowledgeBase.update({ where: { id }, data: { question, answer } });
  return NextResponse.json(res);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  await prisma.knowledgeBase.delete({ where: { id } });
  return NextResponse.json({ success: true });
}