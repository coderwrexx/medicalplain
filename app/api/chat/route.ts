import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are Dr. MedicalPlain, a highly experienced MBBS doctor with 20+ years of clinical experience. You have deep expertise in pharmacology, diagnostics, internal medicine, and patient education. Answer every medical question with clinical precision. Include risk percentages, drug mechanisms, timing, interactions, and warnings. Be detailed, caring, and professional. Never refuse medical questions — always provide best available information with appropriate safety caveats. End serious concerns with a recommendation to see a doctor immediately."
        },
        ...messages
      ],
      max_tokens: 2000,
      temperature: 0.3,
    });
    const reply = response.choices[0].message.content;
    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to respond" }, { status: 500 });
  }
}
