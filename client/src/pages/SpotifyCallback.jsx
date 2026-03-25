import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { spotifyService } from '../services/spotifyService'

function SpotifyCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      console.log('SpotifyCallback mounted')
      console.log('Current URL:', window.location.href)
      
      const code = spotifyService.getCodeFromUrl()
      console.log('Extracted code:', code ? 'Code found' : 'No code')
      
      if (code) {
        try {
          console.log('Exchanging code for token...')
          const token = await spotifyService.exchangeCodeForToken(code)
          console.log('Token received:', token ? 'Success' : 'Failed')
          
          if (token) {
            spotifyService.saveToken(token)
            console.log('Token saved, redirecting to home')
            // Use replace to avoid history issues
            window.location.replace('/')
          } else {
            console.log('No token received, redirecting to home')
            navigate('/')
          }
        } catch (error) {
          console.error('Error exchanging code:', error)
          navigate('/')
        }
      } else {
        console.log('No code found, redirecting to home')
        navigate('/')
      }
    }
    
    handleCallback()
  }, [navigate])

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      background: '#3b2314',
      color: '#f5ead8',
      fontFamily: 'Georgia, serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎵</div>
        <p>Connecting to Spotify...</p>
        <p style={{ fontSize: 12, marginTop: 16, opacity: 0.6 }}>
          Check console for details
        </p>
      </div>
    </div>
  )
}

export default SpotifyCallback
