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
      {/* Top Bar - Restaurant Name */}
      <div className="absolute top-0 left-0 right-0 safe-top px-4 pt-4 pb-2 pointer-events-auto">
        <div className="bg-aroma-dark bg-opacity-90 backdrop-blur rounded-full px-4 py-2 inline-block">
          <h1 className="text-aroma-gold font-bold text-sm">🍽️ AROMA</h1>
        </div>
      </div>

      {/* Bottom Info Panel */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
        <div className="bg-gradient-to-t from-aroma-dark via-aroma-dark to-transparent px-4 pt-8 pb-4 safe-bottom">
          {/* Dish Name & Price */}
          <div className="mb-4">
            <div className="flex items-baseline justify-between mb-2">
              <h2 className="text-white text-2xl font-bold">{dish.name}</h2>
              <span className="text-aroma-gold text-xl font-bold">${dish.price}</span>
            </div>

            {/* Quick Description */}
            <p className="text-gray-300 text-sm mb-4 line-clamp-2">
              {dish.description}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : 'bg-aroma-gold text-aroma-dark hover:bg-yellow-500'
                }`}
              >
                <ShoppingCart size={18} />
                {addedToCart ? 'Added!' : 'Add to Cart'}
              </button>

              {/* Expand Details Button */}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="px-4 py-2 rounded-lg border-2 border-aroma-gold text-aroma-gold font-medium text-sm hover:bg-aroma-gold hover:text-aroma-dark transition-colors"
              >
                <ChevronDown size={18} className={`transition-transform ${showDetails ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Expandable Details */}
          {showDetails && (
            <div className="bg-aroma-dark bg-opacity-50 backdrop-blur rounded-lg p-4 border border-aroma-gold border-opacity-30 space-y-3">
              {/* Cuisine Type */}
              <div>
                <h3 className="text-aroma-gold text-xs font-bold uppercase mb-1">Cuisine</h3>
                <p className="text-gray-300 text-sm">{dish.cuisine}</p>
              </div>

              {/* Allergens */}
              {dish.allergens && dish.allergens.length > 0 && (
                <div>
                  <h3 className="text-aroma-gold text-xs font-bold uppercase mb-1">Allergens</h3>
                  <div className="flex flex-wrap gap-2">
                    {dish.allergens.map((allergen) => (
                      <span key={allergen} className="bg-red-900 text-red-100 text-xs px-2 py-1 rounded">
                        {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dietary Info */}
              {dish.dietary && dish.dietary.length > 0 && (
                <div>
                  <h3 className="text-aroma-gold text-xs font-bold uppercase mb-1">Dietary</h3>
                  <div className="flex flex-wrap gap-2">
                    {dish.dietary.map((tag) => (
                      <span key={tag} className="bg-green-900 text-green-100 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Spice Level */}
              {dish.spiceLevel && (
                <div>
                  <h3 className="text-aroma-gold text-xs font-bold uppercase mb-1">Spice Level</h3>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-6 rounded ${i < dish.spiceLevel ? 'bg-red-500' : 'bg-gray-600'}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Rating */}
              {dish.rating && (
                <div>
                  <h3 className="text-aroma-gold text-xs font-bold uppercase mb-1">Rating</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-sm">{'⭐'.repeat(Math.floor(dish.rating))}</span>
                    <span className="text-gray-400 text-sm">({dish.rating}/5)</span>
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
