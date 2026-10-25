import * as THREE from 'three';
import { A, B, GRID_X, GRID_Z, PALMS, POOL, TREES, U } from './shared';

// A technical drawing on the ground, drawn like a pen: every vertex carries the moment (0–1)
// it is reached, so a single uniform animates the whole plan.
class Pen {
  constructor() { this.groups = []; }

  group(t0, t1) {
    const g = { t0, t1, segs: [], fills: [], length: 0 };
    this.groups.push(g);
    this.current = g;
    return this;
  }

  line(points, w = 0.03, weight = 1, closed = false) {
    const g = this.current;
    const pts = closed ? [...points, points[0]] : points;
    for (let i = 0; i < pts.length - 1; i++) {
      const [a, b] = [pts[i], pts[i + 1]];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      g.segs.push({ a, b, w, weight, s0: g.length, s1: g.length + len });
      g.length += len;
    }
    return this;
  }

  rect([x0, x1], [z0, z1], w, weight, fill = 0) {
    this.line([[x0, z0], [x1, z0], [x1, z1], [x0, z1]], w, weight, true);
    if (fill) this.current.fills.push({ pts: [[x0, z0], [x1, z0], [x1, z1], [x0, z1]], weight: fill, s: this.current.length });
    return this;
  }

  dashed(a, b, w = 0.02, weight = 0.7, dash = 0.6, gap = 0.3) {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    for (let s = 0; s < len; s += dash + gap) {
      const e = Math.min(len, s + dash);
      this.line([[a[0] + ((b[0] - a[0]) * s) / len, a[1] + ((b[1] - a[1]) * s) / len], [a[0] + ((b[0] - a[0]) * e) / len, a[1] + ((b[1] - a[1]) * e) / len]], w, weight);
    }
    return this;
  }

  arc([cx, cz], r, from, to, w = 0.02, weight = 0.8, steps = 14) {
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const a = from + ((to - from) * i) / steps;
      pts.push([cx + Math.cos(a) * r, cz + Math.sin(a) * r]);
    }
    return this.line(pts, w, weight);
  }

  geometry(y = 0.03, thicken = 2.2) {
    const pos = [], t = [], wt = [], idx = [];
    const quad = (corners, ts, weight) => {
      const base = pos.length / 3;
      corners.forEach(([x, z], i) => { pos.push(x, y, z); t.push(ts[i]); wt.push(weight); });
      idx.push(base, base + 2, base + 1, base, base + 3, base + 2);
    };
    for (const g of this.groups) {
      const at = s => g.t0 + (g.t1 - g.t0) * (g.length ? s / g.length : 1);
      for (const { a, b, w: w0, weight, s0, s1 } of g.segs) {
        const w = w0 * thicken;
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
        const dx = (b[0] - a[0]) / len, dz = (b[1] - a[1]) / len;
        const nx = -dz * w / 2, nz = dx * w / 2;
        const ax = a[0] - dx * w / 2, az = a[1] - dz * w / 2, bx = b[0] + dx * w / 2, bz = b[1] + dz * w / 2;
        quad([[ax + nx, az + nz], [ax - nx, az - nz], [bx - nx, bz - nz], [bx + nx, bz + nz]], [at(s0), at(s0), at(s1), at(s1)], weight);
      }
      for (const f of g.fills) quad(f.pts, f.pts.map(() => at(f.s)), f.weight);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('aT', new THREE.Float32BufferAttribute(t, 1));
    geo.setAttribute('aW', new THREE.Float32BufferAttribute(wt, 1));
    geo.setIndex(idx);
    geo.computeBoundingSphere();
    return geo;
  }
}

const circle = (pen, c, r, w, weight, steps = 28) => pen.arc(c, r, 0, Math.PI * 2, w, weight, steps);
const fmt = v => `${v.toFixed(2).replace('.', ',')}`;

function dimension(pen, labels, a, b, offset, text, at) {
  const dx = b[0] - a[0], dz = b[1] - a[1], len = Math.hypot(dx, dz);
  const nx = -dz / len, nz = dx / len;
  const p = [a[0] + nx * offset, a[1] + nz * offset], q = [b[0] + nx * offset, b[1] + nz * offset];
  pen.line([p, q], 0.018, 0.75);
  for (const [o, e] of [[a, p], [b, q]]) {
    pen.line([[o[0] + nx * 0.25, o[1] + nz * 0.25], [e[0] + nx * 0.25, e[1] + nz * 0.25]], 0.012, 0.5);
    pen.line([[e[0] - 0.18 * (dx / len) - 0.18 * nx, e[1] - 0.18 * (dz / len) - 0.18 * nz], [e[0] + 0.18 * (dx / len) + 0.18 * nx, e[1] + 0.18 * (dz / len) + 0.18 * nz]], 0.03, 1);
  }
  labels.push({ text: text ?? `${fmt(len)} m`, x: (p[0] + q[0]) / 2 + nx * 0.42, z: (p[1] + q[1]) / 2 + nz * 0.42, rot: -Math.atan2(dz, dx), size: 0.42, at });
}

