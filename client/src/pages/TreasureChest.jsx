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

export default function TreasureChest() {
    const navigate = useNavigate()
    const wraps = useMemoryStore((s) => s.wraps)
    const deleteWrap = useMemoryStore((s) => s.deleteWrap)
    const [expandedYear, setExpandedYear] = useState(null)
    const [selectedFolder, setSelectedFolder] = useState(null)
    const [confirmDelete, setConfirmDelete] = useState(null)

    const years = Object.keys(wraps).map(Number).sort((a, b) => b - a)
    const folderNames = Object.keys(FOLDER_COLORS)
    const activeData = expandedYear && selectedFolder ? wraps[expandedYear]?.[selectedFolder] : null

    const handleDelete = (year) => {
        deleteWrap(year)
        if (expandedYear === year) { setExpandedYear(null); setSelectedFolder(null) }
        setConfirmDelete(null)
    }

    return (
        <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", fontFamily: "Georgia, serif" }}>
            <img src="/bg-flower.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(240,230,215,0.88)", backdropFilter: "blur(6px)" }} />

            <div style={{ position: "relative", zIndex: 10, display: "flex", height: "100vh" }}>

                {/* SIDEBAR */}
                <div style={{ width: 240, flexShrink: 0, display: "flex", flexDirection: "column", background: "rgba(255,250,244,0.75)", borderRight: "1px solid rgba(180,140,100,0.2)", backdropFilter: "blur(8px)" }}>
                    <div style={{ padding: "28px 24px 16px" }}>
                        <button onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#a08060", marginBottom: 20, display: "flex", alignItems: "center", gap: 5 }}>
                            ← back to home
                        </button>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <img src="/icon-treasure.png" alt="" style={{ width: 36, height: 36, objectFit: "contain" }} />
                            <div>
                                <p style={{ fontSize: 16, fontWeight: 700, color: "#3d2b1a", lineHeight: 1 }}>treasure</p>
                                <p style={{ fontSize: 16, fontWeight: 700, color: "#3d2b1a", lineHeight: 1 }}>chest</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ width: "80%", height: 1, background: "rgba(180,140,100,0.2)", margin: "0 auto 16px" }} />

                    <div style={{ flex: 1, overflowY: "auto", padding: "0 0 20px" }}>
                        <p style={{ padding: "0 24px 10px", fontSize: 9, letterSpacing: 3, color: "#b09070", textTransform: "uppercase" }}>your wraps</p>

                        {years.length === 0 && (
                            <p style={{ padding: "0 24px", fontSize: 12, color: "#c4a07a", fontStyle: "italic" }}>no wraps yet</p>
                        )}

                        {years.map((year) => {
                            const isOpen = expandedYear === year
                            return (
                                <div key={year}>
                                    {/* Year row */}
                                    <div style={{ margin: "2px 12px", borderRadius: 10, background: isOpen ? "rgba(212,184,150,0.4)" : "transparent", transition: "background 0.2s" }}>
                                        <div style={{ display: "flex", alignItems: "center", padding: "9px 14px", cursor: "pointer" }}
                                            onClick={() => { setExpandedYear(isOpen ? null : year); setSelectedFolder(null) }}>
                                            <span style={{ fontSize: 13, fontWeight: isOpen ? 700 : 500, color: isOpen ? "#3d2b1a" : "#8a6a4a", flex: 1 }}>{year}</span>
                                            {/* delete button */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setConfirmDelete(year) }}
                                                title="move to dump it"
                                                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#c4a07a", padding: "0 4px", lineHeight: 1, marginRight: 4 }}
                                            >🗑️</button>
                                            <span style={{ fontSize: 9, color: "#c4a07a", display: "inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
                                        </div>
                                    </div>

                                    {/* Folders */}
                                    {isOpen && (
                                        <div style={{ paddingBottom: 6 }}>
                                            {folderNames.map((name) => {
                                                const isSel = selectedFolder === name
                                                const col = FOLDER_COLORS[name]
                                                return (
                                                    <div key={name} onClick={() => setSelectedFolder(name)}
                                                        style={{ margin: "2px 12px 2px 20px", padding: "8px 12px", borderRadius: 9, cursor: "pointer", display: "flex", alignItems: "center", gap: 9, background: isSel ? `${col}99` : "transparent", boxShadow: isSel ? `0 2px 8px ${col}66` : "none", transition: "all 0.18s" }}>
                                                        <svg viewBox="0 0 20 16" style={{ width: 20, height: 15, flexShrink: 0 }}>
                                                            <path d="M1 4 Q1 3 2 3 L7 3 Q8 3 8.5 2 L9 1 Q9.5 0 10.5 0 L18 0 Q19 0 19 1 L19 4 Z" fill={shade(col, -20)} />
                                                            <rect x="1" y="4" width="18" height="11" rx="2" fill={col} />
                                                            <rect x="1" y="4" width="18" height="5" rx="2" fill="white" opacity="0.15" />
                                                        </svg>
                                                        <span style={{ fontSize: 12, color: isSel ? "#3d2b1a" : "#7a5a3e", fontWeight: isSel ? 600 : 400 }}>{name.replace("_", " ")}</span>
                                                        {isSel && <span style={{ marginLeft: "auto", fontSize: 10 }}>{FOLDER_EMOJI[name]}</span>}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* MAIN PANEL */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    {!activeData ? (
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 40 }}>
                            <img src="/icon-treasure.png" alt="" style={{ width: 80, opacity: 0.18 }} />
                            <p style={{ color: "#c4a07a", fontSize: 15, fontStyle: "italic" }}>select a folder to open your memories</p>
                            <p style={{ color: "#d4b896", fontSize: 12 }}>✦ ✦ ✦</p>
                        </div>
                    ) : (
                        <FolderView name={selectedFolder} data={activeData} />
                    )}
                </div>
            </div>

            {/* Confirm delete modal */}
            {confirmDelete && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
                    <div style={{ background: "#fffaf5", borderRadius: 20, padding: "32px 36px", width: 340, boxShadow: "0 8px 40px rgba(0,0,0,0.15)", textAlign: "center", fontFamily: "Georgia, serif" }}>
                        <img src="/icon-dump.png" alt="" style={{ width: 52, marginBottom: 14 }} />
                        <h3 style={{ fontSize: 16, color: "#3d2b1a", marginBottom: 8 }}>move {confirmDelete} to dump it?</h3>
                        <p style={{ fontSize: 12, color: "#a08060", marginBottom: 24, lineHeight: 1.6 }}>this wrap will be moved to dump it. you can restore it from there.</p>
                        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                            <button onClick={() => setConfirmDelete(null)} style={{ background: "transparent", border: "1px solid #c4a07a", borderRadius: 20, padding: "8px 20px", fontSize: 13, color: "#7a5a3e", cursor: "pointer", fontFamily: "Georgia, serif" }}>cancel</button>
                            <button onClick={() => handleDelete(confirmDelete)} style={{ background: "#3d2b1a", color: "white", border: "none", borderRadius: 20, padding: "8px 20px", fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif" }}>move it</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function FolderView({ name, data }) {
    const col = FOLDER_COLORS[name]
    const hasContent = data?.text || data?.photos?.length > 0
    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "22px 36px 18px", background: `linear-gradient(135deg, ${col}55 0%, rgba(255,250,244,0.6) 100%)`, borderBottom: "1px solid rgba(180,140,100,0.15)", display: "flex", alignItems: "center", gap: 14 }}>
                <svg viewBox="0 0 40 32" style={{ width: 40, height: 32, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.12))" }}>
                    <path d="M2 8 Q2 6 4 6 L14 6 Q16 6 17 4 L18 2 Q19 0 21 0 L36 0 Q38 0 38 2 L38 8 Z" fill={shade(col, -20)} />
                    <rect x="2" y="8" width="36" height="22" rx="4" fill={col} />
                    <rect x="2" y="8" width="36" height="10" rx="4" fill="white" opacity="0.15" />
                </svg>
                <div>
                    <p style={{ fontSize: 9, letterSpacing: 3, color: "#a08060", textTransform: "uppercase", marginBottom: 2 }}>folder</p>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: "#3d2b1a", textTransform: "capitalize", lineHeight: 1 }}>{name.replace("_", " ")} {FOLDER_EMOJI[name]}</h2>
                </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "28px 36px" }}>
                {!hasContent ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 10 }}>
                        <span style={{ fontSize: 36, opacity: 0.3 }}>{FOLDER_EMOJI[name]}</span>
                        <p style={{ color: "#c4a07a", fontSize: 13, fontStyle: "italic" }}>this folder is empty</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 680 }}>
                        {data.text && (
                            <div style={{ background: "rgba(255,252,248,0.95)", borderRadius: 18, padding: "24px 28px", boxShadow: "0 4px 24px rgba(90,62,43,0.09)", position: "relative", overflow: "hidden" }}>
                                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${col}, ${shade(col, 20)})`, borderRadius: "18px 18px 0 0" }} />
                                <p style={{ fontSize: 9, letterSpacing: 3, color: "#b09070", textTransform: "uppercase", marginBottom: 12, marginTop: 4 }}>✦ reflection</p>
                                <p style={{ fontSize: 15, color: "#3d2b1a", lineHeight: 1.9, whiteSpace: "pre-wrap", fontStyle: "italic" }}>{data.text}</p>
                                {data.comment && (
                                    <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px dashed ${col}`, display: "flex", gap: 10, alignItems: "flex-start" }}>
                                        <span style={{ fontSize: 20, lineHeight: 1, color: col, flexShrink: 0 }}>"</span>
                                        <p style={{ fontSize: 13, color: "#7a5a3e", fontStyle: "italic", lineHeight: 1.7 }}>{data.comment}</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {data.photos?.length > 0 && (
                            <div>
                                <p style={{ fontSize: 9, letterSpacing: 3, color: "#b09070", textTransform: "uppercase", marginBottom: 14 }}>✦ photos</p>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 14 }}>
                                    {data.photos.map((src, i) => (
                                        <div key={i} style={{ borderRadius: 14, overflow: "hidden", boxShadow: "0 6px 20px rgba(90,62,43,0.14)", aspectRatio: "1", transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer" }}
                                            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(90,62,43,0.22)" }}
                                            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(90,62,43,0.14)" }}>
                                            <img src={src} alt={`photo ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
