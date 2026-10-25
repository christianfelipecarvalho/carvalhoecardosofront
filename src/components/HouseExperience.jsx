import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import logo from '../assets/LOGO.png';
import poster from '../assets/optimized/house-poster.webp';
import './HouseExperience.css';

// three.js only downloads when the section is about to be seen (or the browser is idle).
const HouseScene3D = lazy(() => import('./house3d/HouseScene3D'));

const stages = [
  { title: 'Planta', description: 'Cada linha tem um propósito.' },
  { title: 'Estrutura', description: 'Precisão que sustenta cada escolha.' },
  { title: 'Realidade', description: 'O seu próximo capítulo, construído.' },
];
// How long each stage stays on screen; the scene builds it in the first ~70%.
const DURATIONS = [2600, 3000, 7000];

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
  } catch {
    return false;
  }
}

export default function HouseExperience() {
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [stage, setStage] = useState(() => (reduced() ? 2 : 0));
  const [paused, setPaused] = useState(reduced);
  const [reducedMotion, setReducedMotion] = useState(reduced);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(!document.hidden);
  const [webgl] = useState(supportsWebGL);
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const [restart, setRestart] = useState(0);
  const root = useRef(null);
  const elapsed = useRef(0);
  const live = webgl && ready;
  const running = live && inView && tabVisible && !paused;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    const near = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setLoad(true); }, { rootMargin: '900px 0px' });
    if (root.current) {
      observer.observe(root.current);
      near.observe(root.current);
    }
    // On larger screens the scene is fetched while the browser is idle; phones wait until it is close.
    const preload = () => { if (window.innerWidth >= 760) setLoad(true); };
    const idle = window.requestIdleCallback ? window.requestIdleCallback(preload, { timeout: 5000 }) : window.setTimeout(preload, 3000);
    const onVisibility = () => setTabVisible(!document.hidden);
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = () => {
      setReducedMotion(media.matches);
      if (media.matches) { setPaused(true); setStage(2); }
    };
    document.addEventListener('visibilitychange', onVisibility);
    media.addEventListener('change', onMotionChange);
    return () => {
      observer.disconnect();
      near.disconnect();
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      document.removeEventListener('visibilitychange', onVisibility);
      media.removeEventListener('change', onMotionChange);
    };
  }, []);

  // Elapsed time lives outside rendering: pausing keeps the exact moment of the stage.
  useEffect(() => {
    if (!running) return undefined;
    let previous = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      elapsed.current += now - previous;
      previous = now;
      if (elapsed.current >= DURATIONS[stage]) {
        elapsed.current = 0;
        setStage(value => (value + 1) % stages.length);
      }
    }, 80);
    return () => window.clearInterval(timer);
  }, [running, stage, restart]);

  function selectStage(next) {
    elapsed.current = 0;
    setPaused(true);
    setStage(next);
    setRestart(value => value + 1);
  }

  function replay() {
    elapsed.current = 0;
    setStage(0);
    setPaused(false);
    setRestart(value => value + 1);
  }

  return (
    <div ref={root} className={`house-experience house-stage-${live ? stage : 2}${running ? ' is-playing' : ' is-paused'}`}>
      <div className="house-experience-topline">
        <span><i /> DO TRAÇO À CONQUISTA</span>
        <span className="house-coordinate">28°40′ S / 49°22′ O</span>
      </div>
      <div className={`house-scene${live ? ' is-live' : ''}`} role="img" aria-label="Animação em 3D: a planta da casa é desenhada, a estrutura de concreto se ergue e a residência pronta aparece enquanto a câmera voa ao redor dela.">
        <img className="house-poster" src={poster} alt="" width="1400" height="713" />
        {webgl && load && (
          <Suspense fallback={null}>
            <HouseScene3D stage={stage} playing={running} reducedMotion={reducedMotion} onReady={() => setReady(true)} />
          </Suspense>
        )}
        <div className="house-signature" aria-hidden={stage !== 2}>
          <img src={logo} alt="Carvalho & Cardoso" />
          <span>DA SUA IDEIA.<br /><strong>PARA A VIDA.</strong></span>
        </div>
        <span className="house-concept">Estudo volumétrico ilustrativo</span>
      </div>
      {live && (
        <div className="house-experience-controls">
          <div className="house-stage-buttons" role="group" aria-label="Etapas da construção">
            {stages.map((item, index) => (
              <button key={item.title} type="button" className={stage === index ? 'active' : ''} aria-pressed={stage === index} onClick={() => selectStage(index)}>
                <span>0{index + 1}</span>{item.title}
              </button>
            ))}
          </div>
          <div className="house-playback" role="group" aria-label="Reprodução da construção">
            <button className="house-replay" type="button" onClick={() => selectStage(Math.max(0, stage - 1))} aria-label="Voltar à etapa anterior" title="Etapa anterior" disabled={stage === 0}>
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M6 5v14M18 5l-9 7 9 7Z" /></svg>
            </button>
            <button className="house-replay house-play-toggle" type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Retomar animação' : 'Pausar animação'} title={paused ? 'Retomar animação' : 'Pausar animação'}>
              <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">{paused ? <path d="m8 5 11 7-11 7Z" /> : <path d="M7 5h3v14H7zm7 0h3v14h-3z" />}</svg>
              <span>{paused ? 'Retomar' : 'Pausar'}</span>
            </button>
            <button className="house-replay" type="button" onClick={replay} aria-label="Reiniciar animação da construção" title="Reiniciar">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 10a8 8 0 1 1 1 7M4 4v6h6" /></svg>
            </button>
          </div>
        </div>
      )}
      <p className="house-stage-caption">{stages[live ? stage : 2].description}</p>
    </div>
  );
}
