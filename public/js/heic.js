// HEIC/HEIF(아이폰 사진)는 사파리 말고는 못 보여줘서, 올리기 전에 브라우저에서 WebP로 바꿉니다.
// 변환기(약 3MB)는 HEIC 파일을 넣을 때만 불러옵니다.
window.Heic = (function() {
  var LIB = 'https://cdn.jsdelivr.net/npm/heic-to@1.6.6/dist/iife/heic-to.js';
  var loading = null;

  function isHeic(file) {
    if (/^image\/hei[cf](-sequence)?$/i.test(file.type || '')) return true;
    // 윈도우 등에서는 형식이 비어 있거나 octet-stream으로 와서 확장자로 봅니다
    return (!file.type || file.type === 'application/octet-stream') && /\.(heic|heif)$/i.test(file.name || '');
  }

  function loadLib() {
    if (window.HeicTo) return Promise.resolve(window.HeicTo);
    if (!loading) {
      loading = new Promise(function(resolve, reject) {
        var s = document.createElement('script');
        s.src = LIB;
        s.onload = function() { window.HeicTo ? resolve(window.HeicTo) : reject(new Error('no HeicTo')); };
        s.onerror = function() { s.remove(); reject(new Error('load failed')); };
        document.head.appendChild(s);
      }).catch(function(e) { loading = null; throw e; });
    }
    return loading;
  }

  // 원본 해상도 그대로 WebP(고화질)로 저장합니다. WebP를 못 만드는 브라우저(사파리)는 JPEG로 저장합니다.
  function encode(source, w, h) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    c.getContext('2d').drawImage(source, 0, 0);
    function blobOf(type) {
      return new Promise(function(resolve) { c.toBlob(resolve, type, 0.95); });
    }
    return blobOf('image/webp').then(function(b) {
      if (b && b.type === 'image/webp') return b;
      return blobOf('image/jpeg');
    }).then(function(b) {
      c.width = c.height = 0;
      if (!b) throw new Error('toBlob failed');
      return b;
    });
  }

  // 사파리처럼 HEIC를 직접 읽을 수 있는 브라우저용 예비 경로
  function nativeDecode(file) {
    return new Promise(function(resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function() {
        encode(img, img.naturalWidth, img.naturalHeight).then(resolve, reject).finally(function() { URL.revokeObjectURL(url); });
      };
      img.onerror = function() { URL.revokeObjectURL(url); reject(new Error('decode failed')); };
      img.src = url;
    });
  }

  async function convert(file) {
    var blob;
    try {
      var heicTo = await loadLib();
      var bmp = await heicTo({ blob: file, type: 'bitmap' });
      try { blob = await encode(bmp, bmp.width, bmp.height); } finally { bmp.close && bmp.close(); }
    } catch (e) {
      blob = await nativeDecode(file);
    }
    var ext = blob.type === 'image/webp' ? '.webp' : '.jpg';
    var name = (file.name || 'image').replace(/\.(heic|heif)$/i, '') + ext;
    return new File([blob], name, { type: blob.type, lastModified: file.lastModified || Date.now() });
  }

  // 목록에서 HEIC만 WebP로 바꿔서 순서대로 돌려줍니다. 실패한 파일 이름은 failed에 담깁니다.
  async function convertFiles(files) {
    var out = [], failed = [];
    for (var f of Array.prototype.slice.call(files)) {
      if (!isHeic(f)) { out.push(f); continue; }
      try { out.push(await convert(f)); } catch (e) { failed.push(f.name || 'HEIC'); }
    }
    return { files: out, failed: failed };
  }

  return { isHeic: isHeic, convertFiles: convertFiles };
})();
