import React, { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const ARViewer = ({ modelUrl, dishName, autoActivateAR = false }) => {
  const containerRef = useRef(null)
  const [isARReady, setIsARReady] = useState(false)
  const [error, setError] = useState(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const videoRef = useRef(null)
  const modelRef = useRef(null)
  const animationIdRef = useRef(null)

  useEffect(() => {
    initializeAR()
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop())
      }
    }
  }, [])

  const initializeAR = async () => {
    try {
      console.log('🚀 Starting AR initialization...')

      // Request camera permission
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        })
        stream.getTracks().forEach(t => t.stop())
        console.log('✅ Camera permission granted')
      } catch (err) {
        throw new Error('Camera permission denied. Please enable camera access.')
      }

      // Create Three.js scene
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x000000)
      sceneRef.current = scene

      // Create camera
      const width = window.innerWidth
      const height = window.innerHeight
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
      camera.position.z = 3
      cameraRef.current = camera

      // Create WebGL renderer
      const canvas = document.createElement('canvas')
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: false,
        powerPreference: 'low-power'
      })
      renderer.setSize(width, height)
      renderer.pixelRatio = Math.min(window.devicePixelRatio, 1.5)
      renderer.setClearColor(0x000000, 1)
      rendererRef.current = renderer

      if (containerRef.current) {
        containerRef.current.appendChild(canvas)
        console.log('✅ Canvas appended')
      }

      // Create video element for live camera feed
      const video = document.createElement('video')
      video.setAttribute('autoplay', '')
      video.setAttribute('playsinline', '')
      video.setAttribute('muted', '')
      video.setAttribute('webkit-playsinline', '')
      video.style.display = 'none'
      document.body.appendChild(video)
      videoRef.current = video

      // Get camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      video.srcObject = stream
      console.log('✅ Camera stream requested')

      // Wait for video to load
      await new Promise(resolve => {
        const handler = () => {
          video.removeEventListener('loadedmetadata', handler)
          resolve()
        }
        video.addEventListener('loadedmetadata', handler)
        video.play().catch(e => console.warn('Video play warning:', e))
      })
      console.log('✅ Video playing')

      // Create video texture
      const videoTexture = new THREE.VideoTexture(video)
      videoTexture.flipY = false

      // Create background plane with camera feed
      const planeGeom = new THREE.PlaneGeometry(16, 9)
      const planeMat = new THREE.MeshBasicMaterial({ map: videoTexture })
      const bgPlane = new THREE.Mesh(planeGeom, planeMat)
      bgPlane.position.z = -5
      scene.add(bgPlane)
      console.log('✅ Background plane added')

      // Create model group for 3D objects
      const modelGroup = new THREE.Group()
      scene.add(modelGroup)

      // Load 3D model
      if (modelUrl) {
        try {
          console.log('🎯 Loading model:', dishName)
          const loader = new GLTFLoader()
          const gltf = await loader.loadAsync(modelUrl)
          const model = gltf.scene

          // Scale and position model
          const box = new THREE.Box3().setFromObject(model)
          const size = box.getSize(new THREE.Vector3())
          const maxDim = Math.max(size.x, size.y, size.z)
          const scale = 1.5 / maxDim
          model.scale.multiplyScalar(scale)

          // Center the model
          box.setFromObject(model)
          const center = box.getCenter(new THREE.Vector3())
          model.position.sub(center)

          modelGroup.add(model)
          modelRef.current = model
          console.log('✅ Model loaded and positioned')
        } catch (err) {
          console.error('❌ Model load failed:', err.message)
          // Create placeholder if model fails
          const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8)
          const material = new THREE.MeshPhongMaterial({ color: 0xffaa00 })
          const placeholder = new THREE.Mesh(geometry, material)
          modelGroup.add(placeholder)
          modelRef.current = placeholder
        }
      }

      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 1)
      modelGroup.add(ambientLight)

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.set(5, 10, 5)
      modelGroup.add(directionalLight)

      // Handle window resize
      const onResize = () => {
        const w = window.innerWidth
        const h = window.innerHeight
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }
      window.addEventListener('resize', onResize)

      // Animation loop
      let frameCount = 0
      const animate = () => {
        animationIdRef.current = requestAnimationFrame(animate)

        if (modelRef.current && frameCount % 2 === 0) {
          modelRef.current.rotation.y += 0.01
          modelRef.current.rotation.x += 0.004
        }
        frameCount++

        renderer.render(scene, camera)
      }
      animate()

      setIsARReady(true)
      console.log('✅ AR initialized successfully!')
    } catch (err) {
      console.error('❌ AR initialization failed:', err)
      setError(err.message)
    }
  }

  const handleExit = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current)
    }
    window.history.back()
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="text-center text-white p-6 max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-red-500">⚠️ Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="space-y-2">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-aroma-gold text-black px-6 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => window.history.back()}
              className="w-full bg-gray-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (!isARReady) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin w-16 h-16 border-4 border-gray-600 border-t-aroma-gold rounded-full mx-auto mb-6"></div>
          <p className="text-lg font-semibold mb-2">Initializing AR Camera</p>
          <p className="text-sm text-gray-400">Please allow camera access...</p>
        </div>
      </div>
    )
  }

  // AR view
  return (
    <div className="w-full h-full relative bg-black overflow-hidden">
      {/* 3D Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ position: 'relative' }}
      />

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
        {/* Top bar */}
        <div className="flex justify-between items-center pointer-events-auto">
          <div className="bg-aroma-dark bg-opacity-90 text-white px-4 py-2 rounded-lg">
            <p className="font-medium text-sm">🍽️ {dishName}</p>
          </div>
          <button
            onClick={handleExit}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            ← Exit
          </button>
        </div>

        {/* Bottom instructions */}
        <div className="bg-aroma-dark bg-opacity-90 text-white text-center px-4 py-3 rounded-lg pointer-events-auto">
          <p className="text-sm">📱 Rotate your device to explore • Pinch to zoom</p>
        </div>
      </div>
    </div>
  )
}

export default ARViewer
