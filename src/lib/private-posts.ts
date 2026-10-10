/**
 * 비밀글: 메모와 같은 비공개 저장소(Nekonic.github.io.data)의 _posts/ 에 저장됩니다.
 * 사이트 빌드에는 포함되지 않고, GitHub 토큰이 있는 브라우저에서만 API로 불러옵니다.
 */
export const PRIVATE_REPO = 'Nekonic/Nekonic.github.io.data';
export const PRIVATE_DIR = '_posts';
/** 본문에서 비공개 이미지 경로를 가리키는 접두사: /_private/images/... -> _posts/images/... */
export const PRIVATE_IMG_PREFIX = '/_private/';

export interface PrivatePostMeta {
  id: string;
  title: string;
  date: string;
  categories: string[];
  tags: string[];
}

export interface PrivatePost extends PrivatePostMeta {
  body: string;
  sha: string;
}

export function getPat(): string | null {
  try {
    return localStorage.getItem('github_pat');
  } catch {
    return null;
  }
}

function api(path: string) {
  return `https://api.github.com/repos/${PRIVATE_REPO}/contents/${path}`;
}

function authHeaders(pat: string, accept = 'application/vnd.github+json') {
  return { Authorization: `Bearer ${pat}`, Accept: accept };
}

function parseList(v?: string): string[] {
  if (!v) return [];
  const t = v.trim();
  if (t.startsWith('[')) {
    return t.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
  }
  return t.replace(/^["']|["']$/g, '').split(/[\s,]+/).filter(Boolean);
}

export function parseFrontmatter(text: string, id: string) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  const fm = m ? m[1] : '';
  const body = m ? m[2].trim() : text;
  const field = (k: string) => {
    const r = fm.match(new RegExp(`^${k}\\s*:\\s*(.*)$`, 'm'));
    return r ? r[1].trim() : undefined;
  };
  const unquote = (v?: string) => (v ?? '').replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1').replace(/\\"/g, '"');
  const dateFromId = id.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] ?? '';
  return {
    meta: {
      id,
      title: unquote(field('title')) || id,
      date: (unquote(field('date')) || dateFromId).slice(0, 10),
      categories: parseList(field('categories')),
      tags: parseList(field('tags')),
    } as PrivatePostMeta,
    body,
  };
}

/** 비밀글 목록 (최신순). 토큰이 없거나 실패하면 null */
export async function listPrivatePosts(pat: string): Promise<PrivatePostMeta[] | null> {
  const res = await fetch(api(PRIVATE_DIR), { headers: authHeaders(pat) });
  if (res.status === 404) return [];
  if (!res.ok) return null;
  const files: { name: string; type: string; url: string }[] = await res.json();
  const mds = files.filter((f) => f.type === 'file' && f.name.endsWith('.md'));
  const metas = await Promise.all(
    mds.map(async (f) => {
      const r = await fetch(f.url, { headers: authHeaders(pat, 'application/vnd.github.raw') });
      if (!r.ok) return null;
      return parseFrontmatter(await r.text(), f.name.replace(/\.md$/, '')).meta;
    }),
  );
  return metas
    .filter((m): m is PrivatePostMeta => !!m)
    .sort((a, b) => (b.date + b.id).localeCompare(a.date + a.id));
}

export async function getPrivatePost(pat: string, id: string): Promise<PrivatePost | null> {
  const res = await fetch(api(`${PRIVATE_DIR}/${encodeURIComponent(id)}.md`), { headers: authHeaders(pat) });
  if (!res.ok) return null;
  const data = await res.json();
  const bytes = Uint8Array.from(atob(data.content.replace(/\n/g, '')), (c) => c.charCodeAt(0));
  const text = new TextDecoder().decode(bytes);
  const { meta, body } = parseFrontmatter(text, id);
  return { ...meta, body, sha: data.sha };
}

const imageCache = new Map<string, string>();

/** root 안의 /_private/... 이미지를 토큰으로 받아와 blob URL로 바꿉니다. */
export async function resolvePrivateImages(root: ParentNode, pat: string) {
  const imgs = Array.from(root.querySelectorAll<HTMLImageElement>(`img[src^="${PRIVATE_IMG_PREFIX}"]`));
  await Promise.all(
    imgs.map(async (img) => {
      const src = img.getAttribute('src')!;
      let url = imageCache.get(src);
      if (!url) {
        const path = `${PRIVATE_DIR}/${src.slice(PRIVATE_IMG_PREFIX.length)}`;
        const r = await fetch(api(path.split('/').map(encodeURIComponent).join('/')), {
          headers: authHeaders(pat, 'application/vnd.github.raw'),
        });
        if (!r.ok) return;
        url = URL.createObjectURL(await r.blob());
        imageCache.set(src, url);
      }
      img.src = url;
    }),
  );
}
