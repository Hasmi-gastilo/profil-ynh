// image-position-editor.js
// Komponen reusable: drag-to-reposition + scroll/pinch-to-zoom
// Dipakai di form admin untuk atur posisi & zoom foto
//
// Cara pakai:
//   import { createImagePositionEditor } from './image-position-editor.js';
//   const editor = createImagePositionEditor(containerEl, { aspectRatio: '1/1' });
//   editor.loadImage(src, savedPos);   // tampilkan foto + restore posisi lama
//   const pos = editor.getPosition();  // { x, y, scale }

export function createImagePositionEditor(container, options = {}) {
  const {
    aspectRatio = '1/1',    // '1/1' untuk bulat/persegi, '16/9' untuk landscape
    shape = 'square',       // 'circle' untuk bulat, 'square' untuk kotak
    minScale = 0.5,
    maxScale = 4,
  } = options;

  // ── Render HTML editor ────────────────────────────────
  container.innerHTML = `
    <div class="ipe-wrapper" id="ipeWrapper" style="display:none;">
      <div class="ipe-label">
        <i class="fas fa-hand-paper"></i>
        Geser foto untuk atur posisi · Scroll / cubit untuk zoom
      </div>
      <div class="ipe-viewport ${shape === 'circle' ? 'ipe-circle' : ''}"
           id="ipeViewport"
           style="aspect-ratio:${aspectRatio};">
        <img id="ipeImg" draggable="false" />
        <div class="ipe-crosshair"></div>
      </div>
      <div class="ipe-controls">
        <button type="button" class="ipe-btn" id="ipeZoomOut" title="Zoom out">
          <i class="fas fa-search-minus"></i>
        </button>
        <div class="ipe-zoom-label" id="ipeZoomLabel">100%</div>
        <button type="button" class="ipe-btn" id="ipeZoomIn" title="Zoom in">
          <i class="fas fa-search-plus"></i>
        </button>
        <button type="button" class="ipe-btn ipe-btn-reset" id="ipeReset" title="Reset">
          <i class="fas fa-undo"></i> Reset
        </button>
      </div>
    </div>
  `;

  const wrapper   = container.querySelector('#ipeWrapper');
  const viewport  = container.querySelector('#ipeViewport');
  const img       = container.querySelector('#ipeImg');
  const zoomLabel = container.querySelector('#ipeZoomLabel');

  // State
  let posX = 50, posY = 50, scale = 1;
  let isDragging = false;
  let startX = 0, startY = 0;
  let lastPosX = 50, lastPosY = 50;

  // ── Render image transform ────────────────────────────
  function applyTransform() {
    // objectPosition tidak bisa di-scale via CSS, kita pakai transform pada img
    // Viewport adalah "kaca pembesar", img diperbesar dan digeser di dalamnya
    img.style.transform = `translate(-50%, -50%) scale(${scale})`;
    img.style.left = posX + '%';
    img.style.top  = posY + '%';
    zoomLabel.textContent = Math.round(scale * 100) + '%';
  }

  function clamp(val, min, max) { return Math.min(max, Math.max(min, val)); }

  // ── Pixel offset → percentage position ───────────────
  function pxToPercent(dx, dy) {
    const vw = viewport.offsetWidth;
    const vh = viewport.offsetHeight;
    posX = clamp(lastPosX + (dx / vw) * 100 * (1 / scale) * -1, 0, 100);
    posY = clamp(lastPosY + (dy / vh) * 100 * (1 / scale) * -1, 0, 100);
    applyTransform();
  }

  // ── MOUSE drag ────────────────────────────────────────
  viewport.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    lastPosX = posX;
    lastPosY = posY;
    viewport.style.cursor = 'grabbing';
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    pxToPercent(e.clientX - startX, e.clientY - startY);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    viewport.style.cursor = 'grab';
  });

  // ── TOUCH drag (single finger) ────────────────────────
  let lastTouchX = 0, lastTouchY = 0;
  let pinchStartDist = 0, pinchStartScale = 1;

  viewport.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      lastTouchX = e.touches[0].clientX;
      lastTouchY = e.touches[0].clientY;
      lastPosX = posX;
      lastPosY = posY;
      startX = lastTouchX;
      startY = lastTouchY;
    } else if (e.touches.length === 2) {
      isDragging = false;
      pinchStartDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchStartScale = scale;
    }
    e.preventDefault();
  }, { passive: false });

  viewport.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && isDragging) {
      pxToPercent(
        e.touches[0].clientX - startX,
        e.touches[0].clientY - startY
      );
    } else if (e.touches.length === 2) {
      // Pinch to zoom
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      scale = clamp(pinchStartScale * (dist / pinchStartDist), minScale, maxScale);
      applyTransform();
    }
    e.preventDefault();
  }, { passive: false });

  viewport.addEventListener('touchend', () => { isDragging = false; });

  // ── SCROLL to zoom ────────────────────────────────────
  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    scale = clamp(scale + delta, minScale, maxScale);
    applyTransform();
  }, { passive: false });

  // ── Button controls ───────────────────────────────────
  container.querySelector('#ipeZoomIn').onclick = () => {
    scale = clamp(scale + 0.15, minScale, maxScale);
    applyTransform();
  };
  container.querySelector('#ipeZoomOut').onclick = () => {
    scale = clamp(scale - 0.15, minScale, maxScale);
    applyTransform();
  };
  container.querySelector('#ipeReset').onclick = () => {
    posX = 50; posY = 50; scale = 1;
    applyTransform();
  };

  // ── Public API ────────────────────────────────────────

  /** Tampilkan foto di editor. pos = {x, y, scale} dari data tersimpan */
  function loadImage(src, pos = null) {
    if (!src) { wrapper.style.display = 'none'; return; }
    img.src = src;
    posX   = pos?.x     ?? 50;
    posY   = pos?.y     ?? 50;
    scale  = pos?.scale ?? 1;
    wrapper.style.display = '';
    applyTransform();
  }

  /** Kembalikan posisi saat ini */
  function getPosition() {
    return { x: Math.round(posX * 10) / 10, y: Math.round(posY * 10) / 10, scale: Math.round(scale * 100) / 100 };
  }

  /** Sembunyikan editor */
  function hide() { wrapper.style.display = 'none'; }

  return { loadImage, getPosition, hide };
}

/**
 * Konversi posisi editor → CSS objectPosition string
 * Bisa dipakai di img/div style="object-position: X% Y%"
 */
export function positionToCSS(pos) {
  if (!pos) return '50% 50%';
  return `${pos.x}% ${pos.y}%`;
}
