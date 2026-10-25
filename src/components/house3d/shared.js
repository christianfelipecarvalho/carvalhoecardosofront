import * as THREE from 'three';

// World units are metres. The street is on +z, the garden and pool on -z.
const rad = THREE.MathUtils.degToRad;
export const dirFrom = (az, alt, out = new THREE.Vector3()) =>
  out.set(Math.sin(az) * Math.cos(alt), Math.sin(alt), Math.cos(az) * Math.cos(alt));

// Golden-hour sun over the garden side (azimuth from +z towards +x), and the cooler, higher key
// light used while the project is still virtual.
export const SUN = dirFrom(rad(232), rad(19));
export const KEY = dirFrom(rad(200), rad(55));

// Levels: plinth, first-floor slab, roof slab, parapet.
export const L = { plinth: 0.15, slab1: 3.25, floor1: 3.5, slab2: 6.55, roof: 6.8, parapet: 7.15 };
// Ground-floor block, upper cantilevered volume and the pool.
export const A = { x0: -8, x1: 4, z0: -5, z1: 4 };
export const B = { x0: -4.5, x1: 9.6, z0: -6.6, z1: 3.2 };
export const POOL = { x0: -6.5, x1: 1.5, z0: -12.2, z1: -8.7, level: -0.08 };
// Structural grid (column axes) used by the blueprint, the frame and the finishes.
export const GRID_X = [-8, -4, 0, 4, 9.3];
export const GRID_Z = [-5, -0.5, 4];

// Planting: palms by the facades, small trees in the lot corners [x, z, height, crown radius].
export const PALMS = [[-9.7, -7.6, 7.4], [-10.3, -4.2, 6.3], [11.4, -7.8, 6.8], [-5.8, 6.7, 7.0], [11.0, 6.4, 6.2], [5.2, -12.4, 5.8]];
export const TREES = [[-3.4, 10.4, 4.6, 1.6], [-13.2, -16.6, 5.4, 2.2], [13.0, -16.4, 5.2, 2.1], [-13.0, 9.0, 4.8, 1.9]];

// Orbit target and origin of the landscape reveal.
export const CENTER = new THREE.Vector3(0.6, 2.2, -3.6);
export const REVEAL_C = new THREE.Vector2(0.6, -3.2);

export const CYAN = new THREE.Color('#6cc8ee');

// Uniforms shared by every patched material; the timeline writes them once per frame.
export const U = {
  uTime: { value: 0 },
  uBuildY: { value: -1 },
  uSeam: { value: 0 },
  uReveal: { value: 0 },
  uRing: { value: 0 },
  uRevealC: { value: REVEAL_C.clone() },
  uReal: { value: 0 },
  uGlass: { value: 0 },
  uPool: { value: 0 },
  uGrid: { value: 0 },
  uFrame: { value: 0 },
  uLamps: { value: 0 },
  uSunDir: { value: SUN.clone() },
  uSunCol: { value: new THREE.Color('#ffc58c') },
  uCyan: { value: CYAN.clone() },
};

// Finishes are visible below the rising build plane, the bare concrete frame above it.
export const finishPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), -1);
export const structurePlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 1);
export function setBuildY(y) {
  U.uBuildY.value = y;
  finishPlane.constant = y;
  structurePlane.constant = -y;
}

export const clamp01 = v => Math.min(1, Math.max(0, v));
export const smooth = v => { const t = clamp01(v); return t * t * (3 - 2 * t); };
export const easeOut = v => 1 - (1 - clamp01(v)) ** 3;
export const easeInOut = v => { const t = clamp01(v); return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2; };
export const span = (v, a, b) => clamp01((v - a) / (b - a));
