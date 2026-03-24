import React, { useState, useEffect } from 'react'
import { ChevronLeft, Download, Printer, Copy, Check, Eye } from 'lucide-react'
import * as QRCode from 'qrcode'
import { generateAromaQRValue } from '../utils/qrGenerator'

const ItemDetail = ({ item, onBack, onViewAR }) => {
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const baseUrl = window.location.origin
  const qrValue = generateAromaQRValue(baseUrl, item.id)

  // Generate QR code
  useEffect(() => {
    const generateQR = async () => {
      try {
        const dataUrl = await QRCode.toDataURL(qrValue, {
          errorCorrectionLevel: 'H',
          type: 'image/png',
          width: 300,
          margin: 2,
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

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = `aroma-${item.name.replace(/\s/g, '-')}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrint = () => {
    const printWindow = window.open()
    printWindow.document.write(`
      <html>
        <head>
          <title>AROMA - ${item.name}</title>
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
              background: #f5f5f5;
            }
            .container { max-width: 600px; text-align: center; }
            img { max-width: 400px; height: auto; margin: 20px 0; }
            h1 { color: #2C1810; margin: 20px 0 10px 0; }
            h2 { color: #8B4513; font-size: 28px; margin: 10px 0; }
            p { color: #666; margin: 10px 0; }
            .price { font-size: 24px; color: #FFD700; font-weight: bold; margin: 20px 0; }
            .description { font-size: 16px; color: #333; margin: 15px 0; font-style: italic; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🍽️ AROMA</h1>
            <h2>${item.name}</h2>
            <p class="description">${item.description}</p>
            <p class="price">$${item.price}</p>
            <img src="${qrDataUrl}" alt="QR Code" />
            <p><strong>Scan to view in AR</strong></p>
            <p style="margin-top: 30px; color: #999; font-size: 12px;">AROMA WebAR Restaurant Menu</p>
          </div>
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
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-aroma-gold hover:text-yellow-500 mb-8 transition-colors"
        >
          <ChevronLeft size={20} />
          Back to Menu
        </button>

        {/* Item Header */}
        <div className="mb-8">
          <img
            src={item.thumbnail}
            alt={item.name}
            className="w-full h-64 rounded-lg object-cover mb-6"
          />
          <h1 className="text-4xl font-bold text-white mb-2">{item.name}</h1>
          <p className="text-aroma-gold text-2xl font-bold mb-4">${item.price}</p>
          <p className="text-gray-300 text-lg mb-2">{item.cuisine} Cuisine</p>
          <p className="text-gray-400">{item.description}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {item.allergens && item.allergens.length > 0 && (
            <div className="bg-red-900 bg-opacity-30 border border-red-700 rounded-lg p-4">
              <h3 className="text-red-400 font-bold text-sm uppercase mb-2">Allergens</h3>
              <div className="flex flex-wrap gap-2">
                {item.allergens.map((allergen) => (
                  <span key={allergen} className="bg-red-800 text-red-100 text-xs px-2 py-1 rounded">
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.dietary && item.dietary.length > 0 && (
            <div className="bg-green-900 bg-opacity-30 border border-green-700 rounded-lg p-4">
              <h3 className="text-green-400 font-bold text-sm uppercase mb-2">Dietary</h3>
              <div className="flex flex-wrap gap-2">
                {item.dietary.map((diet) => (
                  <span key={diet} className="bg-green-800 text-green-100 text-xs px-2 py-1 rounded">
                    {diet}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.spiceLevel && (
            <div className="bg-orange-900 bg-opacity-30 border border-orange-700 rounded-lg p-4">
              <h3 className="text-orange-400 font-bold text-sm uppercase mb-2">Spice Level</h3>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-6 rounded ${i < item.spiceLevel ? 'bg-red-500' : 'bg-gray-600'}`}
                  />
                ))}
              </div>
            </div>
          )}

          {item.rating && (
            <div className="bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-lg p-4">
              <h3 className="text-yellow-400 font-bold text-sm uppercase mb-2">Rating</h3>
              <div className="flex items-center gap-2">
                <span className="text-xl">{'⭐'.repeat(Math.floor(item.rating))}</span>
                <span className="text-gray-300 text-sm">({item.rating}/5)</span>
              </div>
            </div>
          )}
        </div>

        {/* View AR Button */}
        <button
          onClick={onViewAR}
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors mb-8"
        >
          <Eye size={24} />
          View in AR
        </button>

        {/* QR Code Section */}
        <div className="bg-white rounded-lg p-8 text-center mb-8">
          <h2 className="text-aroma-dark font-bold mb-4">Scan to View in AR</h2>
          {qrDataUrl && (
            <img src={qrDataUrl} alt="QR Code" className="mx-auto mb-4" />
          )}
          <p className="text-gray-600 text-sm">
            Open this QR code with your phone camera to view {item.name} in augmented reality
          </p>
        </div>

        {/* QR URL */}
        <div className="bg-aroma-dark bg-opacity-50 border border-aroma-gold rounded-lg p-4 mb-8">
          <p className="text-gray-400 text-xs uppercase mb-2">AR Link</p>
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

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 bg-aroma-gold text-aroma-dark px-6 py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
          >
            <Download size={20} />
            Download QR
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
          <h3 className="text-aroma-gold font-bold mb-4">📱 How to View in AR</h3>
          <ol className="text-gray-400 text-sm space-y-2">
            <li>1. Tap <strong>"View in AR"</strong> button above</li>
            <li>2. OR scan the QR code with your phone camera</li>
            <li>3. Grant camera permission when prompted</li>
            <li>4. Tap "View in AR" button on the next screen</li>
            <li>5. Point camera at a flat surface (floor, table, wall)</li>
            <li>6. Tap to place the 3D model</li>
            <li>7. Drag to rotate the model</li>
            <li>8. Pinch to zoom in/out</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default ItemDetail
