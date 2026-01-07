import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant' | 'system'; 
  content: string; 
  timestamp: Date; 
}

const MessageSchema: Schema = new Schema<IMessage>({
  role: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { _id: false }); 

export interface IConversation extends Document {
  lineUserId: string;          
  platform: 'LINE';            
  topic: string;               
  status: 'active' | 'closed'; 
  messages: IMessage[];       
  metadata: { 
    [key: string]: any;       
  };
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema: Schema = new Schema<IConversation>({
  lineUserId: { type: String, required: true, index: true }, 
  platform: { type: String, required: true, default: 'LINE' },
  topic: { type: String, required: true, default: '未分類對話' },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  messages: [MessageSchema], 
  metadata: { type: Object, default: {} },
}, {
  timestamps: true, 
});

const ConversationModel: Model<IConversation> = (mongoose.models.Conversation as Model<IConversation>) || mongoose.model<IConversation>('Conversation', ConversationSchema);

export { ConversationModel };