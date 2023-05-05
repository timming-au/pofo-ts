import { PerspectiveCamera } from '@react-three/drei'
import { useThree, useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import React from 'react'

interface CameraProps {
  tPos?: [x:number,y:number,z:number]
  tRot?: [x:number,y:number]
}

export const PanningCamera = ({tPos = [0, 0, 10], tRot = [0, -0.3]}:CameraProps): JSX.Element => {
  const { camera, pointer } = useThree()

  const targetPos: [x:number,y:number,z:number] = tPos
 
  const targetRot: [x:number,y:number] = tRot

  function pan(friction: number) {
    let f = friction * 300
    let c = camera
    let [rex, rey] = [targetRot[1], targetRot[0]]
    // target location
    let [pex, pey] = [targetPos[1], targetPos[0]]
    // lerp rotation smoothly
    gsap.to(c.rotation, {
      y: rey - c.rotation.y - (pointer.x * Math.PI) / 15,
      x: rex - c.rotation.x + (pointer.y * Math.PI) / 12,
      duration: 2,
      ease: 'power3.out',
    })
    // lerp position smoothly
    gsap.to(c.position, {
      x: pey + (pey - c.position.y - pointer.x * 450) / f,
      y: pex + (pex - c.position.x - pointer.y * 450) / f,
      duration: 2,
      ease: 'power3.out',
    })
  }
  // optimise something here, don't make it run on every frame
  useFrame(() => {
    pan(0.8)
  })
  return <PerspectiveCamera makeDefault position={targetPos} />
}
