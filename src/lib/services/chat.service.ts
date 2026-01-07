import { WebhookEvent, MessageEvent } from '@line/bot-sdk';
import { LineClient } from '@/lib/clients/line.client';
import { GeminiClient } from '@/lib/clients/gemini.client';
import { ConversationRepository } from '@/lib/repositories/conversation.repository';
import { IMessage } from '@/lib/db/conversation.model';

const SYSTEM_PROMPT = `
你現在是 "鏈鋸人 Chainsaw Man"！同時也是一位生活智慧王。
請用充滿熱血、直率、有時帶點瘋狂但又意外實用的語氣回應。
開場白通常是：「我是你的鏈鋸人 Chainsaw Man！是生活智慧王，有什麼雜事交給我鋸爆它！」

請根據使用者的問題，提供實用建議。
重要：你必須嚴格遵守以下 JSON 格式輸出，不要包含任何 Markdown 標記或額外文字。

請回傳一個 JSON 物件，格式如下：
{
  "title": "這裡填寫一個熱血的短標題 (10字內)",
  "summary": "這裡填寫 1~2 句符合鏈鋸人風格的開場白",
  "advice": [
    "建議事項 1 (具體步驟)",
    "建議事項 2 (具體步驟)",
    "建議事項 3 (具體步驟)"
  ],
  "closing": "一句熱血的結尾",
  "quickReplies": [
    "建議使用者可以點選的後續行動或回應 1",
    "建議使用者可以點選的後續行動或回應 2"
  ],
  "buttonTemplate": {
    "text": "請設計一個引導使用者進行下一步選擇的問題",
    "actions": ["選項1", "選項2", "選項3"]
  }
}

範例輸出：
{
  "title": "惡魔都給我閃邊！",
  "summary": "這種小事也敢來煩本大爺？好啦，看在你誠心發問的份上，我就教你幾招！",
  "advice": [
    "先去買個超級美味的吐司",
    "然後把果醬塗滿滿的",
    "一口氣吃下去，超爽的！"
  ],
  "closing": "解決了吧？我要去摸波奇塔了！",
  "quickReplies": ["還有問題", "謝謝鏈鋸人", "我也要摸波奇塔"],
  "buttonTemplate": {
    "text": "你現在想幹嘛？",
    "actions": ["吃吐司", "打惡魔", "睡覺"]
  }
}

請確保 JSON 格式正確。
重要：請務必提供 buttonTemplate，讓使用者可以透過按鈕進行下一步互動。actions 陣列最多 4 個選項，每個選項標籤不超過 20 字。
`;

export class ChatService {
  private lineClient: LineClient;
  private geminiClient: GeminiClient;
  private conversationRepo: ConversationRepository;

  constructor() {
    this.lineClient = new LineClient();
    this.geminiClient = new GeminiClient();
    this.conversationRepo = new ConversationRepository();
  }


