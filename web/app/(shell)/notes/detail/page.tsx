"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import type { DomainId } from "@/lib/types";

const DOMAIN_OPTIONS: { id: DomainId; name: string }[] = [
  { id: "business", name: "Business" },
  { id: "learning", name: "Learning" },
  { id: "fitness", name: "Fitness" },
  { id: "religion", name: "Religion" },
  { id: "home", name: "Home" },
  { id: "food", name: "Food" },
];

function NoteDetailInner() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const { notes, updateNote, removeNote, togglePinNote } = useDoIt();

  const note = notes.find((n) => n.id === id);

  const [title, setTitle] = useState(note?.title ?? "");
  const [body, setBody] = useState(note?.body ?? "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(note?.tags ?? []);
  const [domainId, setDomainId] = useState<DomainId | "">(note?.domainId ?? "");
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-focus body if blank
  useEffect(() => {
    if (note && !note.body) {
      setTimeout(() => bodyRef.current?.focus(), 100);
    }
  }, [note]);

  function scheduleSave(patch: {
    title?: string;
    body?: string;
    tags?: string[];
    domainId?: DomainId | undefined;
  }) {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      updateNote(id, patch);
    }, 600);
  }

  function saveNow() {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    updateNote(id, {
      title: title.trim() || undefined,
      body,
      tags,
      domainId: domainId || undefined,
    });
  }

  function handleTitleBlur() {
    saveNow();
  }

  function handleBodyBlur() {
    saveNow();
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (!t || tags.includes(t)) {
      setTagInput("");
      return;
    }
    const next = [...tags, t];
    setTags(next);
    setTagInput("");
    updateNote(id, { tags: next });
  }

  function removeTag(t: string) {
    const next = tags.filter((x) => x !== t);
    setTags(next);
    updateNote(id, { tags: next });
  }

  function handleDelete() {
    removeNote(id);
    router.push("/notes");
  }

  function handlePin() {
    togglePinNote(id);
  }

  if (!note) {
    return (
      <>
        <Topbar name="note." sub="not found" />
        <div
          style={{
            padding: "32px 16px",
            textAlign: "center",
            fontSize: 14,
            color: "#8E8E93",
          }}
        >
          note not found.
        </div>
      </>
    );
  }

  const SHADOW_PAPER =
    "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 1px rgba(20,20,30,0.02),0 12px 28px -16px rgba(20,20,30,0.10)";

  return (
    <>
      <Topbar name="note." sub={note.pinned ? "pinned" : "captured"} />

      {/* back + actions row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <button
          onClick={() => {
            saveNow();
            router.push("/notes");
          }}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 13.5,
            fontWeight: 600,
            color: "#0B0B0F",
            letterSpacing: "-0.010em",
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "8px 0",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={14}
            height={14}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
          notes
        </button>
        <div style={{ flex: 1 }} />
        <button
          onClick={handlePin}
          style={{
            background: note.pinned ? "#E2EEFF" : "transparent",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 12,
            fontWeight: 600,
            color: note.pinned ? "#0050C8" : "#8E8E93",
            letterSpacing: "-0.005em",
            padding: "7px 12px",
            borderRadius: 10,
            boxShadow: note.pinned
              ? "inset 0 0 0 0.5px rgba(0,80,200,0.15)"
              : "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
          }}
        >
          {note.pinned ? "pinned" : "pin"}
        </button>
        <button
          onClick={handleDelete}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 12,
            fontWeight: 600,
            color: "#8E8E93",
            padding: "7px 12px",
            borderRadius: 10,
            boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
          }}
        >
          delete
        </button>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 22,
          padding: "18px 18px 14px",
          boxShadow: SHADOW_PAPER,
          marginBottom: 12,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* title input */}
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            scheduleSave({ title: e.target.value || undefined });
          }}
          onBlur={handleTitleBlur}
          placeholder="title (optional)"
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 20,
            fontWeight: 700,
            color: "#0B0B0F",
            fontFamily: "inherit",
            letterSpacing: "-0.025em",
            lineHeight: 1.15,
            width: "100%",
          }}
        />

        {/* divider */}
        <div style={{ height: 0.5, background: "rgba(60,60,67,0.08)" }} />

        {/* body textarea */}
        <textarea
          ref={bodyRef}
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            scheduleSave({ body: e.target.value });
          }}
          onBlur={handleBodyBlur}
          placeholder="write anything."
          rows={10}
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 15,
            fontWeight: 400,
            color: "#1C1C1E",
            fontFamily: "inherit",
            letterSpacing: "-0.008em",
            lineHeight: 1.6,
            resize: "none",
            width: "100%",
          }}
        />
      </div>

      {/* tags */}
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: "12px 14px",
          boxShadow: SHADOW_PAPER,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#8E8E93",
            marginBottom: 10,
          }}
        >
          tags
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: tags.length > 0 ? 10 : 0,
          }}
        >
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => removeTag(t)}
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: "#0B0B0F",
                background: "#F4F5F7",
                borderRadius: 999,
                padding: "4px 10px",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                letterSpacing: "0.01em",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              {t}
              <span style={{ opacity: 0.45, fontSize: 13, lineHeight: 1 }}>
                ×
              </span>
            </button>
          ))}
        </div>
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag();
            }
          }}
          onBlur={addTag}
          placeholder="add tag · press enter"
          style={{
            background: "#F4F5F7",
            border: "none",
            outline: "none",
            borderRadius: 10,
            padding: "8px 12px",
            fontSize: 13,
            fontWeight: 500,
            color: "#0B0B0F",
            fontFamily: "inherit",
            width: "100%",
            letterSpacing: "-0.005em",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* domain */}
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: "12px 14px",
          boxShadow: SHADOW_PAPER,
          marginBottom: 110,
        }}
      >
        <div
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#8E8E93",
            marginBottom: 10,
          }}
        >
          domain
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <button
            onClick={() => {
              setDomainId("");
              updateNote(id, { domainId: undefined });
            }}
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: !domainId ? "#fff" : "#6E6E73",
              background: !domainId
                ? "linear-gradient(180deg,#1A1A20 0%,#000 100%)"
                : "#F4F5F7",
              borderRadius: 999,
              padding: "5px 12px",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            none
          </button>
          {DOMAIN_OPTIONS.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                setDomainId(d.id);
                updateNote(id, { domainId: d.id });
              }}
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: domainId === d.id ? "#fff" : "#6E6E73",
                background:
                  domainId === d.id
                    ? "linear-gradient(180deg,#1A1A20 0%,#000 100%)"
                    : "#F4F5F7",
                borderRadius: 999,
                padding: "5px 12px",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default function NoteDetailPage() {
  return (
    <Suspense>
      <NoteDetailInner />
    </Suspense>
  );
}
