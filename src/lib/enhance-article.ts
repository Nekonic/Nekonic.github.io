import { enhancePdfs } from './pdf-embed';

/**
 * 글 본문의 코드 블록을 IDE 스타일 프레임(언어 표시 + 복사 버튼)으로, 표를 가로 스크롤 상자로 감쌉니다.
 */
export function enhanceArticle(root: ParentNode) {
  enhancePdfs(root);
  // 표는 가로로 넓으면 표 안에서만 스크롤되게 감쌈 (모바일에서 페이지가 넓어지지 않게)
  root.querySelectorAll<HTMLTableElement>('table').forEach((table) => {
    if (table.parentElement?.classList.contains('table-wrap')) return;
    const wrap = document.createElement('div');
    wrap.className = 'table-wrap';
    table.replaceWith(wrap);
    wrap.append(table);
  });
  root.querySelectorAll<HTMLPreElement>('pre').forEach((pre) => {
    if (pre.parentElement?.classList.contains('code-frame')) return;
    if (pre.closest('details')) return;

    const lang =
      pre.getAttribute('data-language') ||
      pre.querySelector('code')?.className.match(/language-(\S+)/)?.[1] ||
      'text';

    const frame = document.createElement('div');
    frame.className = 'code-frame';
    const header = document.createElement('div');
    header.className = 'code-frame-header';
    const label = document.createElement('span');
    label.textContent = lang === 'plaintext' ? 'text' : lang;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Copy';
    btn.setAttribute('aria-label', '코드 복사');
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pre.innerText);
        btn.textContent = 'Copied';
      } catch {
        btn.textContent = 'Failed';
      }
      setTimeout(() => (btn.textContent = 'Copy'), 1500);
    });
    header.append(label, btn);
    pre.replaceWith(frame);
    frame.append(header, pre);
  });
}
