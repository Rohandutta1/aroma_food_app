# 🎬 Sample 3D Models Included

Your AROMA platform comes with 5 pre-configured sample dishes using **free Google model-viewer demo models**.

## Sample Dishes

All models are hosted on Google's CDN and work immediately without setup:

### 1. 🐟 Grilled Salmon
- **Price**: $18.99
- **Cuisine**: Mediterranean
- **Model**: `https://modelviewer.dev/shared-assets/models/Salmon.glb`
- **Allergens**: Fish, Dairy
- **Dietary**: Gluten-Free, High Protein
- **Spice Level**: 1/5
- **Rating**: 4.8/5

### 2. 🍕 Margherita Pizza
- **Price**: $12.99
- **Cuisine**: Italian
- **Model**: `https://modelviewer.dev/shared-assets/models/Pizza.glb`
- **Allergens**: Gluten, Dairy
- **Dietary**: Vegetarian
- **Spice Level**: 0/5
- **Rating**: 4.7/5

### 3. 🥩 Beef Tenderloin
- **Price**: $24.99
- **Cuisine**: French
- **Model**: `https://modelviewer.dev/shared-assets/models/Steak.glb`
- **Allergens**: Dairy
- **Dietary**: Gluten-Free, High Protein
- **Spice Level**: 1/5
- **Rating**: 4.9/5

### 4. 🍜 Pad Thai
- **Price**: $13.99
- **Cuisine**: Thai
- **Model**: `https://modelviewer.dev/shared-assets/models/Noodles.glb`
- **Allergens**: Peanuts, Shellfish
- **Dietary**: Dairy-Free
- **Spice Level**: 3/5
- **Rating**: 4.6/5

### 5. 🍰 Chocolate Lava Cake
- **Price**: $7.99
- **Cuisine**: Dessert
- **Model**: `https://modelviewer.dev/shared-assets/models/Cake.glb`
- **Allergens**: Dairy, Eggs, Gluten
- **Dietary**: (none)
- **Spice Level**: 0/5
- **Rating**: 4.9/5

---

## 🎨 Model Features

✅ All models are:
- Ready to use (no conversion needed)
- Optimized for web (< 2MB each)
- High quality PBR materials
- Realistic lighting
- Works in AR mode
- Loads in <2 seconds

---

## 🔄 Replace/Customize Models

### Find Your Own 3D Models

**Top Free Sources:**

1. **Sketchfab** (Best quality)
   - https://sketchfab.com/search?q=food
   - Filter by License: Creative Commons
   - Download GLB format
   - Typical file size: 1-5MB

2. **TurboSquid Free**
   - https://www.turbosquid.com/Search/3D-Models/free
   - Search: "food"
   - Download GLB format

3. **Poly Haven** (No account needed)
   - https://polyhaven.com/models
   - All CC0 licensed
   - Food-related searches
   - High quality assets

4. **CGTrader Free**
   - https://www.cgtrader.com/free-3d-models
   - Filter by "Free"
   - Download and convert to GLB

5. **Google Poly** (Archival)
   - https://poly.google.com
   - Historical models
   - Varying quality

---

## 📥 How to Replace a Model

### Step 1: Get the Model
```
Find a GLB file of your choosing
(or convert OBJ/FBX to GLB)
```

### Step 2: Host the Model

**Option A: Upload to Vercel (Easiest)**
```bash
# Copy to public folder
cp your-model.glb public/models/

# Then in dishData.js:
modelUrl: '/models/your-model.glb'
```

**Option B: Use External CDN**
```javascript
// In dishData.js:
modelUrl: 'https://your-cdn.com/models/model.glb'
```

**Option C: Sketchfab Direct Link**
```javascript
// Some Sketchfab models can be accessed directly
modelUrl: 'https://api.sketchfab.com/v3/models/MODEL_ID/download'
```

### Step 3: Update dishData.js

Edit `src/utils/dishData.js`:

```javascript
export const dishData = [
  {
    id: 1,
    name: 'Grilled Salmon',
    price: 18.99,
    // ... other fields ...
    modelUrl: '/models/salmon.glb', // <- Change this
    // ... rest of properties ...
  },
  // ... other dishes ...
];
```

### Step 4: Deploy

```bash
git add .
git commit -m "Update Salmon model"
git push origin main
# Vercel auto-deploys!
```

---

## 🛠️ Model Optimization

If your model is too large or slow:

### Using Blender (Free)

1. **Download**: https://www.blender.org/download/
2. **Open model**: File → Open → your-model.glb
3. **Reduce polygons** (optional):
   - Select all objects: `A`
   - Add Modifier → Decimate
   - Set Ratio: 0.5-0.8
   - Apply
4. **Export**:
   - File → Export As → glTF Binary (.glb)
   - Check "Export Compression"
   - Click "Export"

### Using Online Tools

**Babylon.js Sandbox**:
- https://www.babylonjs-playground.com/
- Upload model
- Check file size
- Export optimized

**Model-Viewer Tool**:
- https://modelviewer.dev/
- Upload model
- See how it looks
- Check performance

