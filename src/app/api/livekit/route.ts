import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

  // Restrict student access to live classes only
  if (!isInstructor) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase configuration missing in LiveKit token generator");
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    try {
      const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
      const { data: session, error: sessionError } = await supabaseAdmin
        .from('live_sessions')
        .select('is_live')
        .or(`session_url.eq.livekit://${room},session_url.eq.agora://${room}`)
        .maybeSingle();

      if (sessionError) {
        console.error("Database error checking live session:", sessionError);
        return NextResponse.json({ error: 'Failed to verify session status' }, { status: 500 });
      }

      if (!session || !session.is_live) {
        return NextResponse.json({ error: 'This live session is not currently active.' }, { status: 403 });
      }
    } catch (dbErr) {
      console.error("Exception checking live session:", dbErr);
      return NextResponse.json({ error: 'Failed to verify session status' }, { status: 500 });
    }
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
