import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, mimeType } = await request.json();
    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [{
        role: "user",
        content: [
          { type: "image_url", image_url: { url: `data:${mimeType || "image/jpeg"};base64,${imageBase64}` } },
          { type: "text", text: "Analyze this medical document. Return ONLY valid JSON no extra text: {\"documentType\":\"prescription or lab_report\",\"summary\":\"one sentence\",\"medications\":[{\"name\":\"\",\"purpose\":\"\",\"dosage\":\"\",\"sideEffects\":[],\"importantNote\":\"\"}],\"labValues\":[{\"testName\":\"\",\"value\":\"\",\"status\":\"normal or low or high\",\"plainExplanation\":\"\",\"normalRange\":\"\"}],\"redFlags\":[],\"questionsToAsk\":[],\"disclaimer\":\"Consult your doctor.\"}" }
        ]
      }],
      max_tokens: 2000,
    });
    const text = response.choices[0].message.content || "";
    const cleaned = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleaned);
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to analyze" }, { status: 500 });
  }
}
