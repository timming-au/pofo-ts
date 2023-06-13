import { useFrame, useThree } from '@react-three/fiber'
import dynamic from 'next/dynamic'
import { Cubes } from '@/components/canvas/Cubes'
import { LightCube } from '@/components/canvas/LightCube'
import { PanningCamera } from '@/components/canvas/PanningCamera'
import { Effects } from '@/components/canvas/Effects'
import { Color, ColorRepresentation } from 'three'
import { FC, Suspense } from 'react'
import { FallbackBackground } from '@/components/canvas/FallbackBackground'
import { Floor } from './Floor'
import { FloorProps } from '@/types'

export const ThreeDee: FC<{ color?: ColorRepresentation }> = ({ color, ...props }): JSX.Element => {
  let floorProps: FloorProps = {
    position: [0, -4, 0],
    rotation: [-Math.PI / 2, 0, 0],
    size: [100, 50],
  }
  // const { scene } = useThree()
  // scene.background = new Color(color)
  console.log('ThreeDee')
  return (
    <Suspense fallback={<FallbackBackground color={'#ff0000'} />}>
      <group {...props}>
        <PanningCamera />
        <LightCube />
        <ambientLight intensity={0.01} />
        <hemisphereLight groundColor='black' intensity={0.01} />
        <Effects />
        <Floor floorProps={floorProps} />
        <Cubes floorProps={floorProps} />
      </group>
    </Suspense>
  )
}
