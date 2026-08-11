/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

import en from '../src/i18n/translations/en';
import tr from '../src/i18n/translations/tr';
import fa from '../src/i18n/translations/fa';

console.log('====================================================');
console.log('🚀 SPORTIVERF Production Compliance & Health Audit');
console.log('====================================================\n');

let totalErrors = 0;

function logPass(msg: string): void {
  console.log(`  [PASS] ${msg}`);
}

function logFail(msg: string): void {
  console.error(`  ❌ [FAIL] ${msg}`);
  totalErrors++;
}

interface CampLocalizedMap {
  en?: string | string[];
  tr?: string | string[];
  fa?: string | string[];
  [key: string]: unknown;
}

interface CampItem {
  id?: string;
  slug?: string;
  sport?: string;
  starRating?: number;
  starTier?: string;
  priceModel?: string;
  priceOnRequest?: boolean;
  tierName?: CampLocalizedMap;
  title?: CampLocalizedMap;
  location?: CampLocalizedMap;
  dates?: CampLocalizedMap;
  ageGroup?: CampLocalizedMap;
  capacity?: CampLocalizedMap;
  imageUrl?: string;
  summary?: CampLocalizedMap;
  includedServices?: CampLocalizedMap;
  [key: string]: unknown;
}

// -----------------------------------------------------------------------------
// 1. Data Integrity Audit: src/data/camps.json
// -----------------------------------------------------------------------------
console.log('📌 1. Verifying Camp Data Store Integrity (src/data/camps.json)...');

const campsFilePath = path.resolve(process.cwd(), 'src/data/camps.json');
if (!fs.existsSync(campsFilePath)) {
  logFail(`src/data/camps.json file not found at ${campsFilePath}`);
} else {
  try {
    const rawCamps = fs.readFileSync(campsFilePath, 'utf-8');
    const camps = JSON.parse(rawCamps) as CampItem[];

    if (!Array.isArray(camps) || camps.length === 0) {
      logFail('camps.json is empty or not an array');
    } else {
      logPass(`Found ${camps.length} camps in dataset.`);

      const requiredLocales = ['en', 'tr', 'fa'];
      const requiredFields: (keyof CampItem)[] = [
        'id',
        'slug',
        'sport',
        'starRating',
        'starTier',
        'priceModel',
        'priceOnRequest',
        'tierName',
        'title',
        'location',
        'dates',
        'ageGroup',
        'capacity',
        'imageUrl',
        'summary',
        'includedServices'
      ];

      const slugSet = new Set<string>();

      camps.forEach((camp: CampItem, index: number) => {
        const campId = camp.id || `index-${index}`;

        // Check required top-level fields
        requiredFields.forEach((field) => {
          if (camp[field] === undefined || camp[field] === null) {
            logFail(`Camp '${campId}' missing required field: '${String(field)}'`);
          }
        });

        // Slug uniqueness check
        if (camp.slug) {
          if (slugSet.has(camp.slug)) {
            logFail(`Duplicate camp slug detected: '${camp.slug}'`);
          } else {
            slugSet.add(camp.slug);
          }
        }

        // Multilingual object field validation
        const localizedFields: (keyof CampItem)[] = [
          'tierName',
          'title',
          'location',
          'dates',
          'ageGroup',
          'capacity',
          'summary'
        ];

        localizedFields.forEach((field) => {
          const val = camp[field];
          if (val && typeof val === 'object') {
            requiredLocales.forEach((loc) => {
              if (!val[loc] || typeof val[loc] !== 'string') {
                logFail(
                  `Camp '${campId}' field '${String(field)}' missing translation for locale '${loc}'`
                );
              }
            });
          }
        });

        // Multilingual includedServices validation
        if (camp.includedServices && typeof camp.includedServices === 'object') {
          requiredLocales.forEach((loc) => {
            const list = camp.includedServices?.[loc];
            if (!Array.isArray(list) || list.length === 0) {
              logFail(`Camp '${campId}' includedServices missing array for locale '${loc}'`);
            }
          });
        }
      });

      if (totalErrors === 0) {
        logPass('All camps passed data integrity and multi-language key validation!');
      }
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    logFail(`Failed to parse src/data/camps.json: ${errorMsg}`);
  }
}

console.log('');

// -----------------------------------------------------------------------------
// 2. Environment Schema Audit: .env.example
// -----------------------------------------------------------------------------
console.log('📌 2. Verifying Environment Schema against .env.example...');

const envExamplePath = path.resolve(process.cwd(), '.env.example');
if (!fs.existsSync(envExamplePath)) {
  logFail('.env.example file not found.');
} else {
  const envContent = fs.readFileSync(envExamplePath, 'utf-8');
  const envKeys = envContent
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => line.split('=')[0].trim());

  logPass(`Parsed ${envKeys.length} template keys from .env.example: ${envKeys.join(', ')}`);

  // Zod schema for environment configuration
  const EnvSchema = z.object({
    PUBLIC_SITE_URL: z.string().url(),
    PUBLIC_DEFAULT_LOCALE: z.enum(['en', 'tr', 'fa']),
    PUBLIC_API_BASE_URL: z.string().url().optional(),
    PUBLIC_API_TIMEOUT_MS: z.string().optional(),
    PUBLIC_CMS_PROVIDER: z.string().optional(),
    PUBLIC_CMS_URL: z.string().url().optional(),
    PUBLIC_BOOKING_SERVICE_URL: z.string().url().optional()
  });

  // Mock template object built from .env.example lines for schema validation test
  const sampleEnvObj: Record<string, string> = {};
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valParts] = trimmed.split('=');
      if (key) {
        sampleEnvObj[key.trim()] = valParts.join('=').trim();
      }
    }
  });

  const parsedEnv = EnvSchema.safeParse(sampleEnvObj);
  if (!parsedEnv.success) {
    logFail(`.env.example schema validation failed: ${parsedEnv.error.message}`);
  } else {
    logPass('.env.example schema validation passed successfully!');
  }
}

