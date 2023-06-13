'use client'
import { Canvas } from '@react-three/fiber'
import { Preload, PerspectiveCamera, PerformanceMonitor } from '@react-three/drei'
import { Vector3 } from 'three'
import { useState, useEffect } from 'react'
import React from 'react'
import { r3f } from '@/helpers/global'
import { ThreeDee } from './ThreeDee'

export default function Scene({ children, ...props }) {
  // Everything defined in here will persist between route changes, only children are swapped
  const [dpr, setDpr] = useState(1)
  useEffect(() => {
    console.log('Scene')
  })
  // Everything defined in here will persist between route changes, only children are swapped
  return (
    <Canvas {...props}>
      <PerformanceMonitor onIncline={() => setDpr(window.devicePixelRatio)} onDecline={() => setDpr(1)}>
        {children}
        <r3f.Out />
        <Preload all />
      </PerformanceMonitor>
    </Canvas>
  )
}
