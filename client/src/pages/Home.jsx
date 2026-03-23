import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FolderModal from '../components/memory/FolderModal'

const FOLDERS = [
  { name: 'my_pov', color: '#e8c4b8', top: '22%', left: '28%' },
  { name: 'peeps', color: '#d4cbb8', top: '20%', left: '72%' },
  { name: 'moments', color: '#d4c8a8', top: '48%', left: '18%' },
  { name: 'triptrip', color: '#ddd8c0', top: '50%', left: '76%' },
  { name: 'mood', color: '#e0c4c0', top: '72%', left: '24%' },
  { name: 'challenges', color: '#d8d0b8', top: '70%', left: '74%' },
]

export default function Home() {
  const navigate = useNavigate()
  const [activeFolder, setActiveFolder] = useState(null)

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#f0ebe0' }}>

      {/* Background flower */}
      <img
        src="/bg-flower.jpg"
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
      />

      {/* Sidebar top-left */}
      <div style={{ position: 'absolute', top: 20, left: 16, zIndex: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SideIcon src="/icon-dump.png" label="dump_it" onClick={() => navigate('/dump-it')} />
        <SideIcon src="/icon-treasure.png" label="treasure_chest" onClick={() => navigate('/treasure-chest')} />
      </div>

      {/* N compass bottom-left */}
      <div style={{
        position: 'absolute', bottom: 18, left: 18, zIndex: 20,
        width: 28, height: 28, borderRadius: '50%',
        background: 'rgba(60,45,30,0.65)', color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 600, fontFamily: 'Georgia, serif',
      }}>N</div>

      {/* Folder icons */}
      {FOLDERS.map((f) => (
        <div
          key={f.name}
          onClick={() => setActiveFolder(f.name)}
          style={{
            position: 'absolute',
            top: f.top, left: f.left,
            transform: 'translate(-50%, -50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 5, cursor: 'pointer', zIndex: 10,
          }}
        >
          <FolderSVG color={f.color} />
          <span style={{
            fontSize: 10, color: '#4a3728',
            fontFamily: 'Georgia, serif',
            letterSpacing: 0.2,
          }}>
            {f.name.replace('_', ' ')}
          </span>
        </div>
      ))}

      {/* Center card */}
      <div style={{
        position: 'absolute', top: '44%', left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 10, zIndex: 15,
      }}>
        <div style={{
          width: 130, height: 130,
          background: 'rgba(255,255,255,0.92)',
          borderRadius: 22,
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 6, cursor: 'pointer',
        }}>
          <span style={{ fontSize: 22, color: '#c4a898', lineHeight: 1 }}>+</span>
          <span style={{ fontSize: 10, color: '#b09080', fontFamily: 'Georgia, serif' }}>add your photo</span>
        </div>
        {/* Username pill */}
        <div style={{
          background: 'rgba(70,55,42,0.75)',
          color: 'white', borderRadius: 20,
          padding: '5px 18px', fontSize: 12,
          fontFamily: 'Georgia, serif',
          backdropFilter: 'blur(4px)',
        }}>
          Ocyeanic
        </div>
      </div>

      {/* Folder modal */}
      {activeFolder && (
        <FolderModal name={activeFolder} onClose={() => setActiveFolder(null)} />
      )}
    </div>
  )
}

function SideIcon({ src, label, onClick }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, cursor: 'pointer' }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(6px)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <img src={src} alt={label} style={{ width: 26, height: 26, objectFit: 'contain' }} />
      </div>
      <span style={{ fontSize: 9, color: '#5a3e2b', fontFamily: 'Georgia, serif' }}>{label}</span>
    </div>
  )
}

function FolderSVG({ color }) {
  const dark = shade(color, -22)
  return (
    <div
      style={{ width: 72, height: 60, filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.13))', transition: 'transform 0.18s' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) translateY(0)'}
    >
      <svg viewBox="0 0 72 60" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        {/* tab */}
        <path d="M3 16 Q3 12 7 12 L26 12 Q29 12 31 9 L33 6 Q35 3 38 3 L65 3 Q69 3 69 7 L69 16 Z" fill={dark} />
        {/* body */}
        <rect x="3" y="16" width="66" height="40" rx="7" fill={color} />
        {/* shine */}
        <rect x="3" y="16" width="66" height="18" rx="7" fill="white" opacity="0.13" />
      </svg>
    </div>
  )
}

function shade(hex, p) {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, (n >> 16) + p))
  const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + p))
  const b = Math.min(255, Math.max(0, (n & 0xff) + p))
  return `rgb(${r},${g},${b})`
}