console.log('');

// -----------------------------------------------------------------------------
// 3. Translation Dictionary Key Parity Audit
// -----------------------------------------------------------------------------
console.log('📌 3. Verifying Translation Dictionary Parity across [en, tr, fa]...');

function getObjectKeyPaths(obj: Record<string, unknown>, prefix = ''): string[] {
  let keys: string[] = [];
  for (const k in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      const pathKey = prefix ? `${prefix}.${k}` : k;
      const val = obj[k];
      if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        keys = keys.concat(getObjectKeyPaths(val as Record<string, unknown>, pathKey));
      } else {
        keys.push(pathKey);
      }
    }
  }
  return keys;
}

const enKeys = getObjectKeyPaths(en as unknown as Record<string, unknown>);
const trKeys = new Set(getObjectKeyPaths(tr as unknown as Record<string, unknown>));
const faKeys = new Set(getObjectKeyPaths(fa as unknown as Record<string, unknown>));

logPass(`Base English dictionary contains ${enKeys.length} translation keys.`);

let missingTr = 0;
let missingFa = 0;

enKeys.forEach((key) => {
  if (!trKeys.has(key)) {
    logFail(`Missing Turkish translation for key: '${key}'`);
    missingTr++;
  }
  if (!faKeys.has(key)) {
    logFail(`Missing Persian translation for key: '${key}'`);
    missingFa++;
  }
});

if (missingTr === 0 && missingFa === 0) {
  logPass('100% translation key parity verified across English, Turkish, and Persian dictionaries!');
}

console.log('');

// -----------------------------------------------------------------------------
// 4. Codebase Relative Import Validator
// -----------------------------------------------------------------------------
console.log('📌 4. Scanning Codebase for Broken Relative Imports...');

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.astro' && file !== 'dist') {
        getAllFiles(fullPath, arrayOfFiles);
      }
    } else if (/\.(ts|tsx|js|mjs|astro)$/.test(file)) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

const srcDir = path.resolve(process.cwd(), 'src');
const srcFiles = getAllFiles(srcDir);
logPass(`Scanning ${srcFiles.length} source files in src/ for import validity...`);

const importRegex = /(?:import|export)\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
const dynamicImportRegex = /import\(['"]([^'"]+)['"]\)/g;

let brokenImportsCount = 0;

function resolveImportPath(sourceFile: string, importPath: string): boolean {
  // Ignore bare package imports like 'astro', 'react', 'zod', etc.
  if (!importPath.startsWith('.') && !importPath.startsWith('@/')) {
    return true;
  }

  let targetPath = '';
  if (importPath.startsWith('@/')) {
    targetPath = path.resolve(srcDir, importPath.slice(2));
  } else {
    targetPath = path.resolve(path.dirname(sourceFile), importPath);
  }

  const extensions = ['', '.ts', '.tsx', '.astro', '.js', '.mjs', '.json'];
  for (const ext of extensions) {
    const candidate = targetPath + ext;
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return true;
    }
  }

  // Check directory index files
  for (const ext of ['.ts', '.tsx', '.astro', '.js']) {
    const candidate = path.join(targetPath, `index${ext}`);
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return true;
    }
  }

  return false;
}

srcFiles.forEach((filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  let match: RegExpExecArray | null;

  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (!resolveImportPath(filePath, importPath)) {
      const relativeSource = path.relative(process.cwd(), filePath);
      logFail(`Broken import '${importPath}' in [${relativeSource}]`);
      brokenImportsCount++;
    }
  }

  while ((match = dynamicImportRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (!resolveImportPath(filePath, importPath)) {
      const relativeSource = path.relative(process.cwd(), filePath);
      logFail(`Broken dynamic import '${importPath}' in [${relativeSource}]`);
      brokenImportsCount++;
    }
  }
});

if (brokenImportsCount === 0) {
  logPass('Zero broken relative imports found across all source files!');
}

console.log('\n====================================================');
if (totalErrors > 0) {
  console.error(`❌ Audit Failed with ${totalErrors} compliance error(s).`);
  process.exit(1);
} else {
  console.log('✅ All Compliance Checks Passed Successfully!');
  process.exit(0);
}
