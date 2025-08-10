import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { message, language } = await request.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompts = {
      en: "You are an agricultural expert helping Ethiopian farmers. Provide practical, actionable advice for farming challenges. Keep responses concise and helpful. Respond ONLY in English.",
      am: "እርስዎ የኢትዮጵያ ገበሬዎችን የሚረዱ የግብርና ባለሙያ ነዎት። ለግብርና ችግሮች ተግባራዊ እና ጠቃሚ ምክር ይስጡ። ምላሾች አጭርና በአማርኛ ብቻ ይሁኑ።",
      or: "Ati ogeessa qonnaa qonnaan bultoota Itoophiyaa gargaaru dha. Rakkoolee qonnaa irratti gorsa hojii irra ooluu fi bu'a qabeessa kenni. Deebii gabaabaa fi faayidaa qabeessa taasisii. Afaan Oromoo qofa deebisi.",
      ti: "ንስኻ ንሓረስቶት ኢትዮጵያ እትሕግዝ ኣፍላጣ ሕርሻ ኢኻ። ንጸገማት ሕርሻ ተግባራዊን ጠቓምን ምኽሪ ሃብ። መልስታት ብትግርኛ ብቻ እዩ።"
    };

    const systemPrompt = systemPrompts[language as keyof typeof systemPrompts] || systemPrompts.en;
    const fullPrompt = `${systemPrompt}\n\nUser question: ${message}\n\nPlease respond ONLY in ${
      language === 'am' ? 'Amharic' :
      language === 'or' ? 'Afaan Oromoo' :
      language === 'ti' ? 'Tigrinya' : 'English'
    }.`

    const result = await model.generateContent(fullPrompt);
    let aiResponse = (await result.response).text();

    // Remove all ** marks from response (markdown bold)
    aiResponse = aiResponse.replace(/\*\*/g, '');

    return NextResponse.json({ aiResponse });
  } catch (error) {
    console.error('Error generating AI response:', error);
    return NextResponse.json({
      aiResponse: "Our experts will respond shortly. Please try again later."
    }, { status: 500 });
  }
}
