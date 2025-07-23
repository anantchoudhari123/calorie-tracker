import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { query } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;

  const prompt = `Give me an estimate of total calories and protein in this meal. Respond with only JSON in this format: {"calories": X, "protein": Y}. Meal: ${query}`;

  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    }),
  });

  const data = await res.json();
  try {
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const result = JSON.parse(text);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ calories: 0, protein: 0 });
  }
}