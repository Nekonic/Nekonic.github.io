// 기존 글이 참조하는 로컬 이미지를 public/assets/images/posts/<글ID>/ 로 이전하고
// 파일명을 정규화한 뒤 글의 링크를 갱신한다.
// 첫 사용처는 git mv, 다른 글이 같은 파일을 쓰면 복사한다.
// 사용: node scripts/migrate-images.mjs [--dry]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const dry = process.argv.includes('--dry');
const blogDir = 'src/content/blog';
const pub = 'public';
const RE = /\/assets\/images\/(?:[^\s()"'<>]|\([^\s()]*\))+/g;

function normalize(name) {
  const ext = path.extname(name).toLowerCase();
  const base = path.basename(name, path.extname(name)).toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'image';
  return { base, ext };
}

const movedTo = new Map(); // 원본 경로 -> 이동된 새 경로
let changedPosts = 0;

for (const file of fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'))) {
  const fp = path.join(blogDir, file);
  const postId = file.replace(/\.md$/, '');
  const dir = path.join(pub, 'assets/images/posts', postId);
  const assigned = new Map(); // 원본 경로 -> 이 글에서의 새 경로
  const taken = new Set();
  const text = fs.readFileSync(fp, 'utf8');

  const next = text.replace(RE, (url) => {
    if (url.startsWith('/assets/images/posts/')) return url;
    const src = path.join(pub, decodeURIComponent(url));
    if (assigned.has(src)) return '/' + path.relative(pub, assigned.get(src)).split(path.sep).join('/');
    if (!fs.existsSync(src) && !movedTo.has(src)) { console.warn(`[missing] ${file}: ${url}`); return url; }

    const { base, ext } = normalize(path.basename(src));
    let dest = path.join(dir, base + ext);
    for (let i = 1; taken.has(dest); i++) dest = path.join(dir, `${base}-${i}${ext}`);
    taken.add(dest);
    assigned.set(src, dest);

    if (!dry) {
      fs.mkdirSync(dir, { recursive: true });
      if (movedTo.has(src)) fs.copyFileSync(movedTo.get(src), dest);
      else { execFileSync('git', ['mv', src, dest]); movedTo.set(src, dest); }
    }
    return '/' + path.relative(pub, dest).split(path.sep).join('/');
  });

  if (next !== text) {
    changedPosts++;
    console.log(`${dry ? '[dry] ' : ''}updated ${file}`);
    if (!dry) fs.writeFileSync(fp, next);
  }
}
console.log(`done. posts changed: ${changedPosts}`);
