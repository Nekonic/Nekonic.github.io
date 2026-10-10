/**
 * 글 본문의 코드 블록을 IDE 스타일 프레임(언어 표시 + 복사 버튼)으로 감쌉니다.
 */
export function enhanceArticle(root: ParentNode) {
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
