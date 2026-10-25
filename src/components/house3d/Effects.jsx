import { useEffect } from 'react';
import { Bloom, EffectComposer, N8AO, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';

// Desktop-only finishing: ambient occlusion grounds the house, bloom lets lamps and the build seam glow.
export default function Effects({ onLoaded }) {
  useEffect(() => { onLoaded?.(); }, [onLoaded]);
  return (
    <EffectComposer multisampling={4} enableNormalPass={false}>
      <N8AO halfRes aoRadius={1.6} distanceFalloff={0.8} intensity={2.4} quality="medium" />
      <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={0.55} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
