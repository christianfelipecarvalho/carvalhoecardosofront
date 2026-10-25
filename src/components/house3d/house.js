import { A, B, GRID_X, GRID_Z, L } from './shared';
import { Builder, rng } from './geometry';

// The reinforced-concrete frame raised in stage 02. aRise = [base y, start on the frame timeline, mode].
export function buildFrame() {
  const b = new Builder();
  const cols = [];
  for (const x of GRID_X.slice(0, 4)) for (const z of GRID_Z) cols.push([x, z]);
  cols.push([9.3, -1.7], [9.3, 2.9]);
  const byDistance = (list, ox, oz) => [...list].sort((p, q) => Math.hypot(p[0] - ox, p[1] - oz) - Math.hypot(q[0] - ox, q[1] - oz));

  byDistance(cols, -8, 4).forEach(([x, z], i) => {
    const t = (i / cols.length) * 0.08;
    b.box('frame', [x - 0.45, x + 0.45], [-0.05, 0.12], [z - 0.45, z + 0.45], { rise: [-0.05, t, 0] });
    b.box('frame', [x - 0.15, x + 0.15], [L.plinth, L.slab1], [z - 0.15, z + 0.15], { rise: [L.plinth, 0.1 + t * 2.4, 0] });
  });
  b.box('frame', [A.x0 - 0.1, A.x1 + 0.1], [0, L.plinth], [A.z0 - 0.1, A.z1 + 0.1], { rise: [0, 0.06, 0] });

  const beams = [];
  for (const x of GRID_X.slice(0, 4)) beams.push([[x - 0.12, x + 0.12], [A.z0, A.z1]]);
  for (const z of GRID_Z) beams.push([[A.x0, A.x1], [z - 0.12, z + 0.12]]);
  beams.push([[A.x1, 9.42], [-1.82, -1.58]], [[A.x1, 9.42], [2.78, 3.02]], [[9.18, 9.42], [-1.7, 2.9]]);
  beams.forEach(([xr, zr], i) => b.box('frame', xr, [2.8, L.slab1], zr, { rise: [2.8, 0.3 + i * 0.012, 1] }));

  b.box('frame', [A.x0 - 0.15, A.x1 + 0.15], [L.slab1, L.floor1], [A.z0 - 0.15, A.z1 + 0.15], { rise: [L.slab1, 0.44, 1] });
  b.box('frame', [B.x0, A.x1 + 0.15], [L.slab1, L.floor1], [B.z0, A.z0 - 0.15], { rise: [L.slab1, 0.47, 1] });
  b.box('frame', [A.x1 + 0.15, B.x1], [L.slab1, L.floor1], [B.z0, B.z1], { rise: [L.slab1, 0.5, 1] });

  const upper = [];
  for (const x of [B.x0 + 0.25, 0, 4, B.x1 - 0.25]) for (const z of [B.z0 + 0.25, -0.5, B.z1 - 0.25]) upper.push([x, z]);
  byDistance(upper, B.x0, B.z1).forEach(([x, z], i) => {
    b.box('frame', [x - 0.15, x + 0.15], [L.floor1, L.slab2], [z - 0.15, z + 0.15], { rise: [L.floor1, 0.56 + i * 0.009, 0] });
  });
  [[[B.x0, B.x1], [B.z0, B.z0 + 0.25]], [[B.x0, B.x1], [B.z1 - 0.25, B.z1]], [[B.x0, B.x0 + 0.25], [B.z0, B.z1]], [[B.x1 - 0.25, B.x1], [B.z0, B.z1]]]
    .forEach(([xr, zr], i) => b.box('frame', xr, [6.1, L.slab2], zr, { rise: [6.1, 0.7 + i * 0.02, 1] }));
  b.box('frame', [B.x0 - 0.25, B.x1 + 0.25], [L.slab2, L.roof], [B.z0 - 0.25, B.z1 + 0.25], { rise: [L.slab2, 0.84, 1] });
  return b.build();
}

