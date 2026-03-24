# ⚡ Quick Start Guide - AROMA WebAR

Get running in 5 minutes!

## 🚀 Installation

### 1. Install Dependencies
```bash
cd /Users/rohandutta/CascadeProjects/aroma
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Open browser to: **http://localhost:5173**

## 📱 Local Mobile Testing

### Test on Real Phone (Same WiFi)

**Step 1: Find your IP**
```bash
ipconfig getifaddr en0  # macOS
```
Result: `192.168.1.X`

**Step 2: Open on Phone**
Visit: `http://192.168.1.X:5173`

**Step 3: Test AR**
- Grant camera permission
- Tap "View in AR" button
- Tap to place model
- Rotate & zoom with gestures

## 🎯 Core Features to Try

1. **View AR**: Tap "View in AR" button
2. **Switch Dishes**: Tap left/right arrows
3. **Rotate**: Tap & drag on model
4. **Zoom**: Pinch to zoom
5. **Info**: Tap info button to see allergens
6. **QR Codes**: Visit `http://localhost:5173/admin/qr`

## 📦 Build & Deploy

### Build
```bash
npm run build
```
Creates optimized `dist/` folder

### Preview Production
```bash
npm run preview
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## 🎨 Customize

### Change Dishes

Edit **src/utils/dishData.js**:
```javascript
export const dishData = [
  {
    name: 'Your Dish',
    price: 19.99,
    modelUrl: 'https://your-model.glb',
    // ... other fields
  }
];
```

### Change Colors

Edit **tailwind.config.js**:
```javascript
colors: {
  'aroma-gold': '#YOUR_COLOR',
  // ... other colors
}
```

## 📊 File Structure

```
src/
├── components/
│   ├── ARViewer.jsx       ← 3D model display
│   ├── UIOverlay.jsx      ← Dish info
│   ├── DishSelector.jsx   ← Navigation
│   └── QRCodeGenerator.jsx← QR codes
├── utils/
│   ├── dishData.js        ← Sample dishes
│   └── qrGenerator.js     ← QR utilities
└── App.jsx                ← Main app
```

## 🔧 Troubleshooting

### Models Not Loading
- Check browser console for errors
- Verify model URL is accessible
- Models must be GLB/GLTF format

### AR Not Working
- Grant camera permission
- Use real device (not emulator)
- iOS 15+ or Android Chrome required

### Slow Performance
- Check model file size (< 2MB)
- Optimize with Blender
- Check internet connection

## 📚 Full Guides

- **Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **3D Models**: See [3D_MODELS_GUIDE.md](3D_MODELS_GUIDE.md)
- **Full README**: See [README.md](README.md)

## ✨ Next Steps

1. ✅ Test locally on phone
2. 📦 Build the app
3. 🚀 Deploy to Vercel
4. 🎨 Customize with your dishes
5. 📱 Share QR codes!

---

**Questions?** Check the full [README.md](README.md) or [DEPLOYMENT.md](DEPLOYMENT.md)

Happy building! 🍽️✨
