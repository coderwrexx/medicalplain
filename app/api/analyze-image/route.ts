import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, mimeType, scanType } = await request.json();
    const prompts: any = {
      skin: "You are a consultant dermatologist. Analyze this skin photo: 1) Visual characteristics 2) Most likely diagnosis with confidence % 3) Severity 4) Possible causes 5) Immediate care 6) When to see a doctor urgently 7) Treatment options in India.",
      eye: "You are an ophthalmologist. Analyze this eye photo: 1) Visual findings 2) Most likely condition 3) Severity 4) Immediate treatment 5) When to see a doctor urgently.",
      tongue: "Analyze this tongue photo for health indicators: 1) Color and coating 2) Health indicators 3) Possible deficiencies 4) Recommendations.",
      nail: "Analyze these nail changes: 1) Visual changes 2) Conditions they indicate 3) Nutritional deficiencies 4) When to seek care.",
      wound: "You are an emergency physician. Analyze this wound: 1) Type and severity 2) Infection signs 3) First aid steps 4) Whether stitches needed 5) When to go to emergency.",
      xray: "You are a radiologist. Analyze this medical image: 1) Observations 2) Any abnormalities 3) Clinical significance 4) Recommendations. Note: preliminary AI analysis only.",
    };
    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [{ role: "user", content: [{ type: "image_url", image_url: { url: `data:${mimeType};base64,${imageBase64}` } }, { type: "text", text: prompts[scanType] || prompts.skin }] }],
      max_tokens: 1500,
    });
    const result = response.choices[0].message.content || "Analysis failed";
    return NextResponse.json({ result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ result: "Analysis failed. Please try again." });
  }
}
