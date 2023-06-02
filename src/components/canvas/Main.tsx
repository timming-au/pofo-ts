import { useFrame, useThree } from '@react-three/fiber'
import dynamic from 'next/dynamic'
import { Cubes } from '@/components/canvas/Cubes'
import { LightCube } from '@/components/canvas/LightCube'
import { PanningCamera } from '@/components/canvas/PanningCamera'
import { Effects } from '@/components/canvas/Effects'
import { Color } from 'three'
import { Suspense } from 'react'
import { FallbackBackground } from '@/components/canvas/FallbackBackground'
import { Floor } from './Floor'
import { FloorProps } from '@/types'

export const Main = ({...props}):JSX.Element => {
  let floorProps: FloorProps = {
    position: [0, -4, 0],
    rotation: [-Math.PI / 2, 0, 0],
    size: [50, 50],
  }
  return (
    <Suspense fallback={<FallbackBackground color={"#ff0000"}/>}>
      <group {...props} onPointerOver={() => {}} onPointerOut={() => {}} >
        <PanningCamera />
        <LightCube/>
        <ambientLight intensity={0.01} />
        <hemisphereLight groundColor='black' intensity={0.01} />
        <Effects />
        <Floor floorProps={floorProps}/>
        <Cubes floorProps={floorProps}/>
      </group>
    </Suspense>
  )
}
