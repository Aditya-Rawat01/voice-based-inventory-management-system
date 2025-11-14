// Agora Configuration
// Replace these with your actual Agora credentials from https://console.agora.io/

export const agoraConfig = {
  // Your Agora App ID (get from Agora Console)
  appId: process.env.NEXT_PUBLIC_AGORA_APP_ID || "",
  
  // Your Agora App Certificate (for backend authentication)
  appCertificate: process.env.NEXT_PUBLIC_AGORA_APP_CERTIFICATE || "",
  
  // Channel name for RTC
  channelName: "convai_76_3Y2",
  
  // Real-Time STT Configuration
  stt: {
    // Base URL for your backend API that handles Agora STT
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "/api/agora",
    
    // Language code for STT (e.g., "en-US", "hi-IN")
    language: "en-US",
  },
};

// Instructions:
// 1. Sign up at https://console.agora.io/
// 2. Create a new project
// 3. Enable Real-Time Speech-to-Text service
// 4. Copy your App ID and App Certificate
// 5. Add them to your .env.local file:
//    NEXT_PUBLIC_AGORA_APP_ID=your_app_id_here
//    NEXT_PUBLIC_AGORA_APP_CERTIFICATE=your_app_certificate_here
//    NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/agora

