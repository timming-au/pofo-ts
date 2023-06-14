import { PerspectiveCamera, useCursor } from '@react-three/drei'
import { useThree, useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import React, { useEffect, useRef } from 'react'

interface CameraProps {
  cameraPos?: [x: number, y: number, z: number]
  tPos?: [x: number, y: number, z: number]
  tRot?: [x: number, y: number]
}

export const PanningCamera = ({ cameraPos = [0, -2, 10], tPos = [0, -1, 10], tRot = [0, -0.3] }: CameraProps) => {
  const camera = useRef()
  const targetPos: [x: number, y: number, z: number] = tPos
  const targetRot: [x: number, y: number] = tRot
  function pan(friction: number, camera, pointer) {
    let f = friction * 300
    let c = camera
    let [rex, rey] = [targetRot[1], targetRot[0]]
    // target location
    let [pex, pey] = [targetPos[1], targetPos[0]]
    // lerp rotation smoothly
    gsap.to(c.rotation, {
      y: rey - c.rotation.y + (pointer.x * Math.PI) / 15,
      x: rex - c.rotation.x - (pointer.y * Math.PI) / 12,
      duration: 2,
      ease: 'power3.out',
    })
    // lerp position smoothly
    gsap.to(c.position, {
      x: pey - (pey - c.position.y - pointer.x * 450) / f,
      y: pex - (pex - c.position.x - pointer.y * 450) / f,
      duration: 2,
      ease: 'power3.out',
    })
  }
  // optimise something here, don't make it run on every frame
  useFrame((state) => {
    pan(0.8, state.camera, state.pointer)
  })
  return <PerspectiveCamera ref={camera} makeDefault position={cameraPos} fov={60} />
}
