import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "@/src/types";
import { SCHOOL_INFO } from "@/src/constants";

const SYSTEM_INSTRUCTION = `
You are the official AI assistant for ${SCHOOL_INFO.name}. 
Your goal is to provide accurate information about the school, its history, academics, admissions, and alumni.
School Motto: ${SCHOOL_INFO.motto} (${SCHOOL_INFO.mottoTranslation})
Founded: ${SCHOOL_INFO.founded}
Location: ${SCHOOL_INFO.location}
Houses: ${SCHOOL_INFO.houses.join(', ')}

Be professional, helpful, and proud of the school's heritage. 
If you don't know the answer, suggest contacting the school office at ${SCHOOL_INFO.contact.email} or ${SCHOOL_INFO.contact.phone}.
Keep responses concise and formatted with markdown if necessary.
`;

export async function getChatResponse(messages: ChatMessage[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }]
  }));

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      ...history,
      { role: 'user', parts: [{ text: messages[messages.length - 1].text }] }
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
    }
  });

  return response.text || "I'm sorry, I couldn't generate a response. Please try again.";
}
