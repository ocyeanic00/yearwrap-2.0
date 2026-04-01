import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useMemoryStore from '../store/memoryStore'
import useUserStore from '../store/userStore'
import Footer from '../components/Footer'

// Derive a vibe from folder data
function getVibe(folders) {
  const texts = Object.values(folders).map(f => f.text || '').join(' ').toLowerCase()
  const photos = Object.values(folders).reduce((t, f) => t + (f.photos?.length || 0), 0)
  if (texts.includes('challeng') || texts.includes('hard') || texts.includes('difficult')) return { label: 'Resilience', emoji: '💪' }
  if (texts.includes('travel') || texts.includes('trip') || texts.includes('adventure')) return { label: 'Adventure', emoji: '✈️' }
  if (texts.includes('peace') || texts.includes('calm') || texts.includes('rest')) return { label: 'Peace', emoji: '🌊' }
  if (texts.includes('grow') || texts.includes('learn') || texts.includes('better')) return { label: 'Growth', emoji: '🌱' }
  if (photos > 10) return { label: 'Memories', emoji: '📸' }
  return { label: 'My Year', emoji: '✨' }
}

function getCoverPhoto(folders) {
  for (const f of Object.values(folders)) {
    if (f.photos?.[0]) return f.photos[0]
  }
  return null
}

function getHighlight(folders) {
  for (const f of Object.values(folders)) {
    if (f.text?.trim()) return f.text.trim().slice(0, 90) + (f.text.length > 90 ? '…' : '')
  }
  return 'No memories written yet — your story is waiting.'
}

