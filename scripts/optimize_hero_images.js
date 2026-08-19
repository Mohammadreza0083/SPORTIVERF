import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const photosDir = 'C:\\Users\\Mohammadreza\\Desktop\\SportivERF\\photos';
const outputDir = 'C:\\Users\\Mohammadreza\\Desktop\\SportivERF\\public\\images';

async function optimize() {
  console.log('--- Starting Hero Image Optimization ---');

  // Desktop Asset
  const desktopInput = fs.existsSync(path.join(photosDir, 'Desktop.webp'))
    ? path.join(photosDir, 'Desktop.webp')
    : path.join(photosDir, 'dekstop.webp');
  const desktopWebpOutput = path.join(outputDir, 'hero-bg.webp');
  const desktopJpgOutput = path.join(outputDir, 'hero-bg.jpg');

  console.log(`Processing Desktop Image: ${desktopInput}`);
  const desktopMetadata = await sharp(desktopInput).metadata();
  console.log(
    `Original Desktop Dimensions: ${desktopMetadata.width}x${desktopMetadata.height}, Size: ${(fs.statSync(desktopInput).size / 1024).toFixed(2)} KB`
  );

  await sharp(desktopInput)
    .webp({ quality: 82, effort: 6, smartSubsample: true })
    .toFile(desktopWebpOutput);

  await sharp(desktopInput)
    .jpeg({ quality: 80, progressive: true, mozjpeg: true })
    .toFile(desktopJpgOutput);

  const desktopWebpStats = fs.statSync(desktopWebpOutput);
  const desktopJpgStats = fs.statSync(desktopJpgOutput);
  console.log(
    `Optimized Desktop WebP: ${(desktopWebpStats.size / 1024).toFixed(2)} KB (${desktopWebpOutput})`
  );
  console.log(
    `Optimized Desktop JPG Fallback: ${(desktopJpgStats.size / 1024).toFixed(2)} KB (${desktopJpgOutput})`
  );

  // Mobile Asset
  const mobileInput = path.join(photosDir, 'mobile.webp');
  const mobileWebpOutput = path.join(outputDir, 'hero-mobile.webp');
  const mobileJpgOutput = path.join(outputDir, 'hero-mobile.jpg');

  console.log(`\nProcessing Mobile Image: ${mobileInput}`);
  const mobileMetadata = await sharp(mobileInput).metadata();
  console.log(
    `Original Mobile Dimensions: ${mobileMetadata.width}x${mobileMetadata.height}, Size: ${(fs.statSync(mobileInput).size / 1024).toFixed(2)} KB`
  );

  await sharp(mobileInput)
    .webp({ quality: 82, effort: 6, smartSubsample: true })
    .toFile(mobileWebpOutput);

  await sharp(mobileInput)
    .jpeg({ quality: 80, progressive: true, mozjpeg: true })
    .toFile(mobileJpgOutput);

  const mobileWebpStats = fs.statSync(mobileWebpOutput);
  const mobileJpgStats = fs.statSync(mobileJpgOutput);
  console.log(
    `Optimized Mobile WebP: ${(mobileWebpStats.size / 1024).toFixed(2)} KB (${mobileWebpOutput})`
  );
  console.log(
    `Optimized Mobile JPG Fallback: ${(mobileJpgStats.size / 1024).toFixed(2)} KB (${mobileJpgOutput})`
  );

  console.log('\n--- Hero Image Optimization Complete ---');
}

optimize().catch((err) => {
  console.error('Error optimizing images:', err);
  process.exit(1);
});
