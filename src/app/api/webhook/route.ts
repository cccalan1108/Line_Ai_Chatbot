import { NextRequest, NextResponse } from 'next/server';
import { validateSignature } from '@line/bot-sdk';
import connectDB from '@/lib/db/mongodb';
import { ChatService } from '@/lib/services/chat.service';

const channelSecret = process.env.LINE_CHANNEL_SECRET || '';
const chatService = new ChatService();

export async function POST(req: NextRequest) {
  try {
    console.log('Webhook POST request received');
    
    // 1. Validate environment variables
    if (!channelSecret) {
      console.error('LINE_CHANNEL_SECRET is missing');
      return NextResponse.json({ message: 'Channel secret not configured' }, { status: 500 });
    }

    // 2. Read body and signature
    const body = await req.text();
    const signature = req.headers.get('x-line-signature') as string;
    
    if (!signature) {
      console.error('Missing x-line-signature header');
      return NextResponse.json({ message: 'Missing signature' }, { status: 401 });
    }

    // 3. Validate signature
    if (!validateSignature(body, channelSecret, signature)) {
      console.error('Invalid signature validation');
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }

    // 4. Connect to Database
    try {
      await connectDB();
      console.log('MongoDB connected successfully');
    } catch (dbError) {
      console.error('MongoDB connection failed:', dbError);
      // We might still want to process the event even if DB fails, or return error? 
      // For now, let's return error to make it visible
      return NextResponse.json({ message: 'Database connection failed' }, { status: 500 });
    }

    // 5. Parse events
    const { events } = JSON.parse(body);
    console.log(`Received ${events.length} events`);

    // 6. Process events
    const results = await Promise.allSettled(
      events.map(async (event: any) => {
        try {
          console.log(`Processing event: ${event.type}`);
          await chatService.handleEvent(event);
          console.log(`Event processed: ${event.type}`);
          return { status: 'success', id: event.webhookEventId };
        } catch (eventError) {
          console.error(`Error processing event ${event.type}:`, eventError);
          throw eventError;
        }
      })
    );

    // Log results
    const rejected = results.filter(r => r.status === 'rejected');
    if (rejected.length > 0) {
      console.error('Some events failed to process:', rejected);
    }

    return NextResponse.json({ status: 'success', results });

  } catch (error: any) {
    console.error('Unhandled Webhook Error:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: error?.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'alive', message: 'LINE Bot Webhook is running!' });
}