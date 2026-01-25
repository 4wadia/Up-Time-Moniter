import { GoogleGenAI, Type } from "@google/genai";
import { Service, IncidentAnalysis } from "../types";

// SECURITY WARNING: This exposes the API key in the client-side bundle.
// In a production environment, this should be proxied through a backend service.
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.warn("Gemini Service: API_KEY is missing. AI analysis will fail.");
} else {
  // console.warn("Gemini Service: API_KEY is present in client bundle. Ensure this is a public/restricted key or move logic to backend.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const analyzeIncident = async (service: Service, errorLog: string): Promise<IncidentAnalysis> => {
  try {
    const model = 'gemini-3-flash-preview';

    const prompt = `
      You are a Site Reliability Engineer (SRE) expert. 
      Analyze the following incident for service "${service.name}" (${service.url}).
      
      Error Log:
      ${errorLog}
      
      Provide a structured analysis including root cause, impact, suggested fix, and estimated resolution time.
      Keep it concise and technical.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rootCause: { type: Type.STRING, description: "The technical root cause of the failure" },
            impact: { type: Type.STRING, description: "Business and technical impact analysis" },
            suggestedFix: { type: Type.STRING, description: "Step-by-step remediation plan" },
            estimatedResolutionTime: { type: Type.STRING, description: "Estimated time to fix" }
          },
          required: ["rootCause", "impact", "suggestedFix", "estimatedResolutionTime"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as IncidentAnalysis;
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return {
      rootCause: "Analysis failed",
      impact: "Unknown",
      suggestedFix: "Check manual logs",
      estimatedResolutionTime: "Unknown"
    };
  }
};