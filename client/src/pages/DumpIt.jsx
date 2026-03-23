import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useMemoryStore from "../store/memoryStore"

const FOLDER_COLORS = {
  my_pov: "#e8dcc8", peeps: "#c8c0b0", moments: "#d4b896",
  triptrip: "#ddd0a8", mood: "#c0b8a8", challenges: "#ccc0a8",
}
const FOLDER_EMOJI = {
  my_pov: "🪞", peeps: "🫂", moments: "✨",
  triptrip: "🗺️", mood: "🌙", challenges: "⚡",
}

function shade(hex, p) {
  const n = parseInt(hex.replace("#", ""), 16)
  return `rgb(${Math.min(255, Math.max(0, (n >> 16) + p))},${Math.min(255, Math.max(0, ((n >> 8) & 0xff) + p))},${Math.min(255, Math.max(0, (n & 0xff) + p))})`
}

export default function DumpIt() {
  const navigate = useNavigate()
  const deletedWraps = useMemoryStore((s) => s.deletedWraps)
  const restoreWrap = useMemoryStore((s) => s.restoreWrap)
  const permanentlyDelete = useMemoryStore((s) => s.permanentlyDelete)
  const [expanded, setExpanded] = useState(null)
  const [confirmPerm, setConfirmPerm] = useState(null)

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", fontFamily: "Georgia, serif" }}>
      <img src="/bg-flower.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(235,222,205,0.90)", backdropFilter: "blur(6px)" }} />

      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", height: "100vh" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 32px 18px", borderBottom: "1px solid rgba(90,62,43,0.12)" }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#a08060", fontFamily: "Georgia, serif", display: "flex", alignItems: "center", gap: 5 }}>
            ← back
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/icon-dump.png" alt="" style={{ width: 32, height: 32, objectFit: "contain" }} />
            <h1 style={{ fontSize: 17, fontWeight: 700, color: "#3d2b1a", letterSpacing: 0.5 }}>dump it</h1>
          </div>
          <div style={{ width: 60 }} />
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 40px" }}>

          {deletedWraps.length === 0 ? (
            /* Empty state */
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 14 }}>
              <img src="/icon-dump.png" alt="" style={{ width: 70, opacity: 0.18 }} />
              <p style={{ color: "#c4a07a", fontSize: 14, fontStyle: "italic" }}>nothing dumped yet</p>
              <p style={{ color: "#d4b896", fontSize: 11 }}>deleted year wraps will appear here</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 680, margin: "0 auto" }}>
              <p style={{ fontSize: 9, letterSpacing: 3, color: "#b09070", textTransform: "uppercase", marginBottom: 4 }}>
                deleted wraps — {deletedWraps.length} item{deletedWraps.length !== 1 ? "s" : ""}
              </p>

              {deletedWraps.map((entry) => {
                const isOpen = expanded === entry.year
                const folderNames = Object.keys(entry.folders)
                const hasAnyContent = folderNames.some(n => entry.folders[n].text || entry.folders[n].photos.length > 0)

                return (
                  <div key={entry.year} style={{ background: "rgba(255,252,248,0.88)", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 20px rgba(90,62,43,0.08)" }}>

                    {/* Wrap header row */}
                    <div style={{ display: "flex", alignItems: "center", padding: "16px 22px", gap: 12, borderBottom: isOpen ? "1px solid rgba(180,140,100,0.15)" : "none", cursor: "pointer" }}
                      onClick={() => setExpanded(isOpen ? null : entry.year)}>
                      <img src="/icon-dump.png" alt="" style={{ width: 28, height: 28, objectFit: "contain", opacity: 0.5 }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 15, fontWeight: 700, color: "#3d2b1a" }}>{entry.year} wrap</p>
                        <p style={{ fontSize: 11, color: "#a08060", marginTop: 2 }}>
                          deleted {new Date(entry.deletedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          {" · "}{hasAnyContent ? "has content" : "empty"}
                        </p>
                      </div>
                      {/* restore */}
                      <button
                        onClick={(e) => { e.stopPropagation(); restoreWrap(entry.year); navigate("/treasure-chest") }}
                        style={{ background: "rgba(212,184,150,0.35)", border: "none", borderRadius: 14, padding: "6px 14px", fontSize: 11, color: "#5a3e2b", cursor: "pointer", fontFamily: "Georgia, serif", whiteSpace: "nowrap" }}
                      >
                        ↩ restore
                      </button>
                      {/* permanent delete */}
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmPerm(entry.year) }}
                        style={{ background: "rgba(180,80,60,0.1)", border: "none", borderRadius: 14, padding: "6px 14px", fontSize: 11, color: "#a04030", cursor: "pointer", fontFamily: "Georgia, serif", whiteSpace: "nowrap" }}
                      >
                        delete forever
                      </button>
                      <span style={{ fontSize: 9, color: "#c4a07a", display: "inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
                    </div>

                    {/* Expanded folder preview */}
                    {isOpen && (
                      <div style={{ padding: "16px 22px", display: "flex", flexDirection: "column", gap: 10 }}>
                        {folderNames.map((name) => {
                          const d = entry.folders[name]
                          const col = FOLDER_COLORS[name]
                          const empty = !d.text && d.photos.length === 0
                          return (
                            <div key={name} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 14px", borderRadius: 12, background: empty ? "transparent" : `${col}44` }}>
                              {/* mini folder */}
                              <svg viewBox="0 0 20 16" style={{ width: 20, height: 15, flexShrink: 0, marginTop: 2 }}>
                                <path d="M1 4 Q1 3 2 3 L7 3 Q8 3 8.5 2 L9 1 Q9.5 0 10.5 0 L18 0 Q19 0 19 1 L19 4 Z" fill={shade(col, -20)} />
                                <rect x="1" y="4" width="18" height="11" rx="2" fill={col} />
                              </svg>
                              <div style={{ flex: 1 }}>
                                <p style={{ fontSize: 12, fontWeight: 600, color: "#3d2b1a", textTransform: "capitalize", marginBottom: 2 }}>
                                  {name.replace("_", " ")} {FOLDER_EMOJI[name]}
                                </p>
                                {empty ? (
                                  <p style={{ fontSize: 11, color: "#c4a07a", fontStyle: "italic" }}>empty</p>
                                ) : (
                                  <>
                                    {d.text && <p style={{ fontSize: 12, color: "#7a5a3e", lineHeight: 1.6, fontStyle: "italic" }}>"{d.text.slice(0, 80)}{d.text.length > 80 ? "..." : ""}"</p>}
                                    {d.photos.length > 0 && (
                                      <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                                        {d.photos.slice(0, 3).map((src, i) => (
                                          <img key={i} src={src} alt="" style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 7 }} />
                                        ))}
                                        {d.photos.length > 3 && <div style={{ width: 44, height: 44, borderRadius: 7, background: `${col}88`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#5a3e2b" }}>+{d.photos.length - 3}</div>}
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Confirm permanent delete modal */}
      {confirmPerm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fffaf5", borderRadius: 20, padding: "32px 36px", width: 340, boxShadow: "0 8px 40px rgba(0,0,0,0.15)", textAlign: "center", fontFamily: "Georgia, serif" }}>
            <span style={{ fontSize: 40 }}>🗑️</span>
            <h3 style={{ fontSize: 16, color: "#3d2b1a", margin: "14px 0 8px" }}>delete {confirmPerm} forever?</h3>
            <p style={{ fontSize: 12, color: "#a08060", marginBottom: 24, lineHeight: 1.6 }}>this cannot be undone. all memories from this year will be gone permanently.</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setConfirmPerm(null)} style={{ background: "transparent", border: "1px solid #c4a07a", borderRadius: 20, padding: "8px 20px", fontSize: 13, color: "#7a5a3e", cursor: "pointer", fontFamily: "Georgia, serif" }}>cancel</button>
              <button onClick={() => { permanentlyDelete(confirmPerm); setConfirmPerm(null) }} style={{ background: "#8b2020", color: "white", border: "none", borderRadius: 20, padding: "8px 20px", fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif" }}>delete forever</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
