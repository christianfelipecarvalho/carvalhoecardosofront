import * as THREE from 'three';
import { contrast, fbm, mix, rng } from './noise';

// Procedural canvas textures, generated once per page. Geometry UVs are in metres, so each
// texture's repeat = 1 / (metres covered by one tile).
const cache = new Map();
let scale = 1;
export function setTextureScale(value) { scale = value; }

const px = size => Math.max(128, Math.round(size * scale));
const once = (key, make) => {
  if (!cache.has(key)) cache.set(key, make());
  return cache.get(key);
};

function canvas(w, h = w) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function texture(c, tile, { srgb = true, wrap = true } = {}) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (wrap) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  if (tile) t.repeat.set(1 / tile[0], 1 / (tile[1] ?? tile[0]));
  t.anisotropy = 8;
  return t;
}

function paint(ctx, w, h, fn) {
  const img = ctx.createImageData(w, h);
  const d = img.data;
  const c = [0, 0, 0, 255];
  for (let y = 0, i = 0; y < h; y++) {
    for (let x = 0; x < w; x++, i++) {
      c[3] = 255;
      fn(x, y, i, c);
      d[i * 4] = c[0];
      d[i * 4 + 1] = c[1];
      d[i * 4 + 2] = c[2];
      d[i * 4 + 3] = c[3];
    }
  }
  ctx.putImageData(img, 0, 0);
}

// Draws fn at the tile's wrap-around offsets so marks crossing an edge continue on the other side.
function wrapped(S, x, y, r, fn) {
  for (const ox of [-S, 0, S]) {
    for (const oy of [-S, 0, S]) {
      if (x + ox + r < 0 || x + ox - r > S || y + oy + r < 0 || y + oy - r > S) continue;
      fn(x + ox, y + oy);
    }
  }
}

const rgb = (c, k = 1) => `rgb(${Math.round(c[0] * k)},${Math.round(c[1] * k)},${Math.round(c[2] * k)})`;

function noiseCanvas(S, opts) {
  const c = canvas(S);
  const n = fbm(S, S, opts);
  paint(c.getContext('2d'), S, S, (x, y, i, o) => {
    const v = contrast(n[i], 2) * 255;
    o[0] = o[1] = o[2] = v;
  });
  return c;
}

export const grassTex = () => once('grass', () => {
  const S = px(1024);
  const c = canvas(S);
  const ctx = c.getContext('2d');
  const n1 = fbm(S, S, { px: 3, octaves: 5, seed: 11 });
  const n2 = fbm(S, S, { px: 20, octaves: 3, seed: 12 });
  const r = rng(13);
  const dark = [50, 74, 27], mid = [82, 110, 40], light = [120, 140, 58];
  paint(ctx, S, S, (x, y, i, o) => {
    const t = contrast(n1[i], 2.4);
    const u = contrast(n2[i], 2);
    const k = 0.8 + r() * 0.34;
    for (let j = 0; j < 3; j++) o[j] = mix(mix(dark[j], mid[j], t), light[j], u * 0.45) * k;
  });
  const blades = [[44, 70, 24], [70, 100, 34], [104, 128, 50], [136, 146, 70], [150, 140, 84]];
  ctx.lineCap = 'round';
  for (let i = 0; i < 26000 * scale * scale; i++) {
    const x = r() * S, y = r() * S;
    const len = (2 + r() * 5) * (S / 1024) * 1.4;
    const a = r() * Math.PI * 2;
    ctx.strokeStyle = rgb(blades[Math.floor(r() * (r() < 0.93 ? 3 : 5))], 0.85 + r() * 0.3);
    ctx.globalAlpha = 0.45 + r() * 0.4;
    ctx.lineWidth = Math.max(1, S / 900);
    wrapped(S, x, y, len, (X, Y) => {
      ctx.beginPath();
      ctx.moveTo(X, Y);
      ctx.lineTo(X + Math.cos(a) * len, Y + Math.sin(a) * len);
      ctx.stroke();
    });
  }
  ctx.globalAlpha = 1;
  return texture(c, [3]);
});

