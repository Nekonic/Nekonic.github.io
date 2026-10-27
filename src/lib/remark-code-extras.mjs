import { visit, SKIP } from 'unist-util-visit';
import { tokenizeToHtml, wrapOperators, isPlainLang, escapeHtml } from './code-tokens.mjs';

// 1) 출력 결과·text 블록: Shiki 대신 숫자·문자열만 칠한 블록으로 만든다.
// 2) 인라인 코드: 키워드·숫자·문자열·함수 호출을 칠한다.
// 3) 본문 연산자(!=, >= 등): 코드 글꼴로 보이게 감싼다. 제목은 목차 텍스트가 깨지지 않게 건너뛴다.
export default function remarkCodeExtras() {
  return (tree) => {
    visit(tree, (node, index, parent) => {
      if (!parent || index === undefined) return;
      if (node.type === 'heading') return SKIP;
      if (node.type === 'code' && isPlainLang(node.lang)) {
        const lines = node.value.split('\n').map((l) => '<span class="line">' + tokenizeToHtml(l, { keywords: false }) + '</span>');
        const lang = escapeHtml(node.lang || 'text');
        parent.children[index] = {
          type: 'html',
          value: '<pre class="astro-code plain-code" data-language="' + lang + '" tabindex="0"><code>' + lines.join('\n') + '</code></pre>',
        };
        return SKIP;
      }
      if (node.type === 'inlineCode') {
        parent.children[index] = { type: 'html', value: '<code>' + tokenizeToHtml(node.value) + '</code>' };
        return SKIP;
      }
      if (node.type === 'text') {
        const html = wrapOperators(node.value);
        if (html) parent.children[index] = { type: 'html', value: html };
      }
    });
  };
}
