"use client";

import { useEffect, useRef, useState } from "react";
import { useDoIt } from "@/lib/store";

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: Event) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEvent = {
  results: {
    [i: number]: { [j: number]: { transcript: string } };
    length: number;
  };
};

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

const WORD_NUM: Record<string, number> = {
  ten: 10,
  fifteen: 15,
  twenty: 20,
  thirty: 30,
  five: 5,
};

type CommandActions = {
  extendCurrent: (min: number) => void;
  pauseCurrent: () => void;
  finishCurrent: () => void;
  skipCurrent: () => void;
  addToInbox: (text: string, domain?: import("@/lib/types").DomainId) => void;
};

function parseCommand(raw: string, actions: CommandActions): string | null {
  const t = raw.trim().toLowerCase();

  const extendMatch = t.match(/^extend\s+(\w+)/);
  if (extendMatch) {
    const token = extendMatch[1];
    const min = WORD_NUM[token] ?? parseInt(token, 10);
    if (!isNaN(min) && min > 0) {
      actions.extendCurrent(min);
      return `Extended ${min} min`;
    }
  }
  if (t === "pause") {
    actions.pauseCurrent();
    return "Paused";
  }
  if (t === "done") {
    actions.finishCurrent();
    return "Done";
  }
  if (t === "skip") {
    actions.skipCurrent();
    return "Skipped";
  }
  const queueMatch = t.match(/^(?:queue inbox|capture)\s+(.+)/);
  if (queueMatch) {
    actions.addToInbox(queueMatch[1]);
    return `Captured: ${queueMatch[1]}`;
  }
  return null;
}

export function VoiceCommandStrip() {
  const {
    extendCurrent,
    pauseCurrent,
    finishCurrent,
    skipCurrent,
    addToInbox,
  } = useDoIt();
  const actions: CommandActions = {
    extendCurrent,
    pauseCurrent,
    finishCurrent,
    skipCurrent,
    addToInbox,
  };
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const recogRef = useRef<SpeechRecognitionInstance | null>(null);

  const SpeechAPI =
    typeof window !== "undefined"
      ? (window.SpeechRecognition ?? window.webkitSpeechRecognition)
      : undefined;
  const hasVoice = !!SpeechAPI;

  useEffect(() => {
    return () => {
      recogRef.current?.stop();
    };
  }, []);

  function showFeedback(msg: string) {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2000);
  }

  function startListening() {
    if (!SpeechAPI) return;
    const recog = new SpeechAPI();
    recog.continuous = false;
    recog.interimResults = false;
    recog.lang = "en-US";
    recog.onresult = (e) => {
      const transcript = e.results[0]?.[0]?.transcript ?? "";
      const result = parseCommand(transcript, actions);
      showFeedback(result ?? `Not recognised: "${transcript}"`);
    };
    recog.onerror = () => {
      setListening(false);
      showFeedback("Mic error");
    };
    recog.onend = () => setListening(false);
    recogRef.current = recog;
    recog.start();
    setListening(true);
  }

  function stopListening() {
    recogRef.current?.stop();
    setListening(false);
  }

  function handleTextSubmit() {
    if (!textInput.trim()) return;
    const result = parseCommand(textInput, actions);
    showFeedback(result ?? `Not recognised: "${textInput}"`);
    setTextInput("");
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 0 4px",
      }}
    >
      {feedback && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 90,
            background: "rgba(18,18,24,0.88)",
            color: "#fff",
            borderRadius: 16,
            padding: "10px 20px",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          {feedback}
        </div>
      )}

      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "var(--label,#8E8E93)",
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          flexShrink: 0,
        }}
      >
        Voice
      </span>

      {hasVoice ? (
        <button
          onClick={listening ? stopListening : startListening}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 14px",
            borderRadius: 12,
            background: listening
              ? "linear-gradient(180deg,#FF6B6B 0%, #E53E3E 100%)"
              : "var(--inset,#F2F2F7)",
            color: listening ? "#fff" : "var(--ink-2,#1C1C1E)",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            border: "none",
            cursor: "pointer",
            boxShadow: listening
              ? "0 2px 8px rgba(229,62,62,0.30)"
              : "inset 0 0 0 0.5px rgba(60,60,67,0.08)",
            transition: "all 0.15s ease",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={13}
            height={13}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
            <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
          </svg>
          {listening ? "Listening…" : "Speak"}
        </button>
      ) : (
        <div style={{ display: "flex", gap: 6, flex: 1 }}>
          <input
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
            placeholder='try "extend 10" · "pause" · "done"'
            style={{
              flex: 1,
              fontSize: 13,
              fontWeight: 500,
              color: "var(--ink,#000)",
              background: "var(--inset,#F2F2F7)",
              border: "none",
              outline: "none",
              borderRadius: 10,
              padding: "7px 12px",
              fontFamily: "inherit",
              letterSpacing: "-0.01em",
            }}
          />
          <button
            onClick={handleTextSubmit}
            style={{
              padding: "7px 12px",
              borderRadius: 10,
              background: "var(--ink,#000)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Go
          </button>
        </div>
      )}
    </div>
  );
}
