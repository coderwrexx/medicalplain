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
          { type: "text", text: "You are a senior MBBS doctor with 20 years experience. Analyze this medical document with maximum clinical detail. Return ONLY valid JSON: {\"documentType\":\"prescription or lab_report\",\"patientSummary\":\"brief context\",\"overallHealthStatus\":\"good or concerning or critical\",\"overallRiskScore\":\"low or medium or high\",\"summary\":\"2-3 sentence professional summary\",\"medications\":[{\"name\":\"\",\"genericName\":\"\",\"drugClass\":\"\",\"purpose\":\"\",\"howItWorks\":\"\",\"dosage\":\"\",\"frequency\":\"\",\"bestTimeToTake\":\"\",\"withFood\":true,\"sideEffects\":{\"common\":[],\"serious\":[],\"riskPercentage\":\"\"},\"warnings\":[],\"drugInteractions\":[],\"overdoseRisk\":\"low or medium or high\",\"addictionRisk\":\"none or low or medium or high\",\"pregnancySafe\":\"\",\"importantNote\":\"\",\"missedDoseInstruction\":\"\",\"storageInstructions\":\"\"}],\"labValues\":[{\"testName\":\"\",\"value\":\"\",\"status\":\"normal or borderline or low or high or critical\",\"deviation\":\"\",\"normalRange\":\"\",\"plainExplanation\":\"\",\"organAffected\":\"\",\"possibleCauses\":[],\"urgencyLevel\":\"routine or soon or urgent or emergency\",\"whatToMonitor\":\"\"}],\"drugInteractionWarnings\":[],\"dietaryRestrictions\":[],\"lifestyleAdvice\":[],\"redFlags\":[{\"flag\":\"\",\"urgency\":\"monitor or see doctor soon or emergency\",\"reason\":\"\"}],\"followUpRecommendations\":[],\"questionsToAsk\":[],\"disclaimer\":\"This is for educational purposes only. Always consult your doctor.\"}" }
        ]
      }],
      max_tokens: 4000,
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
