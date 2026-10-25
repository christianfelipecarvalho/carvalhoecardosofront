import * as THREE from 'three';
import { B, PALMS, POOL, REVEAL_C, TREES } from './shared';
import { Builder, rng } from './geometry';

const v3 = new THREE.Vector3();

// Foliage cards get normals pointing away from the crown centre: soft, volumetric shading.
function radialNormals(geo, cx, cy, cz, lift = 0.35) {
  const p = geo.attributes.position, n = geo.attributes.normal;
  for (let i = 0; i < p.count; i++) {
    v3.set(p.getX(i) - cx, p.getY(i) - cy + lift, p.getZ(i) - cz).normalize();
    n.setXYZ(i, v3.x, v3.y, v3.z);
  }
}

function card(size, random) {
  const geo = new THREE.PlaneGeometry(size, size);
  geo.rotateX(random() * Math.PI);
  geo.rotateY(random() * Math.PI * 2);
  geo.rotateZ(random() * Math.PI);
  return geo;
}

function crown(b, key, root, [cx, cy, cz], [rx, ry], count, size, random) {
  for (let i = 0; i < count; i++) {
    const u = random() * 2 - 1, th = random() * Math.PI * 2, rr = Math.cbrt(0.3 + 0.7 * random());
    const s = Math.sqrt(1 - u * u);
    const x = cx + rx * rr * s * Math.cos(th), y = cy + ry * rr * u, z = cz + rx * rr * s * Math.sin(th);
    const geo = card(size * (0.75 + random() * 0.5), random);
    geo.translate(x, y, z);
    radialNormals(geo, cx, cy, cz);
    const shade = (0.55 + 0.45 * ((y - (cy - ry)) / (2 * ry))) * (0.85 + random() * 0.3);
    b.add(key, geo, { root, uv: 'box', color: [shade * (0.92 + random() * 0.14), shade, shade * (0.88 + random() * 0.14)] });
  }
}

function tree(b, x, z, h, spread, random) {
  const root = [x, 0, z];
  const trunkH = h * 0.48;
  const trunk = new THREE.CylinderGeometry(0.1 + spread * 0.02, 0.2 + spread * 0.03, trunkH, 8, 1);
  trunk.translate(x, trunkH / 2, z);
  b.add('bark', trunk, { root, uv: 'box' });
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + random();
    const len = spread * (0.55 + random() * 0.3);
    const branch = new THREE.CylinderGeometry(0.04, 0.09, len, 6, 1);
    branch.translate(0, len / 2, 0);
    branch.rotateZ(0.75 + random() * 0.35);
    branch.rotateY(a);
    branch.translate(x, trunkH * (0.82 + random() * 0.15), z);
    b.add('bark', branch, { root, uv: 'box' });
  }
  const cy = h * 0.66;
  crown(b, 'leaf', root, [x, cy, z], [spread, h * 0.27], Math.round(46 + spread * 14), 1.5, random);
}

// Jerivá palm: slightly curved ringed trunk and a crown of drooping pinnate fronds.
function palm(b, x, z, h, random) {
  const root = [x, 0, z];
  const lean = random() * Math.PI * 2, bend = 0.25 + random() * 0.35;
  const at = t => [x + Math.cos(lean) * bend * t * t * h * 0.12, t * h, z + Math.sin(lean) * bend * t * t * h * 0.12];
  const segs = 6;
  for (let i = 0; i < segs; i++) {
    const p0 = new THREE.Vector3(...at(i / segs)), p1 = new THREE.Vector3(...at((i + 1) / segs));
    const len = p0.distanceTo(p1);
    const seg = new THREE.CylinderGeometry(0.15 - (i + 1) * 0.008, 0.16 - i * 0.008, len, 9, 1, true);
    seg.translate(0, len / 2, 0);
    seg.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), p1.clone().sub(p0).normalize()));
    seg.translate(p0.x, p0.y, p0.z);
    b.add('palmBark', seg, { root, uv: 'box' });
  }
  const top = at(1);
  const fronds = 15;
  for (let i = 0; i < fronds; i++) {
    const len = 2.7 + random() * 0.9;
    const geo = new THREE.PlaneGeometry(len, 1.15, 10, 1);
    const p = geo.attributes.position;
    const rise = 0.35 + random() * 0.55;
    for (let j = 0; j < p.count; j++) {
      const u = (p.getX(j) + len / 2) / len;
      const across = p.getY(j);
      p.setXYZ(j, u * len, u * len * rise - u * u * len * (0.55 + random() * 0.04), across * (1 - u * 0.35));
    }
    geo.rotateX(-0.25 + random() * 0.5);
    geo.rotateY((i / fronds) * Math.PI * 2 + random() * 0.3);
    geo.translate(...top);
    geo.computeVertexNormals();
    radialNormals(geo, top[0], top[1] - 0.6, top[2], 0.6);
    const shade = 0.82 + random() * 0.3;
    b.add('frond', geo, { root, uv: 'box', color: [shade, shade, shade * 0.95] });
  }
}

