import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import FolderModal from '../components/memory/FolderModal'
import useUserStore from '../store/userStore'

const MENUS = {
  File: [
    { label: 'New Year Wrap', action: 'new' },
    { label: 'Open Treasure Chest', action: 'treasure' },
    { label: '─────────', disabled: true },
    { label: 'Dump It', action: 'dump' },
  ],
  View: [
    { label: 'Home', action: 'home' },
    { label: 'Recap', action: 'recap' },
    { label: 'Dashboard', action: 'dashboard' },
  ],
  Go: [
    { label: 'Treasure Chest', action: 'treasure' },
    { label: 'Dump It', action: 'dump' },
    { label: 'Recap', action: 'recap' },
    { label: 'Login', action: 'login' },
  ],
  Window: [
    { label: 'Minimize', disabled: true },
    { label: 'Zoom', disabled: true },
  ],
  Help: [
    { label: 'About YearWrap', disabled: true },
  ],
}

function shade(hex, p) {
  const n = parseInt(hex.replace('#', ''), 16)
  return `rgb(${Math.min(255, Math.max(0, (n >> 16) + p))},${Math.min(255, Math.max(0, ((n >> 8) & 0xff) + p))},${Math.min(255, Math.max(0, (n & 0xff) + p))})`
}

function FolderSVG({ color, size = 62 }) {
  const dark = shade(color, -28)
  return (
    <svg viewBox="0 0 72 60" style={{ width: size, height: size * 0.83, filter: 'drop-shadow(0 4px 10px rgba(99,32,36,0.45))' }}>
      <path d="M3 16 Q3 12 7 12 L26 12 Q29 12 31 9 L33 6 Q35 3 38 3 L65 3 Q69 3 69 7 L69 16 Z" fill={dark} />
      <rect x="3" y="16" width="66" height="40" rx="7" fill={color} />
      <rect x="3" y="16" width="66" height="18" rx="7" fill="white" opacity="0.18" />
    </svg>
  )
}

function DesktopIcon({ children, label, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, cursor: 'pointer',
        transform: hovered ? 'scale(1.1) translateY(-4px)' : 'scale(1)', transition: 'transform 0.15s'
      }}>
      {children}
      <span style={{
        fontSize: 11, color: '#f2e0dc', fontFamily: 'Georgia, serif',
        textShadow: '0 1px 6px rgba(74,24,32,0.9)',
        background: hovered ? 'rgba(99,32,36,0.72)' : 'transparent',
        padding: '1px 7px', borderRadius: 4, maxWidth: 90, textAlign: 'center', lineHeight: 1.3,
      }}>{label}</span>
    </div>
  )
}

