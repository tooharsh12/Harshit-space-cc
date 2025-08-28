import { GoogleGenAI, Modality } from "@google/genai";
import type { ImageInfo } from '../types';

const getAiClient = (): GoogleGenAI => {
  // The API key is provided by the execution environment and is assumed to be valid.
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateVirtualTryOnImage = async (
  personImage: ImageInfo,
  clothImage: ImageInfo
): Promise<string> => {
    const ai = getAiClient();
    
    const modelName = 'gemini-2.5-flash-image-preview';
    const prompt = `Please take the person from the first image and the clothing item from the second image. Generate a new, photorealistic image where the person is wearing the clothing. The person's face, body pose, and the original background should be preserved as much as possible. The clothing should fit naturally on the person's body, adapting to their pose and body shape. The lighting and shadows on the clothing should match the lighting of the original person's photo. The final result should only be the image.`;
    
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: {
                parts: [
                    { inlineData: { data: personImage.base64, mimeType: personImage.mimeType } },
                    { inlineData: { data: clothImage.base64, mimeType: clothImage.mimeType } },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        // The API should return one or more parts. We need to find the image part.
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const mimeType = part.inlineData.mimeType;
                return `data:${mimeType};base64,${base64ImageBytes}`;
            }
        }
        
        // If no image part is found, throw an error with the text response for debugging.
        throw new Error("No image was generated. AI Response: " + response.text);

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        // The error from the SDK is often user-friendly. We'll pass it along for display.
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        throw new Error(`Gemini API Error: ${message}`);
    }
};