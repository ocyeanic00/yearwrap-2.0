import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useMemoryStore from "../store/memoryStore"

const FOLDER_COLORS = {
  my_pov: "#c8a882", peeps: "#b8956a", moments: "#a07850",
  triptrip: "#8b6240", mood: "#d4b896", challenges: "#7a5535",
}
const FOLDER_ICONS = {
  my_pov: "ri-eye-line", peeps: "ri-group-line", moments: "ri-sparkling-line",
  triptrip: "ri-map-2-line", mood: "ri-moon-line", challenges: "ri-flashlight-line",
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
    <div style={{
      position: "relative", width: "100vw", height: "100vh", overflow: "hidden", fontFamily: "Georgia, serif",
      background: "linear-gradient(160deg, #2a1608 0%, #3b2314 50%, #4a2e18 100%)"
    }}>

      {/* subtle texture overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(ellipse at 30% 20%, rgba(200,168,130,0.07) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(59,35,20,0.2) 0%, transparent 60%)"
      }} />

      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", height: "100vh" }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 28px 14px",
          borderBottom: "1px solid rgba(200,168,130,0.12)",
          background: "rgba(59,35,20,0.45)", backdropFilter: "blur(20px)"
        }}>
          <button onClick={() => navigate("/")} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(200,168,130,0.6)", fontFamily: "Georgia, serif", display: "flex", alignItems: "center", gap: 6, fontSize: 13,
            transition: "color 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = "#f5ead8"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(200,168,130,0.6)"}>
            <i className="ri-arrow-left-line" style={{ fontSize: 16 }} /> home
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <i className="ri-delete-bin-2-line" style={{ fontSize: 20, color: "#c8a882" }} />
            <h1 style={{ fontSize: 16, fontWeight: 700, color: "#f5ead8", letterSpacing: 0.5, margin: 0 }}>dump it</h1>
          </div>
          <div style={{ width: 60 }} />
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
          {deletedWraps.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 14 }}>
              <i className="ri-delete-bin-2-line" style={{ fontSize: 52, color: "#c8a882", opacity: 0.2 }} />
              <p style={{ color: "#c8a882", fontSize: 14, fontStyle: "italic", margin: 0 }}>nothing dumped yet</p>
              <p style={{ color: "rgba(200,168,130,0.5)", fontSize: 11, margin: 0 }}>deleted year wraps will appear here</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 680, margin: "0 auto" }}>
              <p style={{ fontSize: 9, letterSpacing: 3, color: "rgba(200,168,130,0.5)", textTransform: "uppercase", marginBottom: 4 }}>
                deleted wraps — {deletedWraps.length} item{deletedWraps.length !== 1 ? "s" : ""}
              </p>

              {deletedWraps.map((entry) => {
                const isOpen = expanded === entry.year
                const folderNames = Object.keys(entry.folders)
                const hasAnyContent = folderNames.some(n => entry.folders[n].text || entry.folders[n].photos.length > 0)
                return (
                  <div key={entry.year} style={{
                    background: "rgba(59,35,20,0.55)", backdropFilter: "blur(16px)",
                    border: "1px solid rgba(200,168,130,0.15)",
                    borderRadius: 18, overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.25)"
                  }}>

                    <div style={{
                      display: "flex", alignItems: "center", padding: "14px 20px", gap: 12,
                      borderBottom: isOpen ? "1px solid rgba(200,168,130,0.12)" : "none", cursor: "pointer"
                    }}
                      onClick={() => setExpanded(isOpen ? null : entry.year)}>
                      <i className="ri-archive-line" style={{ fontSize: 20, color: "#c8a882", opacity: 0.7 }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "#f5ead8", margin: 0 }}>{entry.year} wrap</p>
                        <p style={{ fontSize: 11, color: "rgba(200,168,130,0.65)", marginTop: 2, marginBottom: 0 }}>
                          deleted {new Date(entry.deletedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          {" · "}{hasAnyContent ? "has content" : "empty"}
                        </p>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); restoreWrap(entry.year); navigate("/treasure-chest") }}
                        style={{
                          background: "rgba(200,168,130,0.18)", border: "1px solid rgba(200,168,130,0.25)",
                          borderRadius: 14, padding: "5px 13px", fontSize: 11, color: "#f5ead8",
                          cursor: "pointer", fontFamily: "Georgia, serif", display: "flex", alignItems: "center", gap: 5
                        }}>
                        <i className="ri-arrow-go-back-line" /> restore
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setConfirmPerm(entry.year) }}
                        style={{
                          background: "rgba(160,60,40,0.18)", border: "1px solid rgba(160,60,40,0.25)",
                          borderRadius: 14, padding: "5px 13px", fontSize: 11, color: "#e08878",
                          cursor: "pointer", fontFamily: "Georgia, serif", display: "flex", alignItems: "center", gap: 5
                        }}>
                        <i className="ri-delete-bin-6-line" /> delete forever
                      </button>
                      <i className="ri-arrow-down-s-line" style={{
                        fontSize: 16, color: "#c8a882",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s"
                      }} />
                    </div>

                    {isOpen && (
                      <div style={{ padding: "14px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
                        {folderNames.map((name) => {
                          const d = entry.folders[name]
                          const col = FOLDER_COLORS[name]
                          const empty = !d.text && d.photos.length === 0
                          return (
                            <div key={name} style={{
                              display: "flex", alignItems: "flex-start", gap: 12,
                              padding: "10px 14px", borderRadius: 12,
                              background: empty ? "rgba(255,255,255,0.03)" : `${col}22`,
                              border: `1px solid ${empty ? "rgba(200,168,130,0.08)" : col + "44"}`
                            }}>
                              <svg viewBox="0 0 20 16" style={{ width: 20, height: 15, flexShrink: 0, marginTop: 2 }}>
                                <path d="M1 4 Q1 3 2 3 L7 3 Q8 3 8.5 2 L9 1 Q9.5 0 10.5 0 L18 0 Q19 0 19 1 L19 4 Z" fill={shade(col, -20)} />
                                <rect x="1" y="4" width="18" height="11" rx="2" fill={col} />
                              </svg>
                              <div style={{ flex: 1 }}>
                                <p style={{
                                  fontSize: 12, fontWeight: 600, color: "#f5ead8", textTransform: "capitalize",
                                  marginBottom: 2, display: "flex", alignItems: "center", gap: 5
                                }}>
                                  {name.replace("_", " ")}
                                  <i className={FOLDER_ICONS[name]} style={{ fontSize: 11, color: "#c8a882" }} />
                                </p>
                                {empty ? (
                                  <p style={{ fontSize: 11, color: "rgba(200,168,130,0.45)", fontStyle: "italic", margin: 0 }}>empty</p>
                                ) : (
                                  <>
                                    {d.text && <p style={{ fontSize: 11, color: "rgba(245,234,216,0.7)", lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>"{d.text.slice(0, 80)}{d.text.length > 80 ? "..." : ""}"</p>}
                                    {d.photos.length > 0 && (
                                      <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                                        {d.photos.slice(0, 3).map((src, i) => (
                                          <img key={i} src={src} alt="" style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 7 }} />
                                        ))}
                                        {d.photos.length > 3 && (
                                          <div style={{
                                            width: 44, height: 44, borderRadius: 7, background: `${col}55`,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 11, color: "#f5ead8"
                                          }}>+{d.photos.length - 3}</div>
                                        )}
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
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100
        }}>
          <div style={{
            background: "rgba(40,22,10,0.96)", backdropFilter: "blur(30px)",
            border: "1px solid rgba(200,168,130,0.2)",
            borderRadius: 20, padding: "32px 36px", width: 340,
            boxShadow: "0 12px 60px rgba(0,0,0,0.5)", textAlign: "center", fontFamily: "Georgia, serif"
          }}>
            <i className="ri-delete-bin-6-line" style={{ fontSize: 44, color: "#e08878" }} />
            <h3 style={{ fontSize: 16, color: "#f5ead8", margin: "14px 0 8px" }}>delete {confirmPerm} forever?</h3>
            <p style={{ fontSize: 12, color: "rgba(200,168,130,0.65)", marginBottom: 24, lineHeight: 1.6 }}>
              this cannot be undone. all memories from this year will be gone permanently.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setConfirmPerm(null)}
                style={{
                  background: "transparent", border: "1px solid rgba(200,168,130,0.4)",
                  borderRadius: 20, padding: "8px 20px", fontSize: 13, color: "#c8a882",
                  cursor: "pointer", fontFamily: "Georgia, serif"
                }}>cancel</button>
              <button onClick={() => { permanentlyDelete(confirmPerm); setConfirmPerm(null) }}
                style={{
                  background: "#7a2020", color: "white", border: "none",
                  borderRadius: 20, padding: "8px 20px", fontSize: 13,
                  cursor: "pointer", fontFamily: "Georgia, serif"
                }}>delete forever</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
