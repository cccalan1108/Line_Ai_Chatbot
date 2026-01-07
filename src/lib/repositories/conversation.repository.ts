import { ConversationModel, IConversation, IMessage } from '@/lib/db/conversation.model';

export interface IConversationRepository {
  findOrCreateActiveConversation(lineUserId: string): Promise<IConversation>;
  addMessage(conversationId: string, message: IMessage): Promise<IConversation | null>;
  resetConversation(lineUserId: string): Promise<void>;
}

export class ConversationRepository implements IConversationRepository {
  
  async resetConversation(lineUserId: string): Promise<void> {
    await ConversationModel.updateMany(
      { lineUserId: lineUserId, status: 'active' },
      { $set: { status: 'closed' } }
    );
  }

  async findOrCreateActiveConversation(lineUserId: string): Promise<IConversation> {
    let conversation = await ConversationModel.findOne({
      lineUserId: lineUserId,
      status: 'active',
    });

    if (conversation) {
      return conversation;
    }
    conversation = await ConversationModel.create({
      lineUserId: lineUserId,
      platform: 'LINE',
      topic: '新的 LINE 對話', 
      status: 'active',
      messages: [],
    });

    return conversation;
  }

  async addMessage(conversationId: string, message: IMessage): Promise<IConversation | null> {
    const updatedConversation = await ConversationModel.findByIdAndUpdate(
      conversationId,
      {
        $push: { messages: message },
        $set: { updatedAt: new Date() }, 
      },
      { new: true } 
    );

    return updatedConversation;
  }
}