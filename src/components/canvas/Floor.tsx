import React from 'react'
import { FloorProps } from '@/types'
import { FC } from 'react'
import { ColorRepresentation } from 'three'
import { MeshReflectorMaterial } from '@react-three/drei'

export const Floor:FC<{color?:ColorRepresentation, floorProps:FloorProps}> = ({color, floorProps, ...props}) => {
  // can optimise by not setting mesh reflector material for the whole mesh.
  return (
    <mesh position={floorProps.position} rotation={floorProps.rotation}>
      <planeGeometry args={[...floorProps.size]}></planeGeometry>
      <MeshReflectorMaterial
        blur={[300, 100]} // Blur ground reflections (width, height), 0 skips blur
        mixBlur={1} // How much blur mixes with surface roughness (default = 1)
        mixStrength={50} // Strength of the reflections
        roughness={0.9}
        resolution={2048} // Off-buffer resolution, lower=faster, higher=better quality, slower
        mirror={1} // Mirror environment, 0 = texture colors, 1 = pick up env colors
        depthScale={2} // Scale the depth factor (0 = no depth, default = 0)
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color='#050505'
        metalness={0.4}
        reflectorOffset={0} // Offsets the virtual camera that projects the reflection. Useful when the reflective surface is some distance from the object's origin (default = 0)
      />
    </mesh>
  )

}