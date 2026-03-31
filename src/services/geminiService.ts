/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { ClinicalFeatures } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function extractFeaturesFromNotes(notes: string): Promise<ClinicalFeatures> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Extract clinical features from the following medical notes for cancer diagnostic staging. 
    Notes: "${notes}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tumorSizeMm: { type: Type.NUMBER, description: "Size of the primary tumor in millimeters" },
          lymphNodeInvolvement: { 
            type: Type.STRING, 
            enum: ["N0", "N1", "N2", "N3", "Unknown"],
            description: "N-stage involvement"
          },
          metastasis: { 
            type: Type.STRING, 
            enum: ["M0", "M1", "Unknown"],
            description: "M-stage involvement"
          },
          biopsyResult: { 
            type: Type.STRING, 
            enum: ["Benign", "Malignant", "Inconclusive", "Pending"],
            description: "Result of the biopsy"
          },
          biomarkers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                value: { type: Type.STRING },
                status: { type: Type.STRING, enum: ["Positive", "Negative", "Normal", "Abnormal"] }
              },
              required: ["name", "value", "status"]
            }
          },
          symptoms: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["tumorSizeMm", "lymphNodeInvolvement", "metastasis", "biopsyResult", "biomarkers", "symptoms"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Neural extraction failed to produce valid clinical features.");
  }
}
