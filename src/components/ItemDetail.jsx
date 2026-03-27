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
    <div className="min-h-screen bg-gradient-to-br from-kid-bg via-white to-kid-yellow/30 p-4 sm:p-6 overflow-y-auto font-kid">
      <div className="max-w-2xl mx-auto pb-12 relative">
        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 text-4xl animate-bounce" style={{ animationDuration: '3s' }}>⭐</div>
        <div className="absolute top-20 -right-2 text-4xl animate-bounce" style={{ animationDuration: '2.5s' }}>🎈</div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-kid-pink text-white px-6 py-3 rounded-full hover:bg-kid-orange hover:-translate-y-2 hover:shadow-xl mb-8 transition-all font-black text-lg border-4 border-white shadow-md z-10 relative"
        >
          <ChevronLeft size={24} strokeWidth={3} />
          Back to Menu!
        </button>

        {/* Item Header (Bubbly Container) */}
        <div className="mb-10 bg-white border-4 border-kid-blue rounded-[3rem] p-4 sm:p-8 shadow-2xl relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-kid-yellow text-kid-text font-black px-6 py-2 rounded-full border-4 border-white shadow-lg transform -rotate-2">
            Yummy Choice!
          </div>
          
          <img
            src={item.thumbnail}
            alt={item.name}
            className="w-full h-64 sm:h-80 rounded-[2.5rem] object-cover mb-8 border-4 border-kid-pink shadow-lg mt-4"
          />
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-kid-heading text-kid-blue mb-4 drop-shadow-sm leading-tight">{item.name}</h1>
            <div className="inline-block bg-kid-orange text-white px-6 py-2 rounded-full font-black text-3xl mb-6 shadow-inner border-4 border-kid-yellow/50 transform rotate-2">
              ${item.price}
            </div>
            <p className="text-kid-pink font-black text-xl mb-3 uppercase tracking-wider bg-kid-pink/10 inline-block px-4 py-1 rounded-full">{item.cuisine} Cuisine</p>
            <p className="text-kid-text text-lg font-bold bg-kid-bg/50 p-4 rounded-2xl">{item.description}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {item.allergens && item.allergens.length > 0 && (
            <div className="bg-red-50 border-4 border-red-400 rounded-[2rem] p-6 shadow-lg transform hover:scale-105 transition-transform">
              <h3 className="text-red-500 font-black text-lg uppercase mb-3 font-kid-heading tracking-widest flex items-center gap-2"><span>⚠️</span> Allergens</h3>
              <div className="flex flex-wrap gap-2">
                {item.allergens.map((allergen) => (
                  <span key={allergen} className="bg-white border-2 border-red-300 text-red-600 font-bold text-sm px-4 py-2 rounded-full shadow-sm">
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.dietary && item.dietary.length > 0 && (
            <div className="bg-green-50 border-4 border-kid-green rounded-[2rem] p-6 shadow-lg transform hover:scale-105 transition-transform">
              <h3 className="text-green-600 font-black text-lg uppercase mb-3 font-kid-heading tracking-widest flex items-center gap-2"><span>🌱</span> Dietary</h3>
              <div className="flex flex-wrap gap-2">
                {item.dietary.map((diet) => (
                  <span key={diet} className="bg-white border-2 border-green-300 text-green-700 font-bold text-sm px-4 py-2 rounded-full shadow-sm">
                    {diet}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.spiceLevel && (
            <div className="bg-orange-50 border-4 border-orange-400 rounded-[2rem] p-6 shadow-lg transform hover:scale-105 transition-transform">
              <h3 className="text-orange-600 font-black text-lg uppercase mb-3 font-kid-heading tracking-widest flex items-center gap-2"><span>🔥</span> Spicy?</h3>
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-6 h-8 rounded-full shadow-inner ${i < item.spiceLevel ? 'bg-orange-500' : 'bg-gray-200'}`}
                  />
                ))}
              </div>
            </div>
          )}

          {item.rating && (
            <div className="bg-yellow-50 border-4 border-kid-yellow rounded-[2rem] p-6 shadow-lg transform hover:scale-105 transition-transform">
              <h3 className="text-yellow-600 font-black text-lg uppercase mb-3 font-kid-heading tracking-widest flex items-center gap-2"><span>⭐</span> Rating</h3>
              <div className="flex items-center gap-2">
                <span className="text-3xl">{'⭐'.repeat(Math.floor(item.rating))}</span>
                <span className="text-kid-text text-lg font-black bg-white px-3 py-1 rounded-full shadow-sm">({item.rating}/5)</span>
              </div>
            </div>
          )}
        </div>

        {/* View AR Button */}
        <div className="relative">
          <div className="absolute -top-4 -right-4 text-4xl animate-bounce" style={{ animationDuration: '2s' }}>🚀</div>
          <button
            onClick={onViewAR}
            className="w-full flex items-center justify-center gap-4 bg-gradient-to-r from-kid-pink to-kid-orange text-white px-6 py-6 rounded-[3rem] font-black text-3xl hover:from-kid-orange hover:to-kid-pink transform hover:scale-105 hover:shadow-2xl transition-all duration-300 mb-10 border-8 border-white shadow-xl font-kid-heading overflow-hidden relative group"
          >
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            <Eye size={36} strokeWidth={3} />
            SEE MAGIC AR! ✨
          </button>
        </div>

        {/* QR Code Section */}
        <div className="bg-white rounded-3xl p-8 text-center mb-8 border-4 border-kid-blue shadow-lg">
          <h2 className="text-kid-pink font-kid-heading text-2xl mb-4">Scan for Magic AR</h2>
          {qrDataUrl && (
            <img src={qrDataUrl} alt="QR Code" className="mx-auto mb-6 border-4 border-kid-yellow rounded-xl p-2" />
          )}
          <p className="text-kid-text font-bold text-sm">
            Scan with phone camera to see {item.name} pop out!
          </p>
        </div>

        {/* QR URL */}
        <div className="bg-white border-4 border-kid-green rounded-2xl p-4 mb-8 shadow-sm">
          <p className="text-kid-blue font-black tracking-wider text-xs uppercase mb-2">Sharing Link</p>
          <div className="flex items-center gap-2">
            <code className="text-kid-text bg-kid-bg px-2 py-1 rounded-lg text-xs flex-1 break-all font-bold group-hover:bg-kid-yellow transition-colors">{qrValue}</code>
            <button
              onClick={handleCopyURL}
              className="p-2 bg-kid-yellow text-kid-text hover:bg-kid-orange hover:text-white rounded-full transition-colors shadow-sm"
              title={copied ? 'Copied!' : 'Copy URL'}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 bg-kid-yellow text-kid-text px-6 py-4 rounded-full font-bold hover:bg-kid-orange hover:text-white hover:-translate-y-1 hover:shadow-md transition-all border-4 border-white shadow-sm"
          >
            <Download size={20} />
            Download
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 bg-kid-green text-kid-text px-6 py-4 rounded-full font-bold hover:bg-kid-blue hover:text-white hover:-translate-y-1 hover:shadow-md transition-all border-4 border-white shadow-sm"
          >
            <Printer size={20} />
            Print
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-white border-8 border-kid-pink rounded-[3rem] p-8 shadow-2xl relative">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-kid-yellow text-kid-text text-xl font-black px-8 py-3 rounded-full border-4 border-white shadow-lg whitespace-nowrap">
            How to play! 🎮
          </div>
          <ol className="text-kid-text font-black text-lg space-y-4 mt-4">
            <li className="flex items-center gap-3"><span className="bg-kid-pink text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">1</span> Tap the big <strong>"SEE MAGIC AR"</strong> button!</li>
            <li className="flex items-center gap-3"><span className="bg-kid-blue text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">2</span> OR scan the QR code with phone camera</li>
            <li className="flex items-center gap-3"><span className="bg-kid-yellow text-kid-text w-8 h-8 flex items-center justify-center rounded-full text-sm">3</span> Allow camera permission</li>
            <li className="flex items-center gap-3"><span className="bg-kid-green text-kid-text w-8 h-8 flex items-center justify-center rounded-full text-sm">4</span> Point your camera at a flat table or floor</li>
            <li className="flex items-center gap-3"><span className="bg-kid-orange text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">5</span> The food will pop right up!</li>
            <li className="flex items-center gap-3"><span className="bg-kid-pink text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">6</span> Drag to spin it, pinch to zoom</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default ItemDetail
