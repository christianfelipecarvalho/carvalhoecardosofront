import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import '@fontsource/manrope/latin-600.css';
import { CENTER, KEY, SUN, U, clamp01, easeInOut, setBuildY, smooth, span } from './shared';
import { depthTwin, getMaterials } from './materials';
import { setTextureScale } from './textures';
import { buildFrame, buildHouse } from './house';
import { buildSite } from './site';
import { blueprintMaterial, buildBlueprint } from './blueprint';

// Seconds each stage takes to build (the parent holds each stage a little longer).
const BUILD = [1.7, 2.2, 3.0];
const HERO_ANGLE = 205;
const ORBIT_SPEED = 11; // degrees per second, about 33 s per revolution
const REWIND = 0.7;
const Effects = lazy(() => import('./Effects'));
const FOG = new THREE.Color();
const bpMaterial = blueprintMaterial();

const CAST = new Set(['white', 'concrete', 'stone', 'wood', 'backing', 'soffit', 'alu', 'gravel', 'pv', 'deckHouse', 'frame', 'hedge', 'leaf', 'frond', 'bark', 'palmBark', 'shrub', 'furniture', 'cushion', 'bollard', 'furnitureH']);
const NO_RECEIVE = new Set(['glass', 'water', 'lamp', 'bollardLight']);

const SKY_VERT = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = p.xyww;
}`;
const SKY_FRAG = /* glsl */ `
uniform vec3 uSunDir;
uniform float uReal;
varying vec3 vDir;
void main() {
  vec3 d = normalize(vDir);
  float h = d.y;
  vec3 zenith = vec3(0.13, 0.27, 0.56);
  vec3 horizon = mix(vec3(0.3, 0.46, 0.68), vec3(0.98, 0.66, 0.42), smoothstep(0.55, 1.0, uReal));
  vec3 day = mix(horizon, zenith, pow(max(h, 0.0), 0.42));
  float sd = max(dot(d, normalize(uSunDir)), 0.0);
  day += vec3(1.0, 0.72, 0.42) * (pow(sd, 6.0) * 0.45 + pow(sd, 60.0) * 0.8 + smoothstep(0.9993, 0.9997, sd) * 8.0);
  day = mix(day, vec3(0.55, 0.5, 0.44), smoothstep(0.0, -0.12, h));
  vec3 night = mix(vec3(0.0055, 0.013, 0.022), vec3(0.0016, 0.0045, 0.008), smoothstep(-0.05, 0.7, h));
  vec3 c = mix(night, day, uReal);
  gl_FragColor = vec4(c, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

function skyMaterial(real) {
  return new THREE.ShaderMaterial({
    uniforms: { uSunDir: { value: SUN.clone() }, uReal: real === undefined ? U.uReal : { value: real } },
    vertexShader: SKY_VERT,
    fragmentShader: SKY_FRAG,
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
  });
}

function Meshes({ geometries, materials }) {
  const depth = useMemo(() => {
    const out = {};
    for (const key of Object.keys(geometries)) {
      const material = materials[key];
      const features = material?.userData.features || {};
      if (features.root || features.rise || features.hedge || features.radial) out[key] = depthTwin(features, material);
    }
    return out;
  }, [geometries, materials]);
  return Object.entries(geometries).map(([key, geometry]) => materials[key] && (
    <mesh
      key={key}
      geometry={geometry}
      material={materials[key]}
      castShadow={CAST.has(key)}
      receiveShadow={!NO_RECEIVE.has(key)}
      customDepthMaterial={depth[key]}
      renderOrder={key === 'water' ? 2 : key === 'glass' ? 3 : 0}
      frustumCulled={false}
    />
  ));
}

// Plan labels are painted once on small canvases, in the site's typeface.
function labelMesh(text, size) {
  const px = 96;
  const font = `600 ${px}px Manrope, sans-serif`;
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.font = font;
  const w = Math.ceil(ctx.measureText(text).width + px * 0.5), h = Math.ceil(px * 1.4);
  ctx.canvas.width = w;
  ctx.canvas.height = h;
  ctx.font = font;
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, w / 2, h / 2);
  const map = new THREE.CanvasTexture(ctx.canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 4;
  const height = size * 1.4;
  return {
    geometry: new THREE.PlaneGeometry(height * (w / h), height),
    material: new THREE.MeshBasicMaterial({ map, color: '#8fd7f3', transparent: true, depthWrite: false, toneMapped: false, fog: false }),
  };
}

function Labels({ labels, state, onSynced }) {
  const [fontReady, setFontReady] = useState(false);
  const refs = useRef([]);
  useEffect(() => { document.fonts.load('600 96px Manrope').finally(() => setFontReady(true)); }, []);
  const items = useMemo(() => (fontReady ? labels.map(label => ({ ...label, ...labelMesh(label.text, label.size) })) : []), [fontReady, labels]);
  useEffect(() => { onSynced(items.length); }, [items, onSynced]);
  useFrame(() => {
    const { draw, opacity, reveal } = state.current;
    items.forEach((label, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      const hidden = Math.hypot(label.x - U.uRevealC.value.x, label.z - U.uRevealC.value.y) < reveal + 0.5;
      const a = hidden ? 0 : smooth((draw - label.at) / 0.08) * opacity;
      mesh.material.opacity = a;
      mesh.visible = a > 0.002;
    });
  });
  return items.map((label, i) => (
    <mesh
      key={`${label.text}-${i}`}
      ref={node => { refs.current[i] = node; }}
      geometry={label.geometry}
      material={label.material}
      position={[label.x, 0.045, label.z]}
      rotation={[-Math.PI / 2, 0, label.rot]}
      renderOrder={2}
    />
  ));
}

// Image-based light for reflections: the golden-hour sky plus a bright sun disc, baked once.
function useSkyEnvironment(gl) {
  const env = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const scene = new THREE.Scene();
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), skyMaterial(1)));
    const disc = new THREE.Mesh(new THREE.CircleGeometry(7, 24), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffd29e').multiplyScalar(4), side: THREE.DoubleSide, toneMapped: false }));
    disc.position.copy(SUN).multiplyScalar(40);
    disc.lookAt(0, 0, 0);
    scene.add(disc);
    const target = pmrem.fromScene(scene, 0.02);
    pmrem.dispose();
    return target.texture;
  }, [gl]);
  useEffect(() => () => env.dispose(), [env]);
  return env;
}

