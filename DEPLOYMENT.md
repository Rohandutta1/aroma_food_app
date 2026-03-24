# 🚀 Deployment Guide - AROMA WebAR App

Complete step-by-step guide to deploy AROMA to Vercel in minutes.

## Prerequisites

- Node.js 16+ installed
- GitHub account (recommended but optional)
- Vercel account (free at vercel.com)

## 🔧 Option 1: Deploy via GitHub (Recommended)

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial AROMA WebAR app commit"

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/aroma.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Select "Import Git Repository"
4. Paste your GitHub repo URL
5. Click "Import"

### Step 3: Configure Project

**Vercel will auto-detect:**
- Framework: Vite ✓
- Build Command: `npm run build` ✓
- Output Directory: `dist` ✓

**You can leave defaults as-is.**

### Step 4: Deploy

Click "Deploy" - Vercel handles the rest!

Your app will be live at: `https://aroma-[random-id].vercel.app`

---

## 🚀 Option 2: Deploy via Vercel CLI (Faster)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Deploy

```bash
cd /Users/rohandutta/CascadeProjects/aroma
vercel
```

**Follow prompts:**
- Set project name: `aroma`
- Confirm settings
- Deploy!

### Step 3: Link to GitHub (Optional)

For automatic deployments on every push:

```bash
vercel link
```

---

## 📱 Option 3: Deploy to Other Platforms

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Select "dist" as public directory
npm run build
firebase deploy
```

### Netlify

```bash
npm install -g netlify-cli
netlify login
netlify init
# Select "dist" as publish directory
npm run build
netlify deploy --prod
```

### AWS Amplify

```bash
npm install -g @aws-amplify/cli
amplify configure
amplify init
npm run build
amplify publish
```

---

## ✅ Post-Deployment Checklist

After deployment, verify everything works:

### 1. **Test on Desktop**
- [ ] Go to your deployed URL
- [ ] All UI elements visible
- [ ] Can navigate between dishes
- [ ] Console has no errors

### 2. **Test on Mobile (Android)**
- [ ] Open Chrome
- [ ] Visit deployed URL
- [ ] Grant camera permission
- [ ] Click "View in AR" button
- [ ] Model should appear in AR view
- [ ] Gestures work (rotate, zoom)

### 3. **Test on Mobile (iOS)**
- [ ] Open Safari (iOS 15+)
- [ ] Visit deployed URL
- [ ] Grant camera permission
- [ ] Tap "View in AR" button
- [ ] Model should appear
- [ ] Verify quick-look mode

### 4. **Test QR Code**
- [ ] Visit `/admin/qr` on deployed app
- [ ] Generate QR code
- [ ] Scan with phone camera
- [ ] Should open correct dish
- [ ] Download QR as PNG

### 5. **Performance Check**
- [ ] Page loads in <5 seconds
- [ ] No console errors
- [ ] Network tab shows all assets loaded
- [ ] Model loads smoothly

---

## 🔗 Custom Domain (Optional)

### Connect Custom Domain on Vercel

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Domains
4. Add your domain (e.g., aroma.restaurant)
5. Follow DNS setup instructions

### Update DNS Records

Add these CNAME records to your domain registrar:

```
aroma.restaurant  CNAME  cname.vercel-dns.com
```

Takes 24-48 hours to propagate.

---

## 🌍 Environment Variables

### Set Environment Variables on Vercel

1. Go to Settings → Environment Variables
2. Add key-value pairs

Example:
```
VITE_RESTAURANT_NAME=AROMA
VITE_RESTAURANT_CITY=San Francisco
```

### Use in App

```javascript
const restaurantName = import.meta.env.VITE_RESTAURANT_NAME
```

---

## 📊 Monitor Deployment

### Vercel Analytics

1. Go to Analytics tab
- See website traffic
- Page load times
- Error rates
- User locations

### Real-time Logs

```bash
vercel logs
```

### Rollback Previous Deployment

```bash
vercel rollback
```

---

## 🐛 Troubleshooting

### Build Failed

**Check build logs:**
```bash
vercel logs --follow
```

**Common issues:**
- Missing dependencies: `npm install`
- Node version mismatch: Use Node 18+
- Port already in use: `npm run build && npm run preview`

### App Loads Blank Page

1. Check browser console for errors
2. Verify model URLs are accessible
3. Clear browser cache: Ctrl+Shift+Delete
4. Try incognito mode

### AR Not Working After Deployment

**Ensure:**
- HTTPS enabled (automatic on Vercel)
- WebXR APIs available
- Camera permission requested
- Testing on real device (not emulator)

**Check console:**
```javascript
console.log(navigator.xr)
```

### Performance Issues

1. Check waterfall in DevTools Network tab
2. Optimize 3D models (< 2MB)
3. Enable Gzip compression (automatic)
4. Use Vercel Analytics for insights

---

## 📈 CI/CD Setup

### Automatic Deployments with GitHub

Vercel automatically deploys when you push to main:

```bash
# Make changes
git add .
git commit -m "Update menu items"
git push origin main
# Vercel auto-deploys! ✨
```

### Deploy Previews

Each pull request gets a preview URL:

```bash
# Create feature branch
git checkout -b feature/new-dishes
# Make changes
git push origin feature/new-dishes
# Create PR on GitHub
# Vercel comment includes preview link
```

---

## 🔐 Security

### HTTPS (Automatic on Vercel)
- All connections are encrypted
- Redirects HTTP → HTTPS

### Content Security Policy
Already included in model-viewer, but you can enhance:

```javascript
// In index.html <head>
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' ajax.googleapis.com">
```

### Camera Permission Security
- Camera only activated when user clicks button
- Permissions requested by browser
- Data never sent to server

---

## 💰 Pricing

### Vercel Free Tier Includes
- ✓ 5 projects
- ✓ Unlimited deployments
- ✓ 100 GB bandwidth/month
- ✓ HTTPS with automatic certificates
- ✓ Analytics
- ✓ Custom domain support

### When You Need Pro
- More than 5 projects
- Team collaboration
- Advanced analytics
- Priority support

---

## 📞 Support

### Vercel Support
- Documentation: https://vercel.com/docs
- Community: https://github.com/vercel/next.js/discussions
- Status: https://www.vercelstatus.com

### Model-Viewer Issues
- GitHub: https://github.com/google/model-viewer/issues
- Docs: https://modelviewer.dev

### WebXR Support
- Documentation: https://immersive-web.github.io/
- Check device support: https://caniuse.com/webxr

---

## ✨ Next Steps

After deployment:

1. **Share QR codes** in restaurant
2. **Collect feedback** from customers
3. **Monitor analytics** on Vercel
4. **Update menu items** as needed
5. **Add more models** to catalog
6. **Integrate ordering** (future feature)

---

**Your AROMA WebAR app is now live! 🎉**

Enjoy serving your customers with AR! 🍽️✨
