import { visit } from 'unist-util-visit';

// ![alt](url){left|right|center} 정렬 문법 처리.
// 기존 kramdown 표기({: .align-left}, {: .center-block :})도 함께 변환한다.
const ATTR = /^\{:?\s*\.?(?:align-)?(left|right|center)(?:-block)?\s*:?\}/;

export default function remarkImageAlign() {
  return (tree) => {
    visit(tree, 'paragraph', (node) => {
      const children = node.children;
      for (let i = 0; i < children.length - 1; i++) {
        const img = children[i];
        const next = children[i + 1];
        if (img.type !== 'image' || next.type !== 'text') continue;
        const m = next.value.match(ATTR);
        if (!m) continue;
        img.data = img.data || {};
        img.data.hProperties = { ...(img.data.hProperties || {}), className: [`img-${m[1]}`] };
        next.value = next.value.slice(m[0].length);
      }
    });
  };
}