// Low-frequency variation sampled at a large scale to break the lawn's tiling.
export const macroTex = () => once('macro', () => {
  const S = 256;
  const c = canvas(S);
  const n = fbm(S, S, { px: 2, octaves: 5, seed: 21 });
  const n2 = fbm(S, S, { px: 7, octaves: 3, seed: 22 });
  paint(c.getContext('2d'), S, S, (x, y, i, o) => {
    o[0] = contrast(n[i], 2.2) * 255;
    o[1] = contrast(n2[i], 2.2) * 255;
    o[2] = 128;
  });
  const t = texture(c, null, { srgb: false });
  return t;
});

export const woodTex = () => once('wood', () => {
  const S = px(512);
  const c = canvas(S);
  const g = fbm(S, S, { px: 26, py: 1.5, octaves: 4, seed: 31 });
  const f = fbm(S, S, { px: 90, py: 3, octaves: 2, seed: 32 });
  const r = rng(33);
  const a = [96, 56, 33], b = [146, 92, 58];
  paint(c.getContext('2d'), S, S, (x, y, i, o) => {
    const t = contrast(g[i], 2.4);
    const s = contrast(f[i], 2.6);
    const k = 0.9 + 0.16 * s + (r() - 0.5) * 0.06;
    for (let j = 0; j < 3; j++) o[j] = mix(a[j], b[j], t) * k;
  });
  return texture(c, [1]);
});

export const soffitTex = () => once('soffit', () => {
  const S = px(512);
  const c = canvas(S);
  const g = fbm(S, S, { px: 1.5, py: 22, octaves: 4, seed: 41 });
  const r = rng(42);
  const a = [150, 106, 66], b = [188, 142, 96];
  const boards = 16;
  paint(c.getContext('2d'), S, S, (x, y, i, o) => {
    const row = Math.floor((y / S) * boards);
    const tone = 0.9 + ((row * 7919) % 13) / 13 * 0.18;
    const edge = ((y / S) * boards) % 1 < 0.04 ? 0.55 : 1;
    const t = contrast(g[i], 2.2);
    const k = tone * edge * (0.96 + r() * 0.06);
    for (let j = 0; j < 3; j++) o[j] = mix(a[j], b[j], t) * k;
  });
  return texture(c, [2.4]);
});

export const deckTex = () => once('deck', () => {
  const S = px(1024);
  const c = canvas(S);
  const ctx = c.getContext('2d');
  const g = fbm(S, S, { px: 1.5, py: 40, octaves: 4, seed: 51 });
  const r = rng(52);
  const planks = 16;
  const tones = Array.from({ length: planks }, () => 0.82 + r() * 0.3);
  const joints = Array.from({ length: planks }, () => [r() * S, r() * S]);
  const a = [112, 76, 50], b = [160, 116, 82];
  paint(ctx, S, S, (x, y, i, o) => {
    const fy = (y / S) * planks;
    const row = Math.floor(fy);
    const gap = fy - row < 0.05 ? 0.28 : 1;
    const jx = joints[row];
    const joint = Math.min(Math.abs(x - jx[0]), Math.abs(x - jx[1])) < S / 700 ? 0.45 : 1;
    const t = contrast(g[i], 2.2);
    const k = tones[row] * gap * joint * (0.95 + r() * 0.08);
    for (let j = 0; j < 3; j++) o[j] = mix(a[j], b[j], t) * k;
  });
  return texture(c, [2.4]);
});

