import { NextResponse, NextRequest } from 'next/server';
import { RtcTokenBuilder, RtcRole } from 'agora-token';

// ⚠️ Environment Variables - Ensure these are set in your .env.local file
const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID || '';
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE || '';
const EXPIRATION_TIME_IN_SECONDS = 3600; // 1 hour

export async function GET(request: NextRequest) {
  try {
    // 1. Validate Credentials
    if (!APP_ID || !APP_CERTIFICATE) {
      return NextResponse.json(
        { error: 'Server configuration error: App ID or App Certificate missing.' },
        { status: 500 }
      );
    }

    // 2. Extract Query Parameters from the Request
    const url = new URL(request.url);
    const channelName = url.searchParams.get('channelName') || `default_channel_${Date.now()}`;
    const uidStr = url.searchParams.get('uid');
    
    // Convert UID to an integer (0 means Agora assigns a random UID)
    const uid = uidStr === null || uidStr === '' ? 0 : parseInt(uidStr);

    // 3. Calculate Token Expiration Time
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + EXPIRATION_TIME_IN_SECONDS;
    
    // We use the PUBLISHER role here, as both the user and the AI agent
    // need to publish their audio streams to the channel.
    const role = RtcRole.PUBLISHER; 

    // 4. Build the Token
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      uid,
      role,
      privilegeExpiredTs,
      privilegeExpiredTs
    );

    // 5. Return the Token Data
    return NextResponse.json({
      rtcToken: token,
      channelName: channelName,
      uid: uid,
    });

  } catch (error) {
    console.error('Error generating Agora token:', error);
    return NextResponse.json(
      { error: 'Failed to generate token due to an internal server error.' },
      { status: 500 }
    );
  }
}