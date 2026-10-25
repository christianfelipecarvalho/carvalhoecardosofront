import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const tmp = new THREE.Vector3();

// World-aligned UVs in metres, so textures stay continuous across neighbouring pieces.
function worldUV(geo) {
  const p = geo.attributes.position, n = geo.attributes.normal;
  const uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    if (ay >= ax && ay >= az) { uv[i * 2] = p.getX(i); uv[i * 2 + 1] = p.getZ(i); }
    else if (ax >= az) { uv[i * 2] = p.getZ(i); uv[i * 2 + 1] = p.getY(i); }
    else { uv[i * 2] = p.getX(i); uv[i * 2 + 1] = p.getY(i); }
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
}

function fill(geo, name, size, value) {
  const count = geo.attributes.position.count;
  const data = new Float32Array(count * size);
  for (let i = 0; i < count; i++) for (let j = 0; j < size; j++) data[i * size + j] = value[j];
  geo.setAttribute(name, new THREE.BufferAttribute(data, size));
}

// Collects geometry per material key and merges each key into a single draw call.
export class Builder {
  constructor() { this.parts = new Map(); }

  add(key, geo, { color = [1, 1, 1], rise, root, uv = 'world' } = {}) {
    if (uv === 'world') worldUV(geo);
    fill(geo, 'color', 3, color);
    if (rise) fill(geo, 'aRise', 3, rise);
    if (root) fill(geo, 'aRoot', 3, root);
    if (!this.parts.has(key)) this.parts.set(key, []);
    this.parts.get(key).push(geo);
    return geo;
  }

  // Axis-aligned box from world ranges.
  box(key, [x0, x1], [y0, y1], [z0, z1], opts) {
    const geo = new THREE.BoxGeometry(Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0));
    geo.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    return this.add(key, geo, opts);
  }

  // Box of size [w, h, d] transformed by position / Euler rotation.
  oriented(key, [w, h, d], position, rotation = [0, 0, 0], opts) {
    const geo = new THREE.BoxGeometry(w, h, d);
    geo.applyMatrix4(new THREE.Matrix4().compose(tmp.set(...position), new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)), new THREE.Vector3(1, 1, 1)));
    return this.add(key, geo, opts);
  }

  build() {
    const out = {};
    for (const [key, list] of this.parts) {
      const indexed = list.filter(g => g.index);
      const flat = list.filter(g => !g.index);
      const merged = [indexed.length && mergeGeometries(indexed), flat.length && mergeGeometries(flat)].filter(Boolean);
      out[key] = merged.length === 1 ? merged[0] : mergeGeometries(merged.map(g => (g.index ? g.toNonIndexed() : g)));
      out[key].computeBoundingSphere();
    }
    return out;
  }
}

// Deterministic random numbers so the scene is identical on every load.
export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
