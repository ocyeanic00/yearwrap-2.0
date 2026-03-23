import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import useMemoryStore from "../store/memoryStore"
import FolderModal from "../components/memory/FolderModal"

const FOLDER_COLORS = {
    my_pov: "#e8dcc8", peeps: "#c8c0b0", moments: "#d4b896",
    triptrip: "#ddd0a8", mood: "#c0b8a8", challenges: "#ccc0a8",
}
const FOLDER_ICONS = {
    my_pov: "ri-eye-line", peeps: "ri-group-line", moments: "ri-sparkling-line",
    triptrip: "ri-map-2-line", mood: "ri-moon-line", challenges: "ri-flashlight-line",
}
const FOLDER_NAMES = ["my_pov", "peeps", "moments", "triptrip", "mood", "challenges"]

function shade(hex, p) {
    const n = parseInt(hex.replace("#", ""), 16)
    return `rgb(${Math.min(255, Math.max(0, (n >> 16) + p))},${Math.min(255, Math.max(0, ((n >> 8) & 0xff) + p))},${Math.min(255, Math.max(0, (n & 0xff) + p))})`
}

function FolderSVG({ color, size = 52 }) {
    const dark = shade(color, -22)
    return (
        <svg viewBox="0 0 72 60" style={{ width: size, height: size * 0.83 }}>
            <path d="M3 16 Q3 12 7 12 L26 12 Q29 12 31 9 L33 6 Q35 3 38 3 L65 3 Q69 3 69 7 L69 16 Z" fill={dark} />
            <rect x="3" y="16" width="66" height="40" rx="7" fill={color} />
            <rect x="3" y="16" width="66" height="18" rx="7" fill="white" opacity="0.13" />
        </svg>
    )
}

function TopBtn({ children, onClick, active, title }) {
    return (
        <button onClick={onClick} title={title} style={{
            background: active ? "rgba(196,160,122,0.25)" : "rgba(255,255,255,0.06)",
            border: "1px solid rgba(196,160,122,0.2)",
            borderRadius: 10, width: 36, height: 36,
            color: active ? "#f5e8d0" : "#c4a07a",
            cursor: "pointer", fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s",
        }}>
            <i className={children} />
        </button>
    )
}