// Window: glass pane with a slim aluminium frame, in a wall plane facing ±z (axis 'z') or ±x (axis 'x').
function windowZ(b, [x0, x1], [y0, y1], z, { mullions = [], depth = 0.06, frame = 0.05 } = {}) {
  b.box('glass', [x0, x1], [y0, y1], [z - 0.012, z + 0.012]);
  const d = [z - depth / 2, z + depth / 2];
  b.box('alu', [x0 - frame, x1 + frame], [y1, y1 + frame], d);
  b.box('alu', [x0 - frame, x1 + frame], [y0 - frame, y0], d);
  b.box('alu', [x0 - frame, x0], [y0, y1], d);
  b.box('alu', [x1, x1 + frame], [y0, y1], d);
  for (const m of mullions) b.box('alu', [m - frame / 2, m + frame / 2], [y0, y1], d);
}

function windowX(b, [z0, z1], [y0, y1], x, { mullions = [], depth = 0.06, frame = 0.05 } = {}) {
  b.box('glass', [x - 0.012, x + 0.012], [y0, y1], [z0, z1]);
  const d = [x - depth / 2, x + depth / 2];
  b.box('alu', d, [y1, y1 + frame], [z0 - frame, z1 + frame]);
  b.box('alu', d, [y0 - frame, y0], [z0 - frame, z1 + frame]);
  b.box('alu', d, [y0, y1], [z0 - frame, z0]);
  b.box('alu', d, [y0, y1], [z1, z1 + frame]);
  for (const m of mullions) b.box('alu', d, [y0, y1], [m - frame / 2, m + frame / 2]);
}

// Vertical wood slats (brise) along a facade, skipping the given openings.
function slats(b, axis, from, to, plane, outward, skip, random) {
  const pitch = 0.11;
  for (let s = from + 0.06; s < to - 0.03; s += pitch) {
    if (skip.some(([a, c]) => s > a - 0.04 && s < c + 0.04)) continue;
    const tone = 0.82 + random() * 0.3;
    const color = [tone, tone * (0.97 + random() * 0.05), tone * (0.94 + random() * 0.08)];
    const depth = [plane - outward * 0.13, plane];
    if (axis === 'x') b.box('wood', [s - 0.024, s + 0.024], [L.floor1, L.slab2], depth.sort((p, q) => p - q), { color });
    else b.box('wood', depth.sort((p, q) => p - q), [L.floor1, L.slab2], [s - 0.024, s + 0.024], { color });
  }
}

