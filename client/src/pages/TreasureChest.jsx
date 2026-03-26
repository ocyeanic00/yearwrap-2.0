import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import useMemoryStore from "../store/memoryStore"
import FolderModal from "../components/memory/FolderModal"

const FOLDER_META = {
    my_pov: { color: "#c8a882", icon: "ri-eye-line", label: "My POV" },
    peeps: { color: "#a07850", icon: "ri-group-line", label: "Peeps" },
    moments: { color: "#b8956a", icon: "ri-sparkling-line", label: "Moments" },
    triptrip: { color: "#8b6240", icon: "ri-map-2-line", label: "Trip Trip" },
    mood: { color: "#d4b896", icon: "ri-moon-line", label: "Mood" },
    challenges: { color: "#7a5535", icon: "ri-flashlight-line", label: "Challenges" },
}
const FOLDER_NAMES = Object.keys(FOLDER_META)

function shade(hex, p) {
    const n = parseInt(hex.replace("#", ""), 16)
    return `rgb(${Math.min(255, Math.max(0, (n >> 16) + p))},${Math.min(255, Math.max(0, ((n >> 8) & 0xff) + p))},${Math.min(255, Math.max(0, (n & 0xff) + p))})`
}

function FolderSVG({ color, size = 52 }) {
    const dark = shade(color, -28)
    return (
        <svg viewBox="0 0 72 60" style={{ width: size, height: size * 0.83, filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.4))" }}>
            <path d="M3 16 Q3 12 7 12 L26 12 Q29 12 31 9 L33 6 Q35 3 38 3 L65 3 Q69 3 69 7 L69 16 Z" fill={dark} />
            <rect x="3" y="16" width="66" height="40" rx="7" fill={color} />
            <rect x="3" y="16" width="66" height="18" rx="7" fill="white" opacity="0.15" />
        </svg>
    )
}

// -- FOLDER CARD --
function FolderCard({ name, data, onClick }) {
    const [hovered, setHovered] = useState(false)
    const meta = FOLDER_META[name]
    const hasContent = data?.text || data?.photos?.length > 0
    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                padding: "14px 8px 10px", borderRadius: 16, cursor: "pointer",
                background: hovered ? "rgba(200,168,130,0.13)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${hovered ? "rgba(200,168,130,0.35)" : "rgba(200,168,130,0.1)"}`,
                boxShadow: hovered ? `0 0 20px rgba(200,168,130,0.18), 0 4px 16px rgba(0,0,0,0.3)` : "none",
                transform: hovered ? "translateY(-4px) scale(1.04)" : "translateY(0) scale(1)",
                transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
                position: "relative",
            }}>
            <FolderSVG color={meta.color} size={48} />
            <span style={{ fontSize: 10, color: hovered ? "#f5ead8" : "#c8a882", textAlign: "center", lineHeight: 1.3, fontFamily: "Georgia, serif", transition: "color 0.2s" }}>
                {meta.label}
            </span>
            <i className={meta.icon} style={{ fontSize: 12, color: hovered ? "#c8a882" : "rgba(200,168,130,0.45)", transition: "color 0.2s" }} />
            {hasContent && (
                <div style={{ position: "absolute", top: 8, right: 8, width: 7, height: 7, borderRadius: "50%", background: "#c8a882", boxShadow: "0 0 6px rgba(200,168,130,0.6)" }} />
            )}
        </div>
    )
}

