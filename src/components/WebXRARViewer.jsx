import React, { useRef, useEffect, useState } from 'react'

const ARViewer = ({ modelUrl, dishName, autoActivateAR = false, onExit }) => {
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
      <div className="w-full h-full bg-kid-bg flex items-center justify-center font-kid">
        <div className="text-center text-kid-text p-6 bg-white rounded-3xl border-4 border-kid-pink shadow-xl max-w-sm mx-4">
          <p className="text-3xl font-kid-heading mb-4 text-kid-pink drop-shadow-sm">Uh Oh! 🙈</p>
          <p className="mb-6 font-bold text-lg">{error}</p>
          <button
            onClick={onExit ? onExit : () => window.history.back()}
            className="bg-kid-blue hover:bg-kid-orange text-white px-8 py-3 rounded-full font-bold text-xl transition-all shadow-md transform hover:-translate-y-1 border-4 border-white"
          >
            Let's Go Back!
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
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10 font-kid">
          <div className="text-center text-white bg-white/20 p-8 rounded-3xl border-4 border-white/50 shadow-2xl">
            {isStarting ? (
              <>
                <div className="animate-bounce w-16 h-16 bg-kid-yellow rounded-full mx-auto mb-6 flex items-center justify-center text-3xl shadow-lg border-4 border-white">
                  ✨
                </div>
                <p className="text-2xl font-kid-heading text-white drop-shadow-md">Waking up Magic Camera...</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-kid-heading mb-6 drop-shadow-md">Ready to see Magic? 🪄</p>
                <button
                  onClick={startAR}
                  className="bg-kid-pink text-white px-8 py-4 rounded-full font-black text-xl hover:bg-kid-orange transform hover:scale-105 transition-all shadow-xl border-4 border-white"
                >
                  📷 Start Camera!
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* UI Controls */}
      <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none flex flex-col justify-start p-2 sm:p-4 z-20 font-kid">
        {/* Top Bar */}
        <div className="flex justify-between items-start pointer-events-auto safe-top mt-2 w-full px-2 sm:px-4">
          {/* Back Button */}
          <div>
            <button
              onClick={onExit ? onExit : () => window.history.back()}
              className="flex items-center gap-1 bg-kid-blue text-white px-4 py-2 rounded-full font-black shadow-lg transition-colors border-2 border-white hover:bg-kid-pink text-sm sm:text-base"
            >
              ← Back
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex flex-col gap-2 items-end">
            {(error || !isReady) && (
              <button
                onClick={startAR}
                disabled={isStarting}
                className="bg-kid-blue text-white px-4 py-2 rounded-full font-bold shadow-md text-sm sm:text-base border-2 border-white"
              >
                {isStarting ? '🔄 Wait...' : '🔄 Restart'}
              </button>
            )}
            <button
              onClick={onExit ? onExit : () => window.history.back()}
              className="bg-kid-pink hover:bg-kid-orange text-white px-4 py-2 rounded-full font-black shadow-lg transition-colors border-2 border-white text-sm sm:text-base"
            >
              ✖ Exit AR
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ARViewer
