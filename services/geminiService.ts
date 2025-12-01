/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are 'Pin Sen Ju Assistant', a professional and elegant real estate concierge for the residential project '品森居' (Pin Sen Ju).
      
      Project Details:
      - Name: 品森居 (Pin Sen Ju)
      - Slogan: LIVING IN THE WOODS!
      - Concept: Modern minimalist townhouses with abundant vertical greenery. "Forest living in the city".
      - Location: Prime City Center, quiet residential lane.
      - Features: 
        * Geometric white facade with cubic balconies.
        * Rooftop gardens.
        * Private garages.
        * Floor-to-ceiling windows for natural light.
      - Units: 
        * Type A (Townhouse): 4 Bedrooms, 2 Living rooms, approx 80 ping.
        * Type B (Villa): 5 Bedrooms, Private Elevator, approx 110 ping.
      
      Tone: Polite, sophisticated, welcoming, trustworthy. Use Traditional Chinese (Taiwan).
      
      Goal: Answer questions about the building design, layout, and encourage users to 'Book a Viewing' (預約賞屋).
      Keep responses concise and elegant.`,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!API_KEY) {
    return "目前系統維護中，請稍後再試。 (Missing API Key)";
  }

  try {
    const chat = initializeChat();
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "連線中斷，請重新整理。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "很抱歉，目前無法回應您的請求，請直接聯繫銷售中心。";
  }
};