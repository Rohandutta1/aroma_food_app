import React, { useState, useRef, useEffect } from 'react'
import './App.css'
import WebXRARViewer from './components/WebXRARViewer'
import UIOverlay from './components/UIOverlay'
import ItemsList from './components/ItemsList'
import ItemDetail from './components/ItemDetail'
import QRCodeGenerator from './components/QRCodeGenerator'
import { dishData, getDishById } from './utils/dishData'
import { getDishIdFromURL } from './utils/qrGenerator'

function App() {
  const [view, setView] = useState('menu') // 'menu', 'detail', 'ar', 'qr-admin'
  const [selectedDishId, setSelectedDishId] = useState(null)
  const [isARSupported, setIsARSupported] = useState(true)
  const [cameraPermission, setCameraPermission] = useState(null)
  const [openedViaQR, setOpenedViaQR] = useState(false)
  const modelViewerRef = useRef(null)

  const selectedDish = selectedDishId ? getDishById(selectedDishId) : null
  const selectedDishIndex = selectedDishId ? dishData.findIndex(d => d.id === selectedDishId) : 0

  // Determine view on mount
  useEffect(() => {
    const path = window.location.pathname
    const dishId = getDishIdFromURL()

    if (path.includes('/admin/qr') || path.includes('qr')) {
      setView('qr-admin')
    } else if (dishId) {
      // Direct link with dish ID - show AR view
      setSelectedDishId(dishId)
      setView('ar')
      setOpenedViaQR(true)
    } else {
      // Default to menu
      setView('menu')
    }
  }, [])

  // Check for WebXR support
  useEffect(() => {
    const checkARSupport = async () => {
      if (!navigator.xr) {
        console.warn('WebXR not supported on this device')
        setIsARSupported(false)
        return
      }

      try {
        const isSessionSupported = await navigator.xr.isSessionSupported('immersive-ar')
        setIsARSupported(isSessionSupported)
      } catch (error) {
        console.error('Error checking AR support:', error)
        setIsARSupported(false)
      }
    }

    // Only check AR support for AR view
    if (view === 'ar') {
      checkARSupport()
    }
  }, [view])

  // Request camera permission for AR
  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        stream.getTracks().forEach(track => track.stop())
        setCameraPermission(true)
      } catch (error) {
        console.error('Camera permission denied:', error)
        setCameraPermission(false)
      }
    }

    if (view === 'ar') {
      requestCameraPermission()
    }
  }, [view])

  const handleSelectItem = (dishId) => {
    setSelectedDishId(dishId)
    setView('detail')
  }

  const handleViewAR = (dishId) => {
    setSelectedDishId(dishId)
    setView('ar')
  }

  const handleBackToMenu = () => {
    setView('menu')
    setSelectedDishId(null)
  }

  const handleBackToDetail = () => {
    setView('detail')
  }

  // QR Admin Page
  if (view === 'qr-admin') {
    return <QRCodeGenerator />
  }

  // Menu/Items List Page
  if (view === 'menu') {
    return <ItemsList items={dishData} onSelectItem={handleSelectItem} />
  }

  // Item Detail Page
  if (view === 'detail' && selectedDish) {
    return (
      <ItemDetail
        item={selectedDish}
        onBack={handleBackToMenu}
        onViewAR={() => handleViewAR(selectedDish.id)}
      />
    )
  }

  // AR View Page
  if (view === 'ar' && selectedDish) {
    return (
      <div className="ar-container">
        <WebXRARViewer
          modelUrl={selectedDish.modelUrl}
          dishName={selectedDish.name}
          autoActivateAR={openedViaQR}
          onExit={handleBackToDetail}
        />

        <div className="ui-overlay">
          <UIOverlay dish={selectedDish} />
        </div>
      </div>
    )
  }

  return null
}

export default App
