import React, { useRef, useState, useEffect } from 'react'

// Simple WebXR AR Viewer
const ARViewer = ({ modelUrl, dishName, autoActivateAR = false }) => {
  const canvasRef = useRef(null)
  const [isARSupported, setIsARSupported] = useState(false)
  const [error, setError] = useState(null)
  const [isARActive, setIsARActive] = useState(false)
  const xrSessionRef = useRef(null)
  const glRef = useRef(null)

  // Check AR support
  useEffect(() => {
    const checkARSupport = async () => {
      if (!navigator.xr) {
        setError('WebXR not supported')
        return
      }

      try {
        const supported = await navigator.xr.isSessionSupported('immersive-ar')
        setIsARSupported(supported)
        if (!supported) {
          setError('AR not supported on this device')
        }
      } catch (err) {
        setError('Error checking AR support')
      }
    }

    checkARSupport()
  }, [])

  // Auto-start AR when opened via QR
  useEffect(() => {
    if (autoActivateAR && isARSupported && !isARActive) {
      const timer = setTimeout(() => {
        startAR()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [autoActivateAR, isARSupported, isARActive])

  const startAR = async () => {
    try {
      if (!navigator.xr) {
        throw new Error('WebXR not supported')
      }

      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['dom-overlay']
      })

      xrSessionRef.current = session
      setIsARActive(true)

      // Set up WebGL context
      const canvas = canvasRef.current
      const gl = canvas.getContext('webgl', { xrCompatible: true })
      glRef.current = gl

      // Make XR session
      await gl.makeXRCompatible()

      const xrFrameOfRef = await session.requestReferenceSpace('local-floor')

      // Handle session end
      session.addEventListener('end', () => {
        setIsARActive(false)
        xrSessionRef.current = null
      })

      // Start render loop
      const renderFrame = (time, frame) => {
        const session = frame.session
        const pose = frame.getViewerPose(xrFrameOfRef)

        if (pose) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, session.renderState.baseLayer.framebuffer)

          // Clear and render
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

          // Here you would render your 3D model
          // For now, just clear to show camera feed
        }

        session.requestAnimationFrame(renderFrame)
      }

      session.requestAnimationFrame(renderFrame)

    } catch (err) {
      console.error('Failed to start AR:', err)
      setError('Failed to start AR session')
    }
  }

  const stopAR = () => {
    if (xrSessionRef.current) {
      xrSessionRef.current.end()
    }
  }

  if (error) {
    return (
      <div className="ar-viewer w-full h-full relative bg-black flex items-center justify-center">
        <div className="text-center text-white p-4">
          <h2 className="text-xl font-bold mb-2">AR Not Available</h2>
          <p className="text-gray-300">{error}</p>
          <p className="text-sm text-gray-400 mt-4">
            Try using Chrome or Safari on a mobile device with AR support
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="ar-viewer w-full h-full relative bg-black">
      {/* Hidden canvas for WebXR */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: isARActive ? 'block' : 'none' }}
      />

      {/* AR Controls */}
      {!isARActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <button
              onClick={startAR}
              disabled={!isARSupported}
              className="bg-aroma-gold text-aroma-dark px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-500 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isARSupported ? '🚀 Start AR Experience' : 'AR Not Supported'}
            </button>
            <p className="text-white text-sm mt-4 max-w-xs">
              Point your camera at a surface to see the 3D model in augmented reality
            </p>
          </div>
        </div>
      )}

      {/* AR Active UI */}
      {isARActive && (
        <>
          <div className="absolute top-4 right-4">
            <button
              onClick={stopAR}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              Exit AR
            </button>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white text-center">
            <p className="text-sm opacity-80">
              Move your device to explore the 3D model in your space
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default ARViewer