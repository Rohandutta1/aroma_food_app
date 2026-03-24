import React from 'react'

const LoadingIndicator = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="spinner"></div>
      <p className="text-white text-sm font-medium">Loading 3D Model...</p>
      <div className="w-32 h-1 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-aroma-gold to-yellow-500 animate-pulse"></div>
      </div>
    </div>
  )
}

export default LoadingIndicator
