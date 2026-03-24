import React, { useRef, useState, useEffect } from 'react'

// Enhanced WebXR AR Viewer with iOS Support
const ARViewer = ({ modelUrl, dishName, autoActivateAR = false }) => {
  const canvasRef = useRef(null)
  const [isARSupported, setIsARSupported] = useState(false)
  const [isQuickLookSupported, setIsQuickLookSupported] = useState(false)
  const [error, setError] = useState(null)
  const [isARActive, setIsARActive] = useState(false)
  const [showModelViewer, setShowModelViewer] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState({})
  const [debugInfo, setDebugInfo] = useState({})
  const xrSessionRef = useRef(null)
  const glRef = useRef(null)

  // Detect device and capabilities
  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent
      const isIOS = /iPad|iPhone|iPod/.test(userAgent)
      const isAndroid = /Android/.test(userAgent)
      const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent)
      const isChrome = /chrome/i.test(userAgent)

      const info = {
        isIOS,
        isAndroid,
        isSafari,
        isChrome,
        isMobile: isIOS || isAndroid,
        userAgent,
        iOSVersion: isIOS ? parseFloat(userAgent.match(/OS (\d+)_(\d+)/)?.slice(1).join('.') || '0') : 0
      }

      setDeviceInfo(info)
      setDebugInfo({
        userAgent,
        hasXR: !!navigator.xr,
        hasWebkit: !!window.webkit,
        iOSVersion: info.iOSVersion
      })

      // Check for Quick Look support (iOS AR)
      setIsQuickLookSupported(isIOS && 'webkit' in window)
    }

    detectDevice()
  }, [])

  // Check AR support with detailed logging
  useEffect(() => {
    const checkARSupport = async () => {
      console.log('🔍 Checking AR support...', deviceInfo, debugInfo)

      // Check WebXR availability
      if (!navigator.xr) {
        console.log('❌ WebXR not available')

        // Check if it's a browser that should support WebXR
        const shouldSupportWebXR = deviceInfo.isChrome || deviceInfo.isSafari || deviceInfo.isEdge

        if (deviceInfo.isIOS) {
          setError('iOS Safari requires WebXR. Enable it in Settings → Safari → Advanced → WebXR, or use Chrome.')
        } else if (deviceInfo.isAndroid) {
          setError('Android requires Chrome 81+ or Samsung Internet. Update your browser for AR support.')
        } else if (shouldSupportWebXR) {
          setError('WebXR is disabled in your browser. Enable it in browser settings or try a different browser.')
        } else {
          setError('WebXR requires a modern browser. Try Chrome, Edge, or Safari for AR support.')
        }
        return
      }

      try {
        // Check immersive-ar support
        console.log('🔄 Checking immersive-ar support...')
        const arSupported = await navigator.xr.isSessionSupported('immersive-ar')
        console.log('🎯 Immersive AR supported:', arSupported)

        if (arSupported) {
          setIsARSupported(true)
          setError(null)
          console.log('✅ AR is supported!')
        } else {
          // Fallback: check for basic VR support
          console.log('🔄 Checking VR support...')
          const vrSupported = await navigator.xr.isSessionSupported('immersive-vr')
          console.log('👓 VR supported:', vrSupported)

          if (vrSupported) {
            setIsARSupported(true)
            setError(null)
            console.log('✅ VR fallback available')
          } else {
            console.log('❌ No XR sessions supported')
            setError(deviceInfo.isIOS
              ? 'iOS AR requires iOS 15+ and WebXR enabled. Go to Settings → Safari → Advanced → WebXR'
              : deviceInfo.isAndroid
                ? 'AR not supported on this Android device. Try a newer device with AR capabilities.'
                : 'AR requires a mobile device with camera. Use your phone or tablet to scan QR codes and experience AR.'
            )
          }
        }
      } catch (err) {
        console.error('❌ AR support check error:', err)
        setError(`Error checking AR support: ${err.message}`)
      }
    }

    if (deviceInfo.isMobile !== undefined) {
      checkARSupport()
    }
  }, [deviceInfo])

  // Auto-start AR when opened via QR
  useEffect(() => {
    if (autoActivateAR && (isARSupported || isQuickLookSupported) && !isARActive) {
      console.log('🚀 Auto-activating AR...')
      const timer = setTimeout(() => {
        if (isQuickLookSupported && deviceInfo.isIOS) {
          console.log('🍎 Using Quick Look for iOS')
          openQuickLook()
        } else if (isARSupported) {
          console.log('🌐 Using WebXR AR')
          startAR()
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [autoActivateAR, isARSupported, isQuickLookSupported, isARActive, deviceInfo])

  const startAR = async () => {
    try {
      if (!navigator.xr) {
        throw new Error('WebXR not supported')
      }

      console.log('📱 Requesting AR session...')

      const sessionInit = {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['dom-overlay', 'hit-test']
      }

      console.log('Session init:', sessionInit)

      const session = await navigator.xr.requestSession('immersive-ar', sessionInit)

      console.log('✅ AR session started:', session)

      xrSessionRef.current = session
      setIsARActive(true)
      setError(null)

      // Set up WebGL context
      const canvas = canvasRef.current
      const gl = canvas.getContext('webgl', { xrCompatible: true })

      if (!gl) {
        throw new Error('WebGL not supported')
      }

      glRef.current = gl

      // Make XR session
      await gl.makeXRCompatible()

      const xrFrameOfRef = await session.requestReferenceSpace('local-floor')

      // Handle session end
      session.addEventListener('end', () => {
        console.log('🔚 AR session ended')
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
      console.error('❌ Failed to start AR:', err)
      setError(`Failed to start AR: ${err.message}`)
      setIsARActive(false)
    }
  }

  const openQuickLook = () => {
    console.log('🍎 Opening Quick Look...')
    // iOS Quick Look AR for USDZ files
    // Since we have GLB files, we'll try to open in browser AR
    if (modelUrl && deviceInfo.isIOS) {
      try {
        // Try to open the GLB in iOS AR using a link
        const link = document.createElement('a')
        link.href = modelUrl
        link.rel = 'ar'
        link.setAttribute('download', 'model.usdz')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        console.log('🍎 Quick Look link clicked')
      } catch (err) {
        console.error('❌ Quick Look failed:', err)
        setError('Failed to open AR on iOS')
      }
    }
  }

  const openModelViewer = () => {
    setShowModelViewer(true)
  }

  // Show debug info in development
  const showDebug = process.env.NODE_ENV === 'development'

  if (error) {
    return (
      <div className="ar-viewer w-full h-full relative bg-black flex items-center justify-center">
        <div className="text-center text-white p-4 max-w-md">
          <h2 className="text-xl font-bold mb-2 text-red-400">AR Not Available</h2>
          <p className="text-gray-300 mb-4">{error}</p>

          <div className="space-y-3">
            {deviceInfo.isIOS && (
              <div className="bg-blue-900 p-3 rounded-lg">
                <h3 className="font-semibold mb-1">iOS Safari Setup:</h3>
                <ol className="text-sm text-left list-decimal list-inside space-y-1">
                  <li>Update to iOS 15.1 or later</li>
                  <li>Settings → Safari → Advanced → WebXR (enable)</li>
                  <li>Or try Chrome on iOS for better AR support</li>
                  <li>Make sure you're using the latest Safari version</li>
                </ol>
              </div>
            )}

            {deviceInfo.isAndroid && (
              <div className="bg-green-900 p-3 rounded-lg">
                <h3 className="font-semibold mb-1">Android Setup:</h3>
                <p className="text-sm">Use Chrome, Samsung Internet, or Edge on a device with AR capabilities</p>
              </div>
            )}

            {!deviceInfo.isIOS && !deviceInfo.isAndroid && (
              <div className="bg-purple-900 p-3 rounded-lg">
                <h3 className="font-semibold mb-1">Desktop/Laptop:</h3>
                <p className="text-sm">AR requires mobile devices. Scan QR codes with your phone or tablet for the full AR experience.</p>
                {deviceInfo.isChrome && (
                  <p className="text-xs mt-1">Chrome: Enable WebXR in chrome://flags/#webxr-incubations</p>
                )}
                {deviceInfo.isEdge && (
                  <p className="text-xs mt-1">Edge: WebXR should be enabled by default</p>
                )}
              </div>
            )}

            {(deviceInfo.isChrome || deviceInfo.isSafari || deviceInfo.isEdge) && !navigator.xr && (
              <div className="bg-orange-900 p-3 rounded-lg">
                <h3 className="font-semibold mb-1">Enable WebXR:</h3>
                <div className="text-sm space-y-1">
                  {deviceInfo.isChrome && (
                    <p>• Chrome: Go to chrome://flags/#webxr-incubations and enable it</p>
                  )}
                  {deviceInfo.isSafari && (
                    <p>• Safari: Settings → Safari → Advanced → WebXR (enable)</p>
                  )}
                  {deviceInfo.isEdge && (
                    <p>• Edge: WebXR should be enabled by default</p>
                  )}
                  <p>• Restart browser after enabling</p>
                </div>
              </div>
            )}

            <div className="bg-yellow-900 p-3 rounded-lg">
              <h3 className="font-semibold mb-1">Alternative Options:</h3>
              <div className="text-sm space-y-2">
                <button
                  onClick={openModelViewer}
                  className="w-full bg-aroma-gold text-aroma-dark px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
                >
                  View 3D Model Instead
                </button>
                <p>• Use a mobile device with AR support</p>
                {!navigator.xr && (deviceInfo.isChrome || deviceInfo.isSafari || deviceInfo.isEdge) && (
                  <p>• Enable WebXR in browser settings (see above)</p>
                )}
              </div>
            </div>
          </div>

          {showDebug && (
            <div className="mt-4 p-2 bg-gray-800 rounded text-xs text-left">
              <strong>Debug Info:</strong>
              <pre className="mt-1">{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-4">
            Device: {deviceInfo.isIOS ? 'iOS' : deviceInfo.isAndroid ? 'Android' : 'Desktop'}
            {deviceInfo.iOSVersion > 0 && ` (${deviceInfo.iOSVersion})`}
          </p>
        </div>
      </div>
    )
  }

  // Show 3D model viewer fallback
  if (showModelViewer) {
    return (
      <div className="model-viewer w-full h-full relative bg-black">
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => setShowModelViewer(false)}
            className="bg-aroma-dark bg-opacity-90 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-opacity-100 transition-all"
          >
            ← Back to AR
          </button>
        </div>

        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center text-white p-4">
            <h2 className="text-xl font-bold mb-4">3D Model Viewer</h2>
            <div className="bg-gray-800 p-4 rounded-lg max-w-md">
              <p className="text-sm mb-4">
                Since AR is not available, here's the 3D model you can view and rotate:
              </p>

              {/* Simple 3D viewer - you could integrate model-viewer here */}
              <div className="bg-gray-700 p-8 rounded-lg mb-4">
                <div className="text-center">
                  <div className="text-6xl mb-2">🍽️</div>
                  <p className="text-sm text-gray-300">3D Model: {dishName}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    (Model viewer would be integrated here with {modelUrl})
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-400">
                For full AR experience, use a mobile device with AR support.
              </p>
            </div>
          </div>
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
            <div className="space-y-4">
              <button
                onClick={isQuickLookSupported && deviceInfo.isIOS ? openQuickLook : startAR}
                disabled={!isARSupported && !isQuickLookSupported}
                className="bg-aroma-gold text-aroma-dark px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-500 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isARSupported ? '🚀 Start AR Experience' :
                 isQuickLookSupported ? '📱 Open in AR (iOS)' :
                 'AR Not Supported'}
              </button>

              {deviceInfo.isIOS && !isARSupported && (
                <button
                  onClick={openQuickLook}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Try iOS Quick Look
                </button>
              )}
            </div>

            <p className="text-white text-sm max-w-xs mt-4">
              {deviceInfo.isIOS
                ? 'iOS 15+ required. Enable WebXR in Safari settings for immersive AR.'
                : deviceInfo.isAndroid
                  ? 'Point your camera at a surface to see the 3D model in augmented reality'
                  : 'AR is only available on mobile devices. Use your phone to scan QR codes for AR.'
              }
            </p>

            {showDebug && (
              <div className="mt-4 p-2 bg-gray-800 rounded text-xs">
                <strong>Status:</strong> AR: {isARSupported ? '✅' : '❌'},
                QuickLook: {isQuickLookSupported ? '✅' : '❌'}
              </div>
            )}
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