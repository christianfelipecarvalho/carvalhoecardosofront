import * as THREE from 'three';
import { POOL, U, finishPlane, structurePlane } from './shared';
import * as T from './textures';

// Every material is a stock MeshStandardMaterial patched with the construction effects:
// build seam, frame rise, radial landscape reveal, plant growth and wind, glass/water fresnel.
const VERT_PARS = /* glsl */ `
uniform float uTime;
uniform float uReveal;
uniform float uFrame;
uniform vec2 uRevealC;
#ifdef G_WIND
uniform float uWindAmp;
#endif
#ifdef G_ROOT
attribute vec3 aRoot;
#endif
#ifdef G_RISE
attribute vec3 aRise;
varying float vRiseK;
#endif
varying vec3 vWPos;
`;

const VERT_BEGIN = /* glsl */ `
#ifdef G_ROOT
{
  vec3 rel = transformed - aRoot;
  #ifdef G_GROW
  float gk = clamp((uReveal - distance(aRoot.xz, uRevealC)) / 5.0, 0.0, 1.0);
  gk = gk * gk * (3.0 - 2.0 * gk);
  rel *= max(gk, 0.0001);
  #endif
  #ifdef G_WIND
  float wh = max(rel.y, 0.0);
  float wp = dot(aRoot.xz, vec2(0.37, 0.61));
  float ws = sin(uTime * 1.3 + wp) * 0.55 + sin(uTime * 2.3 + wp * 1.7 + rel.y * 0.4) * 0.3 + sin(uTime * 0.55 + wp * 0.3) * 0.45;
  rel.xz += vec2(ws, ws * 0.5) * uWindAmp * wh * wh;
  #ifdef G_FLUTTER
  rel.xz += vec2(sin(uTime * 6.0 + dot(transformed, vec3(9.1, 7.3, 5.7))), cos(uTime * 5.2 + dot(transformed, vec3(4.3, 8.9, 6.1)))) * 0.012 * wh / (wh + 1.0);
  #endif
  #endif
  transformed = aRoot + rel;
}
#endif
#ifdef G_HEDGE
{
  float rk = clamp((uReveal - distance(transformed.xz, uRevealC)) / 4.0, 0.0, 1.0);
  transformed.y *= max(rk * rk * (3.0 - 2.0 * rk), 0.0001);
}
#endif
#ifdef G_RISE
{
  // aRise: x = base height, y = start on the frame timeline, z = 0 grows up / 1 drops into place.
  float k = clamp((uFrame - aRise.y) / 0.14, 0.0, 1.0);
  float e = 1.0 - pow(1.0 - k, 3.0);
  if (aRise.z < 0.5) transformed.y = aRise.x + (transformed.y - aRise.x) * max(e, 0.0001);
  else transformed.y += (1.0 - e) * 2.4;
  vRiseK = k;
}
#endif
`;

const VERT_WORLD = /* glsl */ `
vWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
`;

const FRAG_PARS = /* glsl */ `
uniform float uTime;
uniform float uBuildY;
uniform float uSeam;
uniform float uReveal;
uniform float uRing;
uniform float uReal;
uniform float uGlass;
uniform float uPool;
uniform float uGrid;
uniform float uLamps;
uniform vec2 uRevealC;
uniform vec3 uSunDir;
uniform vec3 uSunCol;
uniform vec3 uCyan;
varying vec3 vWPos;
#ifdef G_RISE
varying float vRiseK;
#endif
#ifdef G_GROUND
uniform sampler2D uMacro;
float gGrid(vec2 p, float s, float w) {
  vec2 q = abs(fract(p / s + 0.5) - 0.5) * s;
  vec2 fw = max(fwidth(p), vec2(1e-4));
  vec2 a = 1.0 - smoothstep(vec2(w * 0.5), vec2(w * 0.5) + fw, q);
  float density = clamp(1.0 - max(fw.x, fw.y) / (s * 0.12), 0.0, 1.0);
  return max(a.x, a.y) * density;
}
#endif
`;

