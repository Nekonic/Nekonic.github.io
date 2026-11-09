import { visit, SKIP } from 'unist-util-visit';
import { pdfEmbedHtml, isPdfUrl } from './pdf-embed-html.mjs';

// ![제목](/파일.pdf) 를 <img> 대신 빈 자리(.pdf-embed)로 바꿉니다.
// <img>로 두면 브라우저가 페이지를 열자마자 PDF 전체를 이미지로 받으려 해서, 스크립트가 뷰어로 바꿀 자리만 남깁니다.
export default function remarkPdfEmbed() {
  return (tree) => {
    visit(tree, 'image', (node, index, parent) => {
      if (!parent || index == null || !isPdfUrl(node.url)) return;
      parent.children[index] = { type: 'html', value: pdfEmbedHtml(node.url, node.alt || '') };
      return SKIP;
    });
    // 문단에 PDF 하나만 있으면 문단째 바꿔서 <p> 안에 <div>가 들어가지 않게 함
    visit(tree, 'paragraph', (node, index, parent) => {
      if (!parent || index == null || node.children.length !== 1) return;
      const only = node.children[0];
      if (only.type === 'html' && only.value.startsWith('<div class="pdf-embed"')) {
        parent.children[index] = only;
        return SKIP;
      }
    });
  };
}
