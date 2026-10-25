// Deterministic random + tileable value-noise fBm used to paint the procedural textures.
export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Returns a Float32Array (w*h) in ~[0,1] that tiles seamlessly; px/py = lattice cells of the first octave.
export function fbm(w, h, { px = 4, py = px, octaves = 4, gain = 0.5, seed = 1 } = {}) {
  const out = new Float32Array(w * h);
  const rand = rng(seed);
  let amp = 1;
  let total = 0;
  for (let o = 0; o < octaves; o++) {
    const cx = Math.max(1, Math.round(px * 2 ** o));
    const cy = Math.max(1, Math.round(py * 2 ** o));
    const lat = new Float32Array(cx * cy);
    for (let i = 0; i < lat.length; i++) lat[i] = rand();
    for (let y = 0; y < h; y++) {
      const fy = (y / h) * cy;
      const y0 = Math.floor(fy);
      let ty = fy - y0;
      ty = ty * ty * (3 - 2 * ty);
      const r0 = (y0 % cy) * cx;
      const r1 = ((y0 + 1) % cy) * cx;
      for (let x = 0; x < w; x++) {
        const fx = (x / w) * cx;
        const x0 = Math.floor(fx);
        let tx = fx - x0;
        tx = tx * tx * (3 - 2 * tx);
        const c0 = x0 % cx;
        const c1 = (x0 + 1) % cx;
        const a = lat[r0 + c0];
        const b = lat[r0 + c1];
        const c = lat[r1 + c0];
        const d = lat[r1 + c1];
        out[y * w + x] += amp * (a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty);
      }
    }
    total += amp;
    amp *= gain;
  }
  for (let i = 0; i < out.length; i++) out[i] /= total;
  return out;
}

// Stretches the narrow value-noise distribution around 0.5 to roughly fill [0,1].
export const contrast = (v, k = 2.2) => Math.min(1, Math.max(0, (v - 0.5) * k + 0.5));

export const mix = (a, b, t) => a + (b - a) * t;