// -- JOURNAL SPREAD (folder detail inside card) --
function JournalSpread({ year, folderName, data, onClose, onEdit }) {
    const meta = FOLDER_META[folderName]
    return (
        <div style={{ padding: "14px 18px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <FolderSVG color={meta.color} size={26} />
                    <span style={{ fontSize: 13, color: "#f5ead8", fontWeight: 600, fontFamily: "Georgia, serif" }}>
                        {meta.label} <i className={meta.icon} style={{ fontSize: 12 }} />
                    </span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={onEdit} style={{ background: "rgba(200,168,130,0.15)", border: "none", borderRadius: 8, padding: "5px 12px", color: "#c8a882", fontSize: 11, cursor: "pointer", fontFamily: "Georgia, serif" }}>edit</button>
                    <button onClick={onClose} style={{ background: "none", border: "none", color: "#c8a882", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>x</button>
                </div>
            </div>
            <div style={{ display: "flex", gap: 8, minHeight: 180 }}>
                {/* Text side */}
                <div style={{ flex: 1, background: "rgba(255,245,235,0.05)", border: "1px solid rgba(200,168,130,0.12)", borderRadius: 12, padding: "12px 14px" }}>
                    <p style={{ fontSize: 8, letterSpacing: 2, color: "#c8a882", textTransform: "uppercase", marginBottom: 8, fontFamily: "Georgia, serif" }}>reflection</p>
                    {data?.text
                        ? <p style={{ fontSize: 12, color: "#f5ead8", lineHeight: 1.8, fontStyle: "italic", fontFamily: "Georgia, serif" }}>{data.text}</p>
                        : <p style={{ fontSize: 11, color: "rgba(200,168,130,0.35)", fontStyle: "italic", fontFamily: "Georgia, serif" }}>nothing written yet...</p>
                    }
                    {data?.comment && (
                        <p style={{ fontSize: 11, color: "#c8a882", marginTop: 8, fontStyle: "italic", borderTop: "1px solid rgba(200,168,130,0.12)", paddingTop: 8, fontFamily: "Georgia, serif" }}>"{data.comment}"</p>
                    )}
                </div>
                {/* Photos side */}
                <div style={{ flex: 1, background: "rgba(255,245,235,0.05)", border: "1px solid rgba(200,168,130,0.12)", borderRadius: 12, padding: "12px 14px" }}>
                    <p style={{ fontSize: 8, letterSpacing: 2, color: "#c8a882", textTransform: "uppercase", marginBottom: 8, fontFamily: "Georgia, serif" }}>photos</p>
                    {data?.photos?.length > 0
                        ? <div style={{ display: "grid", gridTemplateColumns: data.photos.length === 1 ? "1fr" : "repeat(2,1fr)", gap: 5 }}>
                            {data.photos.map((src, i) => <img key={i} src={src} alt="" style={{ width: "100%", height: data.photos.length === 1 ? 130 : 65, objectFit: "cover", borderRadius: 8 }} />)}
                        </div>
                        : <div style={{ height: 110, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                            <i className="ri-image-line" style={{ fontSize: 24, color: "rgba(200,168,130,0.25)" }} />
                            <p style={{ fontSize: 11, color: "rgba(200,168,130,0.35)", fontStyle: "italic", fontFamily: "Georgia, serif" }}>no photos yet</p>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

// -- GHOST CARD --
function GhostCard({ year, side, onClick }) {
    const [hovered, setHovered] = useState(false)
    const tx = side === "left" ? "translateX(-260px) translateY(24px) rotateY(16deg) scale(0.82)" : "translateX(260px) translateY(24px) rotateY(-16deg) scale(0.82)"
    return (
        <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
            style={{
                position: "absolute", top: "50%", left: "50%",
                marginTop: -210, marginLeft: -180,
                width: 360, height: 420,
                background: "linear-gradient(160deg,#3a2510,#2a1c0c)",
                border: "1px solid rgba(200,168,130,0.12)",
                borderRadius: 24,
                transform: tx, transformOrigin: side === "left" ? "right center" : "left center",
                perspective: 800,
                opacity: hovered ? 0.72 : 0.5,
                cursor: "pointer", transition: "opacity 0.2s", zIndex: 5,
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: "rgba(245,234,216,0.35)", fontFamily: "Georgia, serif" }}>{year}</span>
        </div>
    )
}

// -- CAROUSEL VIEW --
function CarouselView({ years, wraps, activeIdx, setActiveIdx, onOpenFolder, onDelete, navigate }) {
    const [spreadFolder, setSpreadFolder] = useState(null)
    const activeYear = years[activeIdx]
    const filled = FOLDER_NAMES.filter(fn => wraps[activeYear]?.[fn]?.text || wraps[activeYear]?.[fn]?.photos?.length > 0).length

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
            {years[activeIdx - 1] && <GhostCard year={years[activeIdx - 1]} side="left" onClick={() => { setSpreadFolder(null); setActiveIdx(activeIdx - 1) }} />}
            {years[activeIdx + 1] && <GhostCard year={years[activeIdx + 1]} side="right" onClick={() => { setSpreadFolder(null); setActiveIdx(activeIdx + 1) }} />}

            {/* Main card */}
            <div style={{
                width: "min(380px, calc(100vw - 120px))", minHeight: 440,
                background: "linear-gradient(160deg,#3d2810 0%,#2e1f0e 100%)",
                border: "1px solid rgba(200,168,130,0.22)",
                borderRadius: 24,
                boxShadow: "0 24px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(200,168,130,0.08)",
                position: "relative", zIndex: 10, overflow: "hidden",
                transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                display: "flex", flexDirection: "column",
            }}>
                {/* Card header */}
                <div style={{ padding: "20px 22px 14px", borderBottom: "1px solid rgba(200,168,130,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                        <p style={{ margin: 0, fontSize: 9, letterSpacing: 3, color: "rgba(200,168,130,0.45)", textTransform: "uppercase", fontFamily: "Georgia, serif" }}>yearwrap</p>
                        <span style={{ fontSize: 32, fontWeight: 700, color: "#f5ead8", letterSpacing: -1, fontFamily: "Georgia, serif", lineHeight: 1.1 }}>{activeYear}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                        <button onClick={() => onDelete(activeYear)}
                            style={{ background: "rgba(180,60,60,0.15)", border: "none", borderRadius: 8, width: 28, height: 28, color: "#e08080", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <i className="ri-delete-bin-6-line" style={{ fontSize: 13 }} />
                        </button>
                        <span style={{ fontSize: 9, color: "rgba(200,168,130,0.45)", fontFamily: "Georgia, serif" }}>{filled}/{FOLDER_NAMES.length} filled</span>
                    </div>
                </div>

                {/* Folder grid or spread */}
                <div style={{ flex: 1 }}>
                    {spreadFolder ? (
                        <JournalSpread year={activeYear} folderName={spreadFolder}
                            data={wraps[activeYear]?.[spreadFolder]}
                            onClose={() => setSpreadFolder(null)}
                            onEdit={() => { onOpenFolder(activeYear, spreadFolder); setSpreadFolder(null) }} />
                    ) : (
                        <div style={{ padding: "16px 18px 10px" }}>
                            <p style={{ fontSize: 9, letterSpacing: 2, color: "rgba(200,168,130,0.4)", textTransform: "uppercase", marginBottom: 12, fontFamily: "Georgia, serif" }}>tap a folder to explore</p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                                {FOLDER_NAMES.map(fn => (
                                    <FolderCard key={fn} name={fn} data={wraps[activeYear]?.[fn]} onClick={() => setSpreadFolder(fn)} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Year Wrap CTA */}
                {!spreadFolder && (
                    <div style={{ padding: "12px 18px 18px" }}>
                        <button onClick={() => navigate("/recap")}
                            style={{
                                width: "100%", padding: "12px", borderRadius: 14, border: "none", cursor: "pointer",
                                background: "linear-gradient(135deg, #6b4226 0%, #c8a882 100%)",
                                color: "#1e0e06", fontSize: 13, fontWeight: 700, fontFamily: "Georgia, serif",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                boxShadow: "0 4px 20px rgba(200,168,130,0.3)",
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(200,168,130,0.45)" }}
                            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(200,168,130,0.3)" }}>
                            <i className="ri-sparkling-line" style={{ fontSize: 15 }} />
                            view year recap
                        </button>
                    </div>
                )}
            </div>

            {/* Dots */}
            <div style={{ display: "flex", gap: 5, marginTop: 18, alignItems: "center" }}>
                {years.map((yr, i) => (
                    <button key={yr} onClick={() => { setSpreadFolder(null); setActiveIdx(i) }}
                        style={{ width: i === activeIdx ? 18 : 6, height: 6, borderRadius: 3, background: i === activeIdx ? "#c8a882" : "rgba(200,168,130,0.28)", border: "none", cursor: "pointer", transition: "all 0.25s", padding: 0, flexShrink: 0 }} />
                ))}
            </div>

            {/* Arrow nav */}
            {activeIdx > 0 && (
                <button onClick={() => { setSpreadFolder(null); setActiveIdx(activeIdx - 1) }}
                    style={{ position: "absolute", left: "calc(50% - 230px)", top: "50%", transform: "translateY(-50%)", background: "rgba(200,168,130,0.12)", border: "1px solid rgba(200,168,130,0.2)", borderRadius: "50%", width: 40, height: 40, color: "#c8a882", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5, transition: "all 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(200,168,130,0.22)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(200,168,130,0.12)"}>&lsaquo;</button>
            )}
            {activeIdx < years.length - 1 && (
                <button onClick={() => { setSpreadFolder(null); setActiveIdx(activeIdx + 1) }}
                    style={{ position: "absolute", right: "calc(50% - 230px)", top: "50%", transform: "translateY(-50%)", background: "rgba(200,168,130,0.12)", border: "1px solid rgba(200,168,130,0.2)", borderRadius: "50%", width: 40, height: 40, color: "#c8a882", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5, transition: "all 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(200,168,130,0.22)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(200,168,130,0.12)"}>&rsaquo;</button>
            )}
        </div>
    )
}

// -- GRID VIEW --
function GridView({ years, wraps, onSelect, onDelete }) {
    return (
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 28px 40px" }}>
            <p style={{ fontSize: 9, letterSpacing: 3, color: "rgba(200,168,130,0.45)", textTransform: "uppercase", marginBottom: 16, fontFamily: "Georgia, serif" }}>
                all years — {years.length} wrap{years.length !== 1 ? "s" : ""}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                {years.map(yr => {
                    const folders = wraps[yr] || {}
                    const filled = FOLDER_NAMES.filter(fn => folders[fn]?.text || folders[fn]?.photos?.length > 0).length
                    return (
                        <div key={yr} onClick={() => onSelect(yr)}
                            style={{ background: "rgba(255,245,235,0.05)", border: "1px solid rgba(200,168,130,0.14)", borderRadius: 18, padding: "18px 16px", cursor: "pointer", transition: "all 0.2s", position: "relative" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(200,168,130,0.1)"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = "rgba(200,168,130,0.3)" }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,245,235,0.05)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(200,168,130,0.14)" }}>
                            <p style={{ fontSize: 24, fontWeight: 700, color: "#f5ead8", marginBottom: 2, fontFamily: "Georgia, serif" }}>{yr}</p>
                            <p style={{ fontSize: 10, color: "rgba(200,168,130,0.5)", marginBottom: 14, fontStyle: "italic", fontFamily: "Georgia, serif" }}>{filled}/{FOLDER_NAMES.length} folders filled</p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
                                {FOLDER_NAMES.map(fn => (
                                    <div key={fn} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                                        <FolderSVG color={FOLDER_META[fn].color} size={30} />
                                        <i className={FOLDER_META[fn].icon} style={{ fontSize: 9, color: "rgba(200,168,130,0.5)" }} />
                                    </div>
                                ))}
                            </div>
                            {/* Progress bar */}
                            <div style={{ marginTop: 12, height: 3, background: "rgba(200,168,130,0.12)", borderRadius: 2, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${(filled / FOLDER_NAMES.length) * 100}%`, background: "linear-gradient(90deg,#6b4226,#c8a882)", borderRadius: 2 }} />
                            </div>
                            <button onClick={e => { e.stopPropagation(); onDelete(yr) }}
                                style={{ position: "absolute", top: 12, right: 12, background: "rgba(180,60,60,0.15)", border: "none", borderRadius: 8, width: 26, height: 26, color: "#e08080", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <i className="ri-delete-bin-6-line" style={{ fontSize: 12 }} />
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// -- MAIN --
export default function TreasureChest() {
    const navigate = useNavigate()
    const wraps = useMemoryStore(s => s.wraps)
    const deleteWrap = useMemoryStore(s => s.deleteWrap)
    const years = Object.keys(wraps).map(Number).sort((a, b) => b - a)

    const [activeIdx, setActiveIdx] = useState(0)
    const [openFolder, setOpenFolder] = useState(null)
    const [deleteConfirm, setDeleteConfirm] = useState(null)
    const [view, setView] = useState("carousel")
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const searchRef = useRef(null)

    const searchResults = searchQuery.trim().length > 1
        ? years.flatMap(yr => FOLDER_NAMES.flatMap(fn => {
            const d = wraps[yr]?.[fn]; const hits = []
            if (d?.text?.toLowerCase().includes(searchQuery.toLowerCase())) hits.push({ year: yr, folder: fn, snippet: d.text })
            if (d?.comment?.toLowerCase().includes(searchQuery.toLowerCase())) hits.push({ year: yr, folder: fn, snippet: d.comment })
            return hits
        }))
        : []

    const handleDelete = () => { deleteWrap(deleteConfirm); setDeleteConfirm(null); setActiveIdx(0) }

    // Empty state
    if (years.length === 0) return (
        <div style={{ width: "100vw", height: "100vh", background: "linear-gradient(160deg,#1e0e06,#3d2810)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", flexDirection: "column", gap: 14 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(200,168,130,0.08)", border: "1px solid rgba(200,168,130,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="ri-archive-line" style={{ fontSize: 32, color: "rgba(200,168,130,0.35)" }} />
            </div>
            <h2 style={{ margin: 0, fontSize: 20, color: "#f5ead8", fontWeight: 600 }}>no year wraps yet 🥺</h2>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(200,168,130,0.45)", fontStyle: "italic" }}>your memories will live here</p>
            <button onClick={() => navigate("/")} style={{ marginTop: 8, background: "#c8a882", border: "none", borderRadius: 20, padding: "10px 26px", color: "#3b2314", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                <i className="ri-add-line" /> create your first yearwrap
            </button>
        </div>
    )

    return (
        <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", fontFamily: "Georgia, serif", background: "linear-gradient(160deg,#1e0e06 0%,#3d2810 50%,#4a3018 100%)" }}>
            <style>{`
        .tc-topbtn { background: rgba(255,255,255,0.06); border: 1px solid rgba(200,168,130,0.18); border-radius: 10px; width: 36px; height: 36px; color: #c8a882; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
        .tc-topbtn:hover, .tc-topbtn.active { background: rgba(200,168,130,0.2); color: #f5ead8; }
        @media (max-width: 600px) {
          .tc-ghost { display: none !important; }
          .tc-arrow { display: none !important; }
        }
      `}</style>

            {/* Ambient glow */}
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(ellipse at 25% 20%, rgba(200,168,130,0.07) 0%, transparent 55%), radial-gradient(ellipse at 75% 80%, rgba(107,66,38,0.12) 0%, transparent 55%)" }} />

            {/* TOP BAR */}
            <div style={{ position: "relative", zIndex: 30, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px 12px" }}>
                <button onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(200,168,130,0.6)", fontSize: 13, fontFamily: "Georgia, serif", display: "flex", alignItems: "center", gap: 5, transition: "color 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#c8a882"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(200,168,130,0.6)"}>
                    <i className="ri-arrow-left-line" style={{ fontSize: 15 }} /> home
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <i className="ri-treasure-map-line" style={{ fontSize: 20, color: "#c8a882" }} />
                    <span style={{ fontSize: 15, color: "#f5ead8", fontWeight: 700, letterSpacing: 0.3, fontFamily: "Georgia, serif" }}>treasure chest</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button className={`tc-topbtn${view === "grid" ? " active" : ""}`} onClick={() => setView(v => v === "grid" ? "carousel" : "grid")} title="toggle view">
                        <i className={view === "grid" ? "ri-layout-masonry-line" : "ri-layout-grid-line"} />
                    </button>
                    <button className={`tc-topbtn${searchOpen ? " active" : ""}`} onClick={() => { setSearchOpen(s => !s); setTimeout(() => searchRef.current?.focus(), 80) }} title="search">
                        <i className="ri-search-line" />
                    </button>
                </div>
            </div>

            {/* SEARCH */}
            {searchOpen && (
                <div style={{ position: "relative", zIndex: 25, padding: "0 24px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(200,168,130,0.25)", borderRadius: 24, padding: "8px 18px" }}>
                        <i className="ri-search-line" style={{ color: "#c8a882", fontSize: 14 }} />
                        <input ref={searchRef} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="search across all memories..."
                            style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#f5ead8", fontSize: 13, fontFamily: "Georgia, serif" }} />
                        {searchQuery && <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", color: "#c8a882", cursor: "pointer", fontSize: 16 }}>x</button>}
                    </div>
                    {searchQuery.trim().length > 1 && (
                        <div style={{ background: "rgba(22,9,3,0.97)", border: "1px solid rgba(200,168,130,0.15)", borderRadius: 14, maxHeight: 200, overflowY: "auto", padding: "6px 0" }}>
                            {searchResults.length === 0
                                ? <p style={{ color: "rgba(200,168,130,0.45)", fontSize: 12, fontStyle: "italic", padding: "10px 18px", fontFamily: "Georgia, serif" }}>no results found</p>
                                : searchResults.map((r, i) => (
                                    <button key={i} onClick={() => { setActiveIdx(years.indexOf(r.year)); setView("carousel"); setSearchOpen(false); setSearchQuery("") }}
                                        style={{ display: "block", width: "100%", background: "none", border: "none", padding: "10px 18px", textAlign: "left", cursor: "pointer", borderBottom: "1px solid rgba(200,168,130,0.07)" }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(200,168,130,0.1)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "none"}>
                                        <span style={{ fontSize: 10, color: "#c8a882", fontFamily: "Georgia, serif" }}>{r.year} · {r.folder.replace("_", " ")}</span>
                                        <p style={{ fontSize: 12, color: "#f5ead8", marginTop: 2, fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "Georgia, serif" }}>"{r.snippet.slice(0, 70)}{r.snippet.length > 70 ? "…" : ""}"</p>
                                    </button>
                                ))
                            }
                        </div>
                    )}
                </div>
            )}

            {/* VIEWS */}
            {view === "grid"
                ? <GridView years={years} wraps={wraps} onSelect={yr => { setActiveIdx(years.indexOf(yr)); setView("carousel") }} onDelete={setDeleteConfirm} />
                : <CarouselView years={years} wraps={wraps} activeIdx={activeIdx} setActiveIdx={setActiveIdx}
                    onOpenFolder={(yr, fn) => setOpenFolder({ year: yr, name: fn })} onDelete={setDeleteConfirm} navigate={navigate} />
            }

            {/* FOLDER MODAL */}
            {openFolder && <FolderModal name={openFolder.name} year={openFolder.year} onClose={() => setOpenFolder(null)} />}

            {/* DELETE CONFIRM */}
            {deleteConfirm && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
                    <div style={{ background: "rgba(30,14,6,0.97)", border: "1px solid rgba(200,168,130,0.22)", borderRadius: 22, padding: "36px 40px", width: "min(340px,90vw)", textAlign: "center", fontFamily: "Georgia, serif", boxShadow: "0 16px 60px rgba(0,0,0,0.6)" }}>
                        <i className="ri-delete-bin-2-line" style={{ fontSize: 36, color: "#e08080" }} />
                        <h3 style={{ fontSize: 16, color: "#f5ead8", margin: "14px 0 8px" }}>move {deleteConfirm} to dump it?</h3>
                        <p style={{ fontSize: 12, color: "rgba(200,168,130,0.55)", marginBottom: 26, lineHeight: 1.7 }}>this wrap will be moved to dump it. you can restore it anytime.</p>
                        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                            <button onClick={() => setDeleteConfirm(null)} style={{ background: "transparent", border: "1px solid rgba(200,168,130,0.35)", borderRadius: 20, padding: "9px 22px", fontSize: 13, color: "#c8a882", cursor: "pointer", fontFamily: "Georgia, serif" }}>cancel</button>
                            <button onClick={handleDelete} style={{ background: "#7a2020", color: "white", border: "none", borderRadius: 20, padding: "9px 22px", fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif" }}>move to dump</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
