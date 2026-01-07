import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import { ConversationModel } from '@/lib/db/conversation.model';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  req: NextRequest,
  context: RouteContext 
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const conversation = await ConversationModel.findById(id).lean();
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ data: conversation });
  } catch (error) {
    console.error('Fetch Single Conversation Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversation' },
      { status: 500 }
    );
  }
}