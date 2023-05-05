'use client'

import dynamic from 'next/dynamic'

const LightCube = dynamic(() => import('@/components/canvas/LightCube').then((mod) => mod.LightCube), { ssr: false })
const Camera = dynamic(() => import('@/components/canvas/PanningCamera').then((mod) => mod.PanningCamera), { ssr: false })
const Effects = dynamic(() => import('@/components/canvas/Effects').then((mod) => mod.Effects), { ssr: false })
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {ssr:false})

export const Main = ():JSX.Element => {
  return (
    <>
      <LightCube />
      <ambientLight intensity={0.01} />
      <hemisphereLight groundColor='black' intensity={0.01} />
      <Camera />
      <Effects />
    </>
  )
}
