import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useCursor, MeshReflectorMaterial } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3, Euler, Color, Object3D, DynamicDrawUsage } from 'three'
import { maths, randHSL } from '@/helpers/utils'
import React from 'react'
import { CubeProps, FloorProps, instancerParams } from '@/types'

export function Cubes({ ...props }) {

  class Pillar {
    pillar:CubeProps[] = []
    cubesPerPillar: number = 5
    pos: [x:number,y:number,z:number]
    rot: [x:number,y:number,z:number]
    cubeSize: number

    constructor(spawns: {position:[x:number,y:number,z:number],rotation:[x:number,y:number,z:number]}, cubesPerPillar, cubeSize) {
      this.pos = spawns.position
      this.rot = spawns.rotation
      this.cubesPerPillar = cubesPerPillar
      this.cubeSize = cubeSize
      this.create()
    }

    cubePropsGen(index): CubeProps {
      let randPosMultiplier = 5
      let cubeProps: CubeProps = {
        rot: [0, (Math.random() * Math.PI) / 20 + this.rot[1], 0],
        pos: [
          (Math.random() * this.cubeSize) / randPosMultiplier + this.pos[0],
          index * this.cubeSize + this.pos[1] + this.cubeSize / 2,
          (Math.random() * this.cubeSize) / randPosMultiplier + this.pos[2],
        ],
        // @ts-ignore
        size: [this.cubeSize, this.cubeSize, this.cubeSize].map((x) => x + (Math.random() * x) / 3),
        color: randHSL.noColor(),
      }
      return cubeProps
    }

    /**
     * Creates pillar array of cubes
     */
    create(): void {
      for (let i = 0; i < this.cubesPerPillar; i++) {
        let cubeProps = this.cubePropsGen(i)
        this.pillar.push(cubeProps)
      }
    }

    /**
     * Gets pillar array
     */
    get(): CubeProps[] {
      return this.pillar
    }
  }

  class PillarFactory {

    pos: [x:number,y:number,z:number]
    rotation: [x:number,y:number,z:number]
    minCubesPerPillar: number
    maxCubesPerPillar: number
    pillarCount: number
    cubeSize: number
    pillars: Pillar[] = []
    spawns: {position:[x:number,y:number,z:number],rotation:[x:number,y:number,z:number]}[] = []

    constructor(floorProps, minCubesPerPillar, maxCubesPerPillar, pillarCount, cubeSize) {
      this.pos = floorProps.position
      this.rotation = floorProps.rotation
      this.minCubesPerPillar = minCubesPerPillar
      this.maxCubesPerPillar = maxCubesPerPillar
      this.pillarCount = pillarCount
      this.cubeSize = cubeSize
      this.produce()
    }

    /**
     * Creates pillar spawns
     */
    createSpawns(): void {
      // random x distance between pillars
      let r = (this.cubeSize / 4) * INSTANCE_PROPS.maxScale
      // x distance between pillars based on cube size
      let c = this.cubeSize + r
      // x length based on pillar count, size & random distance
      let n = (this.pillarCount * c) / 2
      let mid = this.pillarCount / 2
      let midFloor = Math.floor(mid)
      for (let i = 0; i < this.pillarCount; i++) {
        let p = midFloor - i
        let z = Math.abs(p - (Math.random() - 0.5))

        // normalise z position component
        let normalisedZ = Math.abs(p / midFloor)

        // ease out-in z position component like a parabola
        let exponentZ = maths.ease.inQuad(Math.abs(normalisedZ)) / 2

        // add cube spawn to spawns array
        this.spawns.push({
          position: [
            Math.random() * r + c * i - n + this.pos[0] + p * c * 0.6 * exponentZ,
            0 + this.pos[1],
            this.pos[2] + Math.pow(z, exponentZ),
          ],
          rotation: [this.rotation[0], (p * Math.PI) / midFloor / 2 + this.rotation[1], this.rotation[2]],
        })
      }
    }

    /**
     * Push pillar instances
     */
    createPillars(): void {
      for (let i = 0; i < this.spawns.length; i++) {
        this.pillars.push(
          new Pillar(this.spawns[i], maths.between(this.minCubesPerPillar, this.maxCubesPerPillar), this.cubeSize),
        )
      }
    }

    /**
     * Generates spawns and pillar instances
     */
    produce(): void {
      this.createSpawns()
      this.createPillars()
    }

    /**
     * Returns pillar array
     */
    get(): Pillar[] {
      return this.pillars
    }
  }

  class Floor {
    position: [x:number,y:number,z:number]
    rotation: [x:number,y:number,z:number]
    size: [x:number,y:number,z:number]
    mesh: JSX.Element

    constructor(floorProps) {
      this.position = floorProps.position
      this.rotation = floorProps.rotation
      this.size = floorProps.size
      this.mesh = this.create()
    }

    create(): JSX.Element {
      let floor = (
        <mesh position={this.position} rotation={this.rotation}>
          <planeGeometry args={[...this.size]}></planeGeometry>
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
      return floor
    }

    get(): JSX.Element {
      return this.mesh
    }
  }

  class CubeScene {
    scene: THREE.Scene
    floor: Floor
    pf: PillarFactory

    constructor(scene) {
      this.scene = scene
      this.floor = new Floor(FLOOR_PROPS)
      this.pf = new PillarFactory(FLOOR_PROPS, MIN_CUBES_PER_PILLAR, MAX_CUBES_PER_PILLAR, PILLAR_COUNT, CUBE_SIZE)
    }

    /**
     * Returns flattened array of cubeProps
     */
    getCubesProps(): CubeProps[][] {
      return this.pf.get().map((pillar) => pillar.get())
    }

    /**
     * Returns floor object
     */
    getFloor(): JSX.Element {
      return this.floor.get()
    }

    run(): void {
      this.scene.background = new Color('rgb(0,0,0)')
    }
  }

  /**
   * Instancer
   */
  function Instances({ spawnProps, dummy = new Object3D(), initialScale, maxScale }: instancerParams) {
    const ref = useRef(null)
    let needToScale = true
    let scaleSpeed = 0.01
    useEffect(() => {
      let index = 0
      for (let i = 0; i < spawnProps.length; i++) {
        for (let j = 0, props = spawnProps[i]; j < props.length; j++) {
          // Set initial positions of the dummy
          dummy.position.set(...props[j].pos)
          dummy.rotation.set(...props[j].rot)
          // @ts-ignore
          dummy.scale.set(...props[j].size.map((s) => s * initialScale))
          dummy.updateMatrix()

          // Set matrix of instance
          ref.current.setMatrixAt(index, dummy.matrix)
          ref.current.setColorAt(index, new Color(props[j].color))
          index++
        }
      }

      // Update the instance
      ref.current.instanceMatrix.needsUpdate = true
      ref.current.instanceMatrix.setUsage(DynamicDrawUsage)
    })

    useFrame((state, delta) => {
      if (needToScale) {
        let index = 0
        for (let i = 0; i < spawnProps.length; i++) {
          for (let j = 0, props = spawnProps[i]; j < props.length; j++) {
            // get current index's matrix
            ref.current.getMatrixAt(index, dummy.matrix)

            // get target scale
            let targetSize = new Vector3(...props[j].size.map((s) => s * maxScale))
            let currentSize = dummy.scale

            if (targetSize.x <= currentSize.x && targetSize.y <= currentSize.y && targetSize.z <= currentSize.z) {
              // stop scaling
              needToScale = false
            } else {
              // incase all cubes not at max scale
              needToScale = true
            }

            // set scale
            dummy.scale.set(
              ...currentSize
                .add(
                  new Vector3()
                    .subVectors(targetSize, currentSize)
                    .add(targetSize.multiplyScalar(0.01))
                    .multiplyScalar(scaleSpeed * delta),
                )
                .toArray(),
            )

            // re-set other matrix props
            dummy.position.set(...props[j].pos)
            dummy.rotation.set(...props[j].rot)
            dummy.updateMatrix()

            // set matrix!
            ref.current.setMatrixAt(index, dummy.matrix)
            index++
          }
          // tells the renderer that the instance matrix has changed and needs to be updated
          ref.current.instanceMatrix.needsUpdate = true
        }
      }
    })
    return (
      <instancedMesh ref={ref} args={[null, null, spawnProps.flat().length]}>
        <boxGeometry args={[1, 1, 1]}></boxGeometry>
        <meshLambertMaterial></meshLambertMaterial>
      </instancedMesh>
    )
  }

  
  /**
   * Define generation properties
   */
  const FLOOR_PROPS:FloorProps = {
    position: [0, -4, 0],
    rotation: [-Math.PI / 2, 0, 0],
    size: [50, 50],
  }
  const INSTANCE_PROPS = {
    initialScale: 0,
    maxScale: 2.5,
  }
  const MIN_CUBES_PER_PILLAR = 10
  const MAX_CUBES_PER_PILLAR = 15
  const PILLAR_COUNT = 21
  const CUBE_SIZE = 0.3

  /**
   * create scene
   */
  const { scene } = useThree()
  let cubeScene = new CubeScene(scene)
  let cubeProps = cubeScene.getCubesProps()
  let floor = cubeScene.getFloor()

  return (
    <>
      <Instances spawnProps={cubeProps} initialScale={0} maxScale={2.5} />
      {floor}
    </>
  )
}

