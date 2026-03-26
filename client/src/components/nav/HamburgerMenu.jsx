import React, { useEffect, useRef } from 'react'

const NAV_ITEMS = [
    { icon: 'ri-home-line', label: 'Home', action: 'home' },
    { icon: 'ri-treasure-map-line', label: 'Treasure Chest', action: 'treasure' },
    { icon: 'ri-delete-bin-2-line', label: 'Dump It', action: 'dump' },
    { icon: 'ri-book-open-line', label: 'Recap', action: 'recap' },
    { icon: 'ri-user-line', label: 'Login', action: 'login' },
    { icon: 'ri-question-line', label: 'Help', action: 'help_video' },
]

export default function HamburgerMenu({ open, onClose, onAction, widgets }) {
    const drawerRef = useRef(null)

    useEffect(() => {
        const fn = e => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', fn)
        return () => document.removeEventListener('keydown', fn)
    }, [onClose])

    useEffect(() => {
        if (open && drawerRef.current) drawerRef.current.focus()
    }, [open])

    return (
        <>
            <style>{`
        .yw-drawer {
          position: fixed;
          top: 30px; left: 0; bottom: 0;
          width: 290px;
          background: rgba(18,7,2,0.96);
          backdrop-filter: blur(48px) saturate(200%);
          -webkit-backdrop-filter: blur(48px) saturate(200%);
          border-right: 1px solid rgba(200,168,130,0.15);
          box-shadow: 6px 0 40px rgba(0,0,0,0.6);
          z-index: 300;
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
          display: flex; flex-direction: column;
          overflow-y: auto;
        }
        .yw-drawer.open { transform: translateX(0); }
        .yw-drawer-overlay {
          position: fixed; inset: 0; top: 30px;
          background: rgba(0,0,0,0.45);
          z-index: 299; opacity: 0; pointer-events: none;
          transition: opacity 0.3s;
        }
        .yw-drawer-overlay.open { opacity: 1; pointer-events: all; }
        .yw-nav-item {
          display: flex; align-items: center; gap: 14px;
          padding: 11px 18px; cursor: pointer;
          border-radius: 10px; border: none; background: transparent;
          width: 100%; text-align: left; margin: 2px 8px; width: calc(100% - 16px);
          font-family: Georgia, serif; font-size: 14px;
          color: rgba(245,234,216,0.82);
          transition: background 0.15s, color 0.15s;
        }
        .yw-nav-item:hover, .yw-nav-item:focus {
          background: rgba(200,168,130,0.13);
          color: #f5ead8;
          outline: none;
        }
        .yw-nav-item:focus-visible { outline: 2px solid rgba(200,168,130,0.45); }
        .yw-widget-card {
          background: rgba(255,245,235,0.05);
          border: 1px solid rgba(200,168,130,0.12);
          border-radius: 14px;
          padding: 12px 14px;
        }
        .yw-section-label {
          font-size: 9px; letter-spacing: 2px;
          color: rgba(200,168,130,0.38);
          text-transform: uppercase;
          font-family: Georgia, serif;
          margin: 0 0 10px;
        }
        @media (min-width: 768px) {
          .yw-drawer, .yw-drawer-overlay, .yw-hamburger-btn { display: none !important; }
        }
      `}</style>

            <div className={`yw-drawer-overlay${open ? ' open' : ''}`} onClick={onClose} aria-hidden="true" />

            <nav ref={drawerRef} tabIndex={-1} aria-label="Mobile navigation"
                aria-hidden={!open} className={`yw-drawer${open ? ' open' : ''}`}>

                {/* Header */}
                <div style={{
                    padding: '18px 20px 14px',
                    borderBottom: '1px solid rgba(200,168,130,0.10)',
                    display: 'flex', alignItems: 'center', gap: 10,
                }}>
                    <img src="/logo.png" alt="YearWrap"
                        style={{ width: 32, height: 32, objectFit: 'contain', filter: 'brightness(1.1)' }}
                        onError={e => { e.target.style.display = 'none' }} />
                    <div>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#f5ead8', fontFamily: 'Georgia, serif' }}>YearWrap</p>
                        <p style={{ margin: 0, fontSize: 10, color: 'rgba(200,168,130,0.5)', fontFamily: 'Georgia, serif' }}>your year, your story</p>
                    </div>
                </div>

                {/* Widgets */}
                {widgets && (
                    <div style={{ padding: '16px 16px 12px' }}>
                        <p className="yw-section-label">overview</p>
                        <div className="yw-widget-card">{widgets}</div>
                    </div>
                )}

                {/* Divider */}
                <div style={{ height: 1, background: 'rgba(200,168,130,0.10)', margin: '0 16px' }} />

                {/* Nav */}
                <div style={{ padding: '12px 0 16px', flex: 1 }}>
                    <p className="yw-section-label" style={{ margin: '0 20px 8px' }}>navigate</p>
                    {NAV_ITEMS.map(item => (
                        <button key={item.action} className="yw-nav-item"
                            onClick={() => { onAction(item.action); onClose() }}
                            aria-label={item.label}>
                            <span style={{
                                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                                background: 'rgba(200,168,130,0.10)',
                                border: '1px solid rgba(200,168,130,0.14)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <i className={item.icon} style={{ fontSize: 16, color: '#c8a882' }} />
                            </span>
                            {item.label}
                            <i className="ri-arrow-right-s-line" style={{ fontSize: 14, color: 'rgba(200,168,130,0.3)', marginLeft: 'auto' }} />
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '12px 20px',
                    borderTop: '1px solid rgba(200,168,130,0.10)',
                    fontSize: 10, color: 'rgba(200,168,130,0.3)',
                    fontFamily: 'Georgia, serif', textAlign: 'center',
                }}>
                    yearwrap · {new Date().getFullYear()}
                </div>
            </nav>
        </>
    )
}