function DockIcon({ label, onClick, icon, img, active }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, position: 'relative' }}>
      <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{
          width: hovered ? 48 : 40, height: hovered ? 48 : 40, borderRadius: 11,
          background: hovered ? 'rgba(196,136,140,0.35)' : 'rgba(242,224,220,0.15)',
          border: '1px solid rgba(196,136,140,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.15s',
          boxShadow: hovered ? '0 4px 16px rgba(74,24,32,0.4)' : 'none',
          overflow: 'hidden', marginBottom: hovered ? -8 : 0,
        }}>
        {img
          ? <img src={img} alt={label} style={{ width: 26, height: 26, objectFit: 'contain' }} />
          : <i className={icon} style={{ fontSize: 20, color: '#f2e0dc' }} />}
      </div>
      {hovered && (
        <div style={{
          position: 'absolute', bottom: '110%',
          background: 'rgba(20,10,8,0.88)', color: '#f2e0dc',
          fontSize: 10, padding: '3px 9px', borderRadius: 6,
          whiteSpace: 'nowrap', pointerEvents: 'none', fontFamily: 'Georgia, serif',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>{label}</div>
      )}
      {active && <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#c4888c' }} />}
    </div>
  )
}

// ── GOOGLY EYES ──
function GooglyEyes({ mousePos }) {
  const leftRef = useRef(null)
  const rightRef = useRef(null)

  function getPupilOffset(eyeRef, maxDist = 3) {
    if (!eyeRef.current || !mousePos) return { x: 0, y: 0 }
    const rect = eyeRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = mousePos.x - cx
    const dy = mousePos.y - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist === 0) return { x: 0, y: 0 }
    const scale = Math.min(dist, maxDist * 6) / dist
    return { x: (dx * scale) / 6, y: (dy * scale) / 6 }
  }

  const lp = getPupilOffset(leftRef)
  const rp = getPupilOffset(rightRef)

  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {[{ ref: leftRef, p: lp }, { ref: rightRef, p: rp }].map(({ ref, p }, i) => (
        <div key={i} ref={ref} style={{
          width: 16, height: 16, borderRadius: '50%',
          background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden', flexShrink: 0,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', background: '#1a0a0c',
            position: 'absolute',
            transform: `translate(${p.x}px, ${p.y}px)`,
            transition: 'transform 0.05s linear',
          }}>
            <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'white', position: 'absolute', top: 1, left: 1 }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── LIVE CLOCK ──
function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const d = time
  const h = d.getHours()
  const m = String(d.getMinutes()).padStart(2, '0')
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return (
    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap', letterSpacing: 0.1 }}>
      {days[d.getDay()]} {d.getDate()} {months[d.getMonth()]} · {h12}:{m} {ampm}
    </span>
  )
}

// ── MENU BAR ──
function MenuBar({ mousePos, navigate, username }) {
  const [openMenu, setOpenMenu] = useState(null)
  const [ccOpen, setCcOpen] = useState(false)

  const handleAction = (action) => {
    setOpenMenu(null)
    if (action === 'home') navigate('/')
    else if (action === 'treasure') navigate('/treasure-chest')
    else if (action === 'dump') navigate('/dump-it')
    else if (action === 'recap') navigate('/recap')
    else if (action === 'login') navigate('/login')
    else if (action === 'dashboard') navigate('/dashboard')
  }

  return (
    <>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 30,
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(32px) saturate(180%)',
        WebkitBackdropFilter: 'blur(32px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.10)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', zIndex: 100,
      }} onClick={() => { setOpenMenu(null); setCcOpen(false) }}>

        {/* Left — apple + menus */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }} onClick={e => e.stopPropagation()}>
          <i className="ri-apple-fill" style={{ fontSize: 15, color: 'rgba(255,255,255,0.9)', marginRight: 8 }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.95)', fontWeight: 700, padding: '0 8px', cursor: 'default' }}>YearWrap</span>
          {Object.keys(MENUS).map((menuName) => (
            <div key={menuName} style={{ position: 'relative' }}>
              <span onClick={() => setOpenMenu(openMenu === menuName ? null : menuName)}
                style={{
                  fontSize: 12, padding: '2px 8px', borderRadius: 4, cursor: 'default',
                  color: openMenu === menuName ? '#1a0a0c' : 'rgba(255,255,255,0.70)',
                  background: openMenu === menuName ? 'rgba(255,255,255,0.88)' : 'transparent',
                  userSelect: 'none',
                }}>{menuName}</span>
              {openMenu === menuName && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 4px)', left: 0,
                  background: 'rgba(30,18,12,0.92)', backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, minWidth: 180,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)', overflow: 'hidden', zIndex: 200,
                }}>
                  {MENUS[menuName].map((item, i) => (
                    <div key={i} onClick={() => !item.disabled && handleAction(item.action)}
                      style={{
                        padding: '7px 16px', fontSize: 12,
                        color: item.disabled ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.88)',
                        cursor: item.disabled ? 'default' : 'pointer',
                        borderBottom: i < MENUS[menuName].length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                        fontFamily: 'Georgia, serif',
                      }}
                      onMouseEnter={e => { if (!item.disabled) e.currentTarget.style.background = 'rgba(99,32,36,0.6)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                    >{item.label}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right — status */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }} onClick={e => e.stopPropagation()}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.80)' }}>{username}</span>
          <GooglyEyes mousePos={mousePos} />
          <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.2)' }} />
          <div onClick={() => setCcOpen(o => !o)}
            style={{
              width: 28, height: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 5, background: ccOpen ? 'rgba(255,255,255,0.18)' : 'transparent',
              transition: 'background 0.15s',
            }}>
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
              <rect x="0" y="0" width="7" height="5" rx="1.5" fill="rgba(255,255,255,0.85)" />
              <rect x="11" y="0" width="7" height="5" rx="1.5" fill="rgba(255,255,255,0.85)" />
              <rect x="0" y="7" width="7" height="5" rx="1.5" fill="rgba(255,255,255,0.85)" />
              <rect x="11" y="7" width="7" height="5" rx="1.5" fill="rgba(255,255,255,0.85)" />
            </svg>
          </div>
          <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.2)' }} />
          <LiveClock />
        </div>
      </div>

      {ccOpen && <ControlCenter onClose={() => setCcOpen(false)} navigate={navigate} />}
    </>
  )
}

