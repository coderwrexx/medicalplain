import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const inputText = body.text;
    const targetLanguage = body.targetLanguage;
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{
        role: "user",
        content: "Translate this medical text to " + targetLanguage + ". Keep medical terms accurate. Return ONLY the translated text, nothing else:\n\n" + inputText
      }],
      max_tokens: 2000,
      temperature: 0.1,
    });
    const translated = response.choices[0].message.content || inputText;
    return NextResponse.json({ translated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ translated: "Translation failed" });
  }
}
