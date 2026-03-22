import React from 'react'

function AboutMe() {
  const folders = [
    { name: 'age_27', color: 'bg-pink-200', position: { top: '15%', left: '20%' } },
    { name: 'city_helsinki', color: 'bg-yellow-300', position: { top: '15%', right: '20%' } },
    { name: 'job_designer', color: 'bg-blue-200', position: { top: '45%', left: '10%' } },
    { name: 'sign_gemini', color: 'bg-pink-200', position: { top: '45%', right: '15%' } },
    { name: 'mood_coffee_lover', color: 'bg-yellow-300', position: { bottom: '15%', left: '15%' } },
    { name: 'style_minimalist', color: 'bg-blue-200', position: { bottom: '15%', right: '15%' } }
  ]

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#E8E4E0]">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 bg-[#D0CCC8] h-12 flex items-center px-4 z-30">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
        </div>
      </div>

      {/* Title and subtitle */}
      <div className="absolute top-16 left-6 z-30">
        <h1 className="text-2xl font-normal text-gray-700">about_me.new_file</h1>
        <p className="text-sm text-gray-500 mt-1">spring 2030</p>
      </div>

      {/* Top right icons */}
      <div className="absolute top-16 right-6 z-30 flex gap-4 text-gray-400">
        <button className="text-2xl">🔍</button>
        <button className="text-2xl">🔍</button>
        <button className="text-2xl">↗️</button>
        <button className="text-2xl">🔄</button>
      </div>

      {/* Center photo with name */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="flex flex-col items-center">
          <div className="bg-white rounded-2xl shadow-xl p-4 mb-4">
            <img 
              src="/src/assets/profile.jpg" 
              alt="Profile"
              className="w-64 h-80 object-cover rounded-lg"
            />
          </div>
          <div className="bg-pink-200 px-8 py-3 rounded-full shadow-lg">
            <span className="text-xl font-medium text-gray-800">Olivia Wilson</span>
          </div>
          <div className="mt-4 text-4xl">
            🖱️
          </div>
        </div>
      </div>

      {/* Floating folder cards */}
      {folders.map((folder) => (
        <div
          key={folder.name}
          className="absolute z-10 cursor-pointer transition-all duration-300 hover:scale-110"
          style={folder.position}
        >
          <div className={`${folder.color} rounded-t-2xl w-40 h-32 shadow-lg flex items-end justify-center pb-3 relative`}>
            {/* Folder tab */}
            <div className={`absolute -top-3 left-4 ${folder.color} w-16 h-6 rounded-t-lg`}></div>
            <span className="text-sm font-medium text-gray-700 text-center px-2">
              {folder.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AboutMe
