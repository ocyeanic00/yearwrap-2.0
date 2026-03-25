import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import html2canvas from 'html2canvas'
import FolderModal from '../components/memory/FolderModal'
import useUserStore from '../store/userStore'
import useMemoryStore from '../store/memoryStore'
import { spotifyService } from '../services/spotifyService'

// TAN & COFFEE PALETTE
// #3b2314 — dark espresso
// #6b4226 — mid coffee
// #8b5e3c — light coffee
// #c8a882 — tan
// #e8d5b8 — pale tan
// #f5ead8 — cream

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
  Window: [{ label: 'Minimize', disabled: true }, { label: 'Zoom', disabled: true }],
  Help: [{ label: 'About YearWrap', disabled: true }],
}

function shade(hex, p) {
  const n = parseInt(hex.replace('#', ''), 16)
  return `rgb(${Math.min(255, Math.max(0, (n >> 16) + p))},${Math.min(255, Math.max(0, ((n >> 8) & 0xff) + p))},${Math.min(255, Math.max(0, (n & 0xff) + p))})`
}

function FolderSVG({ color, size = 62 }) {
  const dark = shade(color, -30)
  return (
    <svg viewBox="0 0 72 60" style={{ width: size, height: size * 0.83, filter: 'drop-shadow(0 4px 10px rgba(59,35,20,0.5))' }}>
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
        fontSize: 11, color: '#f5ead8', fontFamily: 'Georgia, serif',
        textShadow: '0 1px 6px rgba(59,35,20,0.9)',
        background: hovered ? 'rgba(59,35,20,0.78)' : 'transparent',
        padding: '1px 7px', borderRadius: 4, maxWidth: 90, textAlign: 'center', lineHeight: 1.3
      }}>
        {label}
      </span>
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
          background: hovered ? 'rgba(200,168,130,0.35)' : 'rgba(245,234,216,0.12)',
          border: '1px solid rgba(200,168,130,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.15s',
          boxShadow: hovered ? '0 4px 16px rgba(59,35,20,0.45)' : 'none',
          overflow: 'hidden', marginBottom: hovered ? -8 : 0
        }}>
        {img
          ? <img src={img} alt={label} style={{ width: 26, height: 26, objectFit: 'contain' }} />
          : <i className={icon} style={{ fontSize: 20, color: '#f5ead8' }} />}
      </div>
      {hovered && (
        <div style={{
          position: 'absolute', bottom: '110%',
          background: 'rgba(30,16,8,0.92)', color: '#f5ead8',
          fontSize: 10, padding: '3px 9px', borderRadius: 6,
          whiteSpace: 'nowrap', pointerEvents: 'none', fontFamily: 'Georgia, serif',
          border: '1px solid rgba(200,168,130,0.2)'
        }}>{label}</div>
      )}
      {active && <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#c8a882' }} />}
    </div>
  )
}

function GooglyEyes({ mousePos }) {
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  function getPupilOffset(eyeRef) {
    if (!eyeRef.current || !mousePos) return { x: 0, y: 0 }
    const rect = eyeRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2
    const dx = mousePos.x - cx, dy = mousePos.y - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist === 0) return { x: 0, y: 0 }
    const scale = Math.min(dist, 18) / dist
    return { x: (dx * scale) / 6, y: (dy * scale) / 6 }
  }
  const lp = getPupilOffset(leftRef), rp = getPupilOffset(rightRef)
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {[{ ref: leftRef, p: lp }, { ref: rightRef, p: rp }].map(({ ref, p }, i) => (
        <div key={i} ref={ref} style={{
          width: 16, height: 16, borderRadius: '50%',
          background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden', flexShrink: 0
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', background: '#2a1408',
            position: 'absolute', transform: `translate(${p.x}px, ${p.y}px)`, transition: 'transform 0.05s linear'
          }}>
            <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'white', position: 'absolute', top: 1, left: 1 }} />
          </div>
        </div>
      ))}
    </div>
  )
}

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

