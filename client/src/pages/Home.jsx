import React from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  const categories = [
    { name: 'my_pov', position: { top: '18%', left: '26%' }, color: 'bg-[#F4D9C6]/90' },
    { name: 'peeps', position: { top: '16%', right: '18%' }, color: 'bg-[#E8DCC4]/90' },
    { name: 'moments', position: { top: '42%', left: '16%' }, color: 'bg-[#E8DCC4]/80' },
    { name: 'mood', position: { bottom: '22%', left: '20%' }, color: 'bg-[#F2D7D9]/80' },
    { name: 'triptrip', position: { top: '44%', right: '16%' }, color: 'bg-[#F9F3E3]/90' },
    { name: 'challenges', position: { bottom: '20%', right: '18%' }, color: 'bg-[#E8DCC4]/85' }
  ]

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#EDE8E0]">
      {/* Top left navigation icons */}
      <div className="absolute top-6 left-6 z-30 space-y-6">
        <div 
          className="cursor-pointer flex flex-col items-center group"
          onClick={() => navigate('/dump-it')}
        >
          <div className="w-14 h-14 bg-gray-400/80 rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110">
            🗑️
          </div>
          <span className="text-xs text-gray-600 mt-1 font-light">dump_it</span>
        </div>
        
        <div 
          className="cursor-pointer flex flex-col items-center group"
          onClick={() => navigate('/treasure-chest')}
        >
          <div className="w-14 h-14 bg-orange-300/80 rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110">
            📦
          </div>
          <span className="text-xs text-gray-600 mt-1 font-light">treasure_chest</span>
        </div>
      </div>

      {/* Bottom left compass icon */}
      <div className="absolute bottom-6 left-6 z-30">
        <div className="w-10 h-10 bg-gray-700/70 rounded-full flex items-center justify-center text-white text-sm font-light">
          N
        </div>
      </div>

      {/* Background flower image */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/src/assets/bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Center main card with "Ocyeanic" button */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="bg-white/95 rounded-[32px] shadow-2xl w-72 h-72 flex flex-col items-center justify-center">
          <div className="bg-[#B8A08A] text-white px-10 py-3 rounded-full text-base font-normal shadow-md">
            Ocyeanic
          </div>
        </div>
      </div>

      {/* Floating category cards - small rounded squares */}
      {categories.map((cat) => (
        <div
          key={cat.name}
          className={`absolute ${cat.color} backdrop-blur-sm rounded-2xl shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-xl z-10 flex items-end justify-start p-4`}
          style={{
            ...cat.position,
            width: '140px',
            height: '140px'
          }}
          onClick={() => console.log('Category:', cat.name)}
        >
          <span className="text-sm font-normal text-gray-700">
            {cat.name}
          </span>
        </div>
      ))}
    </div>
  )
}

export default Home
