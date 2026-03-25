# Spotify Integration Setup

## Step 1: Configure Redirect URI in Spotify Dashboard

1. Go to https://developer.spotify.com/dashboard
2. Log in with your Spotify account
3. Click on your app (the one with Client ID: f461a926b5c04f019a9944307def0d03)
4. Click "Edit Settings" button
5. Scroll down to "Redirect URIs"
6. Add this exact URI: `http://localhost:3000/spotify/callback`
7. Click "Add" button
8. Click "Save" at the bottom

## Step 2: Start the Backend Server

Open a terminal in the `server` folder and run:
```bash
npm run dev
```

The server should start on port 5000.

## Step 3: Start the Frontend

Open another terminal in the `client` folder and run:
```bash
npm run dev
```

The client should start on port 3000.

## Step 4: Test Spotify Integration

1. Open http://localhost:3000 in your browser
2. Click on the Control Center icon (top right)
3. Click on the Spotify widget
4. You'll be redirected to Spotify's authorization page
5. Click "Agree" to authorize the app
6. You'll be redirected back to your app
7. The Spotify widget should now show your current track!

## Troubleshooting

- If you see "redirect_uri mismatch", make sure you added the exact URI in Step 1
- If the backend is not responding, make sure it's running on port 5000
- Check the browser console for any error messages
