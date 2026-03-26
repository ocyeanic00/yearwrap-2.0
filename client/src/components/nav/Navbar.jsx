import React, { useState, useEffect } from 'react'
import DesktopMenu from './DesktopMenu'
import HamburgerMenu from './HamburgerMenu'

function LiveClock() {
    const [time, setTime] = useState(new Date())
    useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t) }, [])
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const h = time.getHours(), m = String(time.getMinutes()).padStart(2, '0')
    const ampm = h >= 12 ? 'PM' : 'AM', h12 = h % 12 || 12
    return (
        <span style={{ fontSize: 11, color: 'rgba(245,234,216,0.85)', whiteSpace: 'nowrap', letterSpacing: 0.1 }}>
            {days[time.getDay()]} {time.getDate()} {months[time.getMonth()]} · {h12}:{m} {ampm}
        </span>
    )
}

export default function Navbar({ navigate, username, mousePos, GooglyEyes, onCCToggle, ccOpen, widgets }) {
    const [hamburgerOpen, setHamburgerOpen] = useState(false)

    const handleAction = action => {
        if (action === 'help_video') { window.open('/help', '_blank'); return }
        const routes = {
            home: '/', treasure: '/treasure-chest', dump: '/dump-it',
            recap: '/recap', login: '/login', dashboard: '/dashboard',
        }
        if (routes[action]) navigate(routes[action])
    }

    return (
        <>
            <style>{`
        .yw-hamburger-btn {
          background: transparent; border: none; cursor: pointer;
          display: none; align-items: center; justify-content: center;
          padding: 4px; border-radius: 6px; color: #f5ead8;
          transition: background 0.15s;
        }
        .yw-hamburger-btn:hover { background: rgba(200,168,130,0.15); }
        .yw-hamburger-btn:focus-visible { outline: 2px solid rgba(200,168,130,0.5); }
        @media (max-width: 767px) { .yw-hamburger-btn { display: flex !important; } }
      `}</style>

            {/* Menubar */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 30,
                background: 'rgba(59,35,20,0.60)', backdropFilter: 'blur(32px) saturate(180%)',
                WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                borderBottom: '1px solid rgba(200,168,130,0.20)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 12px', zIndex: 100,
            }}>
                {/* LEFT */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {/* Hamburger — mobile only */}
                    <button
                        className="yw-hamburger-btn"
                        aria-label={hamburgerOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={hamburgerOpen}
                        aria-controls="yw-mobile-drawer"
                        onClick={() => setHamburgerOpen(o => !o)}>
                        <i className={hamburgerOpen ? 'ri-close-line' : 'ri-menu-line'} style={{ fontSize: 18 }} />
                    </button>

                    {/* Logo */}
                    <img src="/logo.png" alt="YearWrap"
                        style={{ width: 24, height: 24, objectFit: 'contain', marginRight: 4, filter: 'brightness(1.2)' }}
                        onError={e => { e.target.style.display = 'none' }} />
                    <span style={{ fontSize: 12, color: '#f5ead8', fontWeight: 700, padding: '0 6px', cursor: 'default', fontFamily: 'Georgia, serif' }}>
                        YearWrap
                    </span>

                    {/* Desktop menus */}
                    <DesktopMenu onAction={handleAction} />
                </div>

                {/* RIGHT */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'rgba(245,234,216,0.80)', fontFamily: 'Georgia, serif' }}
                        className="yw-username-label">
                        {username}
                    </span>
                    {GooglyEyes && <GooglyEyes mousePos={mousePos} />}
                    <div style={{ width: 1, height: 14, background: 'rgba(200,168,130,0.3)' }} />
                    {/* Control center toggle */}
                    <button aria-label="Control center" onClick={onCCToggle}
                        style={{
                            width: 28, height: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: 5, background: ccOpen ? 'rgba(200,168,130,0.25)' : 'transparent',
                            border: 'none', transition: 'background 0.15s',
                        }}>
                        <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
                            <rect x="0" y="0" width="7" height="5" rx="1.5" fill="rgba(245,234,216,0.85)" />
                            <rect x="11" y="0" width="7" height="5" rx="1.5" fill="rgba(245,234,216,0.85)" />
                            <rect x="0" y="7" width="7" height="5" rx="1.5" fill="rgba(245,234,216,0.85)" />
                            <rect x="11" y="7" width="7" height="5" rx="1.5" fill="rgba(245,234,216,0.85)" />
                        </svg>
                    </button>
                    <div style={{ width: 1, height: 14, background: 'rgba(200,168,130,0.3)' }} />
                    <LiveClock />
                </div>
            </div>

            {/* Mobile drawer */}
            <HamburgerMenu
                open={hamburgerOpen}
                onClose={() => setHamburgerOpen(false)}
                onAction={handleAction}
                widgets={widgets}
            />
        </>
    )
}
