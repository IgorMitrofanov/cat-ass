import { cp, mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const files = ['index.html', 'about.html', 'styles.css', 'app.js'];
for (const file of files) {
  const source = await readFile(join(root, file), 'utf8');
  const references = [...source.matchAll(/(?:src|href)=["']([^"'#?]+)|url\(["']?([^"')]+)|image:\s*['"]([^'"]+)/g)].map(match => match[1] || match[2] || `assets/${match[3]}`);
  for (const reference of references) {
    if (/^(https?:|data:|\.\/)/.test(reference)) continue;
    await access(join(root, reference));
  }
}
await mkdir(join(root, 'dist'), { recursive: true });
for (const file of files) await cp(join(root, file), join(root, 'dist', file));
await cp(join(root, 'assets'), join(root, 'dist/assets'), { recursive: true, filter: source => !source.endsWith('.png') });
await writeFile(join(root, 'dist/.nojekyll'), '');
console.log('Built dist/ · HTML, CSS, JavaScript and all referenced assets validated.');