// ── GRID VIEW ──
function GridView({ years, wraps, onSelect, onDelete }) {
    return (
        <div style={{ flex: 1, overflowY: "auto", padding: "10px 32px 40px" }}>
            <p style={{ fontSize: 9, letterSpacing: 3, color: "#c4a07a", textTransform: "uppercase", marginBottom: 18 }}>all years — {years.length} wrap{years.length !== 1 ? "s" : ""}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 18 }}>
                {years.map((yr) => {
                    const folders = wraps[yr] || {}
                    const hasContent = FOLDER_NAMES.some(fn => folders[fn]?.text || folders[fn]?.photos?.length > 0)
                    return (
                        <div key={yr}
                            onClick={() => onSelect(yr)}
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(196,160,122,0.15)", borderRadius: 18, padding: "20px 18px", cursor: "pointer", transition: "all 0.2s", position: "relative" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(196,160,122,0.1)"; e.currentTarget.style.transform = "translateY(-2px)" }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "translateY(0)" }}
                        >
                            <p style={{ fontSize: 22, fontWeight: 700, color: "#f5e8d0", marginBottom: 4 }}>{yr}</p>
                            <p style={{ fontSize: 10, color: "#c4a07a", marginBottom: 14, fontStyle: "italic" }}>{hasContent ? "has memories" : "empty wrap"}</p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
                                {FOLDER_NAMES.map(fn => (
                                    <div key={fn} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                                        <FolderSVG color={FOLDER_COLORS[fn]} size={32} />
                                        <i className={FOLDER_ICONS[fn]} style={{ fontSize: 10, color: "#c4a07a" }} />
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={e => { e.stopPropagation(); onDelete(yr) }}
                                style={{ position: "absolute", top: 12, right: 12, background: "rgba(180,60,60,0.15)", border: "none", borderRadius: 8, width: 26, height: 26, color: "#e08080", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                            ><i className="ri-delete-bin-6-line" style={{ fontSize: 13 }} /></button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// ── CAROUSEL VIEW ──
function CarouselView({ years, wraps, activeIdx, setActiveIdx, onOpenFolder, onDelete }) {
    const [spreadFolder, setSpreadFolder] = useState(null) // folder name currently open in journal spread

    const activeYear = years[activeIdx]
    const prevYear = years[activeIdx - 1]
    const nextYear = years[activeIdx + 1]

    const handleFolderClick = (fn) => {
        setSpreadFolder(fn)
    }

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", height: "calc(100vh - 120px)" }}>

            {/* Ghost card — prev year */}
            {prevYear && (
                <GhostCard year={prevYear} side="left" onClick={() => { setSpreadFolder(null); setActiveIdx(activeIdx - 1) }} />
            )}

            {/* Ghost card — next year */}
            {nextYear && (
                <GhostCard year={nextYear} side="right" onClick={() => { setSpreadFolder(null); setActiveIdx(activeIdx + 1) }} />
            )}

            {/* Main card */}
            <div style={{
                width: 360, minHeight: 420,
                background: "linear-gradient(160deg, #3d2810 0%, #2e1f0e 100%)",
                border: "1px solid rgba(196,160,122,0.25)",
                borderRadius: 24,
                boxShadow: "0 20px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(196,160,122,0.1)",
                position: "relative", zIndex: 10,
                overflow: "hidden",
                transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
            }}>
                {/* Card top strip */}
                <div style={{ padding: "20px 24px 14px", borderBottom: "1px solid rgba(196,160,122,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 26, fontWeight: 700, color: "#f5e8d0", letterSpacing: -0.5 }}>{activeYear}</span>
                    <div style={{ display: "flex", gap: 6 }}>
                        <span style={{ fontSize: 10, color: "#c4a07a", fontStyle: "italic", alignSelf: "center" }}>year wrap</span>
                        <button onClick={() => onDelete(activeYear)}
                            style={{ background: "rgba(180,60,60,0.15)", border: "none", borderRadius: 8, width: 28, height: 28, color: "#e08080", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <i className="ri-delete-bin-6-line" style={{ fontSize: 14 }} />
                        </button>
                    </div>
                </div>

                {/* Folder grid or journal spread */}
                {spreadFolder ? (
                    <JournalSpread
                        year={activeYear}
                        folderName={spreadFolder}
                        data={wraps[activeYear]?.[spreadFolder] || { text: "", comment: "", photos: [] }}
                        onClose={() => setSpreadFolder(null)}
                        onEdit={() => { onOpenFolder(activeYear, spreadFolder); setSpreadFolder(null) }}
                    />
                ) : (
                    <div style={{ padding: "20px 24px 24px" }}>
                        <p style={{ fontSize: 9, letterSpacing: 2.5, color: "#c4a07a", textTransform: "uppercase", marginBottom: 16 }}>tap a folder to open</p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                            {FOLDER_NAMES.map((fn) => {
                                const d = wraps[activeYear]?.[fn]
                                const hasContent = d?.text || d?.photos?.length > 0
                                return (
                                    <div key={fn}
                                        onClick={() => handleFolderClick(fn)}
                                        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer", padding: "10px 6px", borderRadius: 12, transition: "all 0.18s", position: "relative" }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(196,160,122,0.1)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                    >
                                        <FolderSVG color={FOLDER_COLORS[fn]} size={52} />
                                        <span style={{ fontSize: 9, color: "#c4a07a", textAlign: "center", lineHeight: 1.3 }}>{fn.replace("_", " ")}</span>
                                        <i className={FOLDER_ICONS[fn]} style={{ fontSize: 13, color: "#c4a07a" }} />
                                        {hasContent && <div style={{ position: "absolute", top: 8, right: 8, width: 6, height: 6, borderRadius: "50%", background: "#c4a07a" }} />}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Year dots */}
            <div style={{ display: "flex", gap: 5, marginTop: 20, alignItems: "center" }}>
                {years.map((yr, i) => (
                    <button key={yr} onClick={() => { setSpreadFolder(null); setActiveIdx(i) }}
                        style={{ width: i === activeIdx ? 16 : 5, height: 5, borderRadius: 3, background: i === activeIdx ? "#c4a07a" : "rgba(196,160,122,0.3)", border: "none", cursor: "pointer", transition: "all 0.25s", padding: 0, flexShrink: 0 }} />
                ))}
            </div>

            {/* Arrow nav */}
            {activeIdx > 0 && (
                <button onClick={() => { setSpreadFolder(null); setActiveIdx(activeIdx - 1) }}
                    style={{ position: "absolute", left: "calc(50% - 230px)", top: "50%", transform: "translateY(-50%)", background: "rgba(196,160,122,0.12)", border: "1px solid rgba(196,160,122,0.2)", borderRadius: "50%", width: 38, height: 38, color: "#c4a07a", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5 }}>
                    ‹
                </button>
            )}
            {activeIdx < years.length - 1 && (
                <button onClick={() => { setSpreadFolder(null); setActiveIdx(activeIdx + 1) }}
                    style={{ position: "absolute", right: "calc(50% - 230px)", top: "50%", transform: "translateY(-50%)", background: "rgba(196,160,122,0.12)", border: "1px solid rgba(196,160,122,0.2)", borderRadius: "50%", width: 38, height: 38, color: "#c4a07a", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5 }}>
                    ›
                </button>
            )}
        </div>
    )
}

// ── GHOST CARD ──
function GhostCard({ year, side, onClick }) {
    const transform = side === "left"
        ? "translateX(-260px) translateY(20px) rotateY(18deg) scale(0.82)"
        : "translateX(260px) translateY(20px) rotateY(-18deg) scale(0.82)"
    return (
        <div onClick={onClick} style={{
            position: "absolute", top: "50%", left: "50%",
            marginTop: -210, marginLeft: -180,
            width: 360, height: 420,
            background: "linear-gradient(160deg, #3a2510 0%, #2a1c0c 100%)",
            border: "1px solid rgba(196,160,122,0.12)",
            borderRadius: 24,
            transform, transformOrigin: side === "left" ? "right center" : "left center",
            perspective: 800,
            opacity: 0.55,
            cursor: "pointer",
            transition: "opacity 0.2s",
            zIndex: 5,
            display: "flex", alignItems: "center", justifyContent: "center",
        }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
            onMouseLeave={e => e.currentTarget.style.opacity = "0.55"}
        >
            <span style={{ fontSize: 28, fontWeight: 700, color: "rgba(245,232,208,0.4)" }}>{year}</span>
        </div>
    )
}

// ── JOURNAL SPREAD ──
function JournalSpread({ year, folderName, data, onClose, onEdit }) {
    const color = FOLDER_COLORS[folderName]
    const hasPhotos = data.photos?.length > 0
    const hasText = !!data.text

    return (
        <div style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Spread header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <FolderSVG color={color} size={28} />
                    <span style={{ fontSize: 13, color: "#f5e8d0", fontWeight: 600 }}>{folderName.replace("_", " ")} <i className={FOLDER_ICONS[folderName]} style={{ fontSize: 13 }} /></span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={onEdit} style={{ background: "rgba(196,160,122,0.15)", border: "none", borderRadius: 8, padding: "5px 12px", color: "#c4a07a", fontSize: 11, cursor: "pointer", fontFamily: "Georgia, serif" }}>edit</button>
                    <button onClick={onClose} style={{ background: "none", border: "none", color: "#c4a07a", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>
                </div>
            </div>

            {/* Journal pages */}
            <div style={{ display: "flex", gap: 10, minHeight: 200 }}>
                {/* Left page — text */}
                <div style={{ flex: 1, background: "rgba(245,232,208,0.06)", border: "1px solid rgba(196,160,122,0.12)", borderRadius: 12, padding: "14px 14px", position: "relative" }}>
                    <p style={{ fontSize: 8, letterSpacing: 2, color: "#c4a07a", textTransform: "uppercase", marginBottom: 10 }}>reflection</p>
                    {hasText ? (
                        <p style={{ fontSize: 12, color: "#f5e8d0", lineHeight: 1.8, fontStyle: "italic" }}>{data.text}</p>
                    ) : (
                        <p style={{ fontSize: 11, color: "rgba(196,160,122,0.4)", fontStyle: "italic" }}>nothing written yet...</p>
                    )}
                    {data.comment && (
                        <p style={{ fontSize: 11, color: "#c4a07a", marginTop: 10, fontStyle: "italic", borderTop: "1px solid rgba(196,160,122,0.15)", paddingTop: 8 }}>"{data.comment}"</p>
                    )}
                </div>

                {/* Right page — photos */}
                <div style={{ flex: 1, background: "rgba(245,232,208,0.06)", border: "1px solid rgba(196,160,122,0.12)", borderRadius: 12, padding: "14px 14px" }}>
                    <p style={{ fontSize: 8, letterSpacing: 2, color: "#c4a07a", textTransform: "uppercase", marginBottom: 10 }}>photos</p>
                    {hasPhotos ? (
                        <div style={{ display: "grid", gridTemplateColumns: data.photos.length === 1 ? "1fr" : "repeat(2,1fr)", gap: 6 }}>
                            {data.photos.map((src, i) => (
                                <img key={i} src={src} alt="" style={{ width: "100%", height: data.photos.length === 1 ? 140 : 70, objectFit: "cover", borderRadius: 8 }} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <p style={{ fontSize: 11, color: "rgba(196,160,122,0.4)", fontStyle: "italic" }}>no photos yet...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// ── MAIN COMPONENT ──
export default function TreasureChest() {
    const navigate = useNavigate()
    const wraps = useMemoryStore((s) => s.wraps)
    const deleteWrap = useMemoryStore((s) => s.deleteWrap)

    const years = Object.keys(wraps).map(Number).sort((a, b) => b - a)

    const [activeIdx, setActiveIdx] = useState(0)
    const [openFolder, setOpenFolder] = useState(null)
    const [deleteConfirm, setDeleteConfirm] = useState(null)
    const [view, setView] = useState("carousel")
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [menuOpen, setMenuOpen] = useState(false)
    const searchRef = useRef(null)

    const searchResults = searchQuery.trim().length > 1
        ? years.flatMap((yr) =>
            FOLDER_NAMES.flatMap((fn) => {
                const d = wraps[yr]?.[fn]
                const hits = []
                if (d?.text?.toLowerCase().includes(searchQuery.toLowerCase()))
                    hits.push({ year: yr, folder: fn, snippet: d.text })
                if (d?.comment?.toLowerCase().includes(searchQuery.toLowerCase()))
                    hits.push({ year: yr, folder: fn, snippet: d.comment })
                return hits
            })
        )
        : []

    const handleDelete = () => {
        deleteWrap(deleteConfirm)
        setDeleteConfirm(null)
        setActiveIdx(0)
    }

    if (years.length === 0) {
        return (
            <div style={{ width: "100vw", height: "100vh", background: "linear-gradient(160deg,#2e1f0e,#4a3018)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", color: "#c4a07a", flexDirection: "column", gap: 12 }}>
                <i className="ri-archive-line" style={{ fontSize: 52, color: "#c4a07a", opacity: 0.3 }} />
                <p style={{ fontSize: 14, fontStyle: "italic" }}>no year wraps yet</p>
                <button onClick={() => navigate("/")} style={{ marginTop: 8, background: "transparent", border: "1px solid #c4a07a", borderRadius: 20, padding: "8px 20px", color: "#c4a07a", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                    <i className="ri-arrow-left-line" /> go home
                </button>
            </div>
        )
    }

    return (
        <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", fontFamily: "Georgia, serif", background: "linear-gradient(160deg,#2e1f0e 0%,#3d2810 50%,#4a3018 100%)" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 30% 20%, rgba(196,160,122,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(90,62,43,0.15) 0%, transparent 60%)", pointerEvents: "none" }} />

            {/* TOP BAR */}
            <div style={{ position: "relative", zIndex: 30, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 28px 14px" }}>
                <button onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer", color: "#c4a07a", fontSize: 13, fontFamily: "Georgia, serif", display: "flex", alignItems: "center", gap: 5 }}>
                    <i className="ri-arrow-left-line" style={{ fontSize: 16 }} /> home
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <img src="/icon-treasure.png" alt="" style={{ width: 26, height: 26, objectFit: "contain" }} />
                    <span style={{ fontSize: 15, color: "#f5e8d0", fontWeight: 700, letterSpacing: 0.5 }}>treasure chest</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <TopBtn active={view === "grid"} onClick={() => { setView(v => v === "grid" ? "carousel" : "grid"); setMenuOpen(false); setSearchOpen(false) }} title="toggle grid view">ri-layout-grid-line</TopBtn>
                    <TopBtn active={searchOpen} onClick={() => { setSearchOpen(s => !s); setMenuOpen(false); setTimeout(() => searchRef.current?.focus(), 80) }} title="search memories">ri-search-line</TopBtn>
                    <div style={{ position: "relative" }}>
                        <TopBtn active={menuOpen} onClick={() => { setMenuOpen(m => !m); setSearchOpen(false) }} title="menu">ri-menu-line</TopBtn>
                        {menuOpen && (
                            <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#3d2810", border: "1px solid rgba(196,160,122,0.2)", borderRadius: 14, overflow: "hidden", minWidth: 190, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", zIndex: 50 }}>
                                {[
                                    { label: "go home", icon: "ri-home-4-line", action: () => navigate("/") },
                                    { label: "dump it", icon: "ri-delete-bin-2-line", action: () => navigate("/dump-it") },
                                    { label: "add new year wrap", icon: "ri-add-circle-line", action: () => setMenuOpen(false) },
                                ].map((item) => (
                                    <button key={item.label} onClick={() => { item.action(); setMenuOpen(false) }}
                                        style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", background: "none", border: "none", padding: "12px 18px", textAlign: "left", color: "#f5e8d0", fontSize: 13, fontFamily: "Georgia, serif", cursor: "pointer", borderBottom: "1px solid rgba(196,160,122,0.08)" }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(196,160,122,0.12)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "none"}
                                    ><i className={item.icon} style={{ fontSize: 15 }} />{item.label}</button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* SEARCH BAR */}
            {searchOpen && (
                <div style={{ position: "relative", zIndex: 25, padding: "0 28px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(196,160,122,0.25)", borderRadius: 24, padding: "8px 18px" }}>
                        <i className="ri-search-line" style={{ color: "#c4a07a", fontSize: 15 }} />
                        <input ref={searchRef} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            placeholder="search across all memories..."
                            style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#f5e8d0", fontSize: 13, fontFamily: "Georgia, serif" }} />
                        {searchQuery && <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", color: "#c4a07a", cursor: "pointer", fontSize: 16 }}>×</button>}
                    </div>
                    {searchQuery.trim().length > 1 && (
                        <div style={{ background: "rgba(30,18,8,0.95)", border: "1px solid rgba(196,160,122,0.15)", borderRadius: 14, maxHeight: 220, overflowY: "auto", padding: "8px 0" }}>
                            {searchResults.length === 0 ? (
                                <p style={{ color: "#c4a07a", fontSize: 12, fontStyle: "italic", padding: "10px 18px" }}>no results found</p>
                            ) : searchResults.map((r, i) => (
                                <button key={i}
                                    onClick={() => { const idx = years.indexOf(r.year); setActiveIdx(idx); setView("carousel"); setSearchOpen(false); setSearchQuery("") }}
                                    style={{ display: "block", width: "100%", background: "none", border: "none", padding: "10px 18px", textAlign: "left", cursor: "pointer", borderBottom: "1px solid rgba(196,160,122,0.07)" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(196,160,122,0.1)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                                >
                                    <span style={{ fontSize: 11, color: "#c4a07a" }}>{r.year} · {r.folder.replace("_", " ")} <i className={FOLDER_ICONS[r.folder]} style={{ fontSize: 11 }} /></span>
                                    <p style={{ fontSize: 12, color: "#f5e8d0", marginTop: 2, fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        "{r.snippet.slice(0, 70)}{r.snippet.length > 70 ? "..." : ""}"
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* VIEWS */}
            {view === "grid" ? (
                <GridView years={years} wraps={wraps} onSelect={(yr) => { setActiveIdx(years.indexOf(yr)); setView("carousel") }} onDelete={setDeleteConfirm} />
            ) : (
                <CarouselView years={years} wraps={wraps} activeIdx={activeIdx} setActiveIdx={setActiveIdx}
                    onOpenFolder={(yr, fn) => setOpenFolder({ year: yr, name: fn })} onDelete={setDeleteConfirm} />
            )}

            {/* FOLDER MODAL */}
            {openFolder && (
                <FolderModal name={openFolder.name} year={openFolder.year} onClose={() => setOpenFolder(null)} />
            )}

            {/* DELETE CONFIRM */}
            {deleteConfirm && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
                    <div style={{ background: "#2e1f0e", border: "1px solid rgba(196,160,122,0.25)", borderRadius: 22, padding: "36px 40px", width: 340, textAlign: "center", fontFamily: "Georgia, serif", boxShadow: "0 12px 60px rgba(0,0,0,0.5)" }}>
                        <i className="ri-delete-bin-2-line" style={{ fontSize: 38, color: "#e08080" }} />
                        <h3 style={{ fontSize: 16, color: "#f5e8d0", margin: "14px 0 8px" }}>move {deleteConfirm} to dump it?</h3>
                        <p style={{ fontSize: 12, color: "#c4a07a", marginBottom: 26, lineHeight: 1.7 }}>this wrap will be moved to dump it. you can restore it anytime.</p>
                        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                            <button onClick={() => setDeleteConfirm(null)} style={{ background: "transparent", border: "1px solid rgba(196,160,122,0.4)", borderRadius: 20, padding: "9px 22px", fontSize: 13, color: "#c4a07a", cursor: "pointer", fontFamily: "Georgia, serif" }}>cancel</button>
                            <button onClick={handleDelete} style={{ background: "#7a2020", color: "white", border: "none", borderRadius: 20, padding: "9px 22px", fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif" }}>move to dump</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
