import { cp, mkdir, readFile, writeFile, access, rm } from 'node:fs/promises';
import { resolve, join, dirname } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const files = ['index.html', 'about.html', 'styles.css', 'app.js', 'v2/index.html', 'v2/styles.css', 'v2/app.js', 'compare/index.html'];
for (const file of files) {
  const source = await readFile(join(root, file), 'utf8');
  const references = [...source.matchAll(/(?:src|href)=["']([^"'#?]+)|url\(["']?([^"')]+)|image:\s*['"]([^'"]+)/g)];
  for (const match of references) {
    const reference = match[1] || match[2] || match[3];
    if (/^(https?:|data:|mailto:)/.test(reference)) continue;
    const target = match[3] && !reference.includes('/') ? join(root, 'assets', reference) : resolve(root, dirname(file), reference);
    await access(target);
  }
}
await mkdir(join(root, 'dist'), { recursive: true });
for (const file of files) {
  await mkdir(dirname(join(root, 'dist', file)), { recursive: true });
  await cp(join(root, file), join(root, 'dist', file));
}
await cp(join(root, 'assets'), join(root, 'dist/assets'), { recursive: true, filter: source => !source.endsWith('.png') && !source.endsWith('mascot-shaved.webp') });
await rm(join(root, 'dist/assets/mascot-shaved.webp'), { force: true });
await writeFile(join(root, 'dist/.nojekyll'), '');
console.log('Built dist/ · HTML, CSS, JavaScript and all referenced assets validated.');
