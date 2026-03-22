# YearWrap

A beautiful scrapbook-style memory journal with AI-powered year recaps.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express + MongoDB
- AI Service: Python Flask

## Setup Instructions

### 1. Install Dependencies

**Client:**
```bash
cd client
npm install
```

**Server:**
```bash
cd server
npm install
```

**AI Service:**
```bash
cd ai-service
pip install -r requirements.txt
```

### 2. Configure Environment

Update `.env` file with your MongoDB URI and Cloudinary credentials.

### 3. Run Services

**Terminal 1 - MongoDB:**
```bash
mongod
```

**Terminal 2 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 3 - AI Service:**
```bash
cd ai-service
python app.py
```

**Terminal 4 - Frontend:**
```bash
cd client
npm run dev
```

### 4. Access Application

Open http://localhost:3000 in your browser.

## Features

- Scrapbook-style floating UI
- Memory categories: my_pov, peeps, moments, mood, triptrip, challenges
- Treasure Chest (active memories)
- Dump It (deleted memories)
- AI-generated year recaps
