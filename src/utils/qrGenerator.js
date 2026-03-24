/**
 * QR Code Generation Utilities
 * 
 * This utility helps generate QR codes for the Aroma WebAR app.
 * Uses react-qrcode for client-side QR generation.
 */

/**
 * Generate QR code value for Aroma app
 * @param {string} baseUrl - The base URL of your deployed app
 * @param {number} dishId - Optional: specific dish ID to open
 * @returns {string} - QR code value
 */
export const generateAromaQRValue = (baseUrl = window.location.origin, dishId = null) => {
  const url = new URL(baseUrl);
  if (dishId) {
    url.searchParams.append('dish', dishId);
  }
  return url.toString();
};

/**
 * Generate QR code for a specific dish
 * @param {number} dishId - Dish ID
 * @returns {string} - QR code value
 */
export const generateDishQRCode = (dishId) => {
  return generateAromaQRValue(window.location.origin, dishId);
};

/**
 * Get dish ID from URL params
 * @returns {number|null} - Dish ID if present in URL
 */
export const getDishIdFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  const dishId = params.get('dish');
  return dishId ? parseInt(dishId) : null;
};

/**
 * Create downloadable QR code image
 * @param {HTMLElement} svgElement - SVG element from QR code
 * @param {string} filename - Output filename
 */
export const downloadQRCode = (svgElement, filename = 'aroma-qr-code.png') => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  const svgString = new XMLSerializer().serializeToString(svgElement);
  const svg = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(svg);
  
  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
  };
  
  img.src = url;
};

/**
 * Print QR code
 * @param {HTMLElement} svgElement - SVG element from QR code
 */
export const printQRCode = (svgElement) => {
  const window_ = window.open();
  const svgString = new XMLSerializer().serializeToString(svgElement);
  
  window_.document.write(`
    <html>
      <head>
        <title>Aroma QR Code</title>
        <style>
          body { display: flex; justify-content: center; align-items: center; min-height: 100vh; }
          svg { max-width: 100%; }
        </style>
      </head>
      <body>
        ${svgString}
        <script>
          window.print();
          window.close();
        </script>
      </body>
    </html>
  `);
  window_.document.close();
};
