import { visit } from 'unist-util-visit';
import { IMG_ATTR, imgAttrClasses } from './image-attrs.mjs';

// ![alt](url){left|right|center invert} 표시 처리 (정렬 + 다크 테마 색 반전).
// 기존 kramdown 표기({: .align-left}, {: .center-block :})도 함께 변환한다.

export default function remarkImageAlign() {
  return (tree) => {
    visit(tree, 'paragraph', (node) => {
      const children = node.children;
      for (let i = 0; i < children.length - 1; i++) {
        const img = children[i];
        const next = children[i + 1];
        if (img.type !== 'image' || next.type !== 'text') continue;
        const m = next.value.match(IMG_ATTR);
        if (!m) continue;
        img.data = img.data || {};
        img.data.hProperties = { ...(img.data.hProperties || {}), className: imgAttrClasses(m[1]).split(' ') };
        next.value = next.value.slice(m[0].length);
      }
    });
  };
}
