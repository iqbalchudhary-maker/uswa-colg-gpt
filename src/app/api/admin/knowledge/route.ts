import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET Request: Data fetch karne ke liye
export async function GET() {
  try {
    const data = await prisma.knowledgeBase.findMany();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// POST Request: Naya data add karne ke liye
export async function POST(req: Request) {
  try {
    const { question, answer } = await req.json();
    const newItem = await prisma.knowledgeBase.create({ data: { question, answer } });
    return NextResponse.json(newItem);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

// PUT Request: Data update karne ke liye
export async function PUT(req: Request) {
  try {
    const { id, question, answer } = await req.json();
    const updated = await prisma.knowledgeBase.update({
      where: { id },
      data: { question, answer }
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE Request: Data remove karne ke liye
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    await prisma.knowledgeBase.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}