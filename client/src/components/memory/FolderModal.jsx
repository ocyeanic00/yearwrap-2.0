import { useState, useRef } from 'react'
import useMemoryStore from '../../store/memoryStore'

export default function FolderModal({ name, year = 2024, onClose }) {
    const wraps = useMemoryStore((s) => s.wraps)
    const updateFolder = useMemoryStore((s) => s.updateFolder)
    const data = wraps[year]?.[name] || { text: '', comment: '', photos: [] }

    const [text, setText] = useState(data.text)
    const [comment, setComment] = useState(data.comment)
    const [photos, setPhotos] = useState(data.photos)
    const fileRef = useRef(null)

    const handlePhoto = (e) => {
        const files = Array.from(e.target.files || []).slice(0, 4 - photos.length)
        files.forEach((file) => {
            const reader = new FileReader()
            reader.onload = (ev) => setPhotos((prev) => [...prev, ev.target.result].slice(0, 4))
            reader.readAsDataURL(file)
        })
    }

    const handleSave = () => {
        updateFolder(year, name, { text, comment, photos })
        onClose()
    }

    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div onClick={(e) => e.stopPropagation()} style={{ background: '#fffaf5', borderRadius: 18, padding: 32, width: 420, maxWidth: '90vw', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
                <h2 style={{ fontSize: 18, color: '#5a3e2b', marginBottom: 16, textTransform: 'capitalize' }}>
                    {name.replace('_', ' ')}
                </h2>

                <textarea
                    placeholder="Write your reflection..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={taStyle}
                />
                <textarea
                    placeholder="Short emotional note..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{ ...taStyle, marginTop: 10, minHeight: 60 }}
                />

                {photos.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8, marginTop: 12 }}>
                        {photos.map((src, i) => (
                            <div key={i} style={{ position: 'relative' }}>
                                <img src={src} alt="" style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 8 }} />
                                <button onClick={() => setPhotos((p) => p.filter((_, idx) => idx !== i))}
                                    style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: 11, padding: 0 }}>
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {photos.length < 4 && (
                    <>
                        <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handlePhoto} />
                        <button onClick={() => fileRef.current?.click()}
                            style={{ marginTop: 12, background: 'transparent', border: '1px dashed #c4a07a', borderRadius: 8, padding: '8px 14px', fontSize: 12, color: '#7a5a3e', cursor: 'pointer', width: '100%' }}>
                            + add photos ({photos.length}/4)
                        </button>
                    </>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                    <button onClick={onClose} style={{ background: 'transparent', color: '#5a3e2b', border: '1px solid #c4a07a', borderRadius: 20, padding: '8px 18px', fontSize: 13, cursor: 'pointer' }}>cancel</button>
                    <button onClick={handleSave} style={{ background: '#5a3e2b', color: 'white', border: 'none', borderRadius: 20, padding: '8px 22px', fontSize: 13, cursor: 'pointer' }}>save</button>
                </div>
            </div>
        </div>
    )
}

const taStyle = {
    width: '100%', border: '1px solid #d4b896', borderRadius: 10,
    padding: '10px 12px', fontSize: 14, fontFamily: 'inherit',
    background: '#fdf6ee', resize: 'vertical', minHeight: 100,
    color: '#3d2b1a', outline: 'none',
}
