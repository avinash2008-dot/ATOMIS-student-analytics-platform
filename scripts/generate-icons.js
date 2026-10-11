const fs = require('fs');
const path = require('path');
const { encode } = require('fast-png');

function renderAtomisIcon(size) {
  const data = new Uint8ClampedArray(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;

  // Helper to blend a color with alpha
  function setPixel(px, py, r, g, b, a) {
    if (px < 0 || px >= size || py < 0 || py >= size) return;
    const idx = (py * size + px) * 4;
    const currentA = data[idx + 3] / 255;
    const newA = a;
    const outA = newA + currentA * (1 - newA);
    if (outA <= 0) return;
    data[idx] = Math.round((r * newA + data[idx] * currentA * (1 - newA)) / outA);
    data[idx + 1] = Math.round((g * newA + data[idx + 1] * currentA * (1 - newA)) / outA);
    data[idx + 2] = Math.round((b * newA + data[idx + 2] * currentA * (1 - newA)) / outA);
    data[idx + 3] = Math.round(outA * 255);
  }

  // Draw ellipse with angle, rx, ry, stroke width, and color
  function drawRotatedEllipse(angleDeg, rx, ry, strokeW, colorFn) {
    const rad = (angleDeg * Math.PI) / 180;
    const cosA = Math.cos(rad);
    const sinA = Math.sin(rad);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - cx;
        const dy = y - cy;
        // Rotate back
        const rotX = dx * cosA + dy * sinA;
        const rotY = -dx * sinA + dy * cosA;

        // Ellipse equation: (rotX/rx)^2 + (rotY/ry)^2 = 1
        const val = Math.sqrt((rotX / rx) ** 2 + (rotY / ry) ** 2);
        // Distance from ellipse perimeter
        const dist = Math.abs(val - 1.0) * Math.min(rx, ry);

        if (dist <= strokeW / 2 + 1.2) {
          const alpha = Math.max(0, Math.min(1, 1 - (dist - strokeW / 2 + 0.6) / 1.2));
          if (alpha > 0) {
            const col = colorFn(rotX, rotY, x, y);
            setPixel(x, y, col.r, col.g, col.b, alpha * col.a);
          }
        }
      }
    }
  }

  // Draw glossy sphere at rotated position
  function drawSphere(centerX, centerY, radius, baseColor, highlightColor) {
    const r2 = radius * radius;
    for (let y = Math.floor(centerY - radius - 1); y <= Math.ceil(centerY + radius + 1); y++) {
      for (let x = Math.floor(centerX - radius - 1); x <= Math.ceil(centerX + radius + 1); x++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const d2 = dx * dx + dy * dy;
        const dist = Math.sqrt(d2);
        if (dist <= radius + 0.8) {
          const edgeAlpha = Math.max(0, Math.min(1, radius + 0.8 - dist));
          // Gloss shading: highlight at top-left (-0.3*r, -0.3*r)
          const hx = dx + radius * 0.35;
          const hy = dy + radius * 0.35;
          const hDist = Math.sqrt(hx * hx + hy * hy) / (radius * 1.5);
          const t = Math.max(0, Math.min(1, 1 - hDist));

          const r = Math.round(baseColor.r * (1 - t * 0.7) + highlightColor.r * t * 0.7);
          const g = Math.round(baseColor.g * (1 - t * 0.7) + highlightColor.g * t * 0.7);
          const b = Math.round(baseColor.b * (1 - t * 0.7) + highlightColor.b * t * 0.7);
          setPixel(x, y, r, g, b, edgeAlpha);
        }
      }
    }
  }

  const baseScale = size / 240;
  const rx = 35 * baseScale;
  const ry = 98 * baseScale;
  const strokeW = Math.max(2, 9 * baseScale);

  // 1. Orange Ring (Vertical tilt ~2 deg)
  drawRotatedEllipse(2, rx, ry, strokeW, (rxVal, ryVal, x, y) => {
    return { r: 255, g: Math.round(110 + (y / size) * 40), b: 0, a: 0.95 };
  });

  // Orange Sphere (bottom of ring)
  const oRad = (2 * Math.PI) / 180;
  const oLocalX = 12 * baseScale;
  const oLocalY = 90 * baseScale;
  const oPx = cx + (oLocalX * Math.cos(oRad) - oLocalY * Math.sin(oRad));
  const oPy = cy + (oLocalX * Math.sin(oRad) + oLocalY * Math.cos(oRad));
  drawSphere(oPx, oPy, 12 * baseScale, { r: 235, g: 85, b: 0 }, { r: 255, g: 240, b: 210 });

  // 2. Blue Ring (-34 deg)
  drawRotatedEllipse(-34, rx, ry, strokeW, (rxVal, ryVal, x, y) => {
    return { r: 0, g: Math.round(160 + ((x + y) / (2 * size)) * 60), b: 255, a: 0.95 };
  });

  // Blue Sphere (outer edge on left side)
  const bRad = (-34 * Math.PI) / 180;
  const bLocalX = 0;
  const bLocalY = -94 * baseScale;
  const bPx = cx + (bLocalX * Math.cos(bRad) - bLocalY * Math.sin(bRad));
  const bPy = cy + (bLocalX * Math.sin(bRad) + bLocalY * Math.cos(bRad));
  drawSphere(bPx, bPy, 12 * baseScale, { r: 0, g: 150, b: 240 }, { r: 220, g: 245, b: 255 });

  // 3. Green Ring (+50 deg)
  drawRotatedEllipse(50, rx, ry, strokeW, (rxVal, ryVal, x, y) => {
    return { r: Math.round(60 + (y / size) * 80), g: 220, b: 20, a: 0.95 };
  });

  // Green Sphere (outer edge on upper right side)
  const gRad = (50 * Math.PI) / 180;
  const gLocalX = 0;
  const gLocalY = -94 * baseScale;
  const gPx = cx + (gLocalX * Math.cos(gRad) - gLocalY * Math.sin(gRad));
  const gPy = cy + (gLocalX * Math.sin(gRad) + gLocalY * Math.cos(gRad));
  drawSphere(gPx, gPy, 12 * baseScale, { r: 60, g: 195, b: 0 }, { r: 235, g: 255, b: 215 });

  // Center Glossy Nucleus (Dark metallic core with white reflection)
  const nucleusRadius = 28 * baseScale;
  drawSphere(cx, cy, nucleusRadius, { r: 22, g: 26, b: 34 }, { r: 255, g: 255, b: 255 });

  return encode({
    width: size,
    height: size,
    data: new Uint8Array(data.buffer),
  });
}

const pubDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(pubDir)) {
  fs.mkdirSync(pubDir, { recursive: true });
}

// 1. Favicon 32x32
const png32 = renderAtomisIcon(32);
fs.writeFileSync(path.join(pubDir, 'favicon-32x32.png'), Buffer.from(png32));
console.log('✓ Generated public/favicon-32x32.png');

// 2. Apple Touch Icon 180x180
const png180 = renderAtomisIcon(180);
fs.writeFileSync(path.join(pubDir, 'apple-touch-icon.png'), Buffer.from(png180));
console.log('✓ Generated public/apple-touch-icon.png');

// 3. Atomis Icon PNG 512x512
const png512 = renderAtomisIcon(512);
fs.writeFileSync(path.join(pubDir, 'atomis-icon.png'), Buffer.from(png512));
console.log('✓ Generated public/atomis-icon.png');