export const stoneTex = () => once('stone', () => {
  const S = px(1024);
  const col = canvas(S);
  const bump = canvas(S);
  const cx = col.getContext('2d');
  const bx = bump.getContext('2d');
  const r = rng(61);
  const m = S / 2.6; // px per metre (tile = 2.6 m)
  const palette = [[178, 168, 150], [164, 154, 136], [192, 182, 164], [150, 142, 128], [172, 156, 132], [140, 134, 124], [184, 170, 148], [166, 160, 150]];
  cx.fillStyle = '#4a443c';
  cx.fillRect(0, 0, S, S);
  bx.fillStyle = '#000';
  bx.fillRect(0, 0, S, S);
  const joint = Math.max(2, m * 0.008);
  let y = 0;
  while (y < S - 1) {
    let h = (0.05 + r() * 0.07) * m;
    if (S - y - h < 0.05 * m) h = S - y;
    let x = r() * S;
    const end = x + S;
    while (x < end - 1) {
      let w = (0.16 + r() * 0.4) * m;
      if (end - x - w < 0.12 * m) w = end - x;
      const base = palette[Math.floor(r() * palette.length)];
      const k = 0.86 + r() * 0.22;
      const hi = 150 + r() * 80;
      const j = () => (r() - 0.5) * joint * 1.6;
      const poly = [[x + joint + j(), y + joint + j()], [x + w - joint + j(), y + joint + j()], [x + w - joint + j(), y + h - joint + j()], [x + joint + j(), y + h - joint + j()]];
      for (const ox of [0, -S]) {
        const pts = poly.map(([a, b]) => [a + ox, b]);
        const draw = (ctx, fill) => {
          ctx.beginPath();
          pts.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b)));
          ctx.closePath();
          ctx.fillStyle = fill;
          ctx.fill();
        };
        draw(cx, rgb(base, k));
        const grad = cx.createLinearGradient(0, y, 0, y + h);
        grad.addColorStop(0, 'rgba(255,255,255,0.10)');
        grad.addColorStop(1, 'rgba(0,0,0,0.16)');
        draw(cx, grad);
        draw(bx, `rgb(${hi},${hi},${hi})`);
        const bg = bx.createLinearGradient(0, y, 0, y + h);
        bg.addColorStop(0, 'rgba(255,255,255,0.18)');
        bg.addColorStop(0.5, 'rgba(0,0,0,0)');
        bg.addColorStop(1, 'rgba(0,0,0,0.3)');
        draw(bx, bg);
      }
      x += w;
    }
    y += h;
  }
  const noise = noiseCanvas(S, { px: 18, octaves: 4, seed: 62 });
  cx.globalCompositeOperation = 'overlay';
  cx.globalAlpha = 0.3;
  cx.drawImage(noise, 0, 0);
  bx.globalCompositeOperation = 'multiply';
  bx.globalAlpha = 0.5;
  bx.drawImage(noise, 0, 0);
  return { map: texture(col, [2.6]), bump: texture(bump, [2.6], { srgb: false }) };
});

