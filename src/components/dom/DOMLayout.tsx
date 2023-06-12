'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { Nav } from './Nav'
const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false })
const ThreeDee = dynamic(() => import('@/components/canvas/ThreeDee').then((mod) => mod.ThreeDee), { ssr: false })

const DOMLayout = ({ children }) => {
  const ref = useRef()

  return (
    <>
      <Scene
        camera={{
          fov: 60,
        }}
        gl={{
          useLegacyLights: false,
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
        }}
        eventPrefix='client'
      >
        <ThreeDee color={'#181818'} />
      </Scene>
      {children}
      <Nav />
    </>
  )
}

export { DOMLayout }
