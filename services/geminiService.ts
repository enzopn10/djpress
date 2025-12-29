
import { GoogleGenAI, Type } from "@google/genai";

// Always use the latest API key from process.env.API_KEY by instantiating inside functions

export const generateBio = async (name: string, genres: string[], keywords: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a professional, engaging 2-paragraph electronic music artist biography for ${name}. 
      Genres: ${genres.join(', ')}. 
      Keywords/Details: ${keywords}. 
      Make it sound sophisticated and ready for a press kit.`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text || "Failed to generate bio.";
  } catch (error) {
    console.error("Error generating bio:", error);
    return "Error generating bio. Please try again later.";
  }
};

export const parsePressKitDump = async (userInput: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `You are an expert talent manager. Parse the following unstructured data dump from an artist and organize it into a structured press kit format. 
      Input: ${userInput}
      
      Instructions:
      1. Extract the display name and create a short, catchy tagline.
      2. If a bio is provided, clean it up. If not, generate one based on the info.
      3. Identify genres and location.
      4. Map links to their correct social platforms.
      5. Identify achievements/milestones and organize by year.
      6. Identify photo links, video links (YouTube/Vimeo), and music links (Spotify/Soundcloud).
      7. Identify technical rider or logo files (URLs).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            displayName: { type: Type.STRING },
            tagline: { type: Type.STRING },
            bio: { type: Type.STRING },
            location: { type: Type.STRING },
            genres: { type: Type.ARRAY, items: { type: Type.STRING } },
            socials: {
              type: Type.OBJECT,
              properties: {
                instagram: { type: Type.STRING },
                soundcloud: { type: Type.STRING },
                spotify: { type: Type.STRING },
                twitter: { type: Type.STRING },
                facebook: { type: Type.STRING },
                youtube: { type: Type.STRING }
              }
            },
            achievements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  year: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["year", "title"]
              }
            },
            videos: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  url: { type: Type.STRING }
                }
              }
            },
            musicEmbeds: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  platform: { type: Type.STRING, description: "spotify or soundcloud" },
                  url: { type: Type.STRING }
                }
              }
            }
          },
          required: ["displayName", "bio"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error parsing dump:", error);
    throw error;
  }
};