export function buildBlueprint() {
  const pen = new Pen();
  const labels = [];
  const W = 0.045;

  // Structural axes with their bubbles.
  pen.group(0, 0.24);
  const letters = ['A', 'B', 'C', 'D', 'E'];
  GRID_X.forEach((x, i) => {
    pen.dashed([x, 9.2], [x, -14.6], 0.014, 0.55, 1.2, 0.25);
    circle(pen, [x, 9.8], 0.5, 0.025, 0.9, 20);
    labels.push({ text: letters[i], x, z: 9.8, rot: 0, size: 0.5, at: 0.3 });
  });
  GRID_Z.forEach((z, i) => {
    pen.dashed([-12.6, z], [13.4, z], 0.014, 0.55, 1.2, 0.25);
    circle(pen, [-13.2, z], 0.5, 0.025, 0.9, 20);
    labels.push({ text: String(i + 1), x: -13.2, z, rot: 0, size: 0.5, at: 0.3 });
  });

  // External walls (filled), with openings.
  pen.group(0.12, 0.5);
  const walls = [
    [[A.x0, -2.6], [A.z1 - 0.25, A.z1]], [[-0.8, 0.4], [A.z1 - 0.25, A.z1]], [[3.4, A.x1], [A.z1 - 0.25, A.z1]],
    [[-2.6, -2.35], [2.8, A.z1 - 0.25]], [[-0.8, -0.55], [2.8, A.z1 - 0.25]],
    [[A.x1 - 0.25, A.x1], [-0.5, 0.8]], [[A.x1 - 0.25, A.x1], [2.6, A.z1 - 0.25]], [[A.x1 - 0.25, A.x1], [A.z0, -1.5]],
    [[A.x0, A.x0 + 0.25], [-1.1, A.z1 - 0.25]], [[A.x0, A.x0 + 0.25], [A.z0, -1.9]],
    [[A.x0, -7.6], [A.z0, A.z0 + 0.25]], [[3.6, A.x1], [A.z0, A.z0 + 0.25]],
  ];
  for (const [xr, zr] of walls) pen.rect(xr, zr, W, 1, 0.22);

  // Glazing, doors and their swing arcs, interior layout.
  pen.group(0.36, 0.68);
  pen.line([[-7.6, A.z0 + 0.06], [3.6, A.z0 + 0.06]], 0.016, 0.8).line([[-7.6, A.z0 + 0.14], [3.6, A.z0 + 0.14]], 0.016, 0.8);
  for (const x of [-4, 0]) pen.rect([x - 0.1, x + 0.1], [A.z0 - 0.02, A.z0 + 0.18], 0.025, 1, 0.5);
  pen.line([[0.4, A.z1 - 0.12], [3.4, A.z1 - 0.12]], 0.016, 0.8);
  pen.line([[A.x0 + 0.12, -1.9], [A.x0 + 0.12, -1.1]], 0.016, 0.8);
  pen.line([[A.x1 - 0.12, 0.8], [A.x1 - 0.12, 2.6]], 0.016, 0.8);
  pen.line([[-2.3, 2.84], [-1.15, 2.84]], 0.03, 1).arc([-1.15, 2.84], 1.15, Math.PI, Math.PI * 1.5, 0.014, 0.6);
  pen.line([[A.x1 - 0.03, -1.5], [A.x1 + 0.97, -1.5]], 0.03, 1).arc([A.x1, -1.5], 1.0, 0, Math.PI / 2, 0.014, 0.6);
  pen.rect([-3.9, -2.9], [0.3, 3.3], 0.022, 0.8);
  for (let i = 1; i < 16; i++) pen.line([[-3.9, 3.3 - i * 0.18], [-2.9, 3.3 - i * 0.18]], 0.01, 0.5);
  pen.line([[-3.4, 3.1], [-3.4, 0.6]], 0.012, 0.6).line([[-3.55, 0.85], [-3.4, 0.6], [-3.25, 0.85]], 0.012, 0.6);
  pen.rect([-7.2, -4.8], [-2.2, -1.02], 0.018, 0.7).rect([-7.2, -6.3], [-3.7, -2.2], 0.018, 0.7);
  pen.rect([-6.1, -5.1], [-3.3, -2.6], 0.016, 0.6).rect([-3.3, -0.7], [-2.1, -1.0], 0.02, 0.7);
  for (const x of [-2.8, -2.0, -1.2]) pen.rect([x - 0.22, x + 0.22], [-2.65, -2.2], 0.012, 0.5).rect([x - 0.22, x + 0.22], [-0.9, -0.45], 0.012, 0.5);
  pen.rect([0.7, 3.0], [-0.9, 0.1], 0.02, 0.7).rect([0.4, 3.4], [3.15, 3.75], 0.016, 0.6).rect([3.1, 3.75], [0.9, 2.6], 0.016, 0.6);

  // Columns.
  pen.group(0.44, 0.6);
  for (const x of GRID_X.slice(0, 4)) for (const z of GRID_Z) pen.rect([x - 0.15, x + 0.15], [z - 0.15, z + 0.15], 0.02, 1, 0.8);
  for (const [x, z] of [[9.3, -1.7], [9.3, 2.9]]) pen.rect([x - 0.15, x + 0.15], [z - 0.15, z + 0.15], 0.02, 1, 0.8);

  // Upper volume projected (dashed) and the carport.
  pen.group(0.54, 0.74);
  const bp = [[B.x0, B.z0], [B.x1, B.z0], [B.x1, B.z1], [B.x0, B.z1], [B.x0, B.z0]];
  for (let i = 0; i < 4; i++) pen.dashed(bp[i], bp[i + 1], 0.02, 0.8, 0.45, 0.22);
  pen.line([[A.x1 + 0.6, -1.0], [9.0, 2.6]], 0.01, 0.35).line([[A.x1 + 0.6, 2.6], [9.0, -1.0]], 0.01, 0.35);

  // Site: deck, pool, paths, driveway, hedges and trees in plan symbols.
  pen.group(0.6, 0.88);
  pen.rect([-8.6, B.x1], [-8.35, -5], 0.022, 0.7).rect([4.05, B.x1], [-5, -2.3], 0.02, 0.6);
  pen.rect([POOL.x0 - 0.42, POOL.x1 + 0.42], [POOL.z0 - 0.42, POOL.z1 + 0.42], 0.03, 1);
  pen.rect([POOL.x0, POOL.x1], [POOL.z0, POOL.z1], 0.03, 1, 0.12);
  for (let i = 1; i <= 3; i++) pen.line([[POOL.x1 - 0.45 * i, POOL.z0], [POOL.x1 - 0.45 * i, POOL.z0 + 1.4]], 0.012, 0.6);
  pen.rect([4.25, 9.35], [B.z1, 12.4], 0.02, 0.6);
  for (let i = 0; i < 9; i++) pen.rect([-2.25, -1.15], [5.75 + i * 0.75 - 0.24, 5.75 + i * 0.75 + 0.24], 0.012, 0.6);
  pen.rect([-16, 16], [-20.4, -19.4], 0.02, 0.6).rect([-15.6, -2.5], [12.1, 12.7], 0.016, 0.5).rect([9.7, 15.6], [12.1, 12.7], 0.016, 0.5);
  for (const [x, z, , s] of TREES) {
    circle(pen, [x, z], s, 0.016, 0.6, 32);
    pen.line([[x - 0.25, z], [x + 0.25, z]], 0.012, 0.6).line([[x, z - 0.25], [x, z + 0.25]], 0.012, 0.6);
  }
  for (const [x, z] of PALMS) {
    circle(pen, [x, z], 1.8, 0.014, 0.55, 24);
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; pen.line([[x, z], [x + Math.cos(a) * 1.8, z + Math.sin(a) * 1.8]], 0.01, 0.4); }
  }

  // Dimensions and the title block.
  pen.group(0.72, 0.96);
  dimension(pen, labels, [A.x0, 4.6], [B.x1, 4.6], 2.4, undefined, 0.86);
  dimension(pen, labels, [A.x0, 4.6], [A.x1, 4.6], 1.2, undefined, 0.84);
  dimension(pen, labels, [A.x1, 4.6], [B.x1, 4.6], 1.2, undefined, 0.84);
  dimension(pen, labels, [-8.9, B.z0], [-8.9, A.z1], 1.6, undefined, 0.88);
  dimension(pen, labels, [POOL.x0, POOL.z0 - 0.5], [POOL.x1, POOL.z0 - 0.5], -0.6, undefined, 0.9);
  // North arrow.
  circle(pen, [-13.6, -16.2], 0.9, 0.018, 0.7, 24);
  pen.line([[-13.6, -15.0], [-13.6, -17.4]], 0.02, 0.9).line([[-14.0, -16.4], [-13.6, -17.4], [-13.2, -16.4]], 0.02, 0.9);
  labels.push({ text: 'N', x: -13.6, z: -17.95, rot: 0, size: 0.5, at: 0.95 });

  return { geometry: pen.geometry(), labels };
}

let material = null;

export function blueprintMaterial() {
  if (material) return material;
  material = new THREE.ShaderMaterial({
    uniforms: { uDraw: { value: 0 }, uOpacity: { value: 1 }, uColor: { value: new THREE.Color('#6cc8ee') }, uReveal: U.uReveal, uRevealC: U.uRevealC },
    vertexShader: /* glsl */ `
      attribute float aT;
      attribute float aW;
      varying float vT;
      varying float vW;
      varying vec2 vP;
      void main() {
        vT = aT;
        vW = aW;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vP = wp.xz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uDraw;
      uniform float uOpacity;
      uniform vec3 uColor;
      uniform float uReveal;
      uniform vec2 uRevealC;
      varying float vT;
      varying float vW;
      varying vec2 vP;
      void main() {
        if (vT > uDraw) discard;
        float head = 1.0 - smoothstep(0.0, 0.04, uDraw - vT);
        float hide = smoothstep(uReveal - 0.8, uReveal + 0.4, distance(vP, uRevealC));
        float a = vW * uOpacity * hide * (1.25 + head * 1.8);
        gl_FragColor = vec4(uColor * (1.0 + head * 1.8) * a, a);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return material;
}
