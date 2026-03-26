import React from 'react'
import { useNavigate } from 'react-router-dom'

const LINKS = [
    { label: 'Home', path: '/' },
    { label: 'Treasure Chest', path: '/treasure-chest' },
    { label: 'Dump It', path: '/dump-it' },
    { label: 'Recap', path: '/recap' },
]

const SOCIALS = [
    { icon: 'ri-github-line', href: 'https://github.com', label: 'GitHub' },
    { icon: 'ri-instagram-line', href: 'https://instagram.com', label: 'Instagram' },
    { icon: 'ri-global-line', href: 'https://yourportfolio.com', label: 'Portfolio' },
]

export default function Footer({ style = {} }) {
    const navigate = useNavigate()

    return (
        <footer style={{
            width: '100%',
            background: 'rgba(30,12,4,0.72)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            borderTop: '1px solid rgba(200,168,130,0.14)',
            fontFamily: 'Georgia, serif',
            ...style,
        }}>
            <div style={{
                maxWidth: 900, margin: '0 auto',
                padding: 'clamp(16px,2.5vh,28px) clamp(16px,3vw,40px)',
                display: 'flex', flexWrap: 'wrap',
                gap: 'clamp(16px,2vw,32px)',
                alignItems: 'flex-start', justifyContent: 'space-between',
            }}>

                {/* Brand */}
                <div style={{ minWidth: 140 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <img src="/logo.png" alt="YearWrap"
                            style={{ width: 28, height: 28, objectFit: 'contain', filter: 'brightness(1.1)' }}
                            onError={e => { e.target.style.display = 'none' }} />
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#f5ead8', letterSpacing: 0.3 }}>YearWrap</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 11, color: 'rgba(200,168,130,0.5)', lineHeight: 1.6, maxWidth: 160 }}>
                        your year, your story. capture every moment that matters.
                    </p>
                </div>

                {/* Quick links */}
                <div>
                    <p style={{ margin: '0 0 10px', fontSize: 9, letterSpacing: 2, color: 'rgba(200,168,130,0.4)', textTransform: 'uppercase' }}>pages</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {LINKS.map(l => (
                            <button key={l.path} onClick={() => navigate(l.path)}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                                    fontSize: 12, color: 'rgba(200,168,130,0.65)', fontFamily: 'Georgia, serif',
                                    textAlign: 'left', transition: 'color 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = '#f5ead8'}
                                onMouseLeave={e => e.currentTarget.style.color = 'rgba(200,168,130,0.65)'}>
                                {l.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Socials + portfolio */}
                <div>
                    <p style={{ margin: '0 0 10px', fontSize: 9, letterSpacing: 2, color: 'rgba(200,168,130,0.4)', textTransform: 'uppercase' }}>connect</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {SOCIALS.map(s => (
                            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    fontSize: 12, color: 'rgba(200,168,130,0.65)',
                                    textDecoration: 'none', transition: 'color 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = '#f5ead8'}
                                onMouseLeave={e => e.currentTarget.style.color = 'rgba(200,168,130,0.65)'}>
                                <i className={s.icon} style={{ fontSize: 15 }} />
                                {s.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div style={{
                borderTop: '1px solid rgba(200,168,130,0.08)',
                padding: 'clamp(8px,1vh,12px) clamp(16px,3vw,40px)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 8,
            }}>
                <span style={{ fontSize: 10, color: 'rgba(200,168,130,0.35)', letterSpacing: 0.3 }}>
                    © {new Date().getFullYear()} YearWrap. made with <i className="ri-heart-fill" style={{ fontSize: 10, color: '#c8784a' }} />
                </span>
                <span style={{ fontSize: 10, color: 'rgba(200,168,130,0.35)' }}>
                    built by{' '}
                    <a href="https://yourportfolio.com" target="_blank" rel="noopener noreferrer"
                        style={{ color: '#c8a882', textDecoration: 'none' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#f5ead8'}
                        onMouseLeave={e => e.currentTarget.style.color = '#c8a882'}>
                        your name ↗
                    </a>
                </span>
            </div>
        </footer>
    )
}