const FRAG_CLIP = /* glsl */ `
#ifdef G_RISE
if (vRiseK <= 0.0) discard;
#endif
#ifdef G_RADIAL
if (distance(vWPos.xz, uRevealC) > uReveal) discard;
#endif
#ifdef G_GROUND
float gReal = 1.0 - smoothstep(uReveal - 1.2, uReveal, distance(vWPos.xz, uRevealC));
if (gReal > 0.5 && vWPos.x > ${POOL.x0.toFixed(2)} && vWPos.x < ${POOL.x1.toFixed(2)} && vWPos.z > ${POOL.z0.toFixed(2)} && vWPos.z < ${POOL.z1.toFixed(2)}) discard;
#endif
`;

const FRAG_MAP = /* glsl */ `
#ifdef G_GROUND
{
  vec2 gp = vWPos.xz;
  vec4 mac = texture2D(uMacro, gp / 47.0);
  vec4 mac2 = texture2D(uMacro, gp / 11.0 + 0.37);
  diffuseColor.rgb *= 0.8 + 0.34 * mac.r + 0.16 * (mac2.g - 0.5);
  diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(1.18, 1.06, 0.74), smoothstep(0.55, 0.95, mac.g) * 0.5);
  float lot = step(abs(gp.x), 15.0) * step(-21.0, gp.y) * step(gp.y, 12.0);
  diffuseColor.rgb *= 1.0 + lot * 0.035 * sign(sin(gp.x * 3.14159 / 1.6));
  diffuseColor.rgb = mix(vec3(0.0035, 0.011, 0.018), diffuseColor.rgb, gReal);
}
#endif
`;

const FRAG_EMIT = /* glsl */ `
#ifdef G_LAMP
totalEmissiveRadiance *= uLamps;
#endif
#ifdef G_SEAM
totalEmissiveRadiance += uCyan * (1.0 - smoothstep(0.0, 0.07, uBuildY - vWPos.y)) * uSeam * 6.0;
#endif
#ifdef G_RISE
totalEmissiveRadiance += uCyan * (1.0 - smoothstep(0.0, 0.12, vWPos.y - uBuildY)) * uSeam * 3.0;
totalEmissiveRadiance += uCyan * (1.0 - vRiseK) * (1.0 - vRiseK) * 0.55;
#endif
#ifdef G_RADIAL
totalEmissiveRadiance += uCyan * (1.0 - smoothstep(0.0, 0.5, uReveal - distance(vWPos.xz, uRevealC))) * uRing * 1.8;
#endif
#ifdef G_GROUND
{
  vec2 gp = vWPos.xz;
  float gd = distance(gp, uRevealC);
  float fade = 1.0 - smoothstep(16.0, 46.0, gd);
  float g = gGrid(gp, 1.0, 0.012) * 0.018 + gGrid(gp, 5.0, 0.03) * 0.05;
  totalEmissiveRadiance += uCyan * g * fade * (1.0 - gReal) * uGrid;
  totalEmissiveRadiance += uCyan * (1.0 - smoothstep(0.0, 0.7, abs(gd - uReveal))) * uRing * 1.5;
}
#endif
#ifdef G_SSS
{
  vec3 sv = normalize(vWPos - cameraPosition);
  float bl = pow(max(dot(sv, uSunDir), 0.0), 3.0);
  totalEmissiveRadiance += diffuseColor.rgb * uSunCol * bl * 0.9 * uReal;
}
#endif
`;

const FRAG_OUT = /* glsl */ `
#include <opaque_fragment>
#if defined(G_GLASS) || defined(G_WATER)
{
  float gNV = clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0);
  float gF = 0.04 + 0.96 * pow(1.0 - gNV, 5.0);
  #ifdef G_GLASS
  float gT = (1.0 - gF) * 0.8;
  gl_FragColor = vec4(outgoingLight * uGlass, (1.0 - gT) * uGlass);
  #else
  float gT = (1.0 - gF) * 0.6;
  gl_FragColor = vec4(outgoingLight * uPool, (1.0 - gT) * uPool);
  #endif
}
#endif
`;

