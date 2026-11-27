// 이미지 뒤에 붙이는 표시: ![alt](url){center invert}
// left|right|center = 정렬, invert = 어두운 테마에서 색 반전 (투명 배경 다이어그램용)
// 기존 kramdown 표기({: .align-left}, {: .center-block :})도 받음
const TOKEN = '\\.?(?:align-)?(?:left|right|center|invert)(?:-block)?';
export const IMG_ATTR = new RegExp(`^\\{:?\\s*((?:${TOKEN}\\s*)+):?\\}`);
export const IMG_WITH_ATTR = new RegExp(`!\\[([^\\]]*)\\]\\(([^)\\s]+)\\)\\{:?\\s*((?:${TOKEN}\\s*)+):?\\}`, 'g');

/** "center invert" → "img-center img-invert" */
export function imgAttrClasses(attr) {
  return [...new Set((attr.match(/left|right|center|invert/g) || []).map((t) => `img-${t}`))].join(' ');
}
