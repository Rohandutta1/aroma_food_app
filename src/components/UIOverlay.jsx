import React, { useState, useEffect } from 'react'
import { ShoppingCart, ChevronDown } from 'lucide-react'

const UIOverlay = ({ dish }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const handleAddToCart = () => {
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Bottom Info Panel */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-auto px-2 sm:px-4 pb-4 sm:pb-6 pt-10">
        <div className="bg-white border-4 border-kid-blue shadow-xl rounded-t-3xl sm:rounded-3xl p-4 sm:p-5 safe-bottom">
          {/* Dish Name & Price */}
          <div className="mb-4">
            <div className="flex items-baseline justify-between mb-2 font-kid">
              <h2 className="text-kid-blue font-kid-heading text-3xl drop-shadow-sm">{dish.name}</h2>
              <span className="text-kid-orange text-2xl font-black">${dish.price}</span>
            </div>

            {/* Quick Description */}
            <p className="text-kid-text text-md mb-4 font-bold opacity-80 line-clamp-2">
              {dish.description}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3 mb-2 font-kid">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-sm sm:text-lg transition-all border-4 shadow-sm ${
                  addedToCart
                    ? 'bg-kid-green text-kid-text border-white'
                    : 'bg-kid-pink text-white hover:bg-kid-orange hover:-translate-y-1 border-white'
                }`}
              >
                <ShoppingCart size={20} />
                {addedToCart ? 'YUM!' : 'Want this!'}
              </button>

              {/* Expand Details Button */}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="px-5 py-3 rounded-full border-4 border-kid-yellow text-kid-text bg-kid-yellow font-bold text-lg hover:bg-kid-orange hover:border-kid-orange hover:text-white transition-all shadow-sm"
              >
                <ChevronDown size={22} className={`transition-transform ${showDetails ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Expandable Details */}
          {showDetails && (
            <div className="bg-kid-bg rounded-3xl p-4 border-4 border-kid-yellow space-y-4 shadow-inner mt-4 font-kid">
              {/* Cuisine Type */}
              <div>
                <h3 className="text-kid-pink text-sm font-black uppercase mb-1 tracking-wider">Cuisine</h3>
                <p className="text-kid-text font-bold text-md">{dish.cuisine}</p>
              </div>

              {/* Allergens */}
              {dish.allergens && dish.allergens.length > 0 && (
                <div>
                  <h3 className="text-red-500 text-sm font-black uppercase mb-2 tracking-wider">Allergens</h3>
                  <div className="flex flex-wrap gap-2">
                    {dish.allergens.map((allergen) => (
                      <span key={allergen} className="bg-white border-2 border-red-300 text-red-600 font-bold text-xs px-3 py-1.5 rounded-full shadow-sm">
                        {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dietary Info */}
              {dish.dietary && dish.dietary.length > 0 && (
                <div>
                  <h3 className="text-green-500 text-sm font-black uppercase mb-2 tracking-wider">Dietary</h3>
                  <div className="flex flex-wrap gap-2">
                    {dish.dietary.map((tag) => (
                      <span key={tag} className="bg-white border-2 border-kid-green text-green-700 font-bold text-xs px-3 py-1.5 rounded-full shadow-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Spice Level */}
              {dish.spiceLevel && (
                <div>
                  <h3 className="text-orange-500 text-sm font-black uppercase mb-1 tracking-wider">Spice Level</h3>
                  <div className="flex gap-2 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-6 rounded-full ${i < dish.spiceLevel ? 'bg-orange-400' : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Rating */}
              {dish.rating && (
                <div>
                  <h3 className="text-yellow-600 text-sm font-black uppercase mb-1 tracking-wider">Rating</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl">{'⭐'.repeat(Math.floor(dish.rating))}</span>
                    <span className="text-kid-text font-bold">({dish.rating}/5)</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UIOverlay
