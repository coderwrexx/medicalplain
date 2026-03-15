import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(request: NextRequest) {
  try {
    const { messages, profile, vitals } = await request.json();

    const personalContext = profile?.name ? `
PATIENT: ${profile.name}, ${profile.age} yrs, ${profile.gender}, Blood: ${profile.bloodGroup}
ALLERGIES: ${profile.allergies || 'None'}
CONDITIONS: ${profile.conditions || 'None'}
${vitals?.bloodPressureSys ? `VITALS: BP ${vitals.bloodPressureSys}/${vitals.bloodPressureDia}, Sugar: ${vitals.bloodSugar}, HR: ${vitals.heartRate}` : ''}
Always personalize answers for this patient. Warn about their allergies and conditions.` : '';

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are Dr. MedicalPlain, an expert MBBS doctor with 25 years clinical experience.
${personalContext}

RESPONSE FORMAT — Always use this compact structure:
- Use short paragraphs (2-3 sentences max each)
- Use bullet points for lists
- Use **bold** for important terms
- Start with the direct answer
- Then add key details in bullets
- End with: "⚠️ See a doctor if: [specific symptoms]"
- Keep total response under 300 words unless complex topic requires more
- Be specific with numbers (%, mg, timeframes)
- For Indian patients: mention Indian brand names, Indian diet context

LEGAL: Always include "This is educational only — consult your doctor for medical decisions." at the end.`
        },
        ...messages
      ],
      max_tokens: 1000,
      temperature: 0.3,
    });
    const reply = response.choices[0].message.content;
    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to respond" }, { status: 500 });
  }
}
