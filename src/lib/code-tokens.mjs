// 언어 정보가 없는 짧은 코드(인라인 코드, 출력 결과·text 블록)와 본문 연산자를 위한 가벼운 토큰 색칠.
// 빌드(remark-code-extras.mjs)와 글쓰기 미리보기(write.astro)가 같이 쓴다.

const KEYWORDS = new Set((
  'if else for while do switch case default break continue return goto ' +
  'int long short char float double void bool unsigned signed const static auto ' +
  'struct class enum union typedef template typename namespace using public private protected ' +
  'virtual override new delete this nullptr NULL true false True False None null undefined ' +
  'def lambda import from as with try except catch throw finally raise pass yield async await ' +
  'fn let mut pub impl trait mod use match loop crate self Self ' +
  'var function export extends interface type in of is not and or sizeof include define'
).split(' '));

// 본문에서 코드 글꼴로 보여 줄 연산자 (긴 것부터)
const OPERATOR_RE = /(!==|===|!=|==|>=|<=|->|=>|&&|\|\||::)/;

const TOKEN_RE = /("(?:[^"\\\n]|\\.)*"|(?<![A-Za-z0-9_])'(?:[^'\\\n]|\\.)*')|(\/\/[^\n]*|(?<!\S)#(?!include|define)[^\n]*)|(\b0x[0-9a-fA-F]+\b|\b\d+(?:\.\d+)?)|([A-Za-z_][A-Za-z0-9_]*)(?=\s*\()|([A-Za-z_][A-Za-z0-9_]*)/g;

export function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * 코드 조각을 색 클래스가 붙은 HTML로 바꾼다.
 * keywords=false 이면 숫자·문자열만 칠한다 (출력 결과용).
 */
export function tokenizeToHtml(text, { keywords = true } = {}) {
  let out = '';
  let last = 0;
  TOKEN_RE.lastIndex = 0;
  let m;
  while ((m = TOKEN_RE.exec(text))) {
    const [all, str, com, num, fn, word] = m;
    let cls = null;
    if (str) cls = 'tok-str';
    else if (com) cls = keywords ? 'tok-com' : null;
    else if (num) cls = 'tok-num';
    else if (fn) cls = keywords ? (KEYWORDS.has(fn) ? 'tok-kw' : 'tok-fn') : null;
    else if (word) cls = keywords && KEYWORDS.has(word) ? 'tok-kw' : null;
    if (!cls) continue;
    out += escapeHtml(text.slice(last, m.index)) + '<span class="' + cls + '">' + escapeHtml(all) + '</span>';
    last = m.index + all.length;
  }
  return out + escapeHtml(text.slice(last));
}

/** 본문 텍스트 속 연산자를 코드 글꼴 span으로 감싼 HTML. 연산자가 없으면 null */
export function wrapOperators(text) {
  const parts = text.split(OPERATOR_RE);
  if (parts.length < 2) return null;
  return parts.map((p, i) => (i % 2 ? '<span class="op">' + escapeHtml(p) + '</span>' : escapeHtml(p))).join('');
}

/** 출력 결과·text 처럼 따로 칠할 언어가 없는 블록인지 */
export function isPlainLang(lang) {
  return !lang || /^(text|plaintext|txt|out|output|plain)$/i.test(lang);
}