function RecapModal({ year, folders, layout, onClose }) {
  const vibe = getVibe(folders)
  const allPhotos = Object.values(folders).flatMap(f => f.photos || [])
  const filledFolders = Object.entries(folders).filter(([, f]) => f.text || f.photos?.length > 0)

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(10,4,1,0.75)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 680, maxHeight: '88vh',
        background: 'rgba(22,9,3,0.96)', backdropFilter: 'blur(40px)',
        border: '1px solid rgba(200,168,130,0.2)', borderRadius: 24,
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
      }}>
        {/* Cover */}
        <div style={{
          height: 180, position: 'relative', flexShrink: 0,
          background: getCoverPhoto(folders)
            ? `url(${getCoverPhoto(folders)}) center/cover`
            : 'linear-gradient(135deg,#3b2314,#6b4226,#c8a882)',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(22,9,3,0.95))' }} />
          <button onClick={onClose} style={{
            position: 'absolute', top: 14, right: 14, width: 32, height: 32,
            background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '50%', cursor: 'pointer', color: '#f5ead8', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
          <div style={{ position: 'absolute', bottom: 16, left: 24 }}>
            <span style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(200,168,130,0.7)', textTransform: 'uppercase', fontFamily: 'Georgia, serif' }}>yearwrap</span>
            <h2 style={{ margin: '2px 0 0', fontSize: 36, fontWeight: 700, color: '#f5ead8', fontFamily: 'Georgia, serif', lineHeight: 1 }}>{year}</h2>
          </div>
          <div style={{ position: 'absolute', bottom: 16, right: 24, display: 'flex', gap: 8, alignItems: 'center' }}>
            {layout && (
              <div style={{ background: 'rgba(200,168,130,0.25)', border: '1px solid rgba(200,168,130,0.4)', borderRadius: 20, padding: '4px 12px', fontSize: 11, color: '#f5d6a0', fontFamily: 'Georgia, serif', display: 'flex', alignItems: 'center', gap: 5 }}>
                <i className={layout === 'magazine' ? 'ri-layout-top-line' : 'ri-collage-line'} style={{ fontSize: 12 }} />
                {layout}
              </div>
            )}
            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#f5ead8', fontFamily: 'Georgia, serif' }}>
              {vibe.emoji} {vibe.label}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {/* Photo strip */}
          {allPhotos.length > 0 && (
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 20, paddingBottom: 4 }}>
              {allPhotos.map((src, i) => (
                <img key={i} src={src} alt="" style={{ height: 72, width: 72, objectFit: 'cover', borderRadius: 10, flexShrink: 0, border: '1px solid rgba(200,168,130,0.2)' }} />
              ))}
            </div>
          )}

          {/* Folders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filledFolders.length === 0
              ? <p style={{ color: 'rgba(200,168,130,0.45)', fontStyle: 'italic', fontFamily: 'Georgia, serif', fontSize: 13 }}>No memories added for this year yet.</p>
              : filledFolders.map(([fname, fdata]) => (
                <div key={fname} style={{ background: 'rgba(255,245,235,0.05)', border: '1px solid rgba(200,168,130,0.12)', borderRadius: 14, padding: '14px 16px' }}>
                  <p style={{ margin: '0 0 6px', fontSize: 10, letterSpacing: 2, color: '#c8a882', textTransform: 'uppercase', fontFamily: 'Georgia, serif' }}>{fname.replace(/_/g, ' ')}</p>
                  {fdata.text && <p style={{ margin: 0, fontSize: 13, color: 'rgba(245,234,216,0.8)', fontFamily: 'Georgia, serif', lineHeight: 1.6 }}>{fdata.text}</p>}
                  {fdata.comment && <p style={{ margin: '6px 0 0', fontSize: 12, color: 'rgba(200,168,130,0.55)', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>{fdata.comment}</p>}
                  {fdata.photos?.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                      {fdata.photos.map((src, i) => (
                        <img key={i} src={src} alt="" style={{ height: 56, width: 56, objectFit: 'cover', borderRadius: 8 }} />
                      ))}
                    </div>
                  )}
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

function RecapCard({ year, folders, onClick }) {
  const [hovered, setHovered] = useState(false)
  const vibe = getVibe(folders)
  const cover = getCoverPhoto(folders)
  const highlight = getHighlight(folders)
  const filled = Object.values(folders).filter(f => f.text || f.photos?.length > 0).length
  const total = Object.keys(folders).length

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer', borderRadius: 20, overflow: 'hidden',
        background: 'rgba(255,245,235,0.06)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: `1px solid ${hovered ? 'rgba(200,168,130,0.35)' : 'rgba(200,168,130,0.14)'}`,
        boxShadow: hovered ? '0 12px 40px rgba(59,35,20,0.45), 0 0 0 1px rgba(200,168,130,0.1)' : '0 4px 16px rgba(0,0,0,0.25)',
        transform: hovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
      }}>
      {/* Cover */}
      <div style={{
        height: 140, position: 'relative',
        background: cover
          ? `url(${cover}) center/cover`
          : `linear-gradient(135deg, #3b2314 0%, #6b4226 60%, #c8a882 100%)`,
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(18,7,2,0.85))' }} />
        {/* Vibe tag */}
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(200,168,130,0.2)',
          borderRadius: 20, padding: '3px 10px',
          fontSize: 10, color: '#f5ead8', fontFamily: 'Georgia, serif',
        }}>
          {vibe.emoji} {vibe.label}
        </div>
        {/* Year */}
        <div style={{ position: 'absolute', bottom: 12, left: 14 }}>
          <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#f5ead8', fontFamily: 'Georgia, serif', lineHeight: 1, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{year}</p>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p style={{ margin: 0, fontSize: 12, color: 'rgba(245,234,216,0.65)', fontFamily: 'Georgia, serif', lineHeight: 1.6, fontStyle: 'italic', flex: 1 }}>
          "{highlight}"
        </p>
        {/* Progress bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 9, color: 'rgba(200,168,130,0.45)', letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'Georgia, serif' }}>folders filled</span>
            <span style={{ fontSize: 9, color: 'rgba(200,168,130,0.6)', fontFamily: 'Georgia, serif' }}>{filled}/{total}</span>
          </div>
          <div style={{ height: 3, background: 'rgba(200,168,130,0.12)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(filled / total) * 100}%`, background: 'linear-gradient(90deg, #6b4226, #c8a882)', borderRadius: 2, transition: 'width 0.4s' }} />
          </div>
        </div>
        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: 'rgba(200,168,130,0.5)', fontFamily: 'Georgia, serif' }}>
            {Object.values(folders).reduce((t, f) => t + (f.photos?.length || 0), 0)} photos
          </span>
          <span style={{ fontSize: 11, color: hovered ? '#c8a882' : 'rgba(200,168,130,0.45)', fontFamily: 'Georgia, serif', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: 4 }}>
            view recap <i className="ri-arrow-right-line" style={{ fontSize: 12 }} />
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Recap() {
  const navigate = useNavigate()
  const user = useUserStore(s => s.user)
  const wraps = useMemoryStore(s => s.wraps)
  const username = user?.name || user?.username || 'guest'

  const [sort, setSort] = useState('newest')
  const [selectedYear, setSelectedYear] = useState(null)

  // Read layout param from URL (set by the layout picker on Home)
  const searchParams = new URLSearchParams(window.location.search)
  const chosenLayout = searchParams.get('layout') // 'magazine' | 'scrapbook' | null

  const years = useMemo(() => {
    const ys = Object.keys(wraps).map(Number)
    return sort === 'newest' ? ys.sort((a, b) => b - a) : ys.sort((a, b) => a - b)
  }, [wraps, sort])

  // Auto-open current year's recap if coming from layout picker
  useEffect(() => {
    if (chosenLayout) {
      const currentYear = new Date().getFullYear()
      if (wraps[currentYear]) setSelectedYear(currentYear)
    }
  }, [])

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      background: 'linear-gradient(160deg, #1a0a04 0%, #2a1208 40%, #1e0e06 100%)',
      fontFamily: 'Georgia, serif', display: 'flex', flexDirection: 'column',
    }}>
      <style>{`
        .recap-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: clamp(12px, 2vw, 20px);
        }
        @media (max-width: 480px) { .recap-grid { grid-template-columns: 1fr; } }
        @media (min-width: 481px) and (max-width: 767px) { .recap-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1400px) { .recap-grid { grid-template-columns: repeat(5, 1fr); } }
      `}</style>

      {/* Header */}
      <div style={{ padding: 'clamp(20px,4vh,48px) clamp(20px,5vw,64px) 0' }}>
        <button onClick={() => navigate('/')} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20,
          color: 'rgba(200,168,130,0.5)', fontSize: 12, fontFamily: 'Georgia, serif', transition: 'color 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#f5ead8'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(200,168,130,0.5)'}>
          <i className="ri-arrow-left-line" /> back home
        </button>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <div>
            <p style={{ margin: '0 0 4px', fontSize: 10, letterSpacing: 3, color: 'rgba(200,168,130,0.45)', textTransform: 'uppercase' }}>yearwrap</p>
            <h1 style={{ margin: 0, fontSize: 'clamp(28px,5vw,48px)', fontWeight: 700, color: '#f5ead8', letterSpacing: -1, lineHeight: 1 }}>your recaps</h1>
            <p style={{ margin: '8px 0 0', fontSize: 13, color: 'rgba(200,168,130,0.5)' }}>
              {years.length} {years.length === 1 ? 'year' : 'years'} of memories · {username}
            </p>
          </div>

          {/* Sort filter */}
          {years.length > 1 && (
            <div style={{ display: 'flex', gap: 6, background: 'rgba(255,245,235,0.05)', border: '1px solid rgba(200,168,130,0.15)', borderRadius: 12, padding: 4 }}>
              {[{ val: 'newest', label: 'Newest first' }, { val: 'oldest', label: 'Oldest first' }].map(opt => (
                <button key={opt.val} onClick={() => setSort(opt.val)} style={{
                  padding: '6px 14px', borderRadius: 9, border: 'none', cursor: 'pointer',
                  fontSize: 11, fontFamily: 'Georgia, serif', transition: 'all 0.15s',
                  background: sort === opt.val ? 'rgba(200,168,130,0.2)' : 'transparent',
                  color: sort === opt.val ? '#f5ead8' : 'rgba(200,168,130,0.5)',
                }}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div style={{ flex: 1, padding: '0 clamp(20px,5vw,64px) clamp(32px,4vh,48px)' }}>
        {years.length === 0 ? (
          /* Empty state */
          <div style={{
            textAlign: 'center', padding: 'clamp(48px,8vh,80px) 20px',
            maxWidth: 400, margin: '0 auto',
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%', margin: '0 auto 20px',
              background: 'rgba(200,168,130,0.08)', border: '1px solid rgba(200,168,130,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i className="ri-book-open-line" style={{ fontSize: 32, color: 'rgba(200,168,130,0.35)' }} />
            </div>
            <h2 style={{ margin: '0 0 8px', fontSize: 22, color: '#f5ead8', fontWeight: 600 }}>no recaps yet 🥺</h2>
            <p style={{ margin: '0 0 24px', fontSize: 13, color: 'rgba(200,168,130,0.45)', lineHeight: 1.6 }}>
              your year stories will live here. start capturing memories to build your first yearwrap.
            </p>
            <button onClick={() => navigate('/')} style={{
              background: '#c8a882', border: 'none', borderRadius: 20, padding: '10px 28px',
              fontSize: 13, fontWeight: 700, color: '#3b2314', cursor: 'pointer',
              fontFamily: 'Georgia, serif', boxShadow: '0 4px 18px rgba(200,168,130,0.25)',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#d4b896'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#c8a882'; e.currentTarget.style.transform = 'translateY(0)' }}>
              create your first yearwrap
            </button>
          </div>
        ) : (
          <div className="recap-grid">
            {years.map(year => (
              <RecapCard
                key={year}
                year={year}
                folders={wraps[year]}
                onClick={() => setSelectedYear(year)}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* Modal */}
      {selectedYear && (
        <RecapModal
          year={selectedYear}
          folders={wraps[selectedYear]}
          layout={chosenLayout}
          onClose={() => setSelectedYear(null)}
        />
      )}
    </div>
  )
}
