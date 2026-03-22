import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Login:', { email, password })
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-warmPeach/20 to-beige flex items-center justify-center">
      <div className="floating-card bg-white p-10 w-96">
        <h2 className="text-3xl font-light text-softBrown mb-8 text-center">welcome back</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="email"
            className="w-full p-3 rounded-xl bg-cream border-none focus:outline-none focus:ring-2 focus:ring-warmPeach"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            className="w-full p-3 rounded-xl bg-cream border-none focus:outline-none focus:ring-2 focus:ring-warmPeach"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full floating-card bg-softBrown text-white py-3 hover:bg-softBrown/80"
          >
            sign in
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
