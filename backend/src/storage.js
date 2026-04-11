import { appendFile, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, '../data');

async function ensureDataDir() {
  await mkdir(dataDir, { recursive: true });
}

export async function appendJsonLine(filename, record) {
  await ensureDataDir();
  const filePath = path.join(dataDir, filename);
  await appendFile(filePath, `${JSON.stringify(record)}\n`, 'utf8');
}

export async function countJsonLines(filename) {
  try {
    const filePath = path.join(dataDir, filename);
    const content = await readFile(filePath, 'utf8');

    return content
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean).length;
  } catch {
    return 0;
  }
}
