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
