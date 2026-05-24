import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const room = searchParams.get('room');
  const username = searchParams.get('username');
  const isInstructor = searchParams.get('role') === 'instructor';

  if (!room) {
    return NextResponse.json({ error: 'Missing "room" query parameter' }, { status: 400 });
  }
  if (!username) {
    return NextResponse.json({ error: 'Missing "username" query parameter' }, { status: 400 });
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  try {
    const at = new AccessToken(apiKey, apiSecret, {
      identity: username,
      name: username,
    });

    at.addGrant({ 
        roomJoin: true, 
        room: room, 
        canPublish: true, // students and instructors can publish since we use the component
        canSubscribe: true 
    });

    const token = await at.toJwt();
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { room, identity } = body;
    
    if (!room || !identity) {
      return NextResponse.json({ error: 'Missing parameters: room and identity are required' }, { status: 400 });
    }

    const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!livekitUrl || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    // RoomServiceClient typically expects an http/https URL, not wss://
    const httpUrl = livekitUrl.replace('wss://', 'https://').replace('ws://', 'http://');
    
    const roomService = new RoomServiceClient(httpUrl, apiKey, apiSecret);
    await roomService.removeParticipant(room, identity);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error kicking participant:', error);
    return NextResponse.json({ error: error.message || 'Failed to kick participant' }, { status: 500 });
  }
}
