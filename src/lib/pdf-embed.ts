/**
 * 본문의 PDF 자리(.pdf-embed, remark-pdf-embed가 만듦)를 글 안에서 바로 읽을 수 있는 뷰어로 바꿉니다.
 * PDF.js는 PDF가 있는 글에서만, 화면에 보일 때 불러옵니다.
 */
const PDFJS = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PdfJs = any; // CDN에서 불러오므로 타입 패키지는 두지 않음
let loading: Promise<PdfJs> | null = null;

function loadPdfJs(): Promise<PdfJs> {
  if (!loading) {
    loading = import(/* @vite-ignore */ `${PDFJS}/build/pdf.min.mjs`).then((lib: PdfJs) => {
      lib.GlobalWorkerOptions.workerSrc = `${PDFJS}/build/pdf.worker.min.mjs`;
      return lib;
    });
    loading.catch(() => (loading = null));
  }
  return loading;
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, text?: string) {
  const e = document.createElement(tag);
  e.className = cls;
  if (text) e.textContent = text;
  return e;
}

function buildViewer(src: string, title: string) {
  const name = decodeURIComponent(src.split('/').pop() || 'document.pdf');
  const frame = el('figure', 'pdf-frame');
  const header = el('div', 'pdf-frame-header');
  const label = el('span', 'pdf-frame-title', title || name);
  const info = el('span', 'pdf-frame-info', 'PDF');
  const open = el('a', 'pdf-frame-btn', '새 탭');
  open.href = src;
  open.target = '_blank';
  open.rel = 'noopener';
  const down = el('a', 'pdf-frame-btn', '다운로드');
  down.href = src;
  down.setAttribute('download', name);
  header.append(label, info, open, down);
  const pages = el('div', 'pdf-frame-pages');
  pages.append(el('p', 'pdf-frame-msg', 'PDF 불러오는 중...'));
  frame.append(header, pages);
  return { frame, pages, info };
}

async function render(src: string, pages: HTMLElement, info: HTMLElement) {
  const lib = await loadPdfJs();
  const doc = await lib.getDocument({
    url: src,
    cMapUrl: `${PDFJS}/cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `${PDFJS}/standard_fonts/`,
  }).promise;
  info.textContent = `${doc.numPages}쪽`;
  pages.replaceChildren();

  // 쪽마다 자리를 먼저 잡고, 화면에 가까워지면 그립니다
  const first = await doc.getPage(1);
  const ratio = first.getViewport({ scale: 1 }).height / first.getViewport({ scale: 1 }).width;
  const slots: HTMLDivElement[] = [];
  for (let n = 1; n <= doc.numPages; n++) {
    const slot = el('div', 'pdf-frame-page');
    slot.style.aspectRatio = String(1 / ratio);
    slot.dataset.page = String(n);
    slot.setAttribute('aria-label', `${n} / ${doc.numPages}쪽`);
    pages.append(slot);
    slots.push(slot);
  }

  const drawn = new Set<number>();
  const draw = async (slot: HTMLDivElement) => {
    const n = Number(slot.dataset.page);
    if (drawn.has(n)) return;
    drawn.add(n);
    try {
      const page = n === 1 ? first : await doc.getPage(n);
      const base = page.getViewport({ scale: 1 });
      const scale = (slot.clientWidth / base.width) * Math.min(window.devicePixelRatio || 1, 2);
      const vp = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(vp.width);
      canvas.height = Math.floor(vp.height);
      await page.render({ canvasContext: canvas.getContext('2d')!, viewport: vp }).promise;
      slot.style.aspectRatio = `${vp.width} / ${vp.height}`;
      slot.append(canvas);
    } catch {
      slot.classList.add('pdf-frame-page-error');
      slot.append(el('p', 'pdf-frame-msg', `${n}쪽을 표시하지 못했습니다.`));
    }
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); draw(e.target as HTMLDivElement); } });
  }, { root: pages, rootMargin: '600px 0px' });
  slots.forEach((s) => io.observe(s));
}

// 글쓰기 미리보기는 글자마다 다시 그려지므로, 한 번 만든 뷰어를 주소별로 다시 씁니다
const reused = new Map<string, HTMLElement>();

export function enhancePdfs(root: ParentNode, opts: { reuse?: boolean } = {}) {
  root.querySelectorAll<HTMLElement>('.pdf-embed[data-src]').forEach((target) => {
    const src = target.dataset.src || '';
    const title = target.dataset.title || '';
    const cached = opts.reuse ? reused.get(src) : undefined;
    if (cached) { target.replaceWith(cached); return; }

    const { frame, pages, info } = buildViewer(src, title);
    target.replaceWith(frame);
    if (opts.reuse) reused.set(src, frame);

    const fail = () => {
      pages.replaceChildren(el('p', 'pdf-frame-msg', 'PDF를 표시하지 못했습니다. 위의 새 탭이나 다운로드로 열어 주세요.'));
      reused.delete(src);
    };
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      render(src, pages, info).catch(fail);
    }, { rootMargin: '400px 0px' });
    io.observe(frame);
  });
}
