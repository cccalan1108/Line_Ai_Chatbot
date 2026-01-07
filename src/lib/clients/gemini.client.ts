import { GoogleGenerativeAI, Content, GenerativeModel } from '@google/generative-ai';
import { IMessage } from '@/lib/db/conversation.model';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = process.env.LLM_MODEL_NAME || 'gemini-2.5-flash';

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined');
}

export class GeminiClient {
  private ai: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    this.ai = new GoogleGenerativeAI(GEMINI_API_KEY!);
    this.model = this.ai.getGenerativeModel({ model: MODEL_NAME });
  }

  private formatMessages(messages: IMessage[]): Content[] {
    return messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model', 
      parts: [{ text: msg.content }],
    }));
  }

  public async generateResponse(
    history: IMessage[],
    systemPrompt: string
  ): Promise<string> {

    const contents: Content[] = this.formatMessages(history);

    try {
      const result = await this.model.generateContent({
        contents: contents,
        systemInstruction: systemPrompt, 
      });
      const response = await result.response;
      const text = response.text(); 

      return text || '現在無法生成回應，請稍後再試。';

    } catch (error) {
      console.error('Gemini API Error:', error);
      return '服務暫時無法回應，請稍後再試。'; 
    }
  }
}