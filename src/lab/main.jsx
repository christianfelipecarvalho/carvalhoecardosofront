// Dev-only harness (served by `vite` at /lab.html, never built): renders one 3D house scene
// in a deterministic state so scripts/lab-shot.mjs can screenshot it.
//   /lab.html?stage=0|1|2&t=<seconds since stage start>&angle=<orbit degrees>
//   /lab.html?play=1            live animation, cycling stages like the site
import { StrictMode, Suspense, lazy, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

const params = new URLSearchParams(location.search);
const Scene = lazy(() => import('../components/house3d/HouseScene3D'));
const play = params.get('play') === '1';
const debug = play ? undefined : { t: Number(params.get('t') ?? 99), angle: Number(params.get('angle') ?? 35) };

function Lab() {
  const [stage, setStage] = useState(Number(params.get('stage') ?? 2));
  useEffect(() => {
    if (!play) return undefined;
    const durations = [2600, 3000, 7000];
    const timer = setTimeout(() => setStage(value => (value + 1) % 3), durations[stage]);
    return () => clearTimeout(timer);
  }, [stage]);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Suspense fallback={null}>
        <Scene stage={stage} playing={play} reducedMotion={false} debug={debug} onReady={() => { window.__labReady = true; }} />
      </Suspense>
      {play && <span style={{ position: 'absolute', left: 12, top: 10, color: '#6cc8ee', font: '12px monospace' }}>stage {stage}</span>}
    </div>
  );
}

createRoot(document.getElementById('lab')).render(<StrictMode><Lab /></StrictMode>);
