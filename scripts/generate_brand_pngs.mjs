import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Function to generate a simple uncompressed/deflated RGBA PNG
function createPng(width, height, getPixel) {
  const rowSize = width * 4 + 1; // 1 filter byte per row
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // Helper to make chunk
  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type);
    const typeAndData = Buffer.concat([typeBuf, data]);
    const crc = crc32(typeAndData);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // IDAT chunk
  const idatChunk = makeChunk('IDAT', deflated);

  // IEND chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// CRC32 implementation
function crc32(buf) {
  let table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

const outDir = path.resolve('public/brand');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Colors
const NAVY = [7, 26, 47, 255]; // #071A2F
const GOLD = [217, 165, 20, 255]; // #D9A514
const YELLOW = [255, 201, 40, 255]; // #FFC928
const WHITE = [255, 255, 255, 255];
const TRANSPARENT = [0, 0, 0, 0];

// 1. App Icon: 256x256 squircle with navy background and symbol
const appIconPng = createPng(256, 256, (x, y, w, h) => {
  const cx = w / 2;
  const cy = h / 2;
  const r = 56;
  const dx = Math.max(0, Math.abs(x - cx) - (cx - r));
  const dy = Math.max(0, Math.abs(y - cy) - (cy - r));
  if (dx * dx + dy * dy > r * r) return TRANSPARENT;
  
  // Center logo representation
  const nx = (x - 48) / 160;
  const ny = (y - 48) / 160;
  if (nx >= 0 && nx <= 1 && ny >= 0 && ny <= 1) {
    if (nx > 0.4 && nx < 0.9 && ny > 0.3 && ny < 0.8) {
      return GOLD;
    }
    if (nx > 0.15 && nx < 0.6 && ny > 0.15 && ny < 0.85) {
      return WHITE;
    }
    if (nx < 0.3 && ny > 0.35 && ny < 0.65) {
      return YELLOW;
    }
  }
  return NAVY;
});
fs.writeFileSync(path.join(outDir, 'togoserve-app-icon.png'), appIconPng);

// 2. Symbol: 120x120
const symbolPng = createPng(120, 120, (x, y, w, h) => {
  const nx = x / w;
  const ny = y / h;
  if (nx > 0.45 && nx < 0.9 && ny > 0.25 && ny < 0.85) return GOLD;
  if (nx > 0.18 && nx < 0.65 && ny > 0.15 && ny < 0.85) return NAVY;
  if (nx < 0.32 && ny > 0.35 && ny < 0.7) return YELLOW;
  return TRANSPARENT;
});
fs.writeFileSync(path.join(outDir, 'togoserve-symbol.png'), symbolPng);

// 3. Logo Horizontal (Light): 360x80
const horizPng = createPng(360, 80, (x, y, w, h) => {
  if (x < 75) {
    const nx = x / 75;
    const ny = y / h;
    if (nx > 0.45 && nx < 0.9 && ny > 0.25 && ny < 0.85) return GOLD;
    if (nx > 0.18 && nx < 0.65 && ny > 0.15 && ny < 0.85) return NAVY;
    if (nx < 0.32 && ny > 0.35 && ny < 0.7) return YELLOW;
    return TRANSPARENT;
  }
  if (x >= 95 && x <= 220 && y >= 25 && y <= 55) {
    if (x <= 155) return NAVY; // TOGO
    return GOLD; // SERVE
  }
  return TRANSPARENT;
});
fs.writeFileSync(path.join(outDir, 'togoserve-logo-horizontal.png'), horizPng);

// 4. Logo Dark: 360x80
const darkPng = createPng(360, 80, (x, y, w, h) => {
  if (x < 75) {
    const nx = x / 75;
    const ny = y / h;
    if (nx > 0.45 && nx < 0.9 && ny > 0.25 && ny < 0.85) return GOLD;
    if (nx > 0.18 && nx < 0.65 && ny > 0.15 && ny < 0.85) return WHITE;
    if (nx < 0.32 && ny > 0.35 && ny < 0.7) return YELLOW;
    return TRANSPARENT;
  }
  if (x >= 95 && x <= 220 && y >= 25 && y <= 55) {
    if (x <= 155) return WHITE; // TOGO
    return GOLD; // SERVE
  }
  return TRANSPARENT;
});
fs.writeFileSync(path.join(outDir, 'togoserve-logo-dark.png'), darkPng);

// 5. Logo Stacked: 200x200
const stackedPng = createPng(200, 200, (x, y, w, h) => {
  if (y < 110) {
    const nx = (x - 50) / 100;
    const ny = (y - 15) / 90;
    if (nx >= 0 && nx <= 1 && ny >= 0 && ny <= 1) {
      if (nx > 0.45 && nx < 0.9 && ny > 0.25 && ny < 0.85) return GOLD;
      if (nx > 0.18 && nx < 0.65 && ny > 0.15 && ny < 0.85) return NAVY;
      if (nx < 0.32 && ny > 0.35 && ny < 0.7) return YELLOW;
    }
  } else if (y >= 120 && y <= 155 && x >= 30 && x <= 170) {
    if (x <= 95) return NAVY;
    return GOLD;
  }
  return TRANSPARENT;
});
fs.writeFileSync(path.join(outDir, 'togoserve-logo-stacked.png'), stackedPng);

console.log('Successfully generated official TOGOSERVE brand PNG assets in /public/brand/');
