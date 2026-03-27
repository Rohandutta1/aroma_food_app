import React, { useRef, useEffect, useState } from 'react'

const ARViewer = ({ modelUrl, dishName, autoActivateAR = false }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState(null)
  const streamRef = useRef(null)

  useEffect(() => {
    startAR()

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

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startAR = async () => {
    try {
      console.log('🚀 Starting AR...')

      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
          console.log('✅ Video stream started')
          setIsReady(true)
        }

        // Add event listeners for mobile camera issues
        videoRef.current.onpause = () => {
          console.log('⚠️ Video paused')
          // On mobile, try to resume
          if (videoRef.current && !videoRef.current.ended) {
            videoRef.current.play().catch(err => console.log('Failed to resume video:', err))
          }
        }

        videoRef.current.onended = () => {
          console.log('⚠️ Video stream ended')
          // Try to restart the stream
          setTimeout(() => {
            if (!document.hidden) {
              startAR()
            }
          }, 1000)
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
        })
      }
    } catch (err) {
      console.error('❌ Error:', err)
      setError(err.message)
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
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: 'scaleX(-1)' }}
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
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center text-white">
            <div className="animate-spin w-12 h-12 border-4 border-gray-600 border-t-aroma-gold rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-medium">Initializing Camera...</p>
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
            {error && (
              <button
                onClick={startAR}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                🔄 Restart Camera
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
