import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { message, language } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompts = {
      en: "You are an agricultural expert helping Ethiopian farmers. Provide practical, actionable advice for farming challenges.",
      am: "እርስዎ የኢትዮጵያ ገበሬዎችን የሚረዱ የግብርና ባለሙያ ነዎት። ለግብርና ችግሮች ተግባራዊ እና ጠቃሚ ምክር ይስጡ።",
      or: "Ati ogeessa qonnaa qonnaan bultoota Itoophiyaa gargaaru dha. Rakkoolee qonnaa irratti gorsa hojii irra ooluu fi bu'a qabeessa kenni.",
      ti: "ንስኻ ንሓረስቶት ኢትዮጵያ እትሕግዝ ኣፍላጣ ሕርሻ ኢኻ። ንጸገማት ሕርሻ ተግባራዊን ጠቓምን ምኽሪ ሃብ።",
    };

    const systemPrompt =
      systemPrompts[language as keyof typeof systemPrompts] || systemPrompts.en;
    const fullPrompt = `${systemPrompt}\n\nUser question: ${message}\n\nPlease respond in ${
      language === "am"
        ? "Amharic"
        : language === "or"
        ? "Afaan Oromoo"
        : language === "ti"
        ? "Tigrinya"
        : "English"
    } without shortening the response.`;

    const result = await model.generateContent(fullPrompt);
    const aiResponse = (await result.response).text();

    return NextResponse.json({ aiResponse });
  } catch (error) {
    console.error("Error generating AI response:", error);
    return NextResponse.json(
      {
        aiResponse: "Our experts will respond shortly. Please try again later.",
      },
      { status: 500 }
    );
  }
}
