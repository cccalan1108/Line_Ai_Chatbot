import { Client, WebhookEvent, Message, TextMessage, WebhookRequestBody } from '@line/bot-sdk';

const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;

if (!CHANNEL_ACCESS_TOKEN || !CHANNEL_SECRET) {
  throw new Error('LINE_CHANNEL_ACCESS_TOKEN or LINE_CHANNEL_SECRET  not defined ');
}
export class LineClient {
  private client: Client;

  constructor() {
    this.client = new Client({
      channelAccessToken: CHANNEL_ACCESS_TOKEN!, 
      channelSecret: CHANNEL_SECRET!,          
    });
  }

  public getInstance(): Client {
    return this.client;
  }

  public async replyMessage(replyToken: string, message: Message | Message[]): Promise<any> {
    try {
      await this.client.replyMessage(replyToken, message);
    } catch (error) {
      console.error('LINE Reply Message Error:', error);
      throw new Error('Failed to send reply message ');
    }
  }

  public async replyText(replyToken: string, text: string): Promise<any> {
    const message: TextMessage = {
      type: 'text',
      text: text,
    };
    return this.replyMessage(replyToken, message);
  }
}