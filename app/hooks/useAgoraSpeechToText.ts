"use client";

import { useState, useRef, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

interface UseAgoraSpeechToTextOptions {
  appId?: string;
  onTranscript?: (transcript: string) => void;
  onPartialTranscript?: (partialTranscript: string) => void;
  onError?: (error: Error) => void;
}

export function useAgoraSpeechToText(options: UseAgoraSpeechToTextOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [partialTranscript, setPartialTranscript] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const clientRef = useRef<any>(null);
  const localAudioTrackRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Agora RTC Client
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // For now, we'll use Web Speech API as a fallback
      // Agora Real-Time STT requires backend integration
      // This hook provides the structure for Agora integration
      
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let interimTranscript = "";
          let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + " ";
            } else {
              interimTranscript += transcript;
            }
          }

          if (interimTranscript) {
            setPartialTranscript(interimTranscript);
            options.onPartialTranscript?.(interimTranscript);
          }

          if (finalTranscript) {
            setTranscript((prev) => prev + finalTranscript);
            setPartialTranscript("");
            options.onTranscript?.(finalTranscript.trim());
          }
        };

        recognition.onerror = (event: any) => {
          const error = new Error(`Speech recognition error: ${event.error}`);
          setError(error);
          options.onError?.(error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        setIsInitialized(true);
      } else {
        // Fallback: Initialize Agora RTC for audio capture
        // Note: Full Agora STT requires backend REST API integration
        if (options.appId) {
          const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
          clientRef.current = client;
          setIsInitialized(true);
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options.onError?.(error);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.stop();
        localAudioTrackRef.current.close();
      }
      if (clientRef.current) {
        clientRef.current.leave();
      }
    };
  }, [options.appId]);

  const startListening = async () => {
    if (!isInitialized) {
      setError(new Error("Speech recognition not initialized"));
      return;
    }

    try {
      if (recognitionRef.current) {
        // Use Web Speech API
        recognitionRef.current.start();
        setIsListening(true);
        setError(null);
      } else if (clientRef.current && options.appId) {
        // Use Agora RTC for audio capture
        // Note: This captures audio but STT requires backend integration
        const uid = await clientRef.current.join(
          options.appId,
          "default-channel",
          null,
          null
        );

        const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        await clientRef.current.publish([localAudioTrack]);
        localAudioTrackRef.current = localAudioTrack;
        setIsListening(true);
        setError(null);

        // TODO: Integrate with Agora Real-Time STT REST API
        // This requires backend endpoint to start STT task
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options.onError?.(error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.stop();
        localAudioTrackRef.current.close();
        localAudioTrackRef.current = null;
      }
      if (clientRef.current) {
        clientRef.current.leave();
      }
      setIsListening(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options.onError?.(error);
    }
  };

  const clearTranscript = () => {
    setTranscript("");
    setPartialTranscript("");
  };

  return {
    isListening,
    transcript,
    partialTranscript,
    error,
    isInitialized,
    startListening,
    stopListening,
    clearTranscript,
  };
}

