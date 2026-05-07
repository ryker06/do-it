"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDoIt } from "@/lib/store";
import { useIsDesktop } from "@/lib/useIsDesktop";
import { Topbar } from "@/components/Topbar";
import type { DomainId, Note } from "@/lib/types";

const SHADOW_PAPER =
  "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 1px rgba(20,20,30,0.02),0 12px 28px -16px rgba(20,20,30,0.10),0 28px 50px -32px rgba(20,20,30,0.14)";

const DOMAIN_OPTIONS: { id: DomainId; name: string }[] = [
  { id: "business", name: "Business" },
  { id: "learning", name: "Learning" },
  { id: "fitness", name: "Fitness" },
  { id: "religion", name: "Religion" },
  { id: "home", name: "Home" },
  { id: "food", name: "Food" },
];

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

// ── Compact list row for desktop left pane ──
function NoteRow({
  note,
  selected,
  onSelect,
}: {
  note: Note;
  selected: boolean;
  onSelect: () => void;
}) {
  const title = noteTitle(note);
  const preview = notePreview(note);
  return (
    <button
      onClick={onSelect}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: "100%",
        padding: "11px 14px",
        background: selected ? "var(--ink,#0B0B0F)" : "transparent",
        border: "none",
        cursor: "pointer",
        fontFamily: "inherit",
        textAlign: "left",
        transition: "background 160ms",
        borderBottom: "0.5px solid var(--hairline,rgba(60,60,67,0.10))",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {note.pinned && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: selected ? "rgba(255,255,255,0.5)" : "#8E8E93",
            }}
          >
            pinned
          </span>
        )}
        <span
          style={{
            fontSize: 10,
            color: selected ? "rgba(255,255,255,0.5)" : "var(--label,#8E8E93)",
            fontWeight: 500,
            marginLeft: "auto",
          }}
        >
          {timeAgo(note.updatedAt)}
        </span>
      </div>
      <div
        style={{
          fontSize: 13.5,
          fontWeight: 700,
          color: selected ? "#fff" : "var(--ink,#0B0B0F)",
          letterSpacing: "-0.012em",
          lineHeight: 1.2,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {title || "untitled"}
      </div>
      {preview && (
        <div
          style={{
            fontSize: 11.5,
            color: selected
              ? "rgba(255,255,255,0.55)"
              : "var(--label-2,#6E6E73)",
            fontWeight: 400,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {preview}
        </div>
      )}
    </button>
  );
}

// ── Inline note editor (desktop right pane) ──
function NoteEditor({
  noteId,
  onDelete,
}: {
  noteId: string;
  onDelete: () => void;
}) {
  const { notes, updateNote, removeNote, togglePinNote } = useDoIt();
  const note = notes.find((n) => n.id === noteId);

  const [title, setTitle] = useState(note?.title ?? "");
  const [body, setBody] = useState(note?.body ?? "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(note?.tags ?? []);
  const [domainId, setDomainId] = useState<DomainId | "">(note?.domainId ?? "");
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync when noteId changes
  useEffect(() => {
    setTitle(note?.title ?? "");
    setBody(note?.body ?? "");
    setTags(note?.tags ?? []);
    setDomainId(note?.domainId ?? "");
    setTagInput("");
    if (note && !note.body) {
      setTimeout(() => bodyRef.current?.focus(), 80);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId]);

  function scheduleSave(patch: {
    title?: string;
    body?: string;
    tags?: string[];
    domainId?: DomainId | undefined;
  }) {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      updateNote(noteId, patch);
    }, 600);
  }

  function saveNow() {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    updateNote(noteId, {
      title: title.trim() || undefined,
      body,
      tags,
      domainId: domainId || undefined,
    });
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
    updateNote(noteId, { tags: next });
  }

  function removeTag(t: string) {
    const next = tags.filter((x) => x !== t);
    setTags(next);
    updateNote(noteId, { tags: next });
  }

  if (!note)
    return (
      <div className="md-empty">
        <span className="md-empty-icon">◎</span>
        <span>note not found</span>
      </div>
    );

  return (
    <div
      style={{
        padding: "24px 32px 40px",
        maxWidth: 720,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* Action bar */}
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
            togglePinNote(noteId);
          }}
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
        <select
          value={domainId}
          onChange={(e) => {
            setDomainId(e.target.value as DomainId | "");
            updateNote(noteId, {
              domainId: (e.target.value as DomainId) || undefined,
            });
          }}
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: domainId ? "#1C1C1E" : "#8E8E93",
            background: "#F4F5F7",
            border: "none",
            outline: "none",
            borderRadius: 10,
            padding: "7px 10px",
            fontFamily: "inherit",
            boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
          }}
        >
          <option value="">domain</option>
          {DOMAIN_OPTIONS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => {
            removeNote(noteId);
            onDelete();
          }}
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

      {/* Editor card */}
      <div
        style={{
          background: "#fff",
          borderRadius: 22,
          padding: "18px 20px 14px",
          boxShadow: SHADOW_PAPER,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          minHeight: 0,
        }}
      >
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            scheduleSave({ title: e.target.value || undefined });
          }}
          onBlur={saveNow}
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
        <div style={{ height: 0.5, background: "rgba(60,60,67,0.08)" }} />
        <textarea
          ref={bodyRef}
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            scheduleSave({ body: e.target.value });
          }}
          onBlur={saveNow}
          placeholder="write anything."
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 15,
            fontWeight: 400,
            color: "#1C1C1E",
            fontFamily: "inherit",
            letterSpacing: "-0.005em",
            lineHeight: 1.6,
            resize: "none",
            flex: 1,
            minHeight: 300,
          }}
        />
        {/* Tags */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
            paddingTop: 8,
            borderTop: "0.5px solid rgba(60,60,67,0.08)",
          }}
        >
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => removeTag(t)}
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#6E6E73",
                background: "#F4F5F7",
                border: "none",
                borderRadius: 999,
                padding: "4px 9px",
                fontFamily: "inherit",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              #{t} <span style={{ opacity: 0.5, fontSize: 10 }}>×</span>
            </button>
          ))}
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="+ tag"
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "#0B0B0F",
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "inherit",
              width: 60,
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Mobile note card ──
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
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("selected");
  const isDesktop = useIsDesktop();

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
      const id = `note-${now}`;
      if (isDesktop) {
        router.push(`/notes?selected=${id}`, { scroll: false });
      } else {
        router.push(`/notes/detail?id=${id}`);
      }
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

  // ── Desktop master/detail ──
  if (isDesktop) {
    return (
      <div className="md-layout">
        {/* LEFT — 320px */}
        <div className="md-list" style={{ width: 320 }}>
          <div style={{ padding: "12px 10px 0" }}>{searchBar}</div>
          {filtered.length === 0 && (
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#8E8E93",
                textAlign: "center",
                padding: "24px 0",
              }}
            >
              {q ? "no notes match." : "nothing captured yet."}
            </div>
          )}
          {pinned.length > 0 && (
            <>
              <div
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#8E8E93",
                  padding: "4px 14px 2px",
                }}
              >
                pinned
              </div>
              {pinned.map((n) => (
                <NoteRow
                  key={n.id}
                  note={n}
                  selected={selectedId === n.id}
                  onSelect={() =>
                    router.push(`/notes?selected=${n.id}`, { scroll: false })
                  }
                />
              ))}
              {rest.length > 0 && (
                <div
                  style={{
                    fontSize: 9.5,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#8E8E93",
                    padding: "8px 14px 2px",
                  }}
                >
                  notes
                </div>
              )}
            </>
          )}
          {rest.map((n) => (
            <NoteRow
              key={n.id}
              note={n}
              selected={selectedId === n.id}
              onSelect={() =>
                router.push(`/notes?selected=${n.id}`, { scroll: false })
              }
            />
          ))}
        </div>

        {/* RIGHT — editor */}
        <div className="md-detail">
          {selectedId ? (
            <NoteEditor
              noteId={selectedId}
              onDelete={() => router.push("/notes", { scroll: false })}
            />
          ) : (
            <div className="md-empty">
              <span className="md-empty-icon">◎</span>
              <span>select a note or create one</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Mobile single-column ──
  return (
    <>
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
    </>
  );
}

export default function NotesPage() {
  return (
    <Suspense>
      <NotesInner />
    </Suspense>
  );
}
