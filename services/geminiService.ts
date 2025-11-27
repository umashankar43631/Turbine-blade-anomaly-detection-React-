import { GoogleGenAI, Type } from "@google/genai";
import { InspectionResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// We define the schema here to guide the model's JSON output strictly
const schema = {
  type: Type.OBJECT,
  properties: {
    hasDefects: { type: Type.BOOLEAN },
    bladeConditionScore: { type: Type.NUMBER, description: "A score from 0 to 100 representing the overall health of the blade. 100 is perfect, 0 is destroyed." },
    summary: { type: Type.STRING, description: "A concise executive summary of the inspection findings." },
    defects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { 
            type: Type.STRING, 
            description: "Must be one of: Surface Crack (Paint/Gelcoat), Leading Edge Erosion (Paint/Gelcoat), Leading Edge Erosion (Laminate), Laminate Crack, Lightning Defect (Laminate Level), Lightning Defect (Tip Opened), Laminate Defect (Till Core/Through Laminate), Surface Level Erosion, Dust Accumulation, or Other." 
          },
          severity: { type: Type.STRING, description: "Low, Medium, High, or Critical" },
          confidence: { type: Type.NUMBER, description: "Confidence score 0-100" },
          location: { type: Type.STRING, description: "Where on the blade this is located (e.g., Tip, Root, Trailing Edge, Leading Edge)" },
          description: { type: Type.STRING, description: "Detailed visual description of the specific defect found." },
          recommendation: { type: Type.STRING, description: "Actionable maintenance recommendation." },
          boundingBox: {
            type: Type.OBJECT,
            description: "Precise bounding box of the defect with coordinates normalized to 1000 (0-1000 scale).",
            properties: {
              ymin: { type: Type.NUMBER, description: "Top Y coordinate (0-1000)" },
              xmin: { type: Type.NUMBER, description: "Left X coordinate (0-1000)" },
              ymax: { type: Type.NUMBER, description: "Bottom Y coordinate (0-1000)" },
              xmax: { type: Type.NUMBER, description: "Right X coordinate (0-1000)" }
            },
            required: ["ymin", "xmin", "ymax", "xmax"]
          }
        },
        required: ["type", "severity", "confidence", "location", "description", "recommendation", "boundingBox"]
      }
    }
  },
  required: ["hasDefects", "bladeConditionScore", "summary", "defects"]
};

export const analyzeBladeImage = async (base64Image: string, mimeType: string): Promise<InspectionResult> => {
  try {
    const modelId = "gemini-3-pro-preview"; // Using the most capable model for visual reasoning and localization

    const systemPrompt = `
      You are a World-Class Wind Turbine Structural Engineer and Certified Blade Inspector with 20 years of experience in Non-Destructive Testing (NDT) and Computer Vision Analysis.
      
      Your task is to analyze the provided image (which may be a standard photo or a binocular/stereo inspection image) of a wind turbine blade.
      
      You must rigorously detect, classify, and LOCALIZE faults with extreme precision.
      
      Step 1: Scrutinize the entire image for any anomalies.
      Step 2: Classify each anomaly into one of the following specific types:
      1. Surface cracks (Paint/Gelcoat)
      2. Leading Edge erosion (Only Paint/Gelcoat)
      3. Leading Edge Erosion (Laminate) - *Critical*
      4. Laminate Crack - *Critical*
      5. Lightning Defect (Laminate Level) - *Critical*
      6. Lightning Defect (Tip Opened) - *Critical*
      7. Laminate defect (Till Core material / Through Laminate) - *Critical*
      8. Surface level erosion
      9. Dust accumulation
      
      Step 3: For EVERY detected defect, you MUST provide a precise bounding box (ymin, xmin, ymax, xmax) normalized to a 1000x1000 scale.
      - 0,0 is the top-left corner.
      - 1000,1000 is the bottom-right corner.
      - The box should tightly enclose the visible defect.
      
      Guidelines:
      - If the image contains binocular views (two similar images side-by-side), detect defects in ALL views where they are visible. Treat the image as a single canvas for coordinates.
      - Be conservative with "Critical" severity; reserve it for structural compromises.
      - If the blade appears healthy, explicitly state "No Defects Detected" and provide a high condition score.
      - Provide a maintenance recommendation for every detected issue.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            text: systemPrompt
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.1, // Very low temperature for high precision
      }
    });

    if (!response.text) {
      throw new Error("No response from AI model");
    }

    const result = JSON.parse(response.text) as InspectionResult;
    
    // Add timestamp for the report
    result.timestamp = new Date().toISOString();
    
    return result;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
};