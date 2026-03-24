# 🍽️ AROMA - WebAR Restaurant Menu Platform

A complete WebAR (Web-based Augmented Reality) mobile web application for restaurants to showcase their dishes in 3D using WebXR technology. No app download required—users simply scan a QR code and view 3D food models in their real environment.

## ✨ Features

### 🎯 Core WebAR Features
- **WebXR Support**: Works on Android (Chrome, Edge) and iOS (Safari 15+)
- **3D Model Viewer**: Uses model-viewer for efficient 3D rendering
- **AR Mode**: Place 3D models in real world view
- **Gesture Controls**:
  - Tap & drag to rotate models
  - Pinch to zoom in/out
  - Touch interactions optimized for mobile

### 🎨 UI Features
- **Minimal, Clean Overlay**: Shows dish info without blocking AR view
- **Mobile Responsive**: Works perfectly on all phone sizes
- **Info Display**: Dish name, price, description, allergens, dietary info
- **Dish Navigation**: Swipe between multiple dishes
- **Loading Indicators**: Smooth loading with progress feedback

### 📱 Mobile Optimization
- **Camera Permission Handling**: Graceful error handling
- **Safe Area Support**: Works with notched phones
- **Performance**: <5 second load time
- **Mobile-First Design**: Optimized for touch and small screens

### 🔗 QR Code System
- **QR Generator**: Admin page to generate QR codes
- **Deep Linking**: Links can point to specific dishes
- **Export Options**: Download PNG or print directly

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **3D/AR**: model-viewer Web Component + WebXR
- **Styling**: Tailwind CSS
- **UI Icons**: Lucide React
- **QR Codes**: qrcode.react
- **Hosting**: Vercel-ready

## 📁 Project Structure

```
aroma/
├── src/
│   ├── components/
│   │   ├── ARViewer.jsx           # Main AR viewer (model-viewer)
│   │   ├── UIOverlay.jsx          # Dish info overlay
│   │   ├── DishSelector.jsx       # Dish navigation
│   │   ├── LoadingIndicator.jsx   # Loading state
│   │   └── QRCodeGenerator.jsx    # Admin QR generator
│   ├── utils/
│   │   ├── dishData.js            # Sample dishes & models
│   │   ├── qrGenerator.js         # QR utilities
│   │   └── config.js              # App configuration
│   ├── App.jsx                     # Main app component
│   ├── App.css                     # App styles
│   ├── index.css                   # Tailwind imports
│   └── main.jsx                    # Entry point
├── public/
│   └── models/                     # 3D model directory
├── index.html                      # HTML template
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind config
├── postcss.config.js               # PostCSS config
└── package.json                    # Dependencies

```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- A code editor (VS Code recommended)

### Installation

1. **Clone/Navigate to project**
```bash
cd aroma
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Testing on Mobile

1. **Get local IP**
```bash
ipconfig getifaddr en0  # macOS
# or
hostname -I             # Linux
```

2. **Access from phone**
Open `http://<YOUR_IP>:5173` in mobile browser (must be on same WiFi)

3. **Test AR Features**
- Grant camera permission
- Tap "View in AR" button
- Look for environment plane detection
- Tap to place model
- Use gestures to interact

## 📦 Deployment to Vercel

### 1. **Prepare for Deployment**

```bash
# Build the project
npm run build

# Test production build locally
npm run preview
```

### 2. **Deploy to Vercel**

**Option A: Using Vercel CLI**
```bash
npm i -g vercel
vercel
```

**Option B: Using GitHub**
1. Push code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Vercel auto-detects Vite config
6. Click "Deploy"

### 3. **Configure Environment**

In Vercel dashboard:
- Go to Settings → Domains
- Add your custom domain (optional)
- HTTPS is automatic

### 4. **Get Your URL**

Your app will be live at: `https://aroma-[random].vercel.app`

## 🎨 Customization

### 1. **Change Restaurant Details**

Edit [src/utils/dishData.js](src/utils/dishData.js):
```javascript
export const dishData = [
  {
    name: 'Your Dish Name',
    price: 19.99,
    description: 'Your description',
    cuisine: 'Your cuisine type',
    // ... more fields
  }
];
```

### 2. **Add 3D Models**

Replace `modelUrl` in dishData with your own models:
```javascript
modelUrl: 'https://your-domain.com/models/dish.glb'
```

### 3. **Change Colors**

Edit [tailwind.config.js](tailwind.config.js):
```javascript
theme: {
  extend: {
    colors: {
      'aroma-brown': '#YOUR_COLOR',
      'aroma-gold': '#YOUR_COLOR',
      'aroma-dark': '#YOUR_COLOR',
    }
  }
}
```

### 4. **Update Restaurant Name**

Edit components and update "AROMA" references:
- [src/components/UIOverlay.jsx](src/components/UIOverlay.jsx)
- [src/components/QRCodeGenerator.jsx](src/components/QRCodeGenerator.jsx)

## 🎬 Adding 3D Models

### Free 3D Model Sources

1. **Sketchfab** (https://sketchfab.com)
   - Search for food models
   - Download as GLB/GLTF
   - Most are free with license

2. **TurboSquid Free** (https://www.turbosquid.com)
   - Filter by "Free"
   - Download GLB format

3. **CGTrader Free** (https://www.cgtrader.com)
   - Search "food"
   - Filter "Free"

4. **Poly Haven** (https://polyhaven.com)
   - High-quality assets
   - All free, no account needed

### Model Requirements

- **Format**: .glb or .gltf (compressed GLB preferred)
- **Size**: <5MB (aim for 1-2MB)
- **Scale**: Reasonably sized (not too large/small)
- **Optimization**: Pre-optimized models load faster

### Optimize Models

Use Blender (free):
1. Open model in Blender
2. File → Export → glTF 2.0
3. Enable compression
4. Select GLB format
5. Reduce polygon count if needed

## 📱 QR Code Generation

### Access QR Generator

1. **Local**: `http://localhost:5173/admin/qr`
2. **Deployed**: `https://aroma-[random].vercel.app/admin/qr`

### Features
- Generate QR codes for full menu or specific dishes
- Download as PNG (print on menus)
- Print directly
- Copy link to share digitally

### Print QR Codes

1. Go to QR generator
2. Select dish (or "All Dishes")
3. Click "Print"
4. Use physical printer
5. Post on menus, placemats, windows

## 🔗 URL Parameters

### Open Specific Dish

```
https://aroma-app.vercel.app/?dish=1
```

This opens the app showing Dish #1 (Grilled Salmon)

## 🧪 Testing Checklist

- [ ] AR mode works on real Android device
- [ ] AR mode works on real iOS device (Safari 15+)
- [ ] Camera permission prompt appears
- [ ] 3D models load within 5 seconds
- [ ] Rotation works (tap & drag)
- [ ] Zoom works (pinch)
- [ ] Dish navigation works
- [ ] UI overlays don't block AR view
- [ ] Loading indicator appears smoothly
- [ ] QR codes scan correctly
- [ ] Mobile responsive on all sizes
- [ ] No console errors

## 🐛 Troubleshooting

### AR Mode Not Working

**Checklist**:
- [ ] Using iOS Safari 15+ or Android Chrome
- [ ] Camera permission granted
- [ ] Device has ARCore (Android) or A12+ processor (iOS)
- [ ] Good lighting in environment
- [ ] Trying on real device (not emulator)

**Solution**:
```javascript
// Check WebXR support in console
navigator.xr?.isSessionSupported('immersive-ar')
  .then(supported => console.log('AR supported:', supported))
```

### Models Not Loading

**Checklist**:
- [ ] Model URL is correct
- [ ] Model format is GLB/GLTF
- [ ] File size < 5MB
- [ ] CORS enabled on hosting

**Solution**:
```javascript
// Check model loading in browser inspector
// Look for 404 or CORS errors
// Verify URL in network tab
```

### Slow Performance

**Optimize**:
1. Reduce model polygon count
2. Compress GLB files
3. Use model-viewer's built-in optimization
4. Lazy load non-essential images
5. Minimize Main.js size

### Camera Permission Dialog Not Appearing

**On iOS**:
- Only shows once, if denied, go to Settings → Safari → Camera
- Reset Safari data: Settings → Safari → Clear History and Data

**On Android**:
- Check app permissions: Settings → Apps → Chrome → Permissions

## 📊 Performance Metrics

Target:
- **Page Load**: <5 seconds
- **Model Load**: <3 seconds
- **First Interaction**: <500ms
- **AR Init**: <2 seconds

Check with:
```bash
npm run build
npm run preview
# Use Lighthouse in DevTools (Desktop) or PageSpeed Insights
```

## 🔐 Security

- HTTPS automatically enabled on Vercel
- No server-side processing of AR data
- QR codes are simple URLs—no sensitive data
- Model-viewer is maintained by Google

## 📈 Analytics (Optional)

Add Google Analytics or Vercel Analytics:

```javascript
// In src/main.jsx
import { Analytics } from '@vercel/analytics/react';

// Then add <Analytics /> to your app
```

## 🤝 Contributing

To add features:

1. Create new branch: `git checkout -b feature/your-feature`
2. Make changes
3. Test on mobile
4. Commit: `git commit -m "Add your feature"`
5. Push: `git push origin feature/your-feature`
6. Create Pull Request

## 📝 License

MIT License - feel free to use for your restaurant

## 🎯 Future Enhancements

- [ ] Multiple restaurant support
- [ ] Order integration (connect to POS)
- [ ] Customer reviews/ratings
- [ ] Dietary filter & search
- [ ] Multi-language support
- [ ] Mobile app wrapper
- [ ] Live inventory sync
- [ ] Reservation system
- [ ] Real 360° product views
- [ ] Voice guidance in AR

## 📧 Support

For issues or questions:
1. Check troubleshooting section
2. Review browser console
3. Test on different device
4. Check GitHub issues
5. Open new issue with details

---

**Made with ❤️ for restaurants leveraging WebAR technology**

Happy serving! 🍽️✨