function MenuBar({ mousePos, navigate, username }) {
  const [openMenu, setOpenMenu] = useState(null)
  const [ccOpen, setCcOpen] = useState(false)
  const handleAction = (action) => {
    setOpenMenu(null)
    const routes = { home: '/', treasure: '/treasure-chest', dump: '/dump-it', recap: '/recap', login: '/login', dashboard: '/dashboard' }
    if (routes[action]) navigate(routes[action])
  }
  return (
    <>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 30,
        background: 'rgba(59,35,20,0.60)', backdropFilter: 'blur(32px) saturate(180%)',
        WebkitBackdropFilter: 'blur(32px) saturate(180%)',
        borderBottom: '1px solid rgba(200,168,130,0.20)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', zIndex: 100
      }}
        onClick={() => { setOpenMenu(null); setCcOpen(false) }}>

        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }} onClick={e => e.stopPropagation()}>
          <img src="/logo.png" alt="YearWrap" style={{ width: 28, height: 28, objectFit: 'contain', marginRight: 6, opacity: 1, filter: 'brightness(1.2)' }}
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline' }} />
          <i className="ri-leaf-line" style={{ fontSize: 16, color: '#c8a882', marginRight: 6, display: 'none' }} />
          <span style={{ fontSize: 12, color: '#f5ead8', fontWeight: 700, padding: '0 8px', cursor: 'default' }}>YearWrap</span>
          {Object.keys(MENUS).map(menuName => (
            <div key={menuName} style={{ position: 'relative' }}>
              <span onClick={() => setOpenMenu(openMenu === menuName ? null : menuName)}
                style={{
                  fontSize: 12, padding: '2px 8px', borderRadius: 4, cursor: 'default', userSelect: 'none',
                  color: openMenu === menuName ? '#3b2314' : 'rgba(245,234,216,0.72)',
                  background: openMenu === menuName ? 'rgba(245,234,216,0.88)' : 'transparent'
                }}>
                {menuName}
              </span>
              {openMenu === menuName && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 4px)', left: 0,
                  background: 'rgba(40,22,10,0.96)', backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(200,168,130,0.18)', borderRadius: 8, minWidth: 180,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)', overflow: 'hidden', zIndex: 200
                }}>
                  {MENUS[menuName].map((item, i) => (
                    <div key={i} onClick={() => !item.disabled && handleAction(item.action)}
                      style={{
                        padding: '7px 16px', fontSize: 12, fontFamily: 'Georgia, serif',
                        color: item.disabled ? 'rgba(245,234,216,0.3)' : 'rgba(245,234,216,0.88)',
                        cursor: item.disabled ? 'default' : 'pointer',
                        borderBottom: i < MENUS[menuName].length - 1 ? '1px solid rgba(200,168,130,0.08)' : 'none'
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

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }} onClick={e => e.stopPropagation()}>
          <span style={{ fontSize: 11, color: 'rgba(245,234,216,0.80)' }}>{username}</span>
          <GooglyEyes mousePos={mousePos} />
          <div style={{ width: 1, height: 14, background: 'rgba(200,168,130,0.3)' }} />
          <div onClick={() => setCcOpen(o => !o)}
            style={{
              width: 28, height: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 5, background: ccOpen ? 'rgba(200,168,130,0.25)' : 'transparent', transition: 'background 0.15s'
            }}>
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
              <rect x="0" y="0" width="7" height="5" rx="1.5" fill="rgba(245,234,216,0.85)" />
              <rect x="11" y="0" width="7" height="5" rx="1.5" fill="rgba(245,234,216,0.85)" />
              <rect x="0" y="7" width="7" height="5" rx="1.5" fill="rgba(245,234,216,0.85)" />
              <rect x="11" y="7" width="7" height="5" rx="1.5" fill="rgba(245,234,216,0.85)" />
            </svg>
          </div>
          <div style={{ width: 1, height: 14, background: 'rgba(200,168,130,0.3)' }} />
          <LiveClock />
        </div>
      </div>
      {ccOpen && <ControlCenter onClose={() => setCcOpen(false)} navigate={navigate} />}
    </>
  )
}

function ControlCenter({ onClose, navigate }) {
  const [airdrop, setAirdrop] = useState(false)
  const [screenshot, setScreenshot] = useState(false)
  const [brightness, setBrightness] = useState(100)
  const [volume, setVolume] = useState(50)
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Spotify state
  const [spotifyToken, setSpotifyToken] = useState(null)
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Brightness overlay ref
  const brightnessRef = useRef(null)

  // Check for Spotify token on mount
  useEffect(() => {
    const token = spotifyService.getToken()
    console.log('Checking for Spotify token:', token ? 'Found' : 'Not found')
    if (token) {
      setSpotifyToken(token)
      fetchCurrentTrack(token)
    }
  }, [])

  // Fetch current track
  const fetchCurrentTrack = async (token) => {
    try {
      console.log('Fetching current track...')
      let track = await spotifyService.getCurrentlyPlaying(token)
      console.log('Currently playing:', track)
      
      if (!track || !track.item) {
        // If nothing playing, get recently played
        console.log('Nothing playing, fetching recently played...')
        const recent = await spotifyService.getRecentlyPlayed(token)
        console.log('Recently played:', recent)
        if (recent) {
          track = { item: recent.track, is_playing: false }
        }
      }
      
      if (track && track.item) {
        console.log('Setting track:', track.item.name)
        setCurrentTrack(track.item)
        setIsPlaying(track.is_playing || false)
      }
    } catch (error) {
      console.error('Spotify fetch error:', error)
      // Token might be expired
      if (error.message.includes('401')) {
        console.log('Token expired, clearing...')
        spotifyService.clearToken()
        setSpotifyToken(null)
      }
    }
  }

  // Connect to Spotify
  const handleSpotifyConnect = () => {
    console.log('Connecting to Spotify...')
    const authUrl = spotifyService.getAuthUrl()
    console.log('Auth URL:', authUrl)
    window.location.href = authUrl
  }

  // Toggle playback
  const handlePlayPause = async () => {
    if (!spotifyToken) return
    try {
      await spotifyService.togglePlayback(spotifyToken, isPlaying)
      setIsPlaying(!isPlaying)
    } catch (error) {
      console.error('Playback error:', error)
    }
  }

  // Skip next
  const handleNext = async () => {
    if (!spotifyToken) return
    try {
      await spotifyService.skipNext(spotifyToken)
      setTimeout(() => fetchCurrentTrack(spotifyToken), 500)
    } catch (error) {
      console.error('Skip error:', error)
    }
  }

  // Skip previous
  const handlePrevious = async () => {
    if (!spotifyToken) return
    try {
      await spotifyService.skipPrevious(spotifyToken)
      setTimeout(() => fetchCurrentTrack(spotifyToken), 500)
    } catch (error) {
      console.error('Skip error:', error)
    }
  }

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords
              console.log('Got location:', latitude, longitude)
              
              // Use Open-Meteo API (free, no API key needed)
              const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=4`
              )
              const data = await response.json()
              console.log('Weather data:', data)
              
              if (data.current) {
                // Current weather
                const current = data.current
                const today = data.daily
                
                // Map weather codes to descriptions and icons
                const getWeatherInfo = (code) => {
                  const weatherCodes = {
                    0: { desc: 'Clear sky', icon: 'ri-sun-line' },
                    1: { desc: 'Mainly clear', icon: 'ri-sun-line' },
                    2: { desc: 'Partly cloudy', icon: 'ri-sun-cloudy-line' },
                    3: { desc: 'Overcast', icon: 'ri-cloudy-line' },
                    45: { desc: 'Foggy', icon: 'ri-mist-line' },
                    48: { desc: 'Foggy', icon: 'ri-mist-line' },
                    51: { desc: 'Light drizzle', icon: 'ri-drizzle-line' },
                    53: { desc: 'Drizzle', icon: 'ri-drizzle-line' },
                    55: { desc: 'Heavy drizzle', icon: 'ri-drizzle-line' },
                    61: { desc: 'Light rain', icon: 'ri-rainy-line' },
                    63: { desc: 'Rain', icon: 'ri-rainy-line' },
                    65: { desc: 'Heavy rain', icon: 'ri-heavy-showers-line' },
                    71: { desc: 'Light snow', icon: 'ri-snowy-line' },
                    73: { desc: 'Snow', icon: 'ri-snowy-line' },
                    75: { desc: 'Heavy snow', icon: 'ri-snowy-line' },
                    80: { desc: 'Rain showers', icon: 'ri-showers-line' },
                    81: { desc: 'Rain showers', icon: 'ri-showers-line' },
                    82: { desc: 'Heavy rain showers', icon: 'ri-heavy-showers-line' },
                    95: { desc: 'Thunderstorm', icon: 'ri-thunderstorms-line' },
                    96: { desc: 'Thunderstorm', icon: 'ri-thunderstorms-line' },
                    99: { desc: 'Thunderstorm', icon: 'ri-thunderstorms-line' }
                  }
                  return weatherCodes[code] || { desc: 'Partly cloudy', icon: 'ri-sun-cloudy-line' }
                }
                
                const currentWeather = getWeatherInfo(current.weather_code)
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                
                setWeather({
                  temp: Math.round(current.temperature_2m),
                  description: currentWeather.desc,
                  icon: currentWeather.icon,
                  forecast: [1, 2, 3].map(i => {
                    const date = new Date()
                    date.setDate(date.getDate() + i)
                    const dayName = days[date.getDay()]
                    const weatherInfo = getWeatherInfo(today.weather_code[i])
                    return {
                      day: dayName,
                      temp: Math.round(today.temperature_2m_max[i]),
                      icon: weatherInfo.icon
                    }
                  })
                })
              }
              setLoading(false)
            },
            async (error) => {
              // Location denied or error, try IP-based location
              console.log('Geolocation error:', error.message)
              try {
                // Use IP-based location as fallback
                const ipResponse = await fetch('https://ipapi.co/json/')
                const ipData = await ipResponse.json()
                console.log('IP location:', ipData)
                
                const response = await fetch(
                  `https://api.open-meteo.com/v1/forecast?latitude=${ipData.latitude}&longitude=${ipData.longitude}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=4`
                )
                const data = await response.json()
                
                if (data.current) {
                  const current = data.current
                  const today = data.daily
                  
                  const getWeatherInfo = (code) => {
                    const weatherCodes = {
                      0: { desc: 'Clear sky', icon: 'ri-sun-line' },
                      1: { desc: 'Mainly clear', icon: 'ri-sun-line' },
                      2: { desc: 'Partly cloudy', icon: 'ri-sun-cloudy-line' },
                      3: { desc: 'Overcast', icon: 'ri-cloudy-line' },
                      61: { desc: 'Light rain', icon: 'ri-rainy-line' },
                      63: { desc: 'Rain', icon: 'ri-rainy-line' },
                      80: { desc: 'Rain showers', icon: 'ri-showers-line' }
                    }
                    return weatherCodes[code] || { desc: 'Partly cloudy', icon: 'ri-sun-cloudy-line' }
                  }
                  
                  const currentWeather = getWeatherInfo(current.weather_code)
                  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                  
                  setWeather({
                    temp: Math.round(current.temperature_2m),
                    description: currentWeather.desc,
                    icon: currentWeather.icon,
                    forecast: [1, 2, 3].map(i => {
                      const date = new Date()
                      date.setDate(date.getDate() + i)
                      const dayName = days[date.getDay()]
                      const weatherInfo = getWeatherInfo(today.weather_code[i])
                      return {
                        day: dayName,
                        temp: Math.round(today.temperature_2m_max[i]),
                        icon: weatherInfo.icon
                      }
                    })
                  })
                }
              } catch (ipError) {
                console.error('IP location error:', ipError)
                // Final fallback to default
                setWeather({
                  temp: 24,
                  description: 'Partly cloudy',
                  icon: 'ri-sun-cloudy-line',
                  forecast: [
                    { day: 'Mon', temp: 26, icon: 'ri-sun-line' },
                    { day: 'Tue', temp: 21, icon: 'ri-drizzle-line' },
                    { day: 'Wed', temp: 19, icon: 'ri-cloudy-line' }
                  ]
                })
              }
              setLoading(false)
            },
            {
              enableHighAccuracy: false,
              timeout: 5000,
              maximumAge: 0
            }
          )
        } else {
          console.log('Geolocation not supported')
          setLoading(false)
        }
      } catch (error) {
        console.error('Weather fetch error:', error)
        setLoading(false)
      }
    }
    
    fetchWeather()
  }, [])

  // Helper function to map weather conditions to icons
  const getWeatherIcon = (condition) => {
    const icons = {
      'Clear': 'ri-sun-line',
      'Clouds': 'ri-cloudy-line',
      'Rain': 'ri-rainy-line',
      'Drizzle': 'ri-drizzle-line',
      'Thunderstorm': 'ri-thunderstorms-line',
      'Snow': 'ri-snowy-line',
      'Mist': 'ri-mist-line',
      'Fog': 'ri-foggy-line'
    }
    return icons[condition] || 'ri-sun-cloudy-line'
  }

  // Apply brightness via a dark overlay
  useEffect(() => {
    let overlay = document.getElementById('__brightness_overlay__')
    if (!overlay) {
      overlay = document.createElement('div')
      overlay.id = '__brightness_overlay__'
      overlay.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;transition:background 0.2s'
      document.body.appendChild(overlay)
    }
    // brightness 100 = no overlay, 0 = fully black
    const opacity = (100 - brightness) / 100 * 0.85
    overlay.style.background = `rgba(0,0,0,${opacity})`
    return () => { /* keep overlay alive */ }
  }, [brightness])

  // Volume via Web Audio API on all <audio>/<video> elements
  useEffect(() => {
    const els = document.querySelectorAll('audio, video')
    els.forEach(el => { el.volume = volume / 100 })
  }, [volume])

  // AirDrop toggle — copy link to clipboard when turning on
  const handleAirdrop = async () => {
    const next = !airdrop
    setAirdrop(next)
    if (next) {
      try {
        await navigator.clipboard.writeText(window.location.href)
        // Show a brief notification
        const notification = document.createElement('div')
        notification.textContent = 'Link copied to clipboard!'
        notification.style.cssText = 'position:fixed;top:50px;left:50%;transform:translateX(-50%);background:rgba(59,35,20,0.95);color:#f5ead8;padding:12px 24px;borderRadius:12px;fontSize:13px;fontFamily:Georgia,serif;zIndex:9999;boxShadow:0 4px 20px rgba(0,0,0,0.3)'
        document.body.appendChild(notification)
        setTimeout(() => notification.remove(), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  // Screenshot — capture page and copy to clipboard
  // Screenshot — capture page and copy to clipboard
  const handleScreenshot = async () => {
    setScreenshot(true)
    try {
      // Use html2canvas to capture the page
      const canvas = await html2canvas(document.body, {
        allowTaint: true,
        useCORS: true,
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight
      })
        
      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        try {
          // Copy to clipboard
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ])
          
          // Show notification
          const notification = document.createElement('div')
          notification.textContent = 'Screenshot copied to clipboard!'
          notification.style.cssText = 'position:fixed;top:50px;left:50%;transform:translateX(-50%);background:rgba(59,35,20,0.95);color:#f5ead8;padding:12px 24px;borderRadius:12px;fontSize:13px;fontFamily:Georgia,serif;zIndex:9999;boxShadow:0 4px 20px rgba(0,0,0,0.3)'
          document.body.appendChild(notification)
          setTimeout(() => notification.remove(), 2000)
        } catch (err) {
          console.error('Failed to copy screenshot:', err)
          // Fallback: download the image
          const link = document.createElement('a')
          link.download = 'yearwrap-screenshot.png'
          link.href = canvas.toDataURL()
          link.click()
        }
      })
    } catch (err) {
      console.error('Screenshot failed:', err)
    }
    setTimeout(() => setScreenshot(false), 1500)
  }

  const SmallBtn = ({ icon, label, on, onToggle }) => (
    <div onClick={onToggle} style={{
      display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flex: 1,
      background: on ? 'rgba(200,168,130,0.25)' : 'rgba(255,245,235,0.07)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: `1px solid ${on ? 'rgba(200,168,130,0.45)' : 'rgba(255,235,200,0.18)'}`,
      borderRadius: 14, padding: '8px 10px', transition: 'all 0.15s',
      boxShadow: 'inset 0 1px 0 rgba(255,235,200,0.10)',
    }}
      onMouseEnter={e => e.currentTarget.style.background = on ? 'rgba(200,168,130,0.32)' : 'rgba(255,245,235,0.13)'}
      onMouseLeave={e => e.currentTarget.style.background = on ? 'rgba(200,168,130,0.25)' : 'rgba(255,245,235,0.07)'}>
      <div style={{
        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
        background: on ? '#c8a882' : 'rgba(200,168,130,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <i className={icon} style={{ fontSize: 14, color: on ? '#3b2314' : 'rgba(245,234,216,0.85)' }} />
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#f5ead8', fontFamily: 'Georgia, serif', whiteSpace: 'nowrap' }}>{label}</p>
        <p style={{ margin: 0, fontSize: 9, color: on ? '#c8a882' : 'rgba(200,168,130,0.55)' }}>{on ? 'On' : 'Off'}</p>
      </div>
    </div>
  )

  const Slider = ({ label, iconMin, iconMax, value, onChange }) => (
    <div style={{ background: 'rgba(200,168,130,0.08)', border: '1px solid rgba(200,168,130,0.15)', borderRadius: 14, padding: '12px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <p style={{ fontSize: 10, color: 'rgba(245,234,216,0.55)', margin: 0, letterSpacing: 0.5 }}>{label}</p>
        <p style={{ fontSize: 10, color: 'rgba(200,168,130,0.7)', margin: 0 }}>{value}%</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <i className={iconMin} style={{ fontSize: 13, color: 'rgba(200,168,130,0.5)' }} />
        <input type="range" min="0" max="100" value={value} onChange={e => onChange(+e.target.value)}
          style={{ flex: 1, accentColor: '#c8a882', cursor: 'pointer' }} />
        <i className={iconMax} style={{ fontSize: 13, color: '#c8a882' }} />
      </div>
    </div>
  )

  const glass = {
    background: 'rgba(255,245,235,0.07)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255,235,200,0.18)',
    borderRadius: 16,
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 150 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        position: 'absolute', top: 36, right: 12, width: 290,
        background: 'rgba(30,14,6,0.45)',
        backdropFilter: 'blur(60px) saturate(220%)',
        WebkitBackdropFilter: 'blur(60px) saturate(220%)',
        border: '1px solid rgba(255,220,170,0.22)',
        borderRadius: 22, padding: 14,
        boxShadow: '0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,235,200,0.12)',
        display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'Georgia, serif',
      }}>

        {/* AirDrop + Screenshot */}
        <div style={{ display: 'flex', gap: 8 }}>
          <SmallBtn icon="ri-share-line" label="AirDrop" on={airdrop} onToggle={handleAirdrop} />
          <SmallBtn icon="ri-screenshot-line" label="Screenshot" on={screenshot} onToggle={handleScreenshot} />
        </div>

        {/* Weather + Spotify */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {/* Weather */}
          <div style={{
            ...glass, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 4,
            boxShadow: 'inset 0 1px 0 rgba(255,235,200,0.10)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <i className={weather?.icon || 'ri-sun-cloudy-line'} style={{ fontSize: 20, color: '#e8c87a' }} />
              <span style={{ fontSize: 8, color: 'rgba(245,234,216,0.35)', letterSpacing: 1, textTransform: 'uppercase' }}>weather</span>
            </div>
            {loading ? (
              <p style={{ fontSize: 14, color: 'rgba(245,234,216,0.5)', margin: 0 }}>Loading...</p>
            ) : (
              <>
                <p style={{ fontSize: 24, fontWeight: 700, color: '#f5ead8', margin: 0, lineHeight: 1 }}>
                  {weather?.temp || 24}°
                </p>
                <p style={{ fontSize: 9, color: 'rgba(200,168,130,0.7)', margin: 0, textTransform: 'capitalize' }}>
                  {weather?.description || 'Partly cloudy'}
                </p>
                <div style={{ display: 'flex', gap: 3, marginTop: 4 }}>
                  {(weather?.forecast || [
                    { day: 'Mon', temp: 26, icon: 'ri-sun-line' },
                    { day: 'Tue', temp: 21, icon: 'ri-drizzle-line' },
                    { day: 'Wed', temp: 19, icon: 'ri-cloudy-line' }
                  ]).map(w => (
                    <div key={w.day} style={{ flex: 1, textAlign: 'center' }}>
                      <p style={{ fontSize: 7, color: 'rgba(200,168,130,0.5)', margin: 0 }}>{w.day}</p>
                      <i className={w.icon} style={{ fontSize: 10, color: '#c8a882' }} />
                      <p style={{ fontSize: 8, color: 'rgba(245,234,216,0.7)', margin: 0 }}>{w.temp}°</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Spotify */}
          <div onClick={!spotifyToken ? handleSpotifyConnect : undefined} style={{
            ...glass, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 6,
            border: '1px solid rgba(30,215,96,0.22)',
            boxShadow: 'inset 0 1px 0 rgba(30,215,96,0.08)',
            cursor: !spotifyToken ? 'pointer' : 'default'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <i className="ri-spotify-line" style={{ fontSize: 16, color: '#1ed760' }} />
              <span style={{ fontSize: 8, color: 'rgba(245,234,216,0.35)', letterSpacing: 1, textTransform: 'uppercase' }}>spotify</span>
            </div>
            <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
              {currentTrack?.album?.images?.[0]?.url ? (
                <img 
                  src={currentTrack.album.images[0].url} 
                  alt="Album"
                  style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: 'rgba(200,168,130,0.18)', backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(200,168,130,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <i className="ri-music-2-line" style={{ fontSize: 14, color: 'rgba(245,234,216,0.85)' }} />
                </div>
              )}
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <p style={{ fontSize: 10, color: '#f5ead8', fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentTrack?.name || 'your playlist'}
                </p>
                <p style={{ fontSize: 8, color: 'rgba(245,234,216,0.4)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentTrack?.artists?.[0]?.name || 'connect spotify'}
                </p>
              </div>
            </div>
            {spotifyToken && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <i 
                  className="ri-skip-back-line" 
                  onClick={handlePrevious}
                  style={{ fontSize: 13, color: 'rgba(200,168,130,0.85)', cursor: 'pointer', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color = '#c8a882'}
                  onMouseLeave={e => e.target.style.color = 'rgba(200,168,130,0.85)'}
                />
                <div 
                  onClick={handlePlayPause}
                  style={{
                    width: 26, height: 26, borderRadius: '50%', background: '#1ed760',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    boxShadow: '0 0 10px rgba(30,215,96,0.4)', transition: 'transform 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <i className={isPlaying ? 'ri-pause-fill' : 'ri-play-fill'} style={{ fontSize: 13, color: '#000' }} />
                </div>
                <i 
                  className="ri-skip-forward-line" 
                  onClick={handleNext}
                  style={{ fontSize: 13, color: 'rgba(200,168,130,0.85)', cursor: 'pointer', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color = '#c8a882'}
                  onMouseLeave={e => e.target.style.color = 'rgba(200,168,130,0.85)'}
                />
              </div>
            )}
          </div>
        </div>

        {/* Brightness */}
        <div style={{ ...glass, padding: '12px 16px', boxShadow: 'inset 0 1px 0 rgba(255,235,200,0.10)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <p style={{ fontSize: 11, color: 'rgba(245,234,216,0.7)', margin: 0, fontFamily: 'Georgia, serif' }}>Brightness</p>
            <p style={{ fontSize: 10, color: 'rgba(200,168,130,0.7)', margin: 0 }}>{brightness}%</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="ri-sun-line" style={{ fontSize: 13, color: 'rgba(200,168,130,0.5)' }} />
            <input type="range" min="0" max="100" value={brightness} onChange={e => setBrightness(+e.target.value)}
              style={{ flex: 1, accentColor: '#c8a882', cursor: 'pointer' }} />
            <i className="ri-sun-fill" style={{ fontSize: 13, color: '#c8a882' }} />
          </div>
        </div>

        {/* Sound */}
        <div style={{ ...glass, padding: '12px 16px', boxShadow: 'inset 0 1px 0 rgba(255,235,200,0.10)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <p style={{ fontSize: 11, color: 'rgba(245,234,216,0.7)', margin: 0, fontFamily: 'Georgia, serif' }}>Sound</p>
            <p style={{ fontSize: 10, color: 'rgba(200,168,130,0.7)', margin: 0 }}>{volume}%</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="ri-volume-mute-line" style={{ fontSize: 13, color: 'rgba(200,168,130,0.5)' }} />
            <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(+e.target.value)}
              style={{ flex: 1, accentColor: '#c8a882', cursor: 'pointer' }} />
            <i className="ri-volume-up-line" style={{ fontSize: 13, color: '#c8a882' }} />
          </div>
        </div>

      </div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [activeFolder, setActiveFolder] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [profilePhoto, setProfilePhoto] = useState(null)
  const photoInputRef = useRef(null)
  const user = useUserStore((s) => s.user)
  const wraps = useMemoryStore((s) => s.wraps)
  const username = user?.name || user?.username || 'guest'

  const activeWraps = Object.keys(wraps).length
  const foldersFilled = Object.values(wraps).reduce((total, yr) =>
    total + Object.values(yr).filter(f => f.text || f.photos?.length > 0).length, 0)
  const photosSaved = Object.values(wraps).reduce((total, yr) =>
    total + Object.values(yr).reduce((t, f) => t + (f.photos?.length || 0), 0), 0)
  const [time, setTime] = useState(new Date())

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t) }, [])
  const handleMouseMove = useCallback((e) => setMousePos({ x: e.clientX, y: e.clientY }), [])

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const h = time.getHours(), m = String(time.getMinutes()).padStart(2, '0')
  const ampm = h >= 12 ? 'PM' : 'AM'

  const widget = {
    background: 'rgba(59,35,20,0.52)',
    backdropFilter: 'blur(28px) saturate(180%)',
    WebkitBackdropFilter: 'blur(28px) saturate(180%)',
    border: '1px solid rgba(200,168,130,0.18)',
    borderRadius: 18,
    color: '#f5ead8',
    fontFamily: 'Georgia, serif',
  }

  const FOLDERS = [
    { name: 'my_pov', type: 'folder', color: '#c8a882' },
    { name: 'moments', type: 'folder', color: '#a07850' },
    { name: 'peeps', type: 'folder', color: '#b8956a' },
    { name: 'triptrip', type: 'folder', color: '#8b6240' },
    { name: 'mood', type: 'folder', color: '#d4b896' },
    { name: 'challenges', type: 'folder', color: '#7a5535' },
  ]

  return (
    <div onMouseMove={handleMouseMove}
      style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', fontFamily: 'Georgia, serif' }}>

      {/* Wallpaper */}
      <img src="/bg-lily.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center bottom' }} />
      {/* Coffee/tan overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(135deg, rgba(59,35,20,0.62) 0%, rgba(107,66,38,0.48) 50%, rgba(139,94,60,0.38) 100%)'
      }} />
      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 35%, rgba(30,14,6,0.55) 100%)'
      }} />

      <MenuBar mousePos={mousePos} navigate={navigate} username={username} />

      {/* DESKTOP LAYOUT */}
      <div style={{
        position: 'absolute', top: 30, left: 0, right: 0, bottom: 62,
        display: 'flex', alignItems: 'stretch',
        padding: 'clamp(8px,1.5vh,16px) clamp(10px,1.5vw,20px)',
        gap: 'clamp(8px,1.2vw,16px)',
      }}>

        {/* LEFT — widgets */}
        <div style={{ width: 'clamp(160px,17vw,220px)', display: 'flex', flexDirection: 'column', gap: 'clamp(6px,1vh,10px)', flexShrink: 0, overflow: 'hidden' }}>

          {/* Clock */}
          <div style={{ ...widget, padding: 'clamp(8px,1.2vh,14px) clamp(10px,1.1vw,18px)', flexShrink: 0 }}>
            <p style={{ fontSize: 'clamp(7px,0.65vw,9px)', letterSpacing: 2, color: 'rgba(200,168,130,0.6)', textTransform: 'uppercase', marginBottom: 4 }}>local time</p>
            <p style={{ fontSize: 'clamp(22px,2.8vw,36px)', fontWeight: 700, color: '#f5ead8', lineHeight: 1, letterSpacing: -1, margin: 0 }}>
              {String(h % 12 || 12).padStart(2, '0')}:{m}
              <span style={{ fontSize: 'clamp(10px,0.9vw,14px)', fontWeight: 400, marginLeft: 5, color: 'rgba(200,168,130,0.7)' }}>{ampm}</span>
            </p>
            <p style={{ fontSize: 'clamp(9px,0.75vw,11px)', color: 'rgba(200,168,130,0.65)', marginTop: 3, marginBottom: 0 }}>
              {days[time.getDay()]}, {time.getDate()} {months[time.getMonth()]}
            </p>
          </div>

          {/* Quote */}
          <div style={{ ...widget, padding: 'clamp(8px,1vh,14px) clamp(10px,1vw,16px)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
              <i className="ri-double-quotes-l" style={{ fontSize: 'clamp(13px,1.1vw,18px)', color: '#c8a882' }} />
              <span style={{ fontSize: 'clamp(7px,0.6vw,9px)', letterSpacing: 2, color: 'rgba(200,168,130,0.55)', textTransform: 'uppercase' }}>note to self</span>
            </div>
            <p style={{ fontSize: 'clamp(10px,0.85vw,13px)', color: '#f5ead8', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
              "capture the moments that make you feel alive."
            </p>
          </div>

          {/* Quick nav */}
          <div style={{ ...widget, padding: 'clamp(8px,1vh,12px) clamp(10px,1vw,14px)', flexShrink: 0 }}>
            <p style={{ fontSize: 'clamp(7px,0.6vw,9px)', letterSpacing: 2, color: 'rgba(200,168,130,0.55)', textTransform: 'uppercase', marginBottom: 8 }}>quick nav</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[
                { icon: 'ri-treasure-map-line', label: 'Treasure Chest', path: '/treasure-chest' },
                { icon: 'ri-delete-bin-2-line', label: 'Dump It', path: '/dump-it' },
                { icon: 'ri-book-open-line', label: 'Recap', path: '/recap' },
              ].map(item => (
                <div key={item.label} onClick={() => navigate(item.path)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 'clamp(4px,0.6vh,7px) 8px', borderRadius: 10, cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,168,130,0.18)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <i className={item.icon} style={{ fontSize: 'clamp(11px,0.9vw,15px)', color: '#c8a882' }} />
                  <span style={{ fontSize: 'clamp(9px,0.8vw,12px)', color: 'rgba(245,234,216,0.85)' }}>{item.label}</span>
                  <i className="ri-arrow-right-s-line" style={{ fontSize: 12, color: 'rgba(200,168,130,0.35)', marginLeft: 'auto' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ ...widget, padding: 'clamp(8px,1vh,12px) clamp(10px,1vw,14px)', flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <p style={{ fontSize: 'clamp(7px,0.6vw,9px)', letterSpacing: 2, color: 'rgba(200,168,130,0.55)', textTransform: 'uppercase', marginBottom: 8 }}>year wrap</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(5px,0.8vh,8px)' }}>
              {[
                { icon: 'ri-calendar-line', label: 'Active wraps', val: String(activeWraps) },
                { icon: 'ri-folder-open-line', label: 'Folders filled', val: String(foldersFilled) },
                { icon: 'ri-image-line', label: 'Photos saved', val: String(photosSaved) },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className={s.icon} style={{ fontSize: 'clamp(11px,0.9vw,14px)', color: '#c8a882', width: 16, flexShrink: 0 }} />
                  <span style={{ fontSize: 'clamp(9px,0.75vw,11px)', color: 'rgba(200,168,130,0.7)', flex: 1 }}>{s.label}</span>
                  <span style={{ fontSize: 'clamp(11px,0.85vw,13px)', fontWeight: 700, color: '#f5ead8' }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER — layered polaroid + note + envelope */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}>
          <div style={{ position: 'relative', width: 'clamp(220px,28vw,380px)', height: 'clamp(240px,30vw,400px)' }}>

            {/* Kraft envelope — back layer */}
            <div style={{
              position: 'absolute', bottom: 0, left: '5%',
              width: '72%', height: '62%',
              background: 'linear-gradient(145deg, #c8a87a, #a8845a)',
              borderRadius: 4,
              transform: 'rotate(-8deg)',
              boxShadow: '0 4px 18px rgba(59,35,20,0.35)',
              zIndex: 1,
            }}>
              {/* envelope flap */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: '45%',
                background: 'linear-gradient(160deg, #b8946a, #9a7448)',
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                borderRadius: '4px 4px 0 0',
              }} />
            </div>

            {/* Note card — middle layer */}
            <div style={{
              position: 'absolute', bottom: '8%', left: 0,
              width: '62%', height: '70%',
              background: 'linear-gradient(145deg, #f5ead8, #ede0c8)',
              borderRadius: 6,
              transform: 'rotate(-5deg)',
              boxShadow: '0 6px 20px rgba(59,35,20,0.25)',
              zIndex: 2,
              padding: 'clamp(10px,1.5vw,18px)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <p style={{
                fontFamily: 'Georgia, serif', fontStyle: 'italic',
                fontSize: 'clamp(9px,1vw,13px)', color: '#4a2e18',
                lineHeight: 1.8, margin: 0,
              }}>
                always find<br />
                time for the<br />
                things that make<br />
                you feel happy<br />
                to be alive.
              </p>
              <div style={{ position: 'absolute', bottom: 8, right: 10, width: 18, height: 18, borderRadius: '50%', background: 'rgba(200,168,130,0.5)' }} />
            </div>

            {/* Polaroid — top layer, instax style */}
            <div style={{
              position: 'absolute', top: 0, right: '-8%',
              width: '72%',
              background: '#eeebe3',
              padding: 'clamp(5px,0.6vw,8px) clamp(5px,0.6vw,8px) clamp(22px,2.8vh,36px)',
              boxShadow: '0 8px 32px rgba(59,35,20,0.45), 0 2px 8px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(200,180,150,0.25)',
              transform: 'rotate(3deg)',
              zIndex: 3,
              cursor: 'pointer',
              borderRadius: 2,
            }} onClick={() => photoInputRef.current?.click()}>
              <input ref={photoInputRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = ev => setProfilePhoto(ev.target.result)
                  reader.readAsDataURL(file)
                }} />

              {/* Photo area */}
              <div style={{
                width: '100%', paddingBottom: '130%',
                position: 'relative',
                background: profilePhoto ? 'transparent' : 'linear-gradient(145deg, #d4b896, #b8906a)',
                overflow: 'hidden',
              }}>
                {profilePhoto
                  ? <img src={profilePhoto} alt="profile" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.05) saturate(0.88)' }} />
                  : (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                      <i className="ri-add-circle-line" style={{ fontSize: 'clamp(18px,2vw,28px)', color: '#6b4226' }} />
                      <span style={{ fontSize: 'clamp(7px,0.6vw,9px)', color: '#4a2e18', textAlign: 'center', lineHeight: 1.4 }}>add photo</span>
                    </div>
                  )
                }
                {/* Red timestamp */}
                <span style={{
                  position: 'absolute', bottom: 5, right: 7,
                  fontSize: 'clamp(6px,0.55vw,8px)', color: '#d94020',
                  fontFamily: 'monospace', letterSpacing: 0.5, opacity: 0.9,
                }}>
                  {String(new Date().getMonth() + 1).padStart(2, '0')} {String(new Date().getDate()).padStart(2, '0')} '{String(new Date().getFullYear()).slice(2)}
                </span>
              </div>

              {/* Bottom label */}
              <p style={{
                textAlign: 'center', fontSize: 'clamp(8px,0.7vw,10px)',
                color: '#5a3e28', marginTop: 7, fontWeight: 500, marginBottom: 0,
                fontFamily: 'Georgia, serif', letterSpacing: 0.5, opacity: 0.75,
              }}>{username}</p>
            </div>

          </div>
        </div>

        {/* RIGHT — desktop icons */}
        <div style={{ width: 'clamp(65px,7.5vw,100px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'clamp(6px,1.2vh,16px)', flexShrink: 0 }}>
          {FOLDERS.map(item => (
            <DesktopIcon key={item.name} label={item.name.replace('_', ' ')} onClick={() => setActiveFolder(item.name)}>
              <FolderSVG color={item.color} size={Math.round(Math.min(52, Math.max(32, window.innerWidth * 0.036)))} />
            </DesktopIcon>
          ))}
        </div>
      </div>

      {/* Dock */}
      <div style={{
        position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(59,35,20,0.55)', backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        border: '1px solid rgba(200,168,130,0.22)',
        borderRadius: 16, padding: '5px 14px',
        display: 'flex', alignItems: 'flex-end', gap: 0,
        boxShadow: '0 6px 24px rgba(59,35,20,0.4), inset 0 1px 0 rgba(200,168,130,0.15)',
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginRight: 8 }}>
          <DockIcon label="recap" onClick={() => navigate('/recap')} icon="ri-book-open-line" />
          <DockIcon label="login" onClick={() => navigate('/login')} icon="ri-key-2-line" />
        </div>
        <div style={{ width: 1, height: 32, background: 'rgba(200,168,130,0.3)', alignSelf: 'center', margin: '0 8px' }} />
        <DockIcon label="home" onClick={() => { }} icon="ri-home-4-line" active />
        <div style={{ width: 1, height: 32, background: 'rgba(200,168,130,0.3)', alignSelf: 'center', margin: '0 8px' }} />
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginLeft: 0 }}>
          <DockIcon label="dump it" onClick={() => navigate('/dump-it')} icon="ri-delete-bin-2-line" />
          <DockIcon label="treasure" onClick={() => navigate('/treasure-chest')} icon="ri-treasure-map-line" />
        </div>
      </div>

      {activeFolder && <FolderModal name={activeFolder} onClose={() => setActiveFolder(null)} />}
    </div>
  )
}
