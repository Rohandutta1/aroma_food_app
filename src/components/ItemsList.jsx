import React from 'react'
import { ChevronRight } from 'lucide-react'

const ItemsList = ({ items, onSelectItem }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-aroma-dark to-black p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-aroma-gold mb-2">🍽️ AROMA</h1>
          <p className="text-gray-400 mb-8">Select a dish to view details and AR</p>
        </div>

        {/* Items Grid */}
        <div className="space-y-3">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectItem(item.id)}
              className="w-full bg-aroma-dark border border-aroma-gold border-opacity-50 rounded-lg p-4 hover:border-aroma-gold hover:bg-aroma-dark hover:bg-opacity-80 transition-all flex items-center gap-4 group"
            >
              {/* Thumbnail */}
              <img
                src={item.thumbnail}
                alt={item.name}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />

              {/* Info */}
              <div className="flex-1 text-left">
                <h3 className="text-white font-bold text-lg">{item.name}</h3>
                <p className="text-gray-400 text-sm mb-1">{item.cuisine}</p>
                <p className="text-aroma-gold font-semibold">${item.price}</p>
              </div>

              {/* Arrow */}
              <ChevronRight
                size={24}
                className="text-aroma-gold group-hover:translate-x-1 transition-transform"
              />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Tap any dish to view details, QR code, and AR experience
          </p>
        </div>
      </div>
    </div>
  )
}

export default ItemsList
