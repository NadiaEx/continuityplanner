import { useCallback, useEffect, useRef, useState } from "react";

// Minimal type stubs for the Web Speech API (not in lib.dom by default).
type SRResult = { isFinal: boolean; 0: { transcript: string } };
type SREvent = { resultIndex: number; results: ArrayLike<SRResult> };
type SRInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: SREvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechWindow = Window & {
  SpeechRecognition?: new () => SRInstance;
  webkitSpeechRecognition?: new () => SRInstance;
};

export function useSpeechRecognition({
  onFinalTranscript,
}: {
  onFinalTranscript: (text: string) => void;
}) {
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [supported, setSupported] = useState(false);
  const recRef = useRef<SRInstance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as SpeechWindow;
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    setSupported(!!Ctor);
  }, []);

  const start = useCallback(() => {
    if (typeof window === "undefined") return;
    const w = window as SpeechWindow;
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) return;

    const rec = new Ctor();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (e) => {
      let finalChunk = "";
      let interimChunk = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        const text = r[0].transcript;
        if (r.isFinal) finalChunk += text;
        else interimChunk += text;
      }
      if (finalChunk) onFinalTranscript(finalChunk);
      setInterim(interimChunk);
    };

    rec.onerror = () => {
      setListening(false);
      setInterim("");
    };

    rec.onend = () => {
      setListening(false);
      setInterim("");
    };

    recRef.current = rec;
    rec.start();
    setListening(true);
  }, [onFinalTranscript]);

  const stop = useCallback(() => {
    recRef.current?.stop();
    recRef.current = null;
    setListening(false);
    setInterim("");
  }, []);

  useEffect(() => () => recRef.current?.stop(), []);

  return { listening, interim, supported, start, stop };
}
