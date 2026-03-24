import React, { useRef, useEffect, useState, forwardRef } from 'react'
import LoadingIndicator from './LoadingIndicator'

const ARViewer = forwardRef(({ modelUrl, dishName, isARSupported, cameraPermission }, ref) => {
  const modelViewerRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [arActive, setArActive] = useState(false)
  const [touchStartDistance, setTouchStartDistance] = useState(0)

  // Assign ref
  useEffect(() => {
    if (ref) {
      ref.current = modelViewerRef.current
    }
  }, [ref])

  // Initialize model viewer and AR
  useEffect(() => {
    const viewer = modelViewerRef.current
    if (!viewer) return

    const handleLoad = () => {
      console.log('Model loaded successfully:', dishName)
      setIsLoading(false)
      setError(null)
    }

    const handleError = (event) => {
      console.error('Model loading error:', event)
      setError('Failed to load 3D model')
      setIsLoading(false)
    }

    const handleARStatus = (event) => {
      console.log('AR Status:', event.detail.status)
    }

    viewer.addEventListener('load', handleLoad)
    viewer.addEventListener('error', handleError)
    viewer.addEventListener('ar-status-changed', handleARStatus)

    return () => {
      viewer.removeEventListener('load', handleLoad)
      viewer.removeEventListener('error', handleError)
      viewer.removeEventListener('ar-status-changed', handleARStatus)
    }
  }, [dishName])

  // Handle pinch zoom for scaling
  useEffect(() => {
    const viewer = modelViewerRef.current
    if (!viewer) return

    const handleTouchStart = (event) => {
      if (event.touches.length === 2) {
        const touch1 = event.touches[0]
        const touch2 = event.touches[1]
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        )
        setTouchStartDistance(distance)
      }
    }

    const handleTouchMove = (event) => {
      if (event.touches.length === 2 && touchStartDistance > 0) {
        const touch1 = event.touches[0]
        const touch2 = event.touches[1]
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        )

        const scale = distance / touchStartDistance
        const currentScale = viewer.scale || { x: 1, y: 1, z: 1 }

        // Limit scale between 0.5 and 3
        const newScale = Math.max(0.5, Math.min(3, currentScale.x * scale))
        viewer.scale = { x: newScale, y: newScale, z: newScale }

        setTouchStartDistance(distance)
      }
    }

    viewer.addEventListener('touchstart', handleTouchStart)
    viewer.addEventListener('touchmove', handleTouchMove)

    return () => {
      viewer.removeEventListener('touchstart', handleTouchStart)
      viewer.removeEventListener('touchmove', handleTouchMove)
    }
  }, [touchStartDistance])

  // Handle AR activation
  const activateAR = async () => {
    const viewer = modelViewerRef.current
    if (!viewer || !isARSupported) return

    try {
      await viewer.activateAR()
      setArActive(true)
    } catch (error) {
      console.error('AR activation failed:', error)
      setError('AR mode not available. Check device support and permissions.')
    }
  }

  return (
    <div className="ar-viewer w-full h-full relative bg-black">
      {/* Model Viewer Web Component */}
      <model-viewer
        ref={modelViewerRef}
        src={modelUrl}
        alt={dishName}
        shadow-intensity="1"
        exposure="1"
        camera-controls
        touch-action="pan-y"
        autoplay
        ar
        ar-modes="webxr scene-viewer quick-look"
        loading="eager"
        className="w-full h-full"
        style={{
          '--progress-bar-height': '2px',
          '--progress-bar-color': '#ffd700',
        }}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <LoadingIndicator />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="text-center safe-bottom">
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <p className="text-gray-400 text-xs">Please check your internet connection or try a different model.</p>
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-4 safe-bottom flex gap-3 justify-center">
        {/* AR Button - Only show if AR is supported and camera permission granted */}
        {isARSupported && cameraPermission && !arActive && (
          <button
            onClick={activateAR}
            className="bg-aroma-gold text-aroma-dark px-6 py-2 rounded-lg font-medium text-sm hover:bg-yellow-500 transition-colors shadow-lg"
          >
            📷 View in AR
          </button>
        )}

        {/* AR Active Indicator */}
        {arActive && (
          <div className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium text-sm shadow-lg">
            ✓ AR Mode Active
          </div>
        )}

        {/* Camera Permission Error */}
        {cameraPermission === false && (
          <div className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium text-sm shadow-lg">
            ⚠️ Camera Permission Denied
          </div>
        )}

        {/* AR Not Supported */}
        {!isARSupported && (
          <div className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium text-sm shadow-lg">
            ⚠️ AR Not Supported
          </div>
        )}
      </div>

      {/* Gesture Guide */}
      {!isLoading && !error && (
        <div className="absolute top-0 left-0 right-0 px-4 py-4 safe-top pointer-events-none">
          <div className="gesture-hint text-white text-xs opacity-60 text-center">
            👆 Tap & drag to rotate • 👌 Pinch to zoom
          </div>
        </div>
      )}
    </div>
  )
})

ARViewer.displayName = 'ARViewer'

export default ARViewer
