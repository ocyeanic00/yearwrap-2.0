import React from 'react'

function FloatingCard({ category, color, position, onClick }) {
  const colors = {
    my_pov: 'bg-warmPeach',
    peeps: 'bg-beige',
    moments: 'bg-softBrown/20',
    mood: 'bg-lightRose',
    triptrip: 'bg-paleYellow',
    challenges: 'bg-cream'
  }

  return (
    <div
      className={`floating-card ${colors[category]} p-6 cursor-pointer absolute`}
      style={{
        ...position,
        width: '140px',
        height: '140px',
        zIndex: 10
      }}
      onClick={() => onClick(category)}
    >
      <div className="flex items-center justify-center h-full">
        <span className="text-sm font-medium text-softBrown">
          {category.replace('_', ' ')}
        </span>
      </div>
    </div>
  )
}

export default FloatingCard
