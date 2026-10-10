/**
 * 파일명(id)에서 날짜를 추출합니다.
 * 예: "2024-10-14-Reverse_Proxy" -> Date("2024-10-14")
 */
export function getDateFromId(id: string, frontmatterDate?: Date): Date {
  if (frontmatterDate) return frontmatterDate;
  
  const match = id.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (match) {
    return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
  }
  return new Date();
}

/**
 * 날짜를 한국어 형식으로 포맷합니다.
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * categories/tags 문자열 또는 배열을 배열로 통일합니다.
 */
export function toArray(value?: string | string[]): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value.split(/\s+/).filter(Boolean);
}

/**
 * 카테고리별 색상 (JetBrains 프로젝트 아이콘 스타일).
 * 같은 이름은 항상 같은 색이 나오도록 이름을 해시합니다.
 */
const CATEGORY_PALETTE = [
  { tile: '#b4582e', chipBg: '#3d2a1f', chipText: '#e8a27a' },
  { tile: '#3b67b8', chipBg: '#1f2d45', chipText: '#8cb4f0' },
  { tile: '#a23f5c', chipBg: '#3a1f29', chipText: '#e88aa6' },
  { tile: '#6a55b0', chipBg: '#2a2443', chipText: '#b5a6ec' },
  { tile: '#2f7a5e', chipBg: '#1d3329', chipText: '#7fcba4' },
  { tile: '#7a6420', chipBg: '#33301a', chipText: '#d6c47a' },
];

export function categoryStyle(name?: string) {
  if (!name) return { tile: '#4e5157', chipBg: '#2b2d30', chipText: '#bcbec4' };
  let h = 0;
  for (const ch of name.toLowerCase()) h = (h * 31 + ch.codePointAt(0)!) >>> 0;
  return CATEGORY_PALETTE[h % CATEGORY_PALETTE.length];
}

/**
 * 카테고리 이니셜 ("Incident Report" -> "IR", "Linux" -> "LI").
 */
export function initials(name?: string): string {
  if (!name) return '··';
  const words = name.split(/[\s_-]+/).filter(Boolean);
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

/**
 * YYYY-MM-DD
 */
export function isoDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * 읽는 데 걸리는 시간 (분). 한글 기준 분당 약 500자.
 */
export function readingMinutes(body = ''): number {
  const prose = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<details[\s\S]*?<\/details>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/!?\[[^\]]*\]\([^)]*\)/g, '');
  return Math.max(1, Math.round(prose.length / 500));
}
