// scripts/optimize-images.mjs
import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
import { resolve, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const imagesDir = resolve(root, 'public/images');
const WIDTHS = [400, 800, 1200, 1600];

const files = (await readdir(imagesDir)).filter((f) => extname(f).toLowerCase() === '.jpg');

for (const file of files) {
  const name = basename(file, extname(file));
  const srcPath = resolve(imagesDir, file);
  const meta = await sharp(srcPath).metadata();
  const applicableWidths = WIDTHS.filter((w) => w <= (meta.width ?? Infinity));
  if (applicableWidths.length === 0) applicableWidths.push(meta.width ?? 800);

  for (const w of applicableWidths) {
    await sharp(srcPath).resize({ width: w }).jpeg({ quality: 78, mozjpeg: true })
      .toFile(resolve(imagesDir, `${name}-${w}.jpg`));
    await sharp(srcPath).resize({ width: w }).webp({ quality: 78 })
      .toFile(resolve(imagesDir, `${name}-${w}.webp`));
  }
  await sharp(srcPath).avif({ quality: 60 }).toFile(resolve(imagesDir, `${name}.avif`));
  console.log(`  ${file}: ${applicableWidths.join(', ')}w webp/jpg + full avif`);
}
console.log(`Optimized ${files.length} source images.`);
