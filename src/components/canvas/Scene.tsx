'use client'
import { Canvas } from '@react-three/fiber'
import { Preload, PerspectiveCamera, PerformanceMonitor } from '@react-three/drei'
import { Vector3 } from 'three'
import Camera from './PanningCamera'
import Effects from './Effects'
import LightCube from './LightCube'
import { useState, useEffect } from 'react'
import React from 'react'
import { r3f } from '@/helpers/global'

export default function Scene({ ...props }) {
  // Everything defined in here will persist between route changes, only children are swapped
  const [dpr, setDpr] = useState(1)
  // Everything defined in here will persist between route changes, only children are swapped
  return (
    <Canvas {...props}>
      <PerformanceMonitor onIncline={() => setDpr(window.devicePixelRatio)} onDecline={() => setDpr(1)}>
        <LightCube />
        <ambientLight intensity={0.01} />
        <hemisphereLight groundColor='black' intensity={0.01} />
        {/* {children} */}
        <r3f.Out />
        <Preload all />
        <Camera />
        <Effects />
      </PerformanceMonitor>
    </Canvas>
  )
}
