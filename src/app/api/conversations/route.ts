import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import { ConversationModel } from '@/lib/db/conversation.model';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const conversations = await ConversationModel.find()
      .sort({ updatedAt: -1 })
      .select('lineUserId topic status updatedAt createdAt') 
      .lean();

    return NextResponse.json({ data: conversations });
  } catch (error) {
    console.error('Fetch Conversations Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}