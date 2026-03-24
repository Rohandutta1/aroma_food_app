/**
 * Sample Dish Data
 * 
 * This contains sample restaurant dishes with their 3D models and metadata.
 * Replace modelUrl with your actual GLB/GLTF model URLs.
 * 
 * Free 3D Model Sources:
 * - Sketchfab: https://sketchfab.com/search?q=food&type=models
 * - TurboSquid Free: https://www.turbosquid.com/Search/3D-Models/free
 * - CGTrader Free: https://www.cgtrader.com/free-3d-models
 * - Poly Haven: https://polyhaven.com/
 */

export const dishData = [
  {
    id: 1,
    name: 'Grilled Salmon',
    price: 18.99,
    description: 'Pan-seared Atlantic salmon with lemon butter sauce, served with seasonal vegetables',
    cuisine: 'Mediterranean',
    thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/shishkebab.glb',
    allergens: ['Fish', 'Dairy'],
    dietary: ['Gluten-Free', 'High Protein'],
    spiceLevel: 1,
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Margherita Pizza',
    price: 12.99,
    description: 'Classic Italian pizza with San Marzano tomatoes, fresh mozzarella, and basil',
    cuisine: 'Italian',
    thumbnail: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=200&h=200&fit=crop',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    allergens: ['Gluten', 'Dairy'],
    dietary: ['Vegetarian'],
    spiceLevel: 0,
    rating: 4.7,
  },
  {
    id: 3,
    name: 'Classic Burger',
    price: 14.99,
    description: 'Juicy beef patty with fresh toppings, crispy fries, and special sauce',
    cuisine: 'American',
    thumbnail: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/shishkebab.glb',
    allergens: ['Gluten', 'Dairy'],
    dietary: ['High Protein'],
    spiceLevel: 0,
    rating: 4.7,
  },
  {
    id: 4,
    name: 'Asian Noodles',
    price: 11.99,
    description: 'Stir-fried noodles with fresh vegetables, tropical spices, and herbs',
    cuisine: 'Asian',
    thumbnail: 'https://images.unsplash.com/photo-1609618168732-5486f6aa4e90?w=200&h=200&fit=crop',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/coffeemat.glb',
    allergens: ['Gluten'],
    dietary: [],
    spiceLevel: 2,
    rating: 4.8,
  },
  {
    id: 5,
    name: 'Chocolate Lava Cake',
    price: 7.99,
    description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
    cuisine: 'Dessert',
    thumbnail: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    allergens: ['Dairy', 'Eggs', 'Gluten'],
    dietary: [],
    spiceLevel: 0,
    rating: 4.9,
  },
];

/**
 * Get dish by ID
 */
export const getDishById = (id) => {
  return dishData.find(dish => dish.id === id);
};

/**
 * Get dish by index
 */
export const getDishByIndex = (index) => {
  return dishData[index];
};

/**
 * Get all dishes
 */
export const getAllDishes = () => {
  return dishData;
};
