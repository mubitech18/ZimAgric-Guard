
import { GoogleGenAI } from "@google/genai";
import { PlantDiagnosis, Language } from "../types";

export const diagnosePlant = async (
  imageBase64: string, 
  location?: { latitude: number; longitude: number },
  language: Language = 'English',
  isPfumvudzaMode: boolean = false
): Promise<PlantDiagnosis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64,
          },
        },
        {
          text: `Act as a senior Zimbabwean agricultural expert from Agritex. 
          Analyze this plant image for the "ZimAgri-Guard" surveillance system.
          
          CONFIG:
          - Current Language: ${language}
          - Pfumvudza Mode: ${isPfumvudzaMode ? 'ON' : 'OFF'}
          - Target Location: Zimbabwe (near ${location?.latitude}, ${location?.longitude})

          TASKS:
          1. Identify the crop and its condition. Focus heavily on Maize diseases (Fall Armyworm, Maize Streak, Grey Leaf Spot) if applicable.
          2. If Pfumvudza Mode is ON, provide specific organic mulching and conservation advice.
          3. Find 3 nearest agro-dealers in Zimbabwe (Agricura, Windmill, ZFC, Farm & City) using Google Maps.
          4. Provide a summary in ${language} that is easy for a rural farmer to understand.

          FORMAT: Return ONLY a valid JSON object.
          {
            "plantName": string,
            "scientificName": string,
            "status": "Healthy" | "Diseased" | "Stressed",
            "confidenceScore": number,
            "conditionName": string,
            "description": string,
            "immediateActions": string[],
            "organicTreatment": string,
            "chemicalTreatment": string,
            "preventionTips": string[],
            "localLanguageSummary": string,
            "suppliers": [{ "name": string, "distance": string, "directionsUrl": string }]
          }`
        }
      ]
    },
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: location ? {
            latitude: location.latitude,
            longitude: location.longitude
          } : undefined
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");

  try {
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson) as PlantDiagnosis;

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks && parsed.suppliers) {
      parsed.suppliers = parsed.suppliers.map((s) => {
        const chunk = groundingChunks.find((c: any) => 
          c.maps?.title?.toLowerCase().includes(s.name.toLowerCase()) || 
          s.name.toLowerCase().includes(c.maps?.title?.toLowerCase())
        );
        if (chunk?.maps?.uri) return { ...s, directionsUrl: chunk.maps.uri };
        return s;
      });
    }

    return parsed;
  } catch (e) {
    console.error("Parse Error:", e, text);
    throw new Error("Unable to read diagnosis format.");
  }
};

export const translateText = async (text: string, targetLanguage: Language): Promise<string> => {
  if (targetLanguage === 'English') return text;
  
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite-preview',
    contents: `Translate the following farming text into ${targetLanguage}. Keep the tone professional but community-friendly: "${text}"`,
  });
  
  return response.text?.trim() || text;
};
