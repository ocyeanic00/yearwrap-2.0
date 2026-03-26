import { useState, useRef } from 'react'
import useMemoryStore from '../../store/memoryStore'
import useUserStore from '../../store/userStore'

const FOLDER_LABELS = {
    my_pov: 'My POV', moments: 'Moments', peeps: 'Peeps',
    triptrip: 'Trip Trip', mood: 'Mood', challenges: 'Challenges',
}

export default function FolderModal({ name, year = 2024, onClose }) {
    const wraps = useMemoryStore(s => s.wraps)
    const updateFolder = useMemoryStore(s => s.updateFolder)
    const renameFolder = useMemoryStore(s => s.renameFolder)
    const user = useUserStore(s => s.user)
    const data = wraps[year]?.[name] || { text: '', comment: '', photos: [] }

    const defaultLabel = FOLDER_LABELS[name] || name.replace(/_/g, ' ')
    const [folderName, setFolderName] = useState(defaultLabel)
    const [editingName, setEditingName] = useState(false)
    const [text, setText] = useState(data.text)
    const [comment, setComment] = useState(data.comment)
    const [photos, setPhotos] = useState(data.photos || [])
    const fileRef = useRef(null)
    const nameRef = useRef(null)

    const handlePhoto = e => {
        const files = Array.from(e.target.files || []).slice(0, 4 - photos.length)
        files.forEach(file => {
            const reader = new FileReader()
            reader.onload = ev => setPhotos(prev => [...prev, ev.target.result].slice(0, 4))
            reader.readAsDataURL(file)
        })
    }

    const handleSave = () => {
        const newKey = folderName.trim().toLowerCase().replace(/\s+/g, '_') || name
        updateFolder(year, name, { text, comment, photos })
        if (newKey !== name) renameFolder(year, name, newKey)
        onClose()
    }

    const username = user?.name || user?.username || 'my edition'
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

    // 4 fixed slots
    const slots = [0, 1, 2, 3]

    return (
        <div onClick={onClose} style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(30,14,6,0.55)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}>
            <style>{`
        .pc-textarea {
          background: transparent; border: none; border-bottom: 1px solid #a0b4c8;
          outline: none; width: 100%; font-family: Georgia, serif;
          font-size: 13px; color: #4a4a5a; resize: none; padding: 4px 0; line-height: 1.6;
        }
        .pc-textarea::placeholder { color: #a0a8b8; font-style: italic; }
        .folder-name-input {
          background: transparent; border: none; border-bottom: 1.5px dashed #c8a882;
          outline: none; font-family: Georgia, serif; font-size: 20px; font-weight: 700;
          color: #3a2a1a; letter-spacing: 1px; text-transform: uppercase; width: 100%;
          padding: 0 0 2px;
        }
      `}</style>

            <div onClick={e => e.stopPropagation()} style={{
                width: 'min(700px, calc(100vw - 32px))',
                background: '#eeebe4',
                borderRadius: 12,
                boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
                display: 'flex', flexDirection: 'row',
                overflow: 'hidden', minHeight: 300,
                fontFamily: 'Georgia, serif', position: 'relative',
            }}>

                {/* Close */}
                <button onClick={onClose} style={{
                    position: 'absolute', top: 10, right: 14, background: 'transparent',
                    border: 'none', cursor: 'pointer', fontSize: 20, color: '#8a7a6a', zIndex: 10, lineHeight: 1,
                }}>×</button>

                {/* LEFT — Photo Booth */}
                <div style={{
                    width: '42%', flexShrink: 0, borderRight: '1px solid #ccc8be',
                    padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 10,
                }}>
                    <p style={{ margin: 0, fontSize: 12, color: '#6a5a4a', letterSpacing: 0.5 }}>Photo Booth</p>

                    <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handlePhoto} />

                    {/* 4 photo slots */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, flex: 1 }}>
                        {slots.map(i => (
                            <div key={i} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', aspectRatio: '1' }}>
                                {photos[i] ? (
                                    <>
                                        <img src={photos[i]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                        <button onClick={() => setPhotos(p => p.filter((_, idx) => idx !== i))} style={{
                                            position: 'absolute', top: 3, right: 3, width: 18, height: 18,
                                            background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none',
                                            borderRadius: '50%', cursor: 'pointer', fontSize: 11, padding: 0,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>×</button>
                                    </>
                                ) : (
                                    <div onClick={() => fileRef.current?.click()} style={{
                                        width: '100%', height: '100%', minHeight: 70,
                                        border: '1.5px dashed #b8b0a4', borderRadius: 8,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', color: '#a09080', fontSize: 20, background: 'rgba(255,255,255,0.3)',
                                    }}>+</div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Small circle hint when all empty */}
                    {photos.length === 0 && (
                        <div onClick={() => fileRef.current?.click()} style={{
                            position: 'absolute', left: '21%', top: '50%', transform: 'translate(-50%,-50%)',
                            width: 80, height: 80, borderRadius: '50%',
                            border: '1.5px dashed #b0a898',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: '#8a7a6a', gap: 2, pointerEvents: 'none',
                            opacity: 0,
                        }} />
                    )}
                </div>

                {/* RIGHT — Content */}
                <div style={{ flex: 1, padding: '18px 20px 16px 18px', display: 'flex', flexDirection: 'column', position: 'relative' }}>

                    {/* Logo */}
                    <div style={{ position: 'absolute', top: 12, right: 14, width: 58, height: 58 }}>
                        {photos[0]
                            ? <img src={photos[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4, border: '2px solid #c8784a' }} />
                            : <img src="/logo.png" alt="YearWrap" style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                onError={e => { e.target.style.display = 'none' }} />
                        }
                    </div>

                    {/* Editable folder name */}
                    <div style={{ marginBottom: 12, paddingRight: 76 }}>
                        {editingName
                            ? <input
                                ref={nameRef}
                                className="folder-name-input"
                                value={folderName}
                                onChange={e => setFolderName(e.target.value)}
                                onBlur={() => setEditingName(false)}
                                onKeyDown={e => e.key === 'Enter' && setEditingName(false)}
                                autoFocus
                            />
                            : <h2
                                onClick={() => setEditingName(true)}
                                title="Click to rename"
                                style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#3a2a1a', letterSpacing: 1, textTransform: 'uppercase', cursor: 'text', display: 'flex', alignItems: 'center', gap: 6 }}>
                                {folderName}
                                <i className="ri-pencil-line" style={{ fontSize: 12, color: '#b0a090', fontWeight: 400 }} />
                            </h2>
                        }
                        <p style={{ margin: '3px 0 0', fontSize: 11, color: '#8a7a6a' }}>Created: {today}</p>
                    </div>

                    <div style={{ borderTop: '1px solid #ccc8be', marginBottom: 12 }} />

                    {/* Text */}
                    <div style={{ marginBottom: 14 }}>
                        <textarea className="pc-textarea" rows={3} placeholder="Text —" value={text} onChange={e => setText(e.target.value)} />
                        <div style={{ borderBottom: '1px solid #a0b4c8', marginTop: 4 }} />
                    </div>

                    {/* Comments */}
                    <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 4px', fontSize: 12, color: '#5a5a6a', fontStyle: 'italic' }}>Self Reflection — <em>(Add notes)</em></p>
                        <textarea className="pc-textarea" rows={2} placeholder="Add notes" value={comment} onChange={e => setComment(e.target.value)} />
                    </div>

                    {/* Save */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
                        <button onClick={handleSave} style={{
                            background: '#6b4226', border: '1px solid #4a2e18', borderRadius: 20,
                            padding: '6px 26px', fontSize: 13, color: '#f5ead8', cursor: 'pointer',
                            fontFamily: 'Georgia, serif', fontWeight: 600,
                            boxShadow: '0 2px 8px rgba(59,35,20,0.25)', transition: 'all 0.15s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#3b2314'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(59,35,20,0.4)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#6b4226'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(59,35,20,0.25)' }}>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
