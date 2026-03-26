import React, { useState } from 'react'

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
        { label: '▶  Watch How It Works', action: 'help_video' },
    ],
}

export default function DesktopMenu({ onAction }) {
    const [openMenu, setOpenMenu] = useState(null)

    const handleKey = (e, menuName) => {
        if (e.key === 'Enter' || e.key === ' ') setOpenMenu(openMenu === menuName ? null : menuName)
        if (e.key === 'Escape') setOpenMenu(null)
    }

    return (
        <>
            <style>{`
        @media (max-width: 767px) { .yw-desktop-menu { display: none !important; } }
      `}</style>
            <div className="yw-desktop-menu" style={{ display: 'flex', gap: 2, alignItems: 'center' }}
                onMouseLeave={() => setOpenMenu(null)}>
                {Object.keys(MENUS).map(menuName => (
                    <div key={menuName} style={{ position: 'relative' }}>
                        <button
                            aria-haspopup="true"
                            aria-expanded={openMenu === menuName}
                            onClick={() => setOpenMenu(openMenu === menuName ? null : menuName)}
                            onKeyDown={e => handleKey(e, menuName)}
                            style={{
                                fontSize: 12, padding: '2px 8px', borderRadius: 4,
                                cursor: 'default', userSelect: 'none', border: 'none',
                                color: openMenu === menuName ? '#3b2314' : 'rgba(245,234,216,0.72)',
                                background: openMenu === menuName ? 'rgba(245,234,216,0.88)' : 'transparent',
                                fontFamily: 'Georgia, serif', transition: 'all 0.1s',
                            }}>
                            {menuName}
                        </button>

                        {openMenu === menuName && (
                            <div role="menu" style={{
                                position: 'absolute', top: 'calc(100% + 4px)', left: 0,
                                background: 'rgba(40,22,10,0.96)', backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(200,168,130,0.18)', borderRadius: 8,
                                minWidth: 180, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                                overflow: 'hidden', zIndex: 200,
                            }}>
                                {MENUS[menuName].map((item, i) => (
                                    <div key={i} role="menuitem" tabIndex={item.disabled ? -1 : 0}
                                        onClick={() => { if (!item.disabled) { onAction(item.action); setOpenMenu(null) } }}
                                        onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && !item.disabled) { onAction(item.action); setOpenMenu(null) } }}
                                        style={{
                                            padding: '7px 16px', fontSize: 12, fontFamily: 'Georgia, serif',
                                            color: item.disabled ? 'rgba(245,234,216,0.3)' : 'rgba(245,234,216,0.88)',
                                            cursor: item.disabled ? 'default' : 'pointer',
                                            borderBottom: i < MENUS[menuName].length - 1 ? '1px solid rgba(200,168,130,0.08)' : 'none',
                                            outline: 'none',
                                        }}
                                        onMouseEnter={e => { if (!item.disabled) e.currentTarget.style.background = 'rgba(107,66,38,0.6)' }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                                        {item.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    )
}
