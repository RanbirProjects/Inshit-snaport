
import { GoogleGenAI, Type } from "@google/genai";
import { InsightData } from "../types";

const SYSTEM_INSTRUCTION = `
You are a High-Performance Executive Analyst.
Role: Analyze professional reflections to extract structural intelligence.
Tone: Clinical, objective, executive-level.
Structure:
- 'summary': 1-2 lines of situational synthesis.
- 'themes': 3-5 organizational/behavioral patterns.
- 'toneSignal': One precise evocative word.
- 'reflectionPrompts': 2 tactical inquiry prompts.
- 'riskNote': Potential professional liability observation.
Constraints: NO conversational filler. NO AI mentions.
`;

export const generateInsight = async (reflection: string): Promise<InsightData> => {
  // Use a fresh instance to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: reflection,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            themes: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            toneSignal: { type: Type.STRING },
            reflectionPrompts: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            riskNote: { type: Type.STRING, nullable: true }
          },
          required: ["summary", "themes", "toneSignal", "reflectionPrompts"]
        }
      },
    });

    const text = response.text;
    if (!text) throw new Error("SYSTEM_EMPTY_STREAM");
    return JSON.parse(text.trim()) as InsightData;
  } catch (error: any) {
    const errString = JSON.stringify(error).toUpperCase();
    
    // Catch-all for API Key issues to trigger the Key Selection UI
    if (
      errString.includes("API_KEY_INVALID") || 
      errString.includes("400") || 
      errString.includes("INVALID_ARGUMENT") ||
      errString.includes("UNAUTHORIZED")
    ) {
      throw new Error("AUTH_KEY_EXPIRED_OR_INVALID");
    }
    
    throw error;
  }
};
