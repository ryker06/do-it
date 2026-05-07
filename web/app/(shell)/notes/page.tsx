"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import type { Note } from "@/lib/types";

const SHADOW_PAPER =
  "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 1px rgba(20,20,30,0.02),0 12px 28px -16px rgba(20,20,30,0.10),0 28px 50px -32px rgba(20,20,30,0.14)";

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "today";
  if (d === 1) return "yesterday";
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

function noteTitle(n: Note): string {
  if (n.title) return n.title;
  return n.body.slice(0, 60).replace(/\n/g, " ");
}

function notePreview(n: Note): string {
  const src = n.title ? n.body : n.body.slice(60);
  return src.slice(0, 100).replace(/\n/g, " ").trim();
}

function NoteCard({ note, onTap }: { note: Note; onTap: () => void }) {
  const title = noteTitle(note);
  const preview = notePreview(note);
  return (
    <button
      onClick={onTap}
      style={{
        background: "#fff",
        borderRadius: 18,
        padding: "14px 16px",
        textAlign: "left",
        boxShadow:
          "0 0 0 0.5px rgba(60,60,67,0.08),0 1px 2px rgba(20,20,30,0.03),0 8px 20px -14px rgba(20,20,30,0.10)",
        border: "none",
        cursor: "pointer",
        fontFamily: "inherit",
        display: "flex",
        flexDirection: "column",
        gap: 5,
        width: "100%",
        position: "relative",
      }}
    >
      {note.pinned && (
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            fontSize: 11,
            color: "#8E8E93",
            fontWeight: 600,
          }}
        >
          ·
        </div>
      )}
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: "#0B0B0F",
          letterSpacing: "-0.015em",
          lineHeight: 1.2,
          paddingRight: 16,
        }}
      >
        {title || "untitled"}
      </div>
      {preview && (
        <div
          style={{
            fontSize: 13,
            fontWeight: 400,
            color: "#6E6E73",
            letterSpacing: "-0.005em",
            lineHeight: 1.45,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {preview}
        </div>
      )}
      <div
        style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}
      >
        <span style={{ fontSize: 10.5, color: "#8E8E93", fontWeight: 600 }}>
          {timeAgo(note.updatedAt)}
        </span>
        {note.tags.slice(0, 2).map((t) => (
          <span
            key={t}
            style={{
              fontSize: 10.5,
              color: "#6E6E73",
              background: "#F4F5F7",
              borderRadius: 999,
              padding: "2px 7px",
              fontWeight: 600,
            }}
          >
            #{t}
          </span>
        ))}
      </div>
    </button>
  );
}

function NotesInner() {
  const router = useRouter();
  const { notes, addNote } = useDoIt();
  const [search, setSearch] = useState("");

  const q = search.trim().toLowerCase();
  const filtered = q
    ? notes.filter(
        (n) =>
          noteTitle(n).toLowerCase().includes(q) ||
          n.body.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q)),
      )
    : notes;

  const pinned = filtered.filter((n) => n.pinned);
  const rest = filtered.filter((n) => !n.pinned);

  function handleAdd() {
    const now = Date.now();
    addNote({ body: "", tags: [], pinned: false });
    setTimeout(() => {
      router.push(`/notes/detail?id=note-${now}`);
    }, 50);
  }

  // Search + add bar
  const searchBar = (
    <div
      style={{
        display: "flex",
        gap: 10,
        marginBottom: 16,
        alignItems: "center",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#fff",
          borderRadius: 14,
          padding: "10px 14px",
          boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
        }}
      >
        <svg
          width={14}
          height={14}
          viewBox="0 0 16 16"
          fill="none"
          style={{ flexShrink: 0, opacity: 0.35 }}
        >
          <circle cx={7} cy={7} r={5} stroke="#0B0B0F" strokeWidth={1.5} />
          <path
            d="M11 11l3 3"
            stroke="#0B0B0F"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="search notes."
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 14,
            fontWeight: 500,
            color: "#0B0B0F",
            fontFamily: "inherit",
            letterSpacing: "-0.010em",
          }}
        />
      </div>
      <button
        onClick={handleAdd}
        style={{
          flexShrink: 0,
          height: 44,
          padding: "0 18px",
          borderRadius: 14,
          background: "linear-gradient(180deg,#1A1A20 0%,#000 100%)",
          color: "#fff",
          fontSize: 13.5,
          fontWeight: 600,
          letterSpacing: "-0.012em",
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.08) inset,0 0 0 0.5px rgba(0,0,0,0.5),0 12px 24px -14px rgba(10,10,20,0.45)",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width={12}
          height={12}
          fill="none"
          stroke="#fff"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        note
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
      <Topbar name="notes." sub={`${notes.length} captured`} />
      {searchBar}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          paddingBottom: 110,
        }}
      >
        {pinned.length > 0 && (
          <>
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#8E8E93",
                padding: "4px 4px 2px",
              }}
            >
              pinned
            </div>
            {pinned.map((n) => (
              <NoteCard
                key={n.id}
                note={n}
                onTap={() => router.push(`/notes/detail?id=${n.id}`)}
              />
            ))}
            {rest.length > 0 && (
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#8E8E93",
                  padding: "4px 4px 2px",
                }}
              >
                notes
              </div>
            )}
          </>
        )}
        {rest.map((n) => (
          <NoteCard
            key={n.id}
            note={n}
            onTap={() => router.push(`/notes/detail?id=${n.id}`)}
          />
        ))}
        {filtered.length === 0 && (
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              padding: "32px 16px",
              textAlign: "center",
              boxShadow: SHADOW_PAPER,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "#8E8E93",
                letterSpacing: "-0.010em",
              }}
            >
              {q ? "no notes match." : "nothing captured yet."}
            </div>
            {!q && (
              <button
                onClick={handleAdd}
                style={{
                  marginTop: 14,
                  background: "transparent",
                  border: "none",
                  color: "#0B0B0F",
                  fontSize: 13.5,
                  fontWeight: 600,
                  letterSpacing: "-0.010em",
                  fontFamily: "inherit",
                  cursor: "pointer",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                }}
              >
                add the first one.
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function NotesPage() {
  return (
    <Suspense>
      <NotesInner />
    </Suspense>
  );
}