function shrub(b, x, z, size, random, y0 = 0) {
  const root = [x, y0, z];
  crown(b, 'shrub', root, [x, y0 + size * 0.45, z], [size * 0.75, size * 0.5], Math.round(10 + size * 8), 0.75, random);
}

// Ornamental grass clump: thin bent blades.
function grass(b, x, z, size, random) {
  const root = [x, 0, z];
  const count = Math.round(30 + size * 24);
  const pos = [], nor = [], col = [];
  for (let i = 0; i < count; i++) {
    const a = random() * Math.PI * 2, r0 = random() * 0.18 * size;
    const bx = x + Math.cos(a) * r0, bz = z + Math.sin(a) * r0;
    const h = size * (0.6 + random() * 0.6), w = 0.025 + random() * 0.02;
    const out = 0.25 + random() * 0.45;
    const tx = bx + Math.cos(a) * h * out, tz = bz + Math.sin(a) * h * out;
    const px = -Math.sin(a) * w, pz = Math.cos(a) * w;
    pos.push(bx - px, 0, bz - pz, bx + px, 0, bz + pz, tx, h, tz);
    for (let k = 0; k < 3; k++) nor.push(Math.cos(a) * 0.3, 0.9, Math.sin(a) * 0.3);
    const g = 0.55 + random() * 0.4, dry = random() < 0.25 ? 1.25 : 1;
    col.push(0.16 * g * dry, 0.24 * g, 0.08 * g, 0.16 * g * dry, 0.24 * g, 0.08 * g, 0.42 * g * dry, 0.5 * g, 0.2 * g);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(new Array((pos.length / 3) * 2).fill(0), 2));
  const added = b.add('blade', geo, { root, uv: 'keep' });
  added.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
}

