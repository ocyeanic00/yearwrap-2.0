import React from 'react'
import FloatingCard from './FloatingCard'

function MemoryCanvas() {
  const categories = [
    { name: 'my_pov', position: { top: '15%', left: '25%' } },
    { name: 'peeps', position: { top: '15%', right: '25%' } },
    { name: 'moments', position: { top: '45%', left: '15%' } },
    { name: 'mood', position: { bottom: '25%', left: '20%' } },
    { name: 'triptrip', position: { top: '45%', right: '15%' } },
    { name: 'challenges', position: { bottom: '25%', right: '20%' } }
  ]

  const handleCategoryClick = (category) => {
    console.log('Opening category:', category)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-cream via-warmPeach/30 to-lightRose/20">
      {/* Background aesthetic image overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px)'
        }}
      />

      {/* Center main memory card */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="floating-card bg-white p-8 w-80 h-80 flex flex-col items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-light text-softBrown mb-4">Ocyeanic</h2>
            <p className="text-sm text-softBrown/70">your year, your story</p>
          </div>
        </div>
      </div>

      {/* Floating category cards */}
      {categories.map((cat) => (
        <FloatingCard
          key={cat.name}
          category={cat.name}
          position={cat.position}
          onClick={handleCategoryClick}
        />
      ))}
    </div>
  )
}

export default MemoryCanvas