  public async handleEvent(event: WebhookEvent): Promise<void> {
    console.log(`HandleEvent: type=${event.type}`);
    
    if (event.type !== 'message') {
      console.log(`Skipping event: type=${event.type}`);
      return;
    }
    
    if (event.message.type !== 'text') {
      console.log(`Skipping event: messageType=${event.message.type}`);
      return;
    }

    const { userId } = event.source;
    const { text } = event.message;
    const { replyToken } = event;

    console.log(`Processing message from user: ${userId}, text: ${text?.substring(0, 50)}...`);

    if (!userId) {
      console.error('No userId in event source');
      return;
    }

    // Session 管理：重置對話
    if (text.trim() === '重置' || text.trim() === '忘記我' || text.trim() === 'restart') {
        await this.conversationRepo.resetConversation(userId);
        await this.lineClient.replyText(replyToken, '汪！我已經把之前的對話都忘光光了！我們重新開始吧！');
        return;
    }

    try {
      const conversation = await this.conversationRepo.findOrCreateActiveConversation(userId);
      const userMsg: IMessage = { role: 'user', content: text, timestamp: new Date() };
      await this.conversationRepo.addMessage(conversation.id, userMsg);
      const history = conversation.messages.concat(userMsg);
      let aiRawText = await this.geminiClient.generateResponse(history, SYSTEM_PROMPT);
      aiRawText = aiRawText.replace(/```json/g, '').replace(/```/g, '').trim();

      let messagesToSend: any[] = [];
      let aiStoredContent = aiRawText; 

      try {
        const data = JSON.parse(aiRawText);
        
        // 1. 建立主要的 Flex Message (建議內容)
        const flexMessage = {
          type: 'flex',
          altText: data.summary || '鏈鋸人回覆', 
          contents: {
            type: 'bubble',
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                { type: 'text', text: data.title || '鏈鋸人', weight: 'bold', size: 'xl', color: '#FF6600' },
                { type: 'text', text: data.summary || '', wrap: true, color: '#333333', size: 'sm', margin: 'md' },
                { type: 'separator', margin: 'md' },
                { 
                  type: 'box', 
                  layout: 'vertical', 
                  margin: 'md', 
                  spacing: 'sm',
                  contents: Array.isArray(data.advice) ? data.advice.map((item: string, index: number) => ({
                    type: 'box',
                    layout: 'baseline',
                    contents: [
                      { type: 'text', text: `${index + 1}.`, color: '#FF6600', flex: 1, weight: 'bold' },
                      { type: 'text', text: item, wrap: true, color: '#444444', flex: 9, size: 'sm' }
                    ]
                  })) : []
                },
                { type: 'separator', margin: 'md' },
                { type: 'text', text: data.closing || '汪！', wrap: true, color: '#aaaaaa', size: 'xs', margin: 'md', align: 'center' }
              ]
            }
          }
        };
        messagesToSend.push(flexMessage);

        // 2. 強制生成 Button Template (作為第二則訊息)
        let buttonActions: string[] = [];
        let buttonText = "接下來想幹嘛？";

        // 嘗試從 Gemini 回應中獲取按鈕，如果沒有則使用預設值
        if (data.buttonTemplate && Array.isArray(data.buttonTemplate.actions) && data.buttonTemplate.actions.length > 0) {
            console.log('Using Gemini provided buttonTemplate');
            buttonText = data.buttonTemplate.text || buttonText;
            buttonActions = data.buttonTemplate.actions;
        } else if (data.quickReplies && Array.isArray(data.quickReplies) && data.quickReplies.length > 0) {
            console.log('Fallback: Using quickReplies as buttons');
            buttonActions = data.quickReplies;
        } 
        
        // 如果上面都沒抓到，或者抓到的陣列是空的，強制使用預設按鈕
        if (buttonActions.length === 0) {
            console.log('Fallback: Using DEFAULT buttons');
            buttonActions = ["再問一題", "我有其他問題", "謝謝鏈鋸人"];
        }

        // 確保按鈕數量 (1~4) 和長度 (<=20)
        const validActions = buttonActions
            .slice(0, 4)
            .map((action: string) => ({
                type: 'message',
                label: action.substring(0, 20),
                text: action
            }));
        
        // 只要有有效按鈕就發送 (理論上這裡一定會有，因為有預設值)
        if (validActions.length > 0) {
             const templateMessage = {
                type: 'template',
                altText: buttonText, 
                template: {
                    type: 'buttons',
                    text: buttonText.substring(0, 160), 
                    actions: validActions
                }
            };
            messagesToSend.push(templateMessage);
            console.log('Button Template added to messages');
        } else {
            console.error('No valid actions for Button Template (Unexpected)');
        }

        aiStoredContent = JSON.stringify(data, null, 2);

      } catch (e) {
        console.error('JSON Parse Error (Fallback to text):', e);
        messagesToSend.push({ type: 'text', text: aiRawText });
      }

      const aiMsg: IMessage = { role: 'assistant', content: aiStoredContent, timestamp: new Date() };
      await this.conversationRepo.addMessage(conversation.id, aiMsg);
      
      // 使用 replyMessage 發送訊息陣列 (支援多則訊息)
      await this.lineClient.replyMessage(replyToken, messagesToSend);

    } catch (error: any) {
      console.error('ChatService Error:', error);
      
      let errorMessage = '抱歉，大腦有點打結，請稍後再試一次(Error: System Processing Failed)';
      
      if (error?.message === 'QUOTA_EXCEEDED') {
        errorMessage = '抱歉，目前服務使用量已達上限，請稍後再試一次(Error: Quota Exceeded)';
      } else if (error?.message === 'AUTH_ERROR') {
        errorMessage = '抱歉，服務設定有誤，請聯絡管理員(Error: Authentication Failed)';
      } else if (error?.message === 'SERVICE_UNAVAILABLE') {
        errorMessage = '抱歉，AI 服務暫時無法使用，請稍後再試一次(Error: Service Unavailable)';
      }
      
      await this.lineClient.replyText(replyToken, errorMessage);
    }
  }
}