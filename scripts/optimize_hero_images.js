import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const photosDir = 'C:\\Users\\Mohammadreza\\Desktop\\SportivERF\\photos';
const outputDir = 'C:\\Users\\Mohammadreza\\Desktop\\SportivERF\\public\\images';

async function optimize() {
  console.log('--- Starting Hero & Partner Image Optimization ---');

  // 1. Desktop Hero Asset
  const desktopInput = fs.existsSync(path.join(photosDir, 'Desktop.webp'))
    ? path.join(photosDir, 'Desktop.webp')
    : path.join(photosDir, 'dekstop.webp');
  const desktopWebpOutput = path.join(outputDir, 'hero-bg.webp');
  const desktopJpgOutput = path.join(outputDir, 'hero-bg.jpg');

  if (fs.existsSync(desktopInput)) {
    console.log(`Processing Desktop Image: ${desktopInput}`);
    await sharp(desktopInput)
      .webp({ quality: 82, effort: 6, smartSubsample: true })
      .toFile(desktopWebpOutput);
    await sharp(desktopInput)
      .jpeg({ quality: 80, progressive: true, mozjpeg: true })
      .toFile(desktopJpgOutput);
    console.log(
      `Optimized Desktop WebP: ${(fs.statSync(desktopWebpOutput).size / 1024).toFixed(2)} KB`
    );
  }

  // 2. Mobile Hero Asset
  const mobileInput = path.join(photosDir, 'mobile.webp');
  const mobileWebpOutput = path.join(outputDir, 'hero-mobile.webp');
  const mobileJpgOutput = path.join(outputDir, 'hero-mobile.jpg');

  if (fs.existsSync(mobileInput)) {
    console.log(`\nProcessing Mobile Image: ${mobileInput}`);
    await sharp(mobileInput)
      .webp({ quality: 82, effort: 6, smartSubsample: true })
      .toFile(mobileWebpOutput);
    await sharp(mobileInput)
      .jpeg({ quality: 80, progressive: true, mozjpeg: true })
      .toFile(mobileJpgOutput);
    console.log(
      `Optimized Mobile WebP: ${(fs.statSync(mobileWebpOutput).size / 1024).toFixed(2)} KB`
    );
  }

  // 3. Ak Limosa Logo
  const aklimosaInput = path.join(photosDir, 'logobeyaz.png');
  const aklimosaOutput = path.join(outputDir, 'aklimosa-logo.webp');
  if (fs.existsSync(aklimosaInput)) {
    console.log(`\nProcessing Ak Limosa Logo: ${aklimosaInput}`);
    await sharp(aklimosaInput).webp({ quality: 90, effort: 6 }).toFile(aklimosaOutput);
    console.log(
      `Optimized Ak Limosa WebP: ${(fs.statSync(aklimosaOutput).size / 1024).toFixed(2)} KB`
    );
  }

  // 4. TÜRSAB Badge
  const tursabInput = path.join(photosDir, 'tursab-dds-13792.png');
  const tursabOutput = path.join(outputDir, 'tursab-badge.webp');
  if (fs.existsSync(tursabInput)) {
    console.log(`\nProcessing TÜRSAB Badge: ${tursabInput}`);
    await sharp(tursabInput).webp({ quality: 90, effort: 6 }).toFile(tursabOutput);
    console.log(`Optimized TÜRSAB WebP: ${(fs.statSync(tursabOutput).size / 1024).toFixed(2)} KB`);
  }

  // 5. IATA Logo
  const iataInput = path.join(photosDir, 'iatauye.jpg');
  const iataOutput = path.join(outputDir, 'iata-logo.webp');
  if (fs.existsSync(iataInput)) {
    console.log(`\nProcessing IATA Logo: ${iataInput}`);
    await sharp(iataInput).webp({ quality: 85, effort: 6 }).toFile(iataOutput);
    console.log(`Optimized IATA WebP: ${(fs.statSync(iataOutput).size / 1024).toFixed(2)} KB`);
  }

  console.log('\n--- Image Optimization Complete ---');
}

optimize().catch((err) => {
  console.error('Error optimizing images:', err);
  process.exit(1);
});
