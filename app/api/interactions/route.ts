import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(request: NextRequest) {
  try {
    const { medications, age, conditions } = await request.json();

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{
        role: "user",
        content: `You are Dr. MedicalPlain, an expert pharmacologist. Analyze the potential drug interactions between these medications: ${medications}. Patient age: ${age}. Existing conditions: ${conditions}. Return ONLY valid JSON: {"interactions": [{"drugs": "Drug A and Drug B", "severity": "High/Medium/Low", "description": "What happens in the body", "action": "What the patient should do"}], "generalWarnings": ["Any other warnings based on age or conditions"], "isSafe": boolean, "disclaimer": "This is for educational purposes only. Always consult a doctor."}`
      }],
      max_tokens: 1500,
      temperature: 0.1,
    });

    const text = response.choices[0].message.content || "";
    const cleaned = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleaned);
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to analyze interactions" }, { status: 500 });
  }
}