export function buildSite() {
  const b = new Builder();
  const r = rng(19);

  const ground = new THREE.CircleGeometry(320, 96);
  ground.rotateX(-Math.PI / 2);
  b.add('ground', ground);

  // Deck around the house, under the cantilever and by the pool.
  b.box('deck', [-8.6, B.x1], [0, 0.15], [-8.35, -5]);
  b.box('deck', [4.05, B.x1], [0, 0.15], [-5, -2.3]);
  // Pool: stone coping, tiled basin, water surface.
  const c = 0.42;
  b.box('plate', [POOL.x0 - c, POOL.x1 + c], [0, 0.17], [POOL.z0 - c, POOL.z0]);
  b.box('plate', [POOL.x0 - c, POOL.x1 + c], [0, 0.17], [POOL.z1, POOL.z1 + c]);
  b.box('plate', [POOL.x0 - c, POOL.x0], [0, 0.17], [POOL.z0, POOL.z1]);
  b.box('plate', [POOL.x1, POOL.x1 + c], [0, 0.17], [POOL.z0, POOL.z1]);
  b.box('tile', [POOL.x0, POOL.x1], [-1.5, -1.4], [POOL.z0, POOL.z1]);
  b.box('tile', [POOL.x0 - 0.1, POOL.x0], [-1.5, 0], [POOL.z0, POOL.z1]);
  b.box('tile', [POOL.x1, POOL.x1 + 0.1], [-1.5, 0], [POOL.z0, POOL.z1]);
  b.box('tile', [POOL.x0, POOL.x1], [-1.5, 0], [POOL.z0 - 0.1, POOL.z0]);
  b.box('tile', [POOL.x0, POOL.x1], [-1.5, 0], [POOL.z1, POOL.z1 + 0.1]);
  for (let i = 0; i < 3; i++) b.box('tile', [POOL.x1 - 0.45 * (i + 1), POOL.x1], [-1.4, -0.35 - i * 0.35], [POOL.z0, POOL.z0 + 1.4]);
  b.box('water', [POOL.x0, POOL.x1], [POOL.level - 0.01, POOL.level], [POOL.z0, POOL.z1]);

  // Front: entrance path, driveway into the carport, low hedge on the street line.
  for (let i = 0; i < 9; i++) {
    const z = 5.75 + i * 0.75, x = -1.7 + (r() - 0.5) * 0.12;
    b.box('plate', [x - 0.55, x + 0.55], [0, 0.05], [z - 0.24, z + 0.24], { color: [0.95 + r() * 0.1, 0.95, 0.95] });
  }
  b.box('paver', [4.25, 9.35], [0, 0.03], [-2.3, 12.4]);
  b.box('curb', [4.1, 4.25], [0, 0.08], [B.z1, 12.4]);
  b.box('curb', [9.35, 9.5], [0, 0.08], [B.z1, 12.4]);
  // Garden path from the deck to the back of the lot.
  for (let i = 0; i < 7; i++) {
    const z = -13.2 - i * 0.8, x = 4.4 + Math.sin(i * 0.7) * 0.6;
    b.box('plate', [x - 0.5, x + 0.5], [0, 0.05], [z - 0.25, z + 0.25], { color: [0.95, 0.95 + r() * 0.08, 0.95] });
  }
  b.box('pebble', [-8.6, -7.9], [0, 0.04], [-4.95, 4.6]);
  b.box('pebble', [-7.9, 4.0], [0, 0.04], [4.05, 4.6]);

  // Hedges enclosing the lot.
  b.box('hedge', [-16, 16], [0, 1.9], [-20.4, -19.4]);
  b.box('hedge', [-16.6, -15.6], [0, 1.9], [-20.4, 12.6]);
  b.box('hedge', [15.6, 16.6], [0, 1.9], [-20.4, 12.6]);
  b.box('hedge', [-15.6, -2.5], [0, 0.95], [12.1, 12.7]);
  b.box('hedge', [-0.9, 3.9], [0, 0.95], [12.1, 12.7]);
  b.box('hedge', [9.7, 15.6], [0, 0.95], [12.1, 12.7]);

  // Outdoor furniture and garden lights.
  for (const z of [-7.9, -6.7]) {
    b.box('furniture', [2.3, 4.3], [0.15, 0.42], [z - 0.35, z + 0.35]);
    b.box('cushion', [2.35, 4.25], [0.42, 0.5], [z - 0.32, z + 0.32]);
    b.oriented('cushion', [0.7, 0.07, 0.62], [2.55, 0.66, z], [0, 0, 0.6]);
  }
  b.box('furniture', [-8.3, -6.9], [0.15, 0.55], [-7.9, -6.3]);
  for (const [x, z] of [[-2.6, 6.2], [-2.6, 8.4], [-2.6, 10.6], [-0.8, 7.3], [-0.8, 9.5], [-9.2, -8.8], [-9.2, -5.6], [2.6, -13.6], [6.0, -15.9]]) {
    b.box('bollard', [x - 0.06, x + 0.06], [0, 0.55], [z - 0.06, z + 0.06]);
    b.box('bollardLight', [x - 0.065, x + 0.065], [0.45, 0.53], [z - 0.065, z + 0.065]);
  }

  // Vegetation.
  for (const [x, z, h, spread] of TREES) tree(b, x, z, h, spread, r);
  // Neighbouring trees beyond the hedges, outside the drone's orbit: a backdrop from every side.
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + r() * 0.25, d = 34 + r() * 14;
    tree(b, REVEAL_C.x + Math.cos(a) * d, REVEAL_C.y + Math.sin(a) * d, 8 + r() * 3.5, 3 + r() * 1.3, r);
  }
  for (const [x, z, h] of PALMS) palm(b, x, z, h, r);
  for (const [x, z, s] of [[-8.9, -2.8, 1.1], [-9.0, -0.2, 0.9], [-8.9, 2.6, 1.2], [-6.5, 5.0, 1.0], [-4.4, 5.1, 1.2], [0.6, 5.0, 0.9], [2.6, 5.1, 1.1],
    [-7.4, -8.9, 1.0], [2.4, -9.0, 0.8], [-7.0, -12.9, 1.1], [10.4, -3.8, 1.2], [10.3, 0.8, 1.0], [10.2, -6.4, 0.9], [14.6, -17.8, 1.6], [-14.6, -17.6, 1.5], [-14.8, 10.6, 1.3], [14.4, 10.8, 1.3]]) shrub(b, x, z, s, r);
  for (const [x, z] of [[-7.3, -4.2], [-7.3, 3.2]]) shrub(b, x, z, 0.9, r, 4.1);
  for (const [x, z, s] of [[-8.2, -9.4, 1.0], [2.1, -8.6, 0.8], [-3.2, -12.9, 0.9], [0.4, -12.9, 0.8], [-0.4, 4.9, 0.8], [3.6, 4.9, 0.9], [-3.4, 4.9, 0.8], [10.0, -1.8, 0.9], [-9.5, 4.2, 1.0], [5.5, -14.6, 0.9]]) grass(b, x, z, s, r);
  return b.build();
}
