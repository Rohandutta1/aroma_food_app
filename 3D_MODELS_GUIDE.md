# 🎬 How to Add 3D Models to AROMA

Complete guide to finding, optimizing, and adding 3D food models to your AROMA restaurant menu.

## 📥 Finding Free 3D Models

### 1. **Sketchfab** (Best for food models)
- **Website**: https://sketchfab.com
- **Search**: "food" OR "pizza" OR "burger" etc.
- **Filter**: License → Creative Commons
- **Download**: Click "Download" → Select GLB
- **Quality**: ⭐⭐⭐⭐⭐

**Example Models:**
- Cherry Pie: https://sketchfab.com/3d-models/cherry-pie-f58d1e7f7
- Ramen Noodles: https://sketchfab.com/3d-models/ramen-bowl-d3d9e
- Sushi Set: https://sketchfab.com/3d-models/sushi-set-e2c4f

### 2. **TurboSquid Free**
- **Website**: https://www.turbosquid.com/Search/3D-Models/free
- **Filter**: Sort by "Free"
- **Download**: GLB or FBX format
- **Quality**: ⭐⭐⭐⭐

**How to find:**
1. Go to TurboSquid
2. Search for food item
3. Click "Filters"
4. Select "Free"
5. Download GLB

### 3. **CGTrader Free**
- **Website**: https://www.cgtrader.com/free-3d-models
- **Search**: Search for dish name
- **Filter**: "Free" → "Animated: No"
- **Download**: GLB format
- **Quality**: ⭐⭐⭐⭐

### 4. **Poly Haven**
- **Website**: https://polyhaven.com/models
- **Search**: Food-related terms
- **License**: All CC0 (free/public domain)
- **Quality**: ⭐⭐⭐⭐⭐
- **No account needed**

### 5. **Thingiverse**
- **Website**: https://www.thingiverse.com
- **Search**: Food 3D models
- **Format**: Download OBJ/STL (convert to GLB)
- **Quality**: ⭐⭐⭐

### 6. **Google Poly Archive**
- **Website**: https://poly.google.com/
- **Status**: Archival access
- **Models**: Historical Google 3D assets
- **Quality**: ⭐⭐⭐⭐

---

## 🔄 Converting Models to GLB

### If You Have Another Format (OBJ, FBX, USDZ)

**Option 1: Online Converter (Easiest)**

1. Go to https://products.aspose.app/3d/conversion
2. Upload your model
3. Select "Gltf-Binary" as output
4. Download .glb file

**Option 2: Blender (Free, Powerful)**

1. **Install Blender**: https://www.blender.org/download/
2. **Open model**: File → Open
3. **Export as GLB**:
   - File → Export As → glTF Binary (.glb)
   - Check "Export Compression"
   - Click "Export glTF Binary"

---

## 🎨 Optimizing Models for Web

### Using Blender (Recommended)

```
1. Open model in Blender
2. Select all objects: A key
3. Delete unnecessary details
4. Reduce polygon count if needed:
   - Add Modifier → Decimate
   - Set ratio to 0.5-0.8 (removes 20-50% polys)
   - Apply modifier
5. Export as GLB with compression
```

### Using Online Tools

**Babylon.js Sandbox**:
1. Go to https://www.babylonjs-playground.com/
2. Upload model
3. Check filesize
4. Export optimized version

**Model Viewer Viewer**:
1. Go to https://modelviewer.dev/
2. Upload model
3. Check how it looks in AR
4. Optimize if needed

---

## 📊 Model Size Requirements

| Target | Size | Load Time |
|--------|------|-----------|
| Excellent | < 1 MB | < 1 second |
| Good | 1-2 MB | 1-2 seconds |
| Acceptable | 2-5 MB | 2-5 seconds |
| Poor | > 5 MB | > 5 seconds |

**Goal**: Keep models under 2MB for fast loading.

---

## 📱 Uploading Models to Your Server

### Option 1: Host on Vercel (Easiest)

1. **Create `public/models` folder**
```bash
mkdir -p public/models
```

2. **Add model files**
```bash
cp /path/to/your/model.glb public/models/
```

3. **Update dish data** in [src/utils/dishData.js](src/utils/dishData.js):
```javascript
modelUrl: '/models/your-model.glb'
```

4. **Deploy** with `vercel` or `git push`

### Option 2: Host on Cloud Storage (CDN)

**AWS S3**:
```javascript
modelUrl: 'https://your-bucket.s3.amazonaws.com/models/pizza.glb'
```

**Google Cloud Storage**:
```javascript
modelUrl: 'https://storage.googleapis.com/your-bucket/models/pizza.glb'
```

**GitHub Raw CDN**:
```javascript
modelUrl: 'https://raw.githubusercontent.com/your-username/aroma/main/public/models/pizza.glb'
```

### Option 3: Use Free CDN URLs (No Upload Needed)

Direct Sketchfab download links:

```javascript
modelUrl: 'https://api.sketchfab.com/v3/models/MODEL_ID/download'
```

---

## ✏️ Updating Dish Data

### Edit [src/utils/dishData.js](src/utils/dishData.js)

