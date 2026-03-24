import React, { useState, useRef, useEffect } from 'react'
import { Download, Printer, Copy, Check } from 'lucide-react'
import * as QRCode from 'qrcode'
import { generateAromaQRValue, downloadQRCode, printQRCode } from '../utils/qrGenerator'
import { dishData } from '../utils/dishData'

/**
 * QR Code Generator Page
 * 
 * This component allows generating QR codes for the Aroma app.
 * Can be accessed via a special admin URL like /admin/qr
 */

const QRCodeGenerator = () => {
  const [selectedDishId, setSelectedDishId] = useState(null)
  const [copied, setCopied] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const qrContainerRef = useRef()

  const baseUrl = window.location.origin
  const qrValue = generateAromaQRValue(baseUrl, selectedDishId)

  // Generate QR code image
  useEffect(() => {
    const generateQR = async () => {
      try {
        const dataUrl = await QRCode.toDataURL(qrValue, {
          errorCorrectionLevel: 'H',
          type: 'image/png',
          width: 300,
          margin: 1,
          color: {
            dark: '#2C1810',
            light: '#FFFFFF',
          },
        })
        setQrDataUrl(dataUrl)
      } catch (error) {
        console.error('Error generating QR code:', error)
      }
    }
    generateQR()
  }, [qrValue])

  const handleDownload = async () => {
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = `aroma-qr-${selectedDishId || 'menu'}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrint = () => {
    const printWindow = window.open()
    const dishName = selectedDishId
      ? dishData.find(d => d.id === selectedDishId)?.name
      : 'AROMA Menu'
    
    printWindow.document.write(`
      <html>
        <head>
          <title>AROMA QR Code - ${dishName}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            img { max-width: 100%; height: auto; margin: 20px 0; }
            h1 { color: #2C1810; margin-bottom: 10px; }
            p { color: #666; }
          </style>
        </head>
        <body>
          <h1>🍽️ AROMA</h1>
          <h2>${dishName}</h2>
          <img src="${qrDataUrl}" alt="QR Code" />
          <p>Scan to view menu in AR</p>
          <p>AROMA WebAR Restaurant Menu</p>
          <script>
            window.print();
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const handleCopyURL = () => {
    navigator.clipboard.writeText(qrValue)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-aroma-dark to-black p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-aroma-gold mb-2">🍽️ AROMA</h1>
          <p className="text-gray-400">QR Code Generator</p>
        </div>

        {/* QR Code Display */}
        <div className="bg-white p-8 rounded-lg shadow-xl mb-8 text-center">
          <div ref={qrContainerRef}>
            {qrDataUrl && (
              <img
                src={qrDataUrl}
                alt="QR Code"
                className="mx-auto"
              />
            )}
          </div>
          <p className="text-gray-600 text-sm mt-4">
            {selectedDishId
              ? `Scan to view ${dishData.find(d => d.id === selectedDishId)?.name}`
              : 'Scan to open Aroma menu'}
          </p>
        </div>

        {/* URL Display */}
        <div className="bg-aroma-dark bg-opacity-50 border border-aroma-gold rounded-lg p-4 mb-8">
          <p className="text-gray-400 text-xs uppercase mb-2">App URL</p>
          <div className="flex items-center gap-2">
            <code className="text-aroma-gold text-xs flex-1 break-all">{qrValue}</code>
            <button
              onClick={handleCopyURL}
              className="p-2 hover:bg-aroma-gold hover:text-aroma-dark rounded transition-colors"
              title={copied ? 'Copied!' : 'Copy URL'}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
        </div>

        {/* Dish Selection */}
        <div className="bg-aroma-dark bg-opacity-50 border border-aroma-gold border-opacity-30 rounded-lg p-6 mb-8">
          <h2 className="text-aroma-gold font-bold mb-4">Generate QR for Specific Dish</h2>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedDishId(null)}
              className={`p-3 rounded transition-all ${
                selectedDishId === null
                  ? 'bg-aroma-gold text-aroma-dark'
                  : 'bg-aroma-dark border border-aroma-gold text-gray-400 hover:text-white'
              }`}
            >
              All Dishes
            </button>
            {dishData.map((dish) => (
              <button
                key={dish.id}
                onClick={() => setSelectedDishId(dish.id)}
                className={`p-3 rounded text-sm transition-all truncate ${
                  selectedDishId === dish.id
                    ? 'bg-aroma-gold text-aroma-dark font-bold'
                    : 'bg-aroma-dark border border-aroma-gold text-gray-400 hover:text-white'
                }`}
              >
                {dish.name}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 bg-aroma-gold text-aroma-dark px-6 py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
          >
            <Download size={20} />
            Download PNG
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 bg-aroma-gold text-aroma-dark px-6 py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
          >
            <Printer size={20} />
            Print
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-aroma-dark bg-opacity-50 border border-aroma-gold border-opacity-30 rounded-lg p-6">
          <h3 className="text-aroma-gold font-bold mb-4">📋 Instructions</h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>✓ Generate QR codes for the Aroma menu</li>
            <li>✓ Download as PNG to print on menus or placemats</li>
            <li>✓ Print directly to physical media</li>
            <li>✓ Generate dish-specific QR codes</li>
            <li>✓ Share QR code URL with customers</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default QRCodeGenerator
