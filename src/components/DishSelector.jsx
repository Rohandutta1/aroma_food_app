import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DishSelector = ({ dishes, currentIndex, onDishChange }) => {
  const handlePrevious = () => {
    onDishChange((currentIndex - 1 + dishes.length) % dishes.length)
  }

  const handleNext = () => {
    onDishChange((currentIndex + 1) % dishes.length)
  }

  const handleDirectSelect = (index) => {
    onDishChange(index)
  }

  return (
    <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-auto">
      {/* Navigation Arrows */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-20">
        <button
          onClick={handlePrevious}
          className="bg-aroma-gold text-aroma-dark p-2 rounded-full hover:bg-yellow-500 transition-colors shadow-lg"
          aria-label="Previous dish"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-20">
        <button
          onClick={handleNext}
          className="bg-aroma-gold text-aroma-dark p-2 rounded-full hover:bg-yellow-500 transition-colors shadow-lg"
          aria-label="Next dish"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Dish Thumbnails Carousel */}
      <div className="flex justify-center gap-2 px-4">
        {dishes.map((dish, index) => (
          <button
            key={index}
            onClick={() => handleDirectSelect(index)}
            className={`flex-shrink-0 w-16 h-16 rounded-lg transition-all overflow-hidden border-2 ${
              index === currentIndex
                ? 'border-aroma-gold shadow-lg scale-110'
                : 'border-transparent opacity-60 hover:opacity-80'
            }`}
            aria-label={`Select ${dish.name}`}
            title={dish.name}
          >
            <img
              src={dish.thumbnail}
              alt={dish.name}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Dish Counter */}
      <div className="flex justify-center mt-2">
        <span className="text-white text-xs bg-aroma-dark bg-opacity-70 px-3 py-1 rounded-full">
          {currentIndex + 1} / {dishes.length}
        </span>
      </div>
    </div>
  )
}

export default DishSelector