// The finished house: revealed under the build plane in stage 03.
export function buildHouse() {
  const b = new Builder();
  const r = rng(7);
  const { plinth: P, slab1: S1, floor1: F1, slab2: S2, roof: R, parapet: PP } = L;

  // Plinth, ground-floor slab edge and white fascias.
  b.box('concrete', [A.x0 - 0.05, A.x1 + 0.05], [0, P], [A.z0 - 0.05, A.z1 + 0.05]);
  b.box('white', [A.x0 - 0.15, A.x1 + 0.15], [S1, 3.62], [A.z1 - 0.1, A.z1 + 0.15]);
  b.box('white', [A.x0 - 0.15, A.x0 + 0.1], [S1, 3.62], [A.z0 - 0.15, A.z1 + 0.15]);
  b.box('white', [A.x0 - 0.15, B.x0], [S1, 3.62], [A.z0 - 0.15, A.z0 + 0.1]);
  b.box('white', [A.x1 - 0.1, A.x1 + 0.15], [S1, 3.62], [B.z1, A.z1 + 0.15]);
  b.box('white', [B.x0, B.x1], [S1, F1], [B.z0, B.z0 + 0.12]);
  b.box('white', [B.x1 - 0.12, B.x1], [S1, F1], [B.z0, B.z1]);
  b.box('white', [A.x1 + 0.15, B.x1], [S1, F1], [B.z1 - 0.12, B.z1]);
  b.box('white', [B.x0, B.x0 + 0.12], [S1, F1], [B.z0, A.z0 - 0.15]);
  b.box('soffit', [B.x0 + 0.12, B.x1 - 0.12], [3.2, S1], [B.z0 + 0.12, A.z0 - 0.15]);
  b.box('soffit', [A.x1 + 0.15, B.x1 - 0.12], [3.2, S1], [A.z0 - 0.15, B.z1 - 0.12]);

  // Street facade: stone wall, recessed pivot door, plaster wall with the kitchen window.
  b.box('stone', [A.x0, -2.6], [P, S1], [A.z1 - 0.25, A.z1]);
  b.box('stone', [-2.6, -2.35], [P, S1], [2.8, A.z1 - 0.25]);
  b.box('white', [-0.8, -0.55], [P, S1], [2.8, A.z1 - 0.25]);
  b.box('white', [-2.35, -0.8], [2.95, S1], [2.75, 2.95]);
  b.box('wood', [-2.3, -1.15], [P, 2.95], [2.8, 2.88], { color: [0.86, 0.8, 0.74] });
  b.box('alu', [-1.15, -1.08], [P, 2.95], [2.79, 2.89]);
  b.box('alu', [-1.6, -1.56], [1.1, 2.0], [2.88, 2.95]);
  b.box('glass', [-1.08, -0.8], [P, 2.95], [2.82, 2.86]);
  b.box('white', [-0.8, A.x1], [P, 1.25], [A.z1 - 0.25, A.z1]);
  b.box('white', [-0.8, A.x1], [2.45, S1], [A.z1 - 0.25, A.z1]);
  b.box('white', [-0.8, 0.4], [1.25, 2.45], [A.z1 - 0.25, A.z1]);
  b.box('white', [3.4, A.x1], [1.25, 2.45], [A.z1 - 0.25, A.z1]);
  windowZ(b, [0.4, 3.4], [1.25, 2.45], A.z1 - 0.08, { mullions: [1.9] });
  b.box('plate', [-2.9, -0.5], [0, 0.12], [A.z1, 5.3]);
  b.box('plate', [-2.6, -0.8], [0.12, P], [2.8, A.z1]);

  // West facade: board-formed concrete with a tall slot window.
  b.box('concrete', [A.x0, A.x0 + 0.25], [P, S1], [A.z0, -1.9]);
  b.box('concrete', [A.x0, A.x0 + 0.25], [P, S1], [-1.1, A.z1 - 0.25]);
  b.box('concrete', [A.x0, A.x0 + 0.25], [P, 0.45], [-1.9, -1.1]);
  b.box('concrete', [A.x0, A.x0 + 0.25], [3.0, S1], [-1.9, -1.1]);
  windowX(b, [-1.9, -1.1], [0.45, 3.0], A.x0 + 0.1);

  // East facade, inside the carport: plaster with a service door and a high window.
  b.box('white', [A.x1 - 0.25, A.x1], [P, S1], [A.z0, -1.5]);
  b.box('white', [A.x1 - 0.25, A.x1], [P, S1], [-0.5, 0.8]);
  b.box('white', [A.x1 - 0.25, A.x1], [P, 1.9], [0.8, 2.6]);
  b.box('white', [A.x1 - 0.25, A.x1], [2.7, S1], [0.8, 2.6]);
  b.box('white', [A.x1 - 0.25, A.x1], [P, S1], [2.6, A.z1 - 0.25]);
  b.box('white', [A.x1 - 0.25, A.x1], [2.4, S1], [-1.5, -0.5]);
  b.box('wood', [A.x1 - 0.06, A.x1 + 0.02], [P, 2.4], [-1.5, -0.5], { color: [0.9, 0.84, 0.78] });
  windowX(b, [0.8, 2.6], [1.9, 2.7], A.x1 - 0.08);

  // Garden facade: three bays of sliding glass doors between slim steel columns.
  b.box('white', [A.x0, -7.6], [P, S1], [A.z0, A.z0 + 0.25]);
  b.box('white', [3.6, A.x1], [P, S1], [A.z0, A.z0 + 0.25]);
  for (const x of [-4, 0]) b.box('alu', [x - 0.1, x + 0.1], [P, S1], [A.z0 - 0.02, A.z0 + 0.18]);
  b.box('alu', [-7.6, 3.6], [3.05, S1], [A.z0, A.z0 + 0.2]);
  b.box('alu', [-7.6, 3.6], [P, 0.19], [A.z0, A.z0 + 0.2]);
  for (const [x0, x1] of [[-7.6, -4.1], [-3.9, -0.1], [0.1, 3.6]]) {
    const mid = (x0 + x1) / 2;
    windowZ(b, [x0 + 0.04, mid + 0.04], [0.21, 3.03], A.z0 + 0.05, { frame: 0.04 });
    windowZ(b, [mid - 0.04, x1 - 0.04], [0.21, 3.03], A.z0 + 0.13, { frame: 0.04 });
  }

  // Ground-floor interior seen through the glazing.
  b.box('intFloor', [A.x0 + 0.25, A.x1 - 0.25], [P, P + 0.01], [A.z0 + 0.2, A.z1 - 0.25]);
  b.box('intCeil', [A.x0 + 0.25, A.x1 - 0.25], [3.15, S1], [A.z0 + 0.2, A.z1 - 0.25]);
  for (const z of [-4.1, -0.9, 2.3]) b.box('lamp', [A.x0 + 0.8, A.x1 - 0.8], [3.12, 3.15], [z - 0.03, z + 0.03]);
  b.box('fabricDark', [-7.3, -4.5], [P + 0.01, P + 0.02], [-4.0, -1.0]);
  b.box('fabric', [-7.2, -4.8], [P, 0.55], [-2.2, -1.3]);
  b.box('fabric', [-7.2, -4.8], [P, 0.95], [-1.3, -1.02]);
  b.box('fabric', [-7.2, -6.3], [P, 0.55], [-3.7, -2.2]);
  b.box('fabric', [-7.45, -7.2], [P, 0.95], [-3.7, -1.02]);
  b.box('intWood', [-6.1, -5.1], [P, 0.48], [-3.3, -2.6]);
  b.box('intWood', [-3.3, -0.7], [0.82, 0.88], [-2.1, -1.0]);
  b.box('intWood', [-3.1, -2.95], [P, 0.82], [-1.9, -1.2]);
  b.box('intWood', [-1.05, -0.9], [P, 0.82], [-1.9, -1.2]);
  for (const x of [-2.8, -2.0, -1.2]) {
    b.box('fabricDark', [x - 0.22, x + 0.22], [P, 0.5], [-2.65, -2.2]);
    b.box('fabricDark', [x - 0.22, x + 0.22], [P, 0.5], [-0.9, -0.45]);
    b.box('lamp', [x - 0.16, x + 0.16], [2.25, 2.4], [-1.7, -1.4]);
    b.box('alu', [x - 0.006, x + 0.006], [2.4, 3.15], [-1.56, -1.54]);
  }
  b.box('white', [0.7, 3.0], [P, 1.0], [-0.9, 0.1]);
  b.box('intFloor', [0.65, 3.05], [1.0, 1.05], [-0.95, 0.15]);
  b.box('intWood', [0.4, 3.4], [P, 0.95], [3.15, A.z1 - 0.25]);
  b.box('intFloor', [0.4, 3.4], [0.95, 1.0], [3.1, A.z1 - 0.25]);
  b.box('intWood', [3.1, A.x1 - 0.25], [P, 2.75], [0.9, 2.6]);
  for (let i = 0; i < 16; i++) {
    const y = P + (i + 1) * ((F1 - P) / 16);
    b.box('intWood', [-3.9, -2.9], [y - 0.05, y], [3.3 - i * 0.18 - 0.28, 3.3 - i * 0.18]);
  }
  b.box('white', [-3.95, -3.9], [P, S1], [0.3, 3.3]);

  // Upper volume: dark backing walls, wood brise and the framed picture window.
  const inset = 0.32;
  const pic = [-2.4, 5.6];
  const door = [-4.2, 1.8];
  b.box('backing', [B.x0 + inset, pic[0]], [F1, S2], [B.z0 + inset, B.z0 + inset + 0.2]);
  b.box('backing', [pic[1], B.x1 - inset], [F1, S2], [B.z0 + inset, B.z0 + inset + 0.2]);
  b.box('backing', pic, [F1, 3.85], [B.z0 + inset, B.z0 + inset + 0.2]);
  b.box('backing', pic, [6.25, S2], [B.z0 + inset, B.z0 + inset + 0.2]);
  b.box('backing', [B.x0 + inset, B.x1 - inset], [F1, S2], [B.z1 - inset - 0.2, B.z1 - inset]);
  b.box('backing', [B.x1 - inset - 0.2, B.x1 - inset], [F1, S2], [B.z0 + inset, B.z1 - inset]);
  b.box('backing', [B.x0 + inset, B.x0 + inset + 0.2], [F1, S2], [B.z0 + inset, door[0]]);
  b.box('backing', [B.x0 + inset, B.x0 + inset + 0.2], [F1, S2], [door[1], B.z1 - inset]);
  b.box('backing', [B.x0 + inset, B.x0 + inset + 0.2], [6.2, S2], door);
  slats(b, 'x', B.x0, B.x1, B.z0, -1, [[pic[0] - 0.2, pic[1] + 0.2]], r);
  slats(b, 'x', B.x0, B.x1, B.z1, 1, [], r);
  slats(b, 'z', B.z0, B.z1, B.x1, 1, [], r);
  slats(b, 'z', B.z0, B.z1, B.x0, -1, [[door[0] - 0.2, door[1] + 0.2]], r);
  b.box('wood', [B.x0 - 0.02, B.x0 + 0.14], [F1, S2], [B.z0 - 0.02, B.z0 + 0.14], { color: [0.9, 0.9, 0.9] });
  b.box('wood', [B.x1 - 0.14, B.x1 + 0.02], [F1, S2], [B.z0 - 0.02, B.z0 + 0.14], { color: [0.9, 0.9, 0.9] });
  b.box('wood', [B.x1 - 0.14, B.x1 + 0.02], [F1, S2], [B.z1 - 0.14, B.z1 + 0.02], { color: [0.9, 0.9, 0.9] });
  b.box('wood', [B.x0 - 0.02, B.x0 + 0.14], [F1, S2], [B.z1 - 0.14, B.z1 + 0.02], { color: [0.9, 0.9, 0.9] });
  // Picture window: a deep aluminium frame that projects from the slats.
  const fz = [B.z0 - 0.3, B.z0 + inset];
  b.box('alu', [pic[0] - 0.14, pic[1] + 0.14], [6.25, 6.39], fz);
  b.box('alu', [pic[0] - 0.14, pic[1] + 0.14], [3.71, 3.85], fz);
  b.box('alu', [pic[0] - 0.14, pic[0]], [3.85, 6.25], fz);
  b.box('alu', [pic[1], pic[1] + 0.14], [3.85, 6.25], fz);
  windowZ(b, pic, [3.85, 6.25], B.z0 + 0.1, { mullions: [1.6], frame: 0.04 });
  windowX(b, door, [F1 + 0.05, 6.2], B.x0 + inset + 0.1, { mullions: [-1.2], frame: 0.05 });
  for (const [x0, x1] of [[-2.6, 0.6], [2.6, 6.2]]) windowZ(b, [x0, x1], [4.0, 6.0], B.z1 - inset + 0.01, { frame: 0.04 });

  // Upper interior: bedroom behind the picture window and the lounge by the terrace.
  b.box('intFloor', [B.x0 + inset + 0.2, B.x1 - inset - 0.2], [F1, F1 + 0.01], [B.z0 + inset + 0.2, B.z1 - inset - 0.2]);
  b.box('intCeil', [B.x0 + inset + 0.2, B.x1 - inset - 0.2], [6.45, S2], [B.z0 + inset + 0.2, B.z1 - inset - 0.2]);
  b.box('intWall', [pic[0], pic[1] + 0.6], [F1, 6.45], [-3.45, -3.35]);
  b.box('intWall', [pic[0] - 0.1, pic[0]], [F1, 6.45], [B.z0 + inset + 0.2, -3.35]);
  b.box('intWall', [-1.75, -1.65], [F1, 6.45], [-3.35, B.z1 - inset - 0.2]);
  b.box('intWall', [pic[0], pic[1]], [F1, 6.45], [B.z1 - inset - 0.25, B.z1 - inset - 0.2]);
  b.box('intWood', [-0.5, 2.1], [F1, 4.75], [-3.58, -3.45]);
  b.box('fabric', [-0.3, 1.9], [F1, 4.0], [-5.5, -3.58]);
  b.box('cushionInt', [-0.2, 0.75], [4.0, 4.14], [-4.0, -3.62]);
  b.box('cushionInt', [0.95, 1.8], [4.0, 4.14], [-4.0, -3.62]);
  b.box('fabricDark', [-0.3, 1.9], [4.0, 4.05], [-5.0, -4.2]);
  for (const x of [-1.0, 2.6]) {
    b.box('intWood', [x - 0.3, x + 0.3], [F1, 4.0], [-4.0, -3.6]);
    b.box('lamp', [x - 0.09, x + 0.09], [4.7, 4.95], [-3.9, -3.72]);
  }
  b.box('lamp', [-2.0, 5.2], [6.42, 6.45], [-4.9, -4.84]);
  b.box('fabric', [-3.9, -2.2], [F1, 3.95], [-1.0, 0.6]);
  b.box('fabric', [-3.9, -3.6], [F1, 4.3], [-1.0, 0.6]);
  b.box('lamp', [-3.6, -2.0], [6.42, 6.45], [-2.0, -1.94]);

  // Terrace on the ground-floor roof: deck, glass balustrade, planters.
  b.box('deckHouse', [A.x0 + 0.1, B.x0 + inset], [F1, F1 + 0.06], [A.z0 + 0.1, A.z1 - 0.1]);
  b.box('glass', [A.x0 - 0.02, A.x0 + 0.01], [3.66, 4.65], [A.z0 - 0.1, A.z1 + 0.1]);
  b.box('glass', [A.x0 - 0.1, B.x0], [3.66, 4.65], [A.z0 - 0.07, A.z0 - 0.04]);
  b.box('glass', [A.x0 - 0.1, B.x0 + inset], [3.66, 4.65], [A.z1 + 0.04, A.z1 + 0.07]);
  b.box('alu', [A.x0 - 0.05, A.x0 + 0.04], [4.65, 4.7], [A.z0 - 0.1, A.z1 + 0.1]);
  b.box('alu', [A.x0 - 0.1, B.x0], [4.65, 4.7], [A.z0 - 0.1, A.z0 - 0.01]);
  b.box('alu', [A.x0 - 0.1, B.x0 + inset], [4.65, 4.7], [A.z1 + 0.01, A.z1 + 0.1]);
  for (const [x, z] of [[-7.3, -4.2], [-7.3, 3.2]]) b.box('concrete', [x - 0.35, x + 0.35], [F1, 4.1], [z - 0.35, z + 0.35]);
  b.box('furnitureH', [-6.6, -5.0], [F1, 3.95], [-1.2, -0.4]);
  b.box('cushionH', [-6.55, -5.05], [3.95, 4.05], [-1.15, -0.45]);

  // Roof: white parapet, gravel and photovoltaic panels.
  const ox = [B.x0 - 0.25, B.x1 + 0.25], oz = [B.z0 - 0.25, B.z1 + 0.25];
  b.box('white', ox, [S2, PP], [oz[0], oz[0] + 0.25]);
  b.box('white', ox, [S2, PP], [oz[1] - 0.25, oz[1]]);
  b.box('white', [ox[0], ox[0] + 0.25], [S2, PP], [oz[0] + 0.25, oz[1] - 0.25]);
  b.box('white', [ox[1] - 0.25, ox[1]], [S2, PP], [oz[0] + 0.25, oz[1] - 0.25]);
  b.box('concrete', [ox[0] + 0.25, ox[1] - 0.25], [S2, R], [oz[0] + 0.25, oz[1] - 0.25]);
  b.box('gravel', [ox[0] + 0.25, ox[1] - 0.25], [R, R + 0.04], [oz[0] + 0.25, oz[1] - 0.25]);
  for (let row = 0; row < 2; row++) {
    for (let i = 0; i < 6; i++) b.oriented('pv', [1.04, 0.035, 1.7], [-1.6 + i * 1.1, R + 0.16, -3.6 + row * 1.85], [-0.07, 0, 0], { uv: 'box' });
  }
  return b.build();
}
