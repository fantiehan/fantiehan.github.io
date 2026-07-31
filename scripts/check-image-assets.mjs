import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const publicationsFile = join(root, 'src/content/publications.ts');
const allowedExtension = '.webp';
const maxBytes = 350 * 1024;
const defaultMaxWidth = 1200;
const defaultMaxHeight = 900;
const posterMaxWidth = 1200;
const posterMaxHeight = 2000;
const failures = [];
const source = readFileSync(publicationsFile, 'utf8');
const importedFigAssets = Array.from(source.matchAll(/from\s+["']@\/assets\/(fig|posters)\/([^"']+)["']/g)).map((match) => `${match[1]}/${match[2]}`);

function dimensions(file) {
  const output = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' });
  const width = Number(output.match(/pixelWidth:\s*(\d+)/)?.[1]);
  const height = Number(output.match(/pixelHeight:\s*(\d+)/)?.[1]);
  return { width, height };
}

for (const name of importedFigAssets) {
  const file = join(root, 'src/assets', name);
  if (!existsSync(file)) {
    failures.push(`${name} is imported but does not exist`);
    continue;
  }
  const size = statSync(file).size;
  const ext = name.slice(name.lastIndexOf('.')).toLowerCase();
  const isPoster = name.startsWith('posters/');
  const maxWidth = isPoster ? posterMaxWidth : defaultMaxWidth;
  const maxHeight = isPoster ? posterMaxHeight : defaultMaxHeight;
  if (ext !== allowedExtension) failures.push(`${name} should be ${allowedExtension}, not ${ext}`);
  if (size > maxBytes) failures.push(`${name} is ${(size / 1024).toFixed(1)} KiB, budget is 350.0 KiB`);
  const { width, height } = dimensions(file);
  if (width > maxWidth || height > maxHeight) {
    failures.push(`${name} is ${width}x${height}, budget is ${maxWidth}x${maxHeight}`);
  }
}

if (failures.length) {
  console.error('Image asset checks failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Image asset checks passed.');
