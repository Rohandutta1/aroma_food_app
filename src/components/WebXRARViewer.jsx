import React, { useRef, useEffect, useState } from 'react'

const ARViewer = ({ modelUrl, dishName, autoActivateAR = false }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState(null)
  const [isStarting, setIsStarting] = useState(false)
  const streamRef = useRef(null)

  useEffect(() => {
    if (autoActivateAR) {
      startAR()
    }

    // Handle visibility change to restart camera if needed
    const handleVisibilityChange = () => {
      if (!document.hidden && streamRef.current) {
        const videoTracks = streamRef.current.getVideoTracks()
        if (videoTracks.length > 0 && videoTracks[0].readyState === 'ended') {
          console.log('🔄 Restarting camera after visibility change')
          startAR()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Monitor video state periodically
    const videoMonitor = setInterval(() => {
      if (videoRef.current && streamRef.current && isReady) {
        const video = videoRef.current
        const tracks = streamRef.current.getVideoTracks()

        if (tracks.length > 0) {
          const track = tracks[0]
          if (track.readyState === 'ended') {
            console.log('📷 Track ended - restarting')
            startAR()
          } else if (video.paused && !video.ended && document.visibilityState === 'visible') {
            console.log('📹 Video paused unexpectedly - resuming')
            video.play().catch(err => console.log('Failed to resume:', err))
          }
        }
      }
    }, 2000) // Check every 2 seconds

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearInterval(videoMonitor)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [autoActivateAR, isReady])

  const startAR = async () => {
    if (isStarting) return // Prevent multiple starts

    setIsStarting(true)
    setError(null)

    try {
      console.log('🚀 Starting AR...')

      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }

      // Request camera access with fallback constraints
      let constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }
      }

      console.log('📷 Requesting camera with constraints:', constraints)
      let stream
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints)
      } catch (firstError) {
        console.log('⚠️ Environment camera failed, trying any camera:', firstError)
        // Fallback to any camera
        constraints = { video: true }
        stream = await navigator.mediaDevices.getUserMedia(constraints)
      }

      console.log('✅ Camera access granted')
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream

        // Wait for metadata to load
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            console.log('📹 Video metadata loaded')
            resolve()
          }
        })

        // Try to play the video
        try {
          await videoRef.current.play()
          console.log('▶️ Video playing successfully')
          setIsReady(true)
        } catch (playError) {
          console.error('❌ Video play failed:', playError)
          throw new Error('Video autoplay blocked. Please tap to start camera.')
        }

        // Add event listeners for mobile camera issues
        videoRef.current.onpause = () => {
          console.log('⚠️ Video paused')
          // On mobile, try to resume after a short delay
          setTimeout(() => {
            if (videoRef.current && !videoRef.current.ended && document.visibilityState === 'visible') {
              videoRef.current.play().catch(err => {
                console.log('Failed to resume video:', err)
                setError('Camera paused. Tap restart to continue.')
              })
            }
          }, 500)
        }

        videoRef.current.onended = () => {
          console.log('⚠️ Video stream ended')
          setError('Camera stream ended')
          // Try to restart after delay
          setTimeout(() => {
            if (document.visibilityState === 'visible') {
              startAR()
            }
          }, 2000)
        }

        videoRef.current.onerror = (e) => {
          console.error('❌ Video error:', e)
          setError('Video stream error')
        }

        // Listen to track ended events
        stream.getVideoTracks().forEach(track => {
          track.onended = () => {
            console.log('📷 Camera track ended')
            setError('Camera disconnected')
          }
          track.onmute = () => {
            console.log('📷 Camera track muted')
          }
          track.onunmute = () => {
            console.log('📷 Camera track unmuted')
          }
        })

        // Monitor video element visibility
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) {
              console.log('📹 Video element not visible')
            }
          })
        })
        observer.observe(videoRef.current)
      }
    } catch (err) {
      console.error('❌ Error:', err)
      setError(err.message)
    } finally {
      setIsStarting(false)
    }
  }

  if (error) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="text-center text-white p-6">
          <p className="text-2xl font-bold mb-4 text-red-500">⚠️ Error</p>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-aroma-gold text-black px-6 py-2 rounded-lg font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative bg-black overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{
          transform: 'scaleX(-1)',
          backgroundColor: 'black'
        }}
      />

      {/* 3D Model Container - Using model-viewer */}
      {isReady && modelUrl && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <model-viewer
            src={modelUrl}
            alt={dishName}
            auto-rotate
            camera-controls
            style={{
              width: '100%',
              height: '100%',
              pointerEvents: 'auto'
            }}
            exposure="1"
            environment-image="neutral"
            shadow-intensity="1"
          />
        </div>
      )}

      {/* Loading State */}
      {!isReady && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center text-white">
            {isStarting ? (
              <>
                <div className="animate-spin w-12 h-12 border-4 border-gray-600 border-t-aroma-gold rounded-full mx-auto mb-4"></div>
                <p className="text-lg font-medium">Initializing Camera...</p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium mb-4">Tap to Start AR Camera</p>
                <button
                  onClick={startAR}
                  className="bg-aroma-gold text-black px-6 py-3 rounded-lg font-medium text-lg"
                >
                  📷 Start Camera
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* UI Controls */}
      <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none flex flex-col justify-between p-4">
        {/* Top Bar */}
        <div className="flex justify-between items-center pointer-events-auto">
          <div className="bg-black/80 text-white px-4 py-2 rounded-lg">
            <p className="text-sm font-medium">🍽️ {dishName}</p>
          </div>
          <div className="flex gap-2">
            {(error || !isReady) && (
              <button
                onClick={startAR}
                disabled={isStarting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {isStarting ? '🔄 Starting...' : '🔄 Restart Camera'}
              </button>
            )}
            <button
              onClick={() => window.history.back()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              ← Exit
            </button>
          </div>
        </div>

        {/* Bottom Instructions */}
        <div className="bg-black/80 text-white text-center px-4 py-3 rounded-lg pointer-events-auto">
          <p className="text-sm">📱 Move your device to explore • 👆 Tap to interact</p>
        </div>
      </div>
    </div>
  )
}

export default ARViewer
