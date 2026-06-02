import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const scannedRoots = ['src/core', 'src/features/generator'];
const forbiddenSnippets = [
  'Math.random',
  'console.',
  'localStorage',
  'sessionStorage',
  'indexedDB',
  'document.cookie',
  'fetch(',
  'XMLHttpRequest',
  'caches.',
];

function listSourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      return listSourceFiles(path);
    }

    if (!/\.(ts|tsx)$/u.test(entry) || /\.test\.(ts|tsx)$/u.test(entry)) {
      return [];
    }

    return [path];
  });
}

describe('security-oriented static checks', () => {
  it('does not use banned APIs in core or generator source', () => {
    const files = scannedRoots.flatMap(listSourceFiles);
    const findings = files.flatMap((file) => {
      const contents = readFileSync(file, 'utf8');
      return forbiddenSnippets
        .filter((snippet) => contents.includes(snippet))
        .map((snippet) => `${file}: ${snippet}`);
    });

    expect(findings).toEqual([]);
  });
});
