import express from 'express'

const router = express.Router()

const CLIENT_ID = 'f461a926b5c04f019a9944307def0d03'
const CLIENT_SECRET = 'b743bb96b88244c7ab5431fd02797676'
const REDIRECT_URI = 'http://localhost:3000/spotify/callback'

// Exchange authorization code for access token
router.post('/token', async (req, res) => {
  try {
    const { code } = req.body

    if (!code) {
      return res.status(400).json({ error: 'Code is required' })
    }

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    })

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json(data)
    }

    res.json(data)
  } catch (error) {
    console.error('Spotify token exchange error:', error)
    res.status(500).json({ error: 'Failed to exchange token' })
  }
})

export default router