export const concreteTex = () => once('concrete', () => {
  const S = px(1024);
  const c = canvas(S);
  const ctx = c.getContext('2d');
  const grain = fbm(S, S, { px: 2, py: 60, octaves: 3, seed: 71 });
  const blot = fbm(S, S, { px: 5, octaves: 4, seed: 72 });
  const r = rng(73);
  const boards = 20;
  const tones = Array.from({ length: boards }, () => 0.96 + r() * 0.05);
  const base = [172, 170, 165];
  paint(ctx, S, S, (x, y, i, o) => {
    const fy = (y / S) * boards;
    const row = Math.floor(fy);
    const seam = fy - row < 0.03 ? 0.9 : 1;
    const g = grain[(i + row * 977) % (S * S)];
    const k = tones[row] * seam * (0.9 + 0.14 * contrast(g, 2.4)) * (0.9 + 0.16 * contrast(blot[i], 2)) * (0.97 + r() * 0.05);
    for (let j = 0; j < 3; j++) o[j] = base[j] * k;
  });
  // Form-tie holes on a 0.6 m grid.
  const step = S / 4;
  for (let gy = 0; gy < 4; gy++) {
    for (let gx = 0; gx < 4; gx++) {
      const x = gx * step + step / 2 + (gy % 2) * step / 2;
      const y = gy * step + step / 2;
      wrapped(S, x, y, 12, (X, Y) => {
        ctx.fillStyle = 'rgba(70,68,64,0.85)';
        ctx.beginPath();
        ctx.arc(X, Y, S / 220, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(120,118,112,0.5)';
        ctx.lineWidth = S / 500;
        ctx.stroke();
      });
    }
  }
  return texture(c, [2.4]);
});

export const plasterTex = () => once('plaster', () => {
  const S = px(512);
  const c = canvas(S);
  const n = fbm(S, S, { px: 6, octaves: 5, seed: 81 });
  const r = rng(82);
  paint(c.getContext('2d'), S, S, (x, y, i, o) => {
    const k = 0.95 + 0.06 * contrast(n[i], 2) + (r() - 0.5) * 0.03;
    o[0] = 238 * k;
    o[1] = 236 * k;
    o[2] = 230 * k;
  });
  return texture(c, [2]);
});

export const plateTex = () => once('plate', () => {
  const S = px(512);
  const c = canvas(S);
  const n = fbm(S, S, { px: 4, octaves: 5, seed: 91 });
  const v = fbm(S, S, { px: 1, py: 9, octaves: 3, seed: 92 });
  const r = rng(93);
  const a = [206, 192, 166], b = [232, 222, 202];
  paint(c.getContext('2d'), S, S, (x, y, i, o) => {
    const t = contrast(n[i], 2.2);
    const vein = Math.abs(v[i] - 0.5) < 0.012 ? 0.9 : 1;
    const k = vein * (0.95 + r() * 0.07);
    for (let j = 0; j < 3; j++) o[j] = mix(a[j], b[j], t) * k;
  });
  return texture(c, [1.2]);
});

export const paverTex = () => once('paver', () => {
  const S = px(512);
  const c = canvas(S);
  const n = fbm(S, S, { px: 8, octaves: 4, seed: 101 });
  const r = rng(102);
  const cells = 4;
  const tones = Array.from({ length: cells * cells }, () => 0.9 + r() * 0.14);
  paint(c.getContext('2d'), S, S, (x, y, i, o) => {
    const fx = (x / S) * cells, fy = (y / S) * cells;
    const cell = Math.floor(fy) * cells + Math.floor(fx);
    const joint = fx % 1 < 0.025 || fy % 1 < 0.025 ? 0.5 : 1;
    const k = tones[cell] * joint * (0.92 + 0.1 * contrast(n[i], 2)) * (0.96 + r() * 0.06);
    o[0] = 184 * k;
    o[1] = 180 * k;
    o[2] = 172 * k;
  });
  return texture(c, [2]);
});

export const tileTex = () => once('tile', () => {
  const S = px(512);
  const c = canvas(S);
  const r = rng(111);
  const n = 32;
  const shades = [[110, 190, 204], [90, 172, 192], [128, 204, 214], [70, 150, 176], [150, 214, 220]];
  const pick = Array.from({ length: n * n }, () => shades[Math.floor(r() * shades.length)]);
  paint(c.getContext('2d'), S, S, (x, y, i, o) => {
    const fx = (x / S) * n, fy = (y / S) * n;
    const grout = fx % 1 < 0.09 || fy % 1 < 0.09;
    const t = pick[Math.floor(fy) * n + Math.floor(fx)];
    for (let j = 0; j < 3; j++) o[j] = grout ? 214 : t[j];
  });
  return texture(c, [1]);
});

export const pebbleTex = () => once('pebble', () => {
  const S = px(512);
  const c = canvas(S);
  const ctx = c.getContext('2d');
  const r = rng(121);
  ctx.fillStyle = '#5a554e';
  ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 1500; i++) {
    const x = r() * S, y = r() * S;
    const rx = (4 + r() * 6) * (S / 512), ry = rx * (0.6 + r() * 0.35);
    const rot = r() * Math.PI;
    const g = 170 + r() * 60;
    const tint = [g, g - 4 - r() * 8, g - 10 - r() * 14];
    wrapped(S, x, y, rx, (X, Y) => {
      const grad = ctx.createRadialGradient(X - rx * 0.3, Y - ry * 0.3, 0, X, Y, rx);
      grad.addColorStop(0, rgb(tint, 1.08));
      grad.addColorStop(1, rgb(tint, 0.72));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(X, Y, rx, ry, rot, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  return texture(c, [1]);
});

export const asphaltTex = () => once('asphalt', () => {
  const S = px(512);
  const c = canvas(S);
  const n = fbm(S, S, { px: 6, octaves: 5, seed: 131 });
  const r = rng(132);
  paint(c.getContext('2d'), S, S, (x, y, i, o) => {
    const s = r();
    const k = (0.86 + 0.2 * contrast(n[i], 2)) * (s > 0.985 ? 1.6 : s < 0.02 ? 0.6 : 0.95 + r() * 0.1);
    o[0] = 64 * k;
    o[1] = 65 * k;
    o[2] = 68 * k;
  });
  return texture(c, [4]);
});

export const hedgeTex = () => once('hedge', () => {
  const S = px(512);
  const c = canvas(S);
  const ctx = c.getContext('2d');
  const r = rng(141);
  ctx.fillStyle = '#1c2c15';
  ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 3200; i++) {
    const x = r() * S, y = r() * S;
    const rx = (5 + r() * 5) * (S / 512), ry = rx * 0.45;
    const rot = r() * Math.PI;
    const t = r();
    const col = [mix(38, 104, t), mix(62, 132, t), mix(28, 56, t)];
    wrapped(S, x, y, rx, (X, Y) => {
      ctx.fillStyle = rgb(col);
      ctx.beginPath();
      ctx.ellipse(X, Y, rx, ry, rot, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  return texture(c, [1]);
});

// Leaf cluster with alpha for the tree / shrub cards.
export const leafTex = () => once('leaf', () => {
  const S = px(512);
  const c = canvas(S);
  const ctx = c.getContext('2d');
  const r = rng(151);
  for (let i = 0; i < 520; i++) {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * S * 0.44;
    const x = S / 2 + Math.cos(a) * d, y = S / 2 + Math.sin(a) * d;
    const rx = (9 + r() * 9) * (S / 512), ry = rx * (0.38 + r() * 0.12);
    const t = r() * (1 - d / (S * 0.5) * 0.5);
    const col = [mix(34, 118, t), mix(56, 142, t), mix(22, 52, t)];
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(r() * Math.PI * 2);
    ctx.fillStyle = rgb(col);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = rgb(col, 0.75);
    ctx.lineWidth = Math.max(1, S / 512);
    ctx.beginPath();
    ctx.moveTo(-rx * 0.9, 0);
    ctx.lineTo(rx * 0.9, 0);
    ctx.stroke();
    ctx.restore();
  }
  return texture(c, null, { wrap: false });
});

// Pinnate palm frond: u runs base→tip, v across with the rachis at v = 0.5.
export const frondTex = () => once('frond', () => {
  const W = px(512), H = px(256);
  const c = canvas(W, H);
  const ctx = c.getContext('2d');
  const r = rng(161);
  ctx.lineCap = 'round';
  const n = 110;
  for (let i = 0; i < n; i++) {
    const u = 0.03 + (i / n) * 0.95;
    const x = u * W;
    const len = H * 0.48 * Math.pow(Math.sin(Math.min(1, u * 1.15) * Math.PI * 0.92), 0.7) * (0.85 + r() * 0.25);
    for (const side of [-1, 1]) {
      const t = r();
      ctx.strokeStyle = rgb([mix(46, 104, t), mix(74, 132, t), mix(30, 54, t)]);
      ctx.lineWidth = Math.max(1.5, (W / 512) * (3.2 - u * 1.6));
      const ang = (0.55 + r() * 0.25) * side;
      const ex = x + Math.cos(ang) * len * 0.62;
      const ey = H / 2 + Math.sin(ang) * len;
      ctx.beginPath();
      ctx.moveTo(x, H / 2);
      ctx.quadraticCurveTo(x + len * 0.15, H / 2 + side * len * 0.55, ex, ey);
      ctx.stroke();
    }
  }
  ctx.strokeStyle = 'rgb(96,104,62)';
  ctx.lineWidth = Math.max(2, W / 200);
  ctx.beginPath();
  ctx.moveTo(0, H / 2);
  ctx.lineTo(W, H / 2);
  ctx.stroke();
  return texture(c, null, { wrap: false });
});

export const palmBarkTex = () => once('palmBark', () => {
  const S = px(256);
  const c = canvas(S);
  const n = fbm(S, S, { px: 8, py: 2, octaves: 3, seed: 171 });
  const r = rng(172);
  paint(c.getContext('2d'), S, S, (x, y, i, o) => {
    const ring = Math.pow(Math.abs(Math.sin((y / S) * Math.PI * 14)), 6);
    const k = (0.78 + 0.22 * contrast(n[i], 2)) * (1 - ring * 0.35) * (0.95 + r() * 0.08);
    o[0] = 150 * k;
    o[1] = 144 * k;
    o[2] = 132 * k;
  });
  return texture(c, [1]);
});

export const barkTex = () => once('bark', () => {
  const S = px(256);
  const c = canvas(S);
  const n = fbm(S, S, { px: 14, py: 1.5, octaves: 4, seed: 181 });
  paint(c.getContext('2d'), S, S, (x, y, i, o) => {
    const k = 0.55 + 0.55 * contrast(n[i], 2.6);
    o[0] = 104 * k;
    o[1] = 92 * k;
    o[2] = 80 * k;
  });
  return texture(c, [1]);
});

export const pvTex = () => once('pv', () => {
  const W = px(256), H = px(512);
  const c = canvas(W, H);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#b8bcc0';
  ctx.fillRect(0, 0, W, H);
  const f = W * 0.035;
  const cols = 6, rows = 10;
  const cw = (W - 2 * f) / cols, ch = (H - 2 * f) / rows;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const g = ctx.createLinearGradient(0, f + y * ch, 0, f + (y + 1) * ch);
      g.addColorStop(0, '#1d2d4c');
      g.addColorStop(1, '#14213a');
      ctx.fillStyle = g;
      ctx.fillRect(f + x * cw + 1, f + y * ch + 1, cw - 2, ch - 2);
    }
  }
  return texture(c, null, { wrap: false });
});

export const gravelTex = () => once('gravel', () => {
  const S = px(256);
  const c = canvas(S);
  const r = rng(191);
  paint(c.getContext('2d'), S, S, (x, y, i, o) => {
    const k = 0.7 + r() * 0.45;
    o[0] = 168 * k;
    o[1] = 166 * k;
    o[2] = 160 * k;
  });
  return texture(c, [1]);
});

export const waterNormalTex = () => once('waterN', () => {
  const S = 256;
  const c = canvas(S);
  const h = fbm(S, S, { px: 4, octaves: 4, gain: 0.55, seed: 201 });
  const k = 5;
  paint(c.getContext('2d'), S, S, (x, y, i, o) => {
    const dx = h[y * S + ((x + 1) % S)] - h[y * S + ((x + S - 1) % S)];
    const dy = h[((y + 1) % S) * S + x] - h[((y + S - 1) % S) * S + x];
    let nx = -dx * k * 10, ny = -dy * k * 10;
    const l = Math.hypot(nx, ny, 1);
    nx /= l;
    ny /= l;
    o[0] = (nx * 0.5 + 0.5) * 255;
    o[1] = (ny * 0.5 + 0.5) * 255;
    o[2] = (1 / l * 0.5 + 0.5) * 255;
  });
  return texture(c, [4], { srgb: false });
});
