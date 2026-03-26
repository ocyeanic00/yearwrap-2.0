import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Dashboard from '../pages/Dashboard'
import AddMemory from '../pages/AddMemory'
import TreasureChest from '../pages/TreasureChest'
import DumpIt from '../pages/DumpIt'
import Recap from '../pages/Recap'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import AboutMe from '../pages/AboutMe'
import SpotifyCallback from '../pages/SpotifyCallback'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/about-me" element={<AboutMe />} />
      <Route path="/add-memory" element={<AddMemory />} />
      <Route path="/treasure-chest" element={<TreasureChest />} />
      <Route path="/dump-it" element={<DumpIt />} />
      <Route path="/recap" element={<Recap />} />
      <Route path="/spotify/callback" element={<SpotifyCallback />} />
    </Routes>
  )
}

export default AppRoutes
