# Agora AI Speech-to-Text Setup Guide

This guide will help you set up Agora AI for speech-to-text recognition in your inventory management system.

## Prerequisites

1. **Agora Account**: Sign up at [https://console.agora.io/](https://console.agora.io/)
2. **Node.js**: Ensure you have Node.js installed (v18 or higher recommended)

## Step 1: Create Agora Project

1. Go to [Agora Console](https://console.agora.io/)
2. Sign in or create a new account
3. Click on "Create Project"
4. Enter a project name (e.g., "Inventory Voice Management")
5. Select "Real-Time Communication" and "Real-Time Speech-to-Text"
6. Click "Submit"

## Step 2: Get Your Credentials

1. After creating the project, you'll see your **App ID**
2. Click on "Edit" next to your App ID
3. Copy your **App ID** and **App Certificate**
   - ⚠️ **Important**: Keep your App Certificate secure and never expose it in client-side code

## Step 3: Enable Real-Time Speech-to-Text

1. In your project dashboard, navigate to "Extensions" or "Services"
2. Enable "Real-Time Speech-to-Text" service
3. Configure the language settings (default: English - US)

## Step 4: Configure Environment Variables

1. Create a `.env.local` file in the root of your project:

```env
NEXT_PUBLIC_AGORA_APP_ID=your_app_id_here
NEXT_PUBLIC_AGORA_APP_CERTIFICATE=your_app_certificate_here
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/agora
```

2. Replace `your_app_id_here` with your actual Agora App ID
3. Replace `your_app_certificate_here` with your actual App Certificate
4. Update the API base URL if your backend is hosted elsewhere

## Step 5: Install Dependencies

The Agora SDK has already been installed. If you need to reinstall:

```bash
npm install agora-rtc-sdk-ng
```

## Step 6: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to the application
3. Click the microphone button to start listening
4. Speak a command like:
   - "Update stock of Amul Fresh Milk to 50"
   - "Show items running low"
   - "What is total inventory value"

## Current Implementation

### Frontend-Only Mode (Current)

The current implementation uses the **Web Speech API** as a fallback, which works in:
- Chrome/Edge (Chromium-based browsers)
- Safari (with limitations)

This provides immediate functionality without backend setup.

### Full Agora Integration (Future)

For production use with Agora's Real-Time STT, you'll need to:

1. **Create Backend API Endpoints**:
   - `/api/agora/start-stt` - Start STT task
   - `/api/agora/stop-stt` - Stop STT task
   - `/api/agora/webhook` - Receive transcription results

2. **Implement Agora REST API Calls**:
   - Use your App ID and App Certificate for authentication
   - Start STT tasks via REST API
   - Receive results via webhooks or polling

## Voice Commands Supported

The system currently supports these voice commands:

1. **Update Stock**: 
   - "Update stock of [item name] to [number]"
   - Example: "Update stock of Amul Fresh Milk to 50"

2. **Show Low Stock**:
   - "Show items running low"
   - "Show low stock items"

3. **Total Inventory Value**:
   - "What is total inventory value"
   - "Total inventory value"

4. **Add New Item**:
   - "Add new item [item name]"
   - Example: "Add new item Maggi Noodles"

## Troubleshooting

### Microphone Not Working

1. **Check Browser Permissions**:
   - Ensure your browser has microphone permissions
   - Go to browser settings and allow microphone access

2. **Browser Compatibility**:
   - Chrome/Edge: Full support
   - Firefox: Limited support
   - Safari: Requires HTTPS in production

3. **HTTPS Requirement**:
   - Web Speech API requires HTTPS in production
   - Use `localhost` for development (HTTP is allowed)

### Speech Recognition Not Starting

1. Check browser console for errors
2. Verify environment variables are set correctly
3. Ensure microphone is connected and working
4. Check if browser supports Web Speech API

### Agora Integration Issues

1. Verify your App ID is correct
2. Ensure Real-Time STT is enabled in Agora Console
3. Check network connectivity
4. Review Agora Console logs for errors

## Next Steps

1. **Backend Integration**: Set up API endpoints for full Agora STT
2. **Database Integration**: Connect voice commands to your database
3. **Error Handling**: Add comprehensive error handling
4. **User Feedback**: Enhance UI feedback for voice commands

## Resources

- [Agora Documentation](https://docs.agora.io/)
- [Real-Time STT Quickstart](https://docs.agora.io/en/real-time-stt/get-started/quickstart)
- [Voice SDK for Web](https://docs.agora.io/en/Voice/start_call_audio_web_ng?platform=Web)
- [Agora Console](https://console.agora.io/)

## Support

For issues or questions:
- Check Agora documentation
- Review browser console for errors
- Verify your Agora project settings

