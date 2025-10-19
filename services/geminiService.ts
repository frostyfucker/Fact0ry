
import { GoogleGenAI, Type } from "@google/genai";
import { InventoryItem } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const inventoryItemSchema = {
  type: Type.OBJECT,
  properties: {
    itemName: {
      type: Type.STRING,
      description: "The primary name of the equipment or item (e.g., 'Electric Motor', 'Control Panel', 'Hydraulic Pump').",
    },
    modelNumber: {
      type: Type.STRING,
      description: "The model number found on the equipment's data plate. Should be null if not found.",
    },
    serialNumber: {
      type: Type.STRING,
      description: "The serial number found on the equipment's data plate. Should be null if not found.",
    },
    manufacturer: {
      type: Type.STRING,
      description: "The manufacturer or brand name of the equipment (e.g., 'Siemens', 'Allen-Bradley', 'Parker'). Should be null if not found.",
    },
    description: {
      type: Type.STRING,
      description: "A brief, one or two sentence summary of the equipment's appearance, condition, and any other relevant details visible in the image."
    }
  },
  required: ["itemName", "modelNumber", "serialNumber", "manufacturer", "description"]
};

export async function analyzeEquipmentImage(imageBase64: string, mimeType: string): Promise<Omit<InventoryItem, 'id' | 'image'>> {
  const prompt = `
    You are an expert Factory Asset Manager. Your task is to analyze the provided image of a piece of factory equipment. 
    Perform the following actions:
    1.  Identify the main piece of equipment in the image.
    2.  Carefully perform Optical Character Recognition (OCR) on any data plates, labels, or text visible on the equipment.
    3.  Extract the key information: item name, model number, serial number, and manufacturer.
    4.  Provide a brief description of the item.
    5.  Return the information in the specified JSON format. If a specific piece of information (like a serial number) is not clearly visible or present, return null for that field.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType,
            },
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: inventoryItemSchema,
      },
    });
    
    const jsonString = response.text.trim();
    const parsedJson = JSON.parse(jsonString);

    // Validate the parsed JSON against the expected structure
    if (
      typeof parsedJson.itemName === 'string' &&
      (typeof parsedJson.modelNumber === 'string' || parsedJson.modelNumber === null) &&
      (typeof parsedJson.serialNumber === 'string' || parsedJson.serialNumber === null) &&
      (typeof parsedJson.manufacturer === 'string' || parsedJson.manufacturer === null) &&
      typeof parsedJson.description === 'string'
    ) {
      return parsedJson as Omit<InventoryItem, 'id' | 'image'>;
    } else {
      throw new Error("Received malformed JSON from Gemini API.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to process image with Gemini API.");
  }
}
