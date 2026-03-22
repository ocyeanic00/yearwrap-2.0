import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AddMemory() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    best_memory: '',
    lesson: '',
    people: '',
    place: '',
    quote: '',
    gratitude: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Memory data:', formData)
    // API call will go here
  }

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-light text-softBrown mb-8">add a memory</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="floating-card bg-white p-6">
            <label className="block text-sm text-softBrown mb-2">best memory</label>
            <textarea
              className="w-full p-3 rounded-xl bg-cream border-none focus:outline-none focus:ring-2 focus:ring-warmPeach"
              rows="3"
              value={formData.best_memory}
              onChange={(e) => setFormData({ ...formData, best_memory: e.target.value })}
            />
          </div>

          <div className="floating-card bg-white p-6">
            <label className="block text-sm text-softBrown mb-2">lesson learned</label>
            <textarea
              className="w-full p-3 rounded-xl bg-cream border-none focus:outline-none focus:ring-2 focus:ring-warmPeach"
              rows="3"
              value={formData.lesson}
              onChange={(e) => setFormData({ ...formData, lesson: e.target.value })}
            />
          </div>

          <div className="floating-card bg-white p-6">
            <label className="block text-sm text-softBrown mb-2">people who mattered</label>
            <input
              type="text"
              className="w-full p-3 rounded-xl bg-cream border-none focus:outline-none focus:ring-2 focus:ring-warmPeach"
              value={formData.people}
              onChange={(e) => setFormData({ ...formData, people: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="floating-card bg-softBrown text-white px-8 py-3 w-full hover:bg-softBrown/80"
          >
            save memory
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddMemory
