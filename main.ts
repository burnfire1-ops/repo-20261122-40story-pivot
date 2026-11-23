// sum22 news-image entry (news-image-20261122), pivot Opsi A:
// "Geometri sum18 + saturasi R2 + banner hero R2" (1 hero + 9 kartu + 30 brief).
// The finished artwork is entry.png beside this file. This program copies
// it, byte for byte, to /output/entry.png (or $MAKEFUN_OUTPUT_DIR/entry.png
// when the grader sets that variable). It does not generate or alter the
// image, and it uses no network.
// Run: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Revision 2: after copying, verify the copy — the source must start with
// the PNG signature (89 50 4E 47 0D 0A 1A 0A), and the copy's SHA-256 must
// equal the source's SHA-256. Any mismatch throws instead of silently
// shipping a bad entry.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const here = dirname(fileURLToPath(import.meta.url));
const srcPath = join(here, 'entry.png');
const dstPath = join(outDir, 'entry.png');

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

// PNG signature bytes: 89 50 4E 47 0D 0A 1A 0A — refuse a non-PNG source.
const MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const data = readFileSync(srcPath);
if (!data.subarray(0, 8).equals(MAGIC)) {
  throw new Error('entry.png is not a PNG file');
}

mkdirSync(outDir, { recursive: true });
writeFileSync(dstPath, data);

const want = sha256(data);
const got = sha256(readFileSync(dstPath));
if (want !== got) {
  throw new Error(`copy mismatch: source sha256 ${want}, output ${got}`);
}
console.log(`entry.png copied: ${data.length} bytes -> ${dstPath} (sha256 ${got})`);
