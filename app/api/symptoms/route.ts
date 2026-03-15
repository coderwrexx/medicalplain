import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(request: NextRequest) {
  try {
    const { symptoms, duration, age, gender } = await request.json();

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{
        role: "user",
        content: `You are Dr. MedicalPlain. Analyze these symptoms: ${symptoms}. Duration: ${duration}. Patient: ${age}yo ${gender}. Return ONLY valid JSON: {"possibleConditions": [{"condition": "Name", "probability": "High/Medium/Low", "description": "Brief explanation"}], "urgencyLevel": "Routine/Soon/Urgent/Emergency", "recommendation": "What to do next", "redFlags": ["Any alarming signs to watch for"], "disclaimer": "Consult a doctor."}`
      }],
      max_tokens: 1500,
      temperature: 0.2,
    });

    const text = response.choices[0].message.content || "";
    const cleaned = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleaned);
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to analyze symptoms" }, { status: 500 });
  }
}