```javascript
export const dishData = [
  {
    id: 1,
    name: 'Your Dish Name',
    price: 19.99,
    description: 'Your dish description here',
    cuisine: 'Italian',
    thumbnail: 'https://images.unsplash.com/...',
    modelUrl: '/models/your-model.glb', // Your 3D model
    allergens: ['Dairy', 'Gluten'],
    dietary: ['Vegetarian'],
    spiceLevel: 2,
    rating: 4.8,
  },
  // Add more dishes...
];
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique dish ID |
| `name` | string | Dish name |
| `price` | number | Price in USD |
| `description` | string | Short description |
| `cuisine` | string | Cuisine type |
| `thumbnail` | string | Image URL (200x200px) |
| `modelUrl` | string | 3D GLB model URL |
| `allergens` | array | Allergen tags |
| `dietary` | array | Dietary info |
| `spiceLevel` | number | 0-5 (0=none, 5=very spicy) |
| `rating` | number | 0-5 star rating |

---

## 🖼️ Finding Thumbnail Images

### Free Stock Photo Sites

**Best options:**
- Unsplash: https://unsplash.com/s/photos/food
- Pexels: https://www.pexels.com/search/food/
- Pixabay: https://pixabay.com/images/search/food/
- Plated: https://plated.com/gallery/

### Using Unsplash Images

```javascript
thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop'
// Parse URL: unsplash.com/photos/ID
```

---

## 🚀 Adding Models to AROMA

### Step-by-Step Example

1. **Find model on Sketchfab**:
   - Search "hamburger"
   - Download GLB
   - Size should be < 2MB

2. **Optimize in Blender**:
   - Reduce polygons if needed
   - Export with compression
   - Verify size < 2MB

3. **Upload to Vercel**:
   ```bash
   cp ~/Downloads/hamburger.glb public/models/
   ```

4. **Update dishData.js**:
   ```javascript
   {
     id: 6,
     name: 'Classic Hamburger',
     price: 14.99,
     description: 'Juicy beef patty with fresh toppings',
     cuisine: 'American',
     thumbnail: 'https://images.unsplash.com/photo-...',
     modelUrl: '/models/hamburger.glb',
     allergens: ['Gluten', 'Dairy'],
     dietary: ['High Protein'],
     spiceLevel: 0,
     rating: 4.6,
   }
   ```

5. **Deploy**:
   ```bash
   git add .
   git commit -m "Add hamburger model"
   git push origin main
   # Vercel auto-deploys!
   ```

---

## ✅ Testing Your Models

### Quality Checklist

- [ ] Model loads in < 5 seconds
- [ ] Model displays correctly in AR
- [ ] No texture errors or missing parts
- [ ] Rotation works smoothly
- [ ] Zoom works (pinch)
- [ ] Model looks realistic
- [ ] File size < 2MB
- [ ] No console errors

### Test in Browser

1. **Local testing**:
   ```bash
   npm run dev
   # Open http://localhost:5173
   ```

2. **Mobile testing**:
   ```bash
   # Get local IP
   ipconfig getifaddr en0  # macOS
   # Open http://<YOUR_IP>:5173 on phone
   ```

3. **After deployment**:
   - Open deployed URL on mobile
   - Test each model
   - Verify AR mode

---

## 🎨 Model Lighting & Materials

### Model Quality Tips

**Good models have:**
- ✓ Proper materials/textures
- ✓ Realistic lighting
- ✓ Appropriate scale
- ✓ Clean geometry

**Avoid models with:**
- ✗ Missing textures
- ✗ Very high polygon count (> 500k)
- ✗ Incorrect scale
- ✗ Dark/black appearance

---

## 🔗 Recommended Food Models

**Ready-to-use models:**

```javascript
// Salmon
modelUrl: 'https://modelviewer.dev/shared-assets/models/Salmon.glb'

// Pizza
modelUrl: 'https://modelviewer.dev/shared-assets/models/Pizza.glb'

// Steak
modelUrl: 'https://modelviewer.dev/shared-assets/models/Steak.glb'

// Noodles
modelUrl: 'https://modelviewer.dev/shared-assets/models/Noodles.glb'

// Cake
modelUrl: 'https://modelviewer.dev/shared-assets/models/Cake.glb'
```

These are Google's built-in model-viewer demo models (CC0 licensed).

---

## 📧 Troubleshooting Models

### Model Not Showing
```javascript
// Check console for errors
console.error() messages
// Verify URL is correct
// Check CORS if hosted elsewhere
```

### Model Too Large/Small
```javascript
// Edit dish data
modelUrl: '/models/model.glb'
// Adjust model in Blender before exporting
```

### Model Loads Slowly
```javascript
// Optimize with Blender:
// 1. Reduce polygons by 50%
// 2. Use GLB compression
// 3. Compress textures
```

### Textures Missing
```javascript
// Use Gltf format (includes textures)
// Or re-export from author
// Some models need separate texture files
```

---

## 🎓 Learning Resources

- **Model-Viewer Docs**: https://modelviewer.dev/
- **Blender Beginner Guide**: https://www.blender.org/support/
- **Sketchfab Help**: https://sketchfab.com/help
- **glTF Spec**: https://www.khronos.org/gltf/

---

**Happy model hunting! 🎨✨**
