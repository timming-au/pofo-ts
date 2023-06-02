'use client'

import { useFrame, useThree } from '@react-three/fiber'
import dynamic from 'next/dynamic'

const LightCube = dynamic(() => import('@/components/canvas/LightCube').then((mod) => mod.LightCube), { ssr: false })
const PanningCamera = dynamic(() => import('@/components/canvas/PanningCamera').then((mod) => mod.PanningCamera), { ssr: false })
const Effects = dynamic(() => import('@/components/canvas/Effects').then((mod) => mod.Effects), { ssr: false })
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {ssr:false})
const Cubes = dynamic(() => import('@/components/canvas/Cubes').then((mod) => mod.Cubes), {ssr:false})

export const Main = ({...props}):JSX.Element => {
  console.log("RUN")
  return (
    <group onPointerOver={() => {}} onPointerOut={() => {}} >
      <LightCube/>
      <ambientLight intensity={0.01} />
      <hemisphereLight groundColor='black' intensity={0.01} />
      <PanningCamera />
      <Effects />
      <Cubes/>
    </group>
  )
}
