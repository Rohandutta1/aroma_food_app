import React from 'react'
import { ChevronRight } from 'lucide-react'

const ItemsList = ({ items, onSelectItem }) => {
  return (
    <div className="min-h-screen bg-kid-bg p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-kid-heading text-kid-pink mb-3 drop-shadow-sm">🍽️ Yummy Menu</h1>
          <p className="text-kid-text font-kid text-lg mb-8 font-bold">Pick a tasty treat to see it in AR!</p>
        </div>

        {/* Items Grid */}
        <div className="space-y-5">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectItem(item.id)}
              className="w-full bg-white border-4 border-kid-blue rounded-3xl p-4 hover:border-kid-pink hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex items-center gap-4 group"
            >
              {/* Thumbnail */}
              <div className="p-1 bg-kid-yellow rounded-2xl flex-shrink-0">
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 text-left font-kid">
                <h3 className="text-kid-text font-kid-heading text-xl">{item.name}</h3>
                <p className="text-gray-500 text-sm mb-1 font-bold">{item.cuisine}</p>
                <p className="text-kid-orange font-black text-xl">${item.price}</p>
              </div>

              {/* Arrow */}
              <div className="w-10 h-10 rounded-full bg-kid-pink flex items-center justify-center group-hover:bg-kid-yellow transition-colors mr-2">
                <ChevronRight
                  size={24}
                  className="text-white group-hover:text-kid-text group-hover:translate-x-1 transition-all"
                />
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-kid-blue font-bold font-kid text-lg">
            Tap any yummy dish to see magic! ✨
          </p>
        </div>
      </div>
    </div>
  )
}

export default ItemsList
