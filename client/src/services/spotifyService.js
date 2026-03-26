const CLIENT_ID = 'f461a926b5c04f019a9944307def0d03'
const REDIRECT_URI = 'http://127.0.0.1:3000/spotify/callback'
const SCOPES = [
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-recently-played'
].join(' ')

export const spotifyService = {
  // Generate Spotify auth URL
  getAuthUrl: () => {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      show_dialog: true
    })
    return `https://accounts.spotify.com/authorize?${params.toString()}`
  },

  // Get authorization code from URL
  getCodeFromUrl: () => {
    const params = new URLSearchParams(window.location.search)
    return params.get('code')
  },

  // Exchange code for access token via backend
  exchangeCodeForToken: async (code) => {
    const response = await fetch('http://localhost:5000/api/spotify/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to exchange code for token')
    }

    const data = await response.json()
    return data.access_token
  },

  // Save token to localStorage
  saveToken: (token) => {
    localStorage.setItem('spotify_access_token', token)
    localStorage.setItem('spotify_token_time', Date.now().toString())
  },

  // Get saved token
  getToken: () => {
    const token = localStorage.getItem('spotify_access_token')
    const tokenTime = localStorage.getItem('spotify_token_time')
    
    // Token expires after 1 hour
    if (token && tokenTime) {
      const elapsed = Date.now() - parseInt(tokenTime)
      if (elapsed < 3600000) { // 1 hour in ms
        return token
      }
    }
    return null
  },

  // Clear token
  clearToken: () => {
    localStorage.removeItem('spotify_access_token')
    localStorage.removeItem('spotify_token_time')
  },

  // Get currently playing track
  getCurrentlyPlaying: async (token) => {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    if (response.status === 204) return null
    if (!response.ok) throw new Error('Failed to fetch')
    
    return await response.json()
  },

  // Get recently played
  getRecentlyPlayed: async (token) => {
    const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    if (!response.ok) throw new Error('Failed to fetch')
    const data = await response.json()
    return data.items[0]
  },

  // Play/Pause
  togglePlayback: async (token, isPlaying) => {
    const endpoint = isPlaying ? 'pause' : 'play'
    const response = await fetch(`https://api.spotify.com/v1/me/player/${endpoint}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return response.ok
  },

  // Skip to next
  skipNext: async (token) => {
    const response = await fetch('https://api.spotify.com/v1/me/player/next', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return response.ok
  },

  // Skip to previous
  skipPrevious: async (token) => {
    const response = await fetch('https://api.spotify.com/v1/me/player/previous', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return response.ok
  },

  // Set volume (0-100)
  setVolume: async (token, volumePercent) => {
    const response = await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volumePercent}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return response.ok
  }
}
