'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { Nav } from './Nav'
import { Cursor } from './Cursor'
const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false })
const ThreeDee = dynamic(() => import('@/components/canvas/ThreeDee').then((mod) => mod.ThreeDee), { ssr: false })

const DOMLayout = ({ children }) => {
  const ref = useRef()

  return (
    <div
      id='root'
      ref={ref}
      style={{
        position: 'relative',
        width: ' 100%',
        height: '100%',
        overflow: 'auto',
        touchAction: 'auto',
      }}
    >
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
        eventSource={ref}
        eventPrefix='client'
      >
        <ThreeDee color={'#181818'} />
      </Scene>
      <div className='relative mx-[calc(2rem+1vw)] md:mx-[calc(3rem+1vw)] lg:mx-[calc(5rem+1vw)]'>
        <Nav />
        {children}
      </div>
      <Cursor />
    </div>
  )
}

export { DOMLayout }
