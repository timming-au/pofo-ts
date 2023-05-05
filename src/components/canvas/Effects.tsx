import { EffectComposer, Bloom, LUT } from '@react-three/postprocessing'
import React from 'react'
export const Effects = ():JSX.Element => {
  return (
    <EffectComposer disableNormalPass>
      <Bloom luminanceThreshold={0.6} mipmapBlur luminanceSmoothing={0} intensity={0.2} />
    </EffectComposer>
  )
}