// ── CONTROL CENTER PANEL ──
function ControlCenter({ onClose, navigate }) {
  const [wifi, setWifi] = useState(false)
  const [bluetooth, setBluetooth] = useState(true)
  const [airdrop, setAirdrop] = useState(false)
  const [focus, setFocus] = useState(false)
  const [brightness, setBrightness] = useState(70)
  const [volume, setVolume] = useState(50)

  const Toggle = ({ label, icon, on, onToggle }) => (
    <div onClick={onToggle} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      background: on ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.08)',
      border: `1px solid ${on ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.1)'}`,
      borderRadius: 14, padding: '10px 14px', cursor: 'pointer', transition: 'all 0.18s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = on ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.13)'}
      onMouseLeave={e => e.currentTarget.style.background = on ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.08)'}
    >
      <div style={{
        width: 34, height: 34, borderRadius: '50%',
        background: on ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}><i className={icon} style={{ fontSize: 16, color: on ? '#1a0a0c' : 'rgba(255,255,255,0.8)' }} /></div>
      <div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.92)', fontWeight: 600, margin: 0 }}>{label}</p>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', margin: 0 }}>{on ? 'On' : 'Off'}</p>
      </div>
    </div>
  )

  const SmallBtn = ({ icon, label, on, onToggle }) => (
    <div onClick={onToggle} title={label} style={{
      width: 52, height: 52, borderRadius: '50%',
      background: on ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.12)',
      border: '1px solid rgba(255,255,255,0.15)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', transition: 'all 0.15s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = on ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.2)'}
      onMouseLeave={e => e.currentTarget.style.background = on ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.12)'}
    ><i className={icon} style={{ fontSize: 20, color: on ? '#1a0a0c' : 'rgba(255,255,255,0.85)' }} /></div>
  )

  const NavBtn = ({ icon, label, onClick }) => (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 14, padding: '10px 14px', cursor: 'pointer', transition: 'all 0.15s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
    >
      <i className={icon} style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)' }} />
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.88)', fontWeight: 500 }}>{label}</span>
    </div>
  )

  const Slider = ({ label, icon, value, onChange }) => (
    <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '12px 16px' }}>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', margin: '0 0 8px', letterSpacing: 0.3 }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <i className="ri-sun-line" style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} />
        <input type="range" min="0" max="100" value={value} onChange={e => onChange(+e.target.value)}
          style={{ flex: 1, accentColor: 'rgba(255,255,255,0.8)', height: 4, cursor: 'pointer' }} />
        <i className={icon} style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }} />
      </div>
    </div>
  )

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 150 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        position: 'absolute', top: 36, right: 12, width: 300,
        background: 'rgba(20,10,8,0.55)',
        backdropFilter: 'blur(40px) saturate(200%)',
        WebkitBackdropFilter: 'blur(40px) saturate(200%)',
        border: '1px solid rgba(255,255,255,0.14)',
        borderRadius: 20, padding: 16,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        display: 'flex', flexDirection: 'column', gap: 10,
        fontFamily: 'Georgia, serif',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Toggle label="Wi-Fi" icon="ri-wifi-line" on={wifi} onToggle={() => setWifi(v => !v)} />
          <Toggle label="Bluetooth" icon="ri-bluetooth-line" on={bluetooth} onToggle={() => setBluetooth(v => !v)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Toggle label="AirDrop" icon="ri-share-line" on={airdrop} onToggle={() => setAirdrop(v => !v)} />
          <Toggle label="Focus" icon="ri-moon-line" on={focus} onToggle={() => setFocus(v => !v)} />
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', padding: '4px 0' }}>
          <SmallBtn icon="ri-sun-line" label="Display" />
          <SmallBtn icon="ri-screenshot-line" label="Screenshot" />
          <SmallBtn icon="ri-music-2-line" label="Music" />
          <SmallBtn icon="ri-lock-line" label="Lock" />
        </div>
        {/* Weather + Spotify widgets */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {/* Weather */}
          <div style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 14, padding: '14px 12px',
            display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <i className="ri-sun-cloudy-line" style={{ fontSize: 22, color: '#f5c842' }} />
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase' }}>weather</span>
            </div>
            <p style={{ fontSize: 26, fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1 }}>24°</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', margin: 0 }}>Partly cloudy</p>
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              {[{ d: 'Mon', i: 'ri-sun-line', t: '26°' }, { d: 'Tue', i: 'ri-drizzle-line', t: '21°' }, { d: 'Wed', i: 'ri-cloudy-line', t: '19°' }].map(w => (
                <div key={w.d} style={{ flex: 1, textAlign: 'center' }}>
                  <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{w.d}</p>
                  <i className={w.i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }} />
                  <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{w.t}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Spotify */}
          <div style={{
            background: 'rgba(30,215,96,0.10)', border: '1px solid rgba(30,215,96,0.2)',
            borderRadius: 14, padding: '14px 12px',
            display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <i className="ri-spotify-line" style={{ fontSize: 18, color: '#1ed760' }} />
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase' }}>spotify</span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: 6, background: 'linear-gradient(135deg,#632024,#c4888c)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ri-music-2-line" style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: 11, color: '#fff', fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>your playlist</p>
                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', margin: 0 }}>connect spotify</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 2 }}>
              <i className="ri-skip-back-line" style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }} />
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1ed760', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <i className="ri-play-fill" style={{ fontSize: 14, color: '#000' }} />
              </div>
              <i className="ri-skip-forward-line" style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }} />
            </div>
          </div>
        </div>
        <Slider label="Display" icon="ri-sun-fill" value={brightness} onChange={setBrightness} />
        <Slider label="Sound" icon="ri-volume-up-line" value={volume} onChange={setVolume} />
        <div style={{ textAlign: 'center', paddingTop: 2 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', cursor: 'default', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: '4px 14px' }}>
            Edit Controls
          </span>
        </div>
      </div>
    </div>
  )
}

// ── HOME PAGE ──
export default function Home() {
  const navigate = useNavigate()
  const [activeFolder, setActiveFolder] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const user = useUserStore((s) => s.user)
  const username = user?.name || user?.username || 'guest'
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }, [])

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const h = time.getHours()
  const m = String(time.getMinutes()).padStart(2, '0')
  const ampm = h >= 12 ? 'PM' : 'AM'

  const widget = {
    background: 'rgba(20,10,8,0.45)',
    backdropFilter: 'blur(28px) saturate(180%)',
    WebkitBackdropFilter: 'blur(28px) saturate(180%)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 18,
    color: '#f2e0dc',
    fontFamily: 'Georgia, serif',
  }

  const FOLDERS = [
    { name: 'my_pov', type: 'folder', color: '#c4888c' },
    { name: 'moments', type: 'folder', color: '#b07478' },
    { name: 'peeps', type: 'icon', img: '/icon-peeps.png' },
    { name: 'triptrip', type: 'icon', img: '/icon-triptrip.png' },
    { name: 'mood', type: 'icon', img: '/icon-mood.png' },
    { name: 'challenges', type: 'icon', img: '/icon-challenges.png' },
  ]

  return (
    <div onMouseMove={handleMouseMove}
      style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', fontFamily: 'Georgia, serif' }}>

      {/* Wallpaper */}
      <img src="/bg-flower.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(135deg, rgba(99,32,36,0.55) 0%, rgba(74,24,32,0.40) 50%, rgba(138,58,63,0.32) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 35%, rgba(40,10,12,0.50) 100%)' }} />

      <MenuBar mousePos={mousePos} navigate={navigate} username={username} />

      {/* ── DESKTOP LAYOUT ── */}
      <div style={{
        position: 'absolute', top: 38, left: 0, right: 0, bottom: 70,
        display: 'flex', alignItems: 'stretch', padding: '16px 20px', gap: 16,
      }}>

        {/* LEFT COLUMN — widgets */}
        <div style={{ width: 210, display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>

          {/* Clock widget */}
          <div style={{ ...widget, padding: '18px 20px' }}>
            <p style={{ fontSize: 9, letterSpacing: 2.5, color: 'rgba(242,224,220,0.5)', textTransform: 'uppercase', marginBottom: 6 }}>local time</p>
            <p style={{ fontSize: 36, fontWeight: 700, color: '#f2e0dc', lineHeight: 1, letterSpacing: -1 }}>
              {String(h % 12 || 12).padStart(2, '0')}:{m}
              <span style={{ fontSize: 14, fontWeight: 400, marginLeft: 6, color: 'rgba(242,224,220,0.6)' }}>{ampm}</span>
            </p>
            <p style={{ fontSize: 11, color: 'rgba(242,224,220,0.55)', marginTop: 4 }}>
              {days[time.getDay()]}, {time.getDate()} {months[time.getMonth()]}
            </p>
          </div>

          {/* Quote widget */}
          <div style={{ ...widget, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <i className="ri-double-quotes-l" style={{ fontSize: 18, color: '#c4888c' }} />
              <span style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(242,224,220,0.5)', textTransform: 'uppercase' }}>note to self</span>
            </div>
            <p style={{ fontSize: 13, color: '#f2e0dc', lineHeight: 1.7, fontStyle: 'italic' }}>
              "capture the moments that make you feel alive."
            </p>
          </div>

          {/* Quick nav widget */}
          <div style={{ ...widget, padding: '14px 16px' }}>
            <p style={{ fontSize: 9, letterSpacing: 2.5, color: 'rgba(242,224,220,0.5)', textTransform: 'uppercase', marginBottom: 10 }}>quick nav</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { icon: 'ri-treasure-map-line', label: 'Treasure Chest', path: '/treasure-chest' },
                { icon: 'ri-delete-bin-2-line', label: 'Dump It', path: '/dump-it' },
                { icon: 'ri-book-open-line', label: 'Recap', path: '/recap' },
              ].map(item => (
                <div key={item.label} onClick={() => navigate(item.path)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px', borderRadius: 10, cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,136,140,0.18)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <i className={item.icon} style={{ fontSize: 15, color: '#c4888c' }} />
                  <span style={{ fontSize: 12, color: 'rgba(242,224,220,0.85)' }}>{item.label}</span>
                  <i className="ri-arrow-right-s-line" style={{ fontSize: 13, color: 'rgba(242,224,220,0.3)', marginLeft: 'auto' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Stats widget */}
          <div style={{ ...widget, padding: '14px 16px', flex: 1 }}>
            <p style={{ fontSize: 9, letterSpacing: 2.5, color: 'rgba(242,224,220,0.5)', textTransform: 'uppercase', marginBottom: 12 }}>year wrap</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: 'ri-calendar-line', label: 'Active wraps', val: '4' },
                { icon: 'ri-folder-open-line', label: 'Folders filled', val: '6' },
                { icon: 'ri-image-line', label: 'Photos saved', val: '0' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <i className={s.icon} style={{ fontSize: 14, color: '#c4888c', width: 18 }} />
                  <span style={{ fontSize: 11, color: 'rgba(242,224,220,0.65)', flex: 1 }}>{s.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#f2e0dc' }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER — polaroid */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ transform: 'rotate(1.5deg)', zIndex: 12 }}>
            <div style={{
              background: '#f2e0dc', padding: '10px 10px 32px',
              boxShadow: '0 8px 40px rgba(74,24,32,0.5), 0 2px 8px rgba(0,0,0,0.2)', width: 160,
            }}>
              <div style={{
                width: '100%', height: 160,
                background: 'linear-gradient(145deg, #e8c8cc, #d4a0a8)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <i className="ri-add-circle-line" style={{ fontSize: 32, color: '#632024' }} />
                <span style={{ fontSize: 9, color: '#7a3038', textAlign: 'center', lineHeight: 1.5 }}>add your<br />photo</span>
              </div>
              <p style={{ textAlign: 'center', fontSize: 11, color: '#4a1820', marginTop: 10, fontWeight: 600 }}>{username}</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — desktop icons */}
        <div style={{ width: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, paddingTop: 8, flexShrink: 0 }}>
          {FOLDERS.map((item) => (
            <DesktopIcon key={item.name} label={item.name.replace('_', ' ')} onClick={() => setActiveFolder(item.name)}>
              {item.type === 'folder'
                ? <FolderSVG color={item.color} size={58} />
                : (
                  <div style={{
                    width: 62, height: 62, borderRadius: 16,
                    background: 'rgba(99,32,36,0.35)', backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(196,136,140,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(74,24,32,0.4)', overflow: 'hidden',
                  }}>
                    <img src={item.img} alt={item.name} style={{ width: 44, height: 44, objectFit: 'contain' }}
                      onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
                    <div style={{ display: 'none', width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
                      <i className="ri-image-line" style={{ fontSize: 22, color: '#c4888c' }} />
                    </div>
                  </div>
                )
              }
            </DesktopIcon>
          ))}
        </div>
      </div>

      {/* Dock */}
      <div style={{
        position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.18)',
        borderRadius: 18, padding: '6px 16px',
        display: 'flex', alignItems: 'flex-end', gap: 10,
        boxShadow: '0 6px 24px rgba(74,24,32,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
        zIndex: 50,
      }}>
        <DockIcon label="home" onClick={() => { }} icon="ri-home-4-line" active />
        <DockIcon label="dump it" onClick={() => navigate('/dump-it')} img="/icon-dump.png" />
        <DockIcon label="treasure" onClick={() => navigate('/treasure-chest')} img="/icon-treasure.png" />
        <DockIcon label="recap" onClick={() => navigate('/recap')} icon="ri-book-open-line" />
        <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.25)', alignSelf: 'center', margin: '0 2px' }} />
        <DockIcon label="login" onClick={() => navigate('/login')} icon="ri-key-2-line" />
      </div>

      {activeFolder && <FolderModal name={activeFolder} onClose={() => setActiveFolder(null)} />}
    </div>
  )
}