function World({ stage, playing, reducedMotion, debug, onReady }) {
  const { gl, size, invalidate } = useThree();
  const env = useSkyEnvironment(gl);
  const effectsLoaded = useRef(false);
  const onSynced = useCallback(count => { labelState.current.synced = count; invalidate(); }, [invalidate]);
  const materials = useMemo(() => {
    // Procedural textures are painted on the main thread: smaller canvases on small screens.
    setTextureScale(window.innerWidth < 760 ? 0.5 : 0.75);
    return getMaterials();
  }, []);
  const frame = useMemo(() => buildFrame(), []);
  const house = useMemo(() => buildHouse(), []);
  const site = useMemo(() => buildSite(), []);
  const blueprint = useMemo(() => buildBlueprint(), []);
  const sky = useMemo(() => skyMaterial(), []);
  const sun = useRef(null);
  const hemi = useRef(null);
  const lamps = useRef([]);
  const labelState = useRef({ draw: 0, opacity: 1, reveal: 0, synced: 0 });
  const t = useRef({ P: 0, s: 0, theta: debug?.angle ?? 160, stage, rewind: null, time: 0, frames: 0, ready: false, cam: null });
  const small = size.width < 760;

  useEffect(() => { invalidate(); }, [stage, playing, reducedMotion, debug, invalidate]);

  useFrame((state, delta) => {
    const { camera, scene } = state;
    const st = t.current;
    const dt = Math.min(delta, 0.25);
    // Progress P runs 0 → 3: blueprint, frame, finishes.
    if (debug) {
      st.P = stage + clamp01(debug.t / BUILD[stage]);
      st.theta = debug.angle;
      st.time = 12;
    } else if (reducedMotion) {
      st.P = stage + 1;
      st.theta = HERO_ANGLE;
    } else {
      if (stage !== st.stage) {
        if (!playing) st.P = stage + 1;
        else if (stage < st.stage) st.rewind = { from: st.P, t: 0 };
        st.s = 0;
        st.stage = stage;
      }
      if (playing) {
        st.time += dt;
        st.theta += dt * ORBIT_SPEED;
        if (st.rewind) {
          st.rewind.t += dt;
          const k = easeInOut(st.rewind.t / REWIND);
          st.P = st.rewind.from + (stage - st.rewind.from) * k;
          if (st.rewind.t >= REWIND) st.rewind = null;
        } else {
          st.s += dt;
          st.P = stage + clamp01(st.s / BUILD[stage]);
        }
      }
    }

    const P = st.P;
    const p0 = clamp01(P), p1 = clamp01(P - 1), p2 = clamp01(P - 2);
    U.uTime.value = st.time;
    U.uGrid.value = smooth(p0 * 3);
    U.uFrame.value = p1;
    setBuildY(-0.3 + 8 * easeInOut(span(p2, 0, 0.62)));
    U.uSeam.value = smooth(span(p2, 0, 0.06)) * (1 - smooth(span(p2, 0.58, 0.7)));
    U.uReveal.value = 80 * span(p2, 0.14, 1) ** 2;
    U.uRing.value = smooth(span(p2, 0.14, 0.22)) * (1 - smooth(span(p2, 0.86, 1)));
    U.uGlass.value = smooth(span(p2, 0.42, 0.72));
    U.uPool.value = smooth(span(p2, 0.38, 0.75));
    U.uReal.value = smooth(span(p2, 0.12, 0.9));
    U.uLamps.value = smooth(span(p2, 0.5, 0.92));
    bpMaterial.uniforms.uDraw.value = smooth(p0) * 1.001;
    bpMaterial.uniforms.uOpacity.value = 1 - 0.4 * smooth(p1);
    Object.assign(labelState.current, { draw: bpMaterial.uniforms.uDraw.value, opacity: bpMaterial.uniforms.uOpacity.value, reveal: U.uReveal.value });

    // Light: a cool virtual key light turns into the golden-hour sun.
    const real = U.uReal.value;
    const dir = new THREE.Vector3().lerpVectors(KEY, SUN, real).normalize();
    U.uSunDir.value.copy(dir);
    if (sun.current) {
      sun.current.position.copy(CENTER).addScaledVector(dir, 60);
      sun.current.target.position.copy(CENTER);
      sun.current.target.updateMatrixWorld();
      sun.current.intensity = 2.7 + 0.7 * real;
      sun.current.color.set('#e6eef7').lerp(new THREE.Color('#ffd09c'), real);
    }
    if (hemi.current) {
      hemi.current.intensity = 0.85;
      hemi.current.color.set('#7393ae').lerp(new THREE.Color('#a8c4e6'), real);
      hemi.current.groundColor.set('#0b1620').lerp(new THREE.Color('#6a5f44'), real);
    }
    lamps.current.forEach(light => { if (light) light.intensity = 7 * U.uLamps.value; });
    scene.environmentIntensity = 0.55 + 0.45 * real;
    FOG.set('#0c1b26').lerp(new THREE.Color('#d2c9b6'), real);
    if (scene.fog) {
      scene.fog.color.copy(FOG);
      scene.fog.near = 40 + 5 * real;
      scene.fog.far = 165 + 25 * real;
    }

    // Drone: per-stage elevation and distance, fitted to the viewport's aspect ratio.
    const el = THREE.MathUtils.degToRad(P <= 1 ? 57 : P <= 2 ? 57 - 23 * easeInOut(P - 1) : 34 - 17 * easeInOut(P - 2));
    const k = P <= 1 ? 1.2 : P <= 2 ? 1.2 - 0.12 * easeInOut(P - 1) : 1.08 - 0.08 * easeInOut(P - 2);
    const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const tanH = tanV * camera.aspect;
    const radius = Math.max(11.8 / tanH, (3.9 * Math.cos(el) + 9.6 * Math.sin(el)) / tanV) * 1.3 * k;
    const lookY = 0.4 + 1.6 * smooth(P / 3);
    const theta = THREE.MathUtils.degToRad(st.theta);
    const goal = { el, radius, lookY };
    if (!st.cam || debug || reducedMotion || !playing) st.cam = { ...goal };
    else {
      const f = 1 - Math.exp(-dt * 3);
      for (const key of Object.keys(goal)) st.cam[key] += (goal[key] - st.cam[key]) * f;
    }
    const float = debug || reducedMotion ? 0 : Math.sin(st.time * 0.8) * 0.12 + Math.sin(st.time * 1.9) * 0.05;
    const target = new THREE.Vector3(CENTER.x, st.cam.lookY, CENTER.z);
    camera.position.set(
      target.x + st.cam.radius * Math.cos(st.cam.el) * Math.sin(theta),
      target.y + st.cam.radius * Math.sin(st.cam.el) + float,
      target.z + st.cam.radius * Math.cos(st.cam.el) * Math.cos(theta),
    );
    camera.lookAt(target);

    st.frames += 1;
    if (!st.ready && st.frames > 3 && labelState.current.synced >= blueprint.labels.length && (small || effectsLoaded.current)) {
      st.ready = true;
      onReady?.();
    }
    if (!st.ready) invalidate();
  });

  return (
    <>
      <mesh material={sky} frustumCulled={false} renderOrder={-1}><sphereGeometry args={[400, 32, 16]} /></mesh>
      <fog attach="fog" args={['#0c1b26', 40, 165]} />
      <primitive attach="environment" object={env} />
      <hemisphereLight ref={hemi} />
      <directionalLight
        ref={sun}
        castShadow
        shadow-mapSize={[small ? 1024 : 2048, small ? 1024 : 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.035}
        shadow-camera-left={-26}
        shadow-camera-right={26}
        shadow-camera-top={26}
        shadow-camera-bottom={-26}
        shadow-camera-near={5}
        shadow-camera-far={140}
      />
      {[[-5.4, 2.5, -1.6], [-1.6, 2.5, -0.4], [1.8, 5.6, -4.6]].map((p, i) => (
        <pointLight key={p.join()} ref={node => { lamps.current[i] = node; }} position={p} color="#ffc98f" distance={10} decay={2} />
      ))}
      <Meshes geometries={site} materials={materials} />
      <mesh geometry={blueprint.geometry} material={bpMaterial} renderOrder={1} frustumCulled={false} />
      <Labels labels={blueprint.labels} state={labelState} onSynced={onSynced} />
      <Meshes geometries={frame} materials={materials} />
      <Meshes geometries={house} materials={materials} />
      {!small && (
        <Suspense fallback={null}>
          <Effects onLoaded={() => { effectsLoaded.current = true; invalidate(); }} />
        </Suspense>
      )}
    </>
  );
}

export default function HouseScene3D({ stage = 2, playing = true, reducedMotion = false, debug, onReady }) {
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 1.75]}
      frameloop={playing && !debug && !reducedMotion ? 'always' : 'demand'}
      camera={{ fov: 28, near: 0.5, far: 900 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => { gl.localClippingEnabled = true; }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <World stage={stage} playing={playing} reducedMotion={reducedMotion} debug={debug} onReady={onReady} />
    </Canvas>
  );
}