const WATER_N = /* glsl */ `
vec3 mapN = texture2D( normalMap, vNormalMapUv + vec2( uTime * 0.013, uTime * 0.007 ) ).xyz * 2.0 - 1.0;
vec3 mapN2 = texture2D( normalMap, vNormalMapUv * 1.63 + vec2( - uTime * 0.009, uTime * 0.012 ) ).xyz * 2.0 - 1.0;
mapN = normalize( vec3( mapN.xy + mapN2.xy, mapN.z * mapN2.z ) );
`;

export function patch(mat, features = {}) {
  const flags = Object.keys(features).filter(k => features[k]).sort();
  const defs = `${flags.map(k => `#define G_${k.toUpperCase()}`).join('\n')}\n`;
  mat.customProgramCacheKey = () => `cc:${flags.join(',')}`;
  mat.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, U);
    if (features.wind) shader.uniforms.uWindAmp = { value: features.wind };
    if (features.ground) shader.uniforms.uMacro = { value: T.macroTex() };
    shader.vertexShader = defs + shader.vertexShader
      .replace('#include <common>', `#include <common>\n${VERT_PARS}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>\n${VERT_BEGIN}`)
      .replace('#include <project_vertex>', `#include <project_vertex>\n${VERT_WORLD}`);
    shader.fragmentShader = defs + shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${FRAG_PARS}`)
      .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>\n${FRAG_CLIP}`)
      .replace('#include <map_fragment>', `#include <map_fragment>\n${FRAG_MAP}`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>\n${FRAG_EMIT}`)
      .replace('#include <opaque_fragment>', FRAG_OUT);
    if (features.water) shader.fragmentShader = shader.fragmentShader.replace('vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;', WATER_N);
  };
  return mat;
}

// Shadow-pass twin for meshes whose vertices move in the shader.
export function depthTwin(features, source) {
  const mat = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });
  if (source?.map && source.alphaTest) {
    mat.map = source.map;
    mat.alphaTest = source.alphaTest;
  }
  return patch(mat, { root: features.root, grow: features.grow, wind: features.wind, hedge: features.hedge, rise: features.rise, radial: features.radial });
}

const std = (params, features = {}) => {
  const mat = patch(new THREE.MeshStandardMaterial(params), features);
  mat.userData.features = features;
  return mat;
};

function finish(params, features = { seam: true }) {
  const mat = std(params, features);
  mat.clippingPlanes = [finishPlane];
  mat.clipShadows = true;
  return mat;
}

let materials = null;

export function getMaterials() {
  if (materials) return materials;
  const stone = T.stoneTex();
  const premul = { transparent: true, depthWrite: false, blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor };
  const m = {};
  // Finished house, revealed below the rising build plane.
  m.white = finish({ map: T.plasterTex(), roughness: 0.86 });
  m.concrete = finish({ map: T.concreteTex(), roughness: 0.86 });
  m.stone = finish({ map: stone.map, bumpMap: stone.bump, bumpScale: 1.3, roughness: 0.92 });
  m.wood = finish({ map: T.woodTex(), roughness: 0.58, vertexColors: true });
  m.backing = finish({ color: '#2c2824', roughness: 0.9 });
  m.soffit = finish({ map: T.soffitTex(), roughness: 0.62 });
  m.alu = finish({ color: '#25282b', roughness: 0.38, metalness: 0.6 });
  m.gravel = finish({ map: T.gravelTex(), roughness: 1 });
  m.pv = finish({ map: T.pvTex(), roughness: 0.22, metalness: 0.3 });
  m.deckHouse = finish({ map: T.deckTex(), roughness: 0.7 });
  m.glass = finish({ color: '#0b1114', roughness: 0.04, metalness: 0, envMapIntensity: 1.3, ...premul }, { glass: true });
  // Interior seen through the glazing, lit by warm lamps.
  m.intFloor = finish({ map: T.plateTex(), color: '#d8cfc1', roughness: 0.35, envMapIntensity: 0.35, emissive: '#ffcf9a', emissiveIntensity: 0.06 }, { lamp: true });
  m.intWall = finish({ color: '#efe7db', roughness: 0.9, envMapIntensity: 0.3, emissive: '#ffd2a0', emissiveIntensity: 0.2 }, { lamp: true });
  m.intCeil = finish({ color: '#f3eee6', roughness: 0.9, envMapIntensity: 0.25, emissive: '#ffd6a8', emissiveIntensity: 0.28 }, { lamp: true });
  m.intWood = finish({ map: T.woodTex(), color: '#c9a07a', roughness: 0.55, envMapIntensity: 0.35, emissive: '#ffb878', emissiveIntensity: 0.06, vertexColors: true }, { lamp: true });
  m.fabric = finish({ color: '#cbc2b4', roughness: 0.95, envMapIntensity: 0.3, emissive: '#ffcf9a', emissiveIntensity: 0.07 }, { lamp: true });
  m.fabricDark = finish({ color: '#4d4945', roughness: 0.95, envMapIntensity: 0.3 });
  m.cushionInt = finish({ color: '#f1ece3', roughness: 0.95, envMapIntensity: 0.3, emissive: '#ffcf9a', emissiveIntensity: 0.08 }, { lamp: true });
  m.furnitureH = finish({ color: '#3a3836', roughness: 0.6, metalness: 0.2 });
  m.cushionH = finish({ color: '#e7e1d6', roughness: 0.95 });
  m.lamp = finish({ color: '#000000', emissive: '#ffcf96', emissiveIntensity: 6, roughness: 1 }, { lamp: true });
  // Bare reinforced-concrete frame, visible above the build plane.
  m.frame = std({ map: T.concreteTex(), color: '#e3e8ea', roughness: 0.88 }, { rise: true });
  m.frame.clippingPlanes = [structurePlane];
  m.frame.clipShadows = true;
  // Landscape, revealed by the expanding ring.
  m.ground = std({ map: T.grassTex(), roughness: 0.96, envMapIntensity: 0.8 }, { ground: true });
  m.paver = std({ map: T.paverTex(), roughness: 0.85 }, { radial: true });
  m.plate = std({ map: T.plateTex(), roughness: 0.78, vertexColors: true }, { radial: true });
  m.deck = std({ map: T.deckTex(), roughness: 0.72 }, { radial: true });
  m.deckSide = std({ color: '#4a3424', roughness: 0.8 }, { radial: true });
  m.pebble = std({ map: T.pebbleTex(), roughness: 0.9 }, { radial: true });
  m.curb = std({ color: '#bab6ad', roughness: 0.9 }, { radial: true });
  m.tile = std({ map: T.tileTex(), roughness: 0.3, emissive: '#3fb8d0', emissiveIntensity: 0.35 }, { radial: true });
  m.water = std({ color: '#0d4a5a', roughness: 0.05, normalMap: T.waterNormalTex(), normalScale: new THREE.Vector2(0.18, 0.18), envMapIntensity: 1.1, ...premul }, { radial: true, water: true });
  m.furniture = std({ color: '#3a3836', roughness: 0.6, metalness: 0.2 }, { radial: true });
  m.cushion = std({ color: '#e7e1d6', roughness: 0.95 }, { radial: true });
  m.bollard = std({ color: '#2b2c2d', roughness: 0.5, metalness: 0.4 }, { radial: true });
  m.bollardLight = std({ color: '#000000', emissive: '#ffcf96', emissiveIntensity: 3 }, { radial: true, lamp: true });
  // Vegetation grows when the ring reaches it and sways in the wind.
  m.leaf = std({ map: T.leafTex(), alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.75, vertexColors: true }, { root: true, grow: true, wind: 0.0016, flutter: true, sss: true });
  m.shrub = std({ map: T.leafTex(), alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.8, vertexColors: true }, { root: true, grow: true, wind: 0.01, sss: true });
  m.frond = std({ map: T.frondTex(), alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.7, vertexColors: true }, { root: true, grow: true, wind: 0.0009, sss: true });
  m.palmBark = std({ map: T.palmBarkTex(), roughness: 0.95 }, { root: true, grow: true, wind: 0.0009 });
  m.bark = std({ map: T.barkTex(), roughness: 0.95 }, { root: true, grow: true, wind: 0.0016 });
  m.blade = std({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.8 }, { root: true, grow: true, wind: 0.09, sss: true });
  m.hedge = std({ map: T.hedgeTex(), roughness: 0.85, vertexColors: true }, { hedge: true, radial: true, sss: true });
  materials = m;
  return m;
}
