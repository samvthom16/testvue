import sharp from 'sharp'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const iconsDir = resolve(root, 'public/img/icons')

const regularSvg = readFileSync(resolve(iconsDir, 'icon-master.svg'))
const maskableSvg = readFileSync(resolve(iconsDir, 'icon-master-maskable.svg'))

const icons = [
  { file: 'favicon-16x16.png', size: 16, maskable: false },
  { file: 'favicon-32x32.png', size: 32, maskable: false },
  { file: 'apple-touch-icon-60x60.png', size: 60, maskable: false },
  { file: 'apple-touch-icon-76x76.png', size: 76, maskable: false },
  { file: 'apple-touch-icon-120x120.png', size: 120, maskable: false },
  { file: 'apple-touch-icon-152x152.png', size: 152, maskable: false },
  { file: 'apple-touch-icon-180x180.png', size: 180, maskable: false },
  { file: 'apple-touch-icon.png', size: 180, maskable: false },
  { file: 'android-chrome-192x192.png', size: 192, maskable: false },
  { file: 'android-chrome-512x512.png', size: 512, maskable: false },
  { file: 'android-chrome-maskable-192x192.png', size: 192, maskable: true },
  { file: 'android-chrome-maskable-512x512.png', size: 512, maskable: true },
  { file: 'msapplication-icon-144x144.png', size: 144, maskable: false },
  { file: 'mstile-150x150.png', size: 150, maskable: false },
]

for (const { file, size, maskable } of icons) {
  const svg = maskable ? maskableSvg : regularSvg
  await sharp(svg).resize(size, size).png().toFile(resolve(iconsDir, file))
  console.log(`✓ ${file} (${size}x${size})`)
}

console.log('\nAll icons generated.')
