import { GoogleGenAI, Type, Modality } from "@google/genai";
import { InfographicData, MindMapNode, Flashcard, Idea } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Infographic ---

export const generateInfographicContent = async (topic: string): Promise<InfographicData> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate content for an educational and engaging infographic about the following topic: "${topic}". 
      The tone should be professional yet accessible.
      Extract 4 to 6 key points.
      For 'iconKeyword', provide a single simple english noun that best represents the point (e.g., 'brain', 'rocket', 'money', 'tree') which will be used to select an icon.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A catchy, short headline for the infographic" },
            subtitle: { type: Type.STRING, description: "A 1-sentence intro or subtitle" },
            points: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING, description: "A concise explanation (max 20 words)" },
                  iconKeyword: { type: Type.STRING, description: "A single noun to represent the point visually" }
                },
                required: ["title", "description", "iconKeyword"]
              }
            },
            conclusion: { type: Type.STRING, description: "A short wrapping sentence" }
          },
          required: ["title", "subtitle", "points", "conclusion"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from API");
    
    return JSON.parse(text) as InfographicData;
  } catch (error) {
    console.error("Error generating infographic content:", error);
    throw error;
  }
};

export const generateHeaderImage = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
             text: `Create a flat, vector-style, clean, modern, minimalist illustration suitable for an infographic header about: ${prompt}. 
             Use a limited color palette. No text in the image. White or transparent background preferred.`
          }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9", 
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};

// --- Mind Map ---

export const generateMindMapData = async (topic: string): Promise<MindMapNode> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a hierarchical mind map structure for the topic: "${topic}".
      The root node should be the topic itself.
      Create 3-4 main branches, and each branch should have 2-3 sub-nodes.
      Keep labels short (max 3-4 words).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            label: { type: Type.STRING },
            children: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  label: { type: Type.STRING },
                  children: {
                     type: Type.ARRAY,
                     items: {
                        type: Type.OBJECT,
                        properties: {
                           id: { type: Type.STRING },
                           label: { type: Type.STRING }
                        }
                     }
                  }
                },
                required: ["id", "label"]
              }
            }
          },
          required: ["id", "label", "children"]
        }
      }
    });
    
    const text = response.text;
    if (!text) throw new Error("No text returned");
    return JSON.parse(text) as MindMapNode;
  } catch (error) {
    console.error("Error generating mind map:", error);
    throw error;
  }
};

// --- Audio Overview (TTS) ---

export const generateAudioOverview = async (topic: string, contextData: string): Promise<string | null> => {
  // 1. Generate the script
  const scriptResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Write a short, engaging, podcast-style conversation script between two hosts (Host A and Host B) discussing the topic: "${topic}".
    Base it on this context: ${contextData}.
    The conversation should be natural, enthusiastic, and educational.
    Limit to about 150 words total.
    Format: 
    Host A: [Text]
    Host B: [Text]
    `
  });
  
  const script = scriptResponse.text;
  if (!script) throw new Error("Failed to generate script");

  // 2. Convert to Audio
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: script }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: [
                  {
                      speaker: 'Host A',
                      voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Fenrir' }
                      }
                  },
                  {
                      speaker: 'Host B',
                      voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Aoede' }
                      }
                  }
            ]
          }
      }
    }
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return base64Audio || null;
};

// --- Study Tools ---

export const generateStudyData = async (topic: string): Promise<{ cards: Flashcard[], ideas: Idea[] }> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `For the topic "${topic}", generate:
    1. 5 Flashcards (Question and Answer pairs) for a "Power Study" session.
    2. 4 "Spark Ideas" - creative, out-of-the-box applications or related concepts to spark thinking.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          cards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING }
              }
            }
          },
          ideas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No data returned");
  return JSON.parse(text) as { cards: Flashcard[], ideas: Idea[] };
}
