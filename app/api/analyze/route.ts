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
          { type: "text", text: `You are a senior MBBS doctor with 25 years experience in India. You are expert at reading Indian doctor handwriting including:
- Abbreviated drug names (Tab., Cap., Syr., Inj., Oint.)
- Common Indian shorthand (OD=once daily, BD=twice daily, TDS=thrice daily, QID=4 times, HS=bedtime, AC=before food, PC=after food, SOS=as needed)
- Generic Indian brand names (Crocin, Dolo, Pan, Rantac, Metformin, Glycomet, Ecosprin, Stamlo, etc.)
- Illegible cursive — use context clues from surrounding text to decode
- Common Indian diagnosis abbreviations (HTN=hypertension, DM=diabetes mellitus, IHD=ischemic heart disease, URTI=upper respiratory infection)

Analyze this medical document with MAXIMUM clinical detail. If handwriting is unclear, make your best clinical interpretation based on context and note "possibly" for uncertain readings.

Return ONLY valid JSON:
{
  "documentType": "prescription or lab_report or discharge_summary",
  "patientSummary": "name, age, gender if visible",
  "overallHealthStatus": "good or concerning or critical",
  "overallRiskScore": "low or medium or high",
  "summary": "2-3 sentence professional summary in simple English",
  "handwritingNotes": "any parts that were difficult to read and how they were interpreted",
  "medications": [
    {
      "name": "exact drug name decoded",
      "genericName": "generic name",
      "drugClass": "drug class",
      "purpose": "what condition it treats in plain English",
      "howItWorks": "simple mechanism explanation",
      "dosage": "exact dose",
      "frequency": "how many times per day",
      "frequencyCode": "OD or BD or TDS or QID or HS or SOS",
      "duration": "how many days",
      "bestTimeToTake": "morning/night/with food/empty stomach",
      "withFood": true,
      "reminderTimes": ["08:00"],
      "sideEffects": {
        "common": ["side effect 1", "side effect 2"],
        "serious": ["serious side effect"],
        "riskPercentage": "X% of patients experience side effects"
      },
      "warnings": ["warning 1"],
      "drugInteractions": ["interaction 1"],
      "overdoseRisk": "low or medium or high",
      "addictionRisk": "none or low or medium or high",
      "pregnancySafe": "safe or avoid or consult doctor",
      "importantNote": "most critical thing to know",
      "missedDoseInstruction": "what to do if missed",
      "storageInstructions": "how to store"
    }
  ],
  "labValues": [
    {
      "testName": "full test name",
      "value": "result with unit",
      "status": "normal or borderline or low or high or critical",
      "deviation": "how far from normal in %",
      "normalRange": "reference range",
      "plainExplanation": "what this means in everyday language",
      "organAffected": "which organ this relates to",
      "possibleCauses": ["cause 1", "cause 2"],
      "urgencyLevel": "routine or soon or urgent or emergency",
      "whatToMonitor": "symptoms to watch for"
    }
  ],
  "drugInteractionWarnings": ["interaction warning"],
  "dietaryRestrictions": ["avoid X"],
  "lifestyleAdvice": ["advice 1"],
  "redFlags": [
    {
      "flag": "concern description",
      "urgency": "monitor or see doctor soon or emergency",
      "reason": "why this is concerning"
    }
  ],
  "followUpRecommendations": ["follow up 1"],
  "questionsToAsk": ["question 1", "question 2", "question 3", "question 4", "question 5"],
  "disclaimer": "This analysis is for educational purposes only. Always consult your doctor before making any medical decisions."
}` }
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
    return NextResponse.json({ error: "Failed to analyze document" }, { status: 500 });
  }
}