---

## 📊 Model Size Guidelines

| Category | Size | Load Time | Quality |
|----------|------|-----------|---------|
| Excellent | < 1MB | < 1s | High |
| Good | 1-2MB | 1-2s | High |
| Acceptable | 2-5MB | 2-5s | Medium |
| Poor | > 5MB | > 5s | Low |

**Target: Keep models under 2MB**

---

## 🎨 Recommended Food Model Collections

### Complete Restaurant Sets

**Sketchfab Collections:**
- Fully set meals: https://sketchfab.com/search?q=restaurant+food&type=models
- Pizza variations: https://sketchfab.com/search?q=pizza&type=models
- Asian cuisine: https://sketchfab.com/search?q=asian+food&type=models
- Desserts: https://sketchfab.com/search?q=dessert+cake&type=models

### By Cuisine

**Italian:**
- Pasta models
- Pizza variations
- Risotto dishes

**Asian:**
- Sushi & sashimi
- Ramen bowls
- Dumplings

**American:**
- Hamburgers
- BBQ meat
- Steaks

**French:**
- Fine dining dishes
- Pastries
- Gourmet plates

---

## ✅ Quality Checklist for Models

Before using a 3D model:

- [ ] Format is GLB or GLTF
- [ ] File size < 5MB (prefer < 2MB)
- [ ] Model looks realistic
- [ ] Textures/colors are present
- [ ] No obvious errors or gaps
- [ ] Polygon count reasonable (< 500k)
- [ ] Proper scale (not huge/tiny)
- [ ] License allows commercial use

---

## 🚀 Quick Model Enhancement

### Add Lighting
Model-viewer automatically handles:
- ✅ IBL (Image-Based Lighting)
- ✅ Shadows
- ✅ Reflections
- ✅ Exposure control

### Add Scale Explanation

In your app, you can add context:

```javascript
{
  name: 'Grilled Salmon',
  description: 'Pan-seared Atlantic salmon with lemon butter sauce, served with seasonal vegetables',
  size: 'Individual portion',
  servings: 1,
  // ... other properties
}
```

---

## 📱 Test Models in AR

After importing a model:

1. **Local test:**
   ```bash
   npm run dev
   # Open http://localhost:5173
   ```

2. **Mobile test:**
   - Open on phone at `http://<IP>:5173`
   - Tap "View in AR"
   - Verify model displays correctly
   - Test rotation & zoom

3. **Deployment test:**
   - Deploy with `vercel`
   - Test on real device
   - Check load time
   - Verify AR mode

---

## 🎯 Common Model Issues & Solutions

### Model Not Showing
```
✓ Check console for 404 errors
✓ Verify URL is correct
✓ Ensure GLB/GLTF format
✓ Check CORS if external URL
✓ File size < 5MB
```

### Model Appears Too Large
```
✓ Adjust scale in Blender
✓ Export with proper scale
✓ Test before deploying
```

### Model Textures Missing
```
✓ Use GLB format (includes textures)
✓ Check source provides textures
✓ Re-download from author
✓ Re-export from Blender
```

### Load is Too Slow
```
✓ Reduce polygon count (< 100k for fast loading)
✓ Use GLB compression
✓ Compress textures
✓ Check internet speed
✓ Test on 4G network
```

---

## 📚 Learning Resources

**Model-Viewer Documentation:**
- https://modelviewer.dev/docs/index.html
- Uploading models
- Customizing appearance
- AR features
- API reference

**Blender Tutorials:**
- https://www.blender.org/support/
- https://www.youtube.com/results?search_query=blender+export+gltf

**glTF Specification:**
- https://www.khronos.org/gltf/

---

## 🔄 Batch Replace All Models

To replace all models at once:

1. **Download 5 new models** (Sketchfab, TurboSquid, etc.)
2. **Drag into** `public/models/` folder
3. **Edit** `src/utils/dishData.js`:

```javascript
export const dishData = [
  {
    id: 1,
    name: 'Your Dish 1',
    modelUrl: '/models/model1.glb',
    // ... rest unchanged
  },
  {
    id: 2,
    name: 'Your Dish 2',
    modelUrl: '/models/model2.glb',
    // ... rest unchanged
  },
  // ... etc
];
```

4. **Deploy**: `git push origin main`

Done! All new models live.

---

## 💾 Backup Sample Models

The included Google models are great references:

```javascript
// Keep these as backup
const googleModels = {
  salmon: 'https://modelviewer.dev/shared-assets/models/Salmon.glb',
  pizza: 'https://modelviewer.dev/shared-assets/models/Pizza.glb',
  steak: 'https://modelviewer.dev/shared-assets/models/Steak.glb',
  noodles: 'https://modelviewer.dev/shared-assets/models/Noodles.glb',
  cake: 'https://modelviewer.dev/shared-assets/models/Cake.glb',
}
```

You can switch back anytime!

---

**Ready to customize your menu! 🍽️✨**

See [3D_MODELS_GUIDE.md](3D_MODELS_GUIDE.md) for comprehensive model management guide.
