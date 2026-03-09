import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client"; // Prisma import add karen

const prisma = new PrismaClient();
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 1. DATABASE CHECK (Fuzzy Search)
    // Yeh query database mein milta-julta answer dhoondti hai
    const localData: any[] = await prisma.$queryRaw`
      SELECT answer, similarity(answer, ${message}) as sim 
      FROM "KnowledgeBase" 
      WHERE similarity(answer, ${message}) > 0.1 
      ORDER BY sim DESC 
      LIMIT 1;
    `;

    let finalResponse = "";

    // 2. CHECK KARO AGAR DB MEIN ANSWER MIL GAYA
    if (localData.length > 0) {
      finalResponse = localData[0].answer;
    } else {
      // 3. AGAR DB MEIN NAHI HAI, TO GEMINI SE PUCHO
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(message);
      finalResponse = result.response.text();
    }

    return NextResponse.json({ text: finalResponse });
    
  } catch (error: any) {
    console.error("API ROUTE ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}