// 빌드(remark)와 브라우저(비밀글·글쓰기 미리보기)가 같이 쓰는 PDF 자리 표시 HTML
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const isPdfUrl = (url) => /\.pdf(?:[?#]|$)/i.test(url || '');

export const pdfEmbedHtml = (url, title) =>
  `<div class="pdf-embed" data-src="${esc(url)}" data-title="${esc(title)}"></div>`;

// 마크다운 문자열 안의 ![제목](x.pdf) 를 자리 표시로 바꿉니다 (marked로 그리기 전에 사용)
export const pdfMarkdownToHtml = (md) =>
  md.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, alt, url) => (isPdfUrl(url) ? pdfEmbedHtml(url, alt) : m));
