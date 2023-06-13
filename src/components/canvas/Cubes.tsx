import { Suspense, useEffect, useMemo, useRef } from 'react'
import { MeshReflectorMaterial } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3, Color, Object3D, DynamicDrawUsage, Scene } from 'three'
import { maths, randHSL, sleep } from '@/helpers/utils'
import React from 'react'
import { CubeProps, FloorProps, instancerParams } from '@/types'
import { FC } from 'react'

export const Cubes: FC<{ floorProps: FloorProps }> = ({ floorProps, ...props }) => {
  class Pillar {
    pillar: CubeProps[] = []
    cubesPerPillar: number = 5
    pos: [x: number, y: number, z: number]
    rot: [x: number, y: number, z: number]
    cubeSize: number

    constructor(
      spawns: { position: [x: number, y: number, z: number]; rotation: [x: number, y: number, z: number] },
      cubesPerPillar: number,
      cubeSize: number,
    ) {
      this.pos = spawns.position
      this.rot = spawns.rotation
      this.cubesPerPillar = cubesPerPillar
      this.cubeSize = cubeSize
      this.create()
    }

    cubePropsGen(index: number): CubeProps {
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
    pos: [x: number, y: number, z: number]
    rotation: [x: number, y: number, z: number]
    minCubesPerPillar: number
    maxCubesPerPillar: number
    pillarCount: number
    cubeSize: number
    pillars: Pillar[] = []
    spawns: { position: [x: number, y: number, z: number]; rotation: [x: number, y: number, z: number] }[] = []

    constructor(
      floorProps: FloorProps,
      minCubesPerPillar: number,
      maxCubesPerPillar: number,
      pillarCount: number,
      cubeSize: number,
    ) {
      this.pos = floorProps.position
      this.rotation = floorProps.rotation
      this.minCubesPerPillar = minCubesPerPillar
      this.maxCubesPerPillar = maxCubesPerPillar
      this.pillarCount = pillarCount
      this.cubeSize = cubeSize
      this.produce()
    }

    createSpawnWaves(): void {}
    /**
     * Creates pillar spawns
     */
    createSpawns(): void {
      // random x offset between pillars
      let rand_x_offset = (this.cubeSize / 2) * INSTANCE_PROPS.maxScale

      // x distance between pillars based on cube size
      let x_offset = this.cubeSize + rand_x_offset

      // x length based on pillar count, size & random distance
      let n = (this.pillarCount * x_offset) / 2

      let mid = Math.floor(this.pillarCount / 2)
      for (let i = 0; i < this.pillarCount; i++) {
        let p = mid - i
        let z = Math.abs(p - (Math.random() - 0.5))

        // normalise z position component
        let normalisedZ = Math.abs(p / mid)

        // ease out-in z position component like a parabola
        let exponentZ = maths.ease.inQuad(Math.abs(normalisedZ)) / 2

        // add cube spawn to spawns array
        this.spawns.push({
          position: [
            Math.random() * rand_x_offset + x_offset * i - n + this.pos[0] + p * x_offset * 0.6 * exponentZ,
            0 + this.pos[1],
            this.pos[2] + Math.pow(z, exponentZ),
          ],
          rotation: [this.rotation[0], (p * Math.PI) / mid / 2 + this.rotation[1], this.rotation[2]],
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

  class CubeScene {
    scene: THREE.Scene
    pf: PillarFactory

    constructor(scene: Scene) {
      this.pf = new PillarFactory(floorProps, MIN_CUBES_PER_PILLAR, MAX_CUBES_PER_PILLAR, PILLAR_COUNT, CUBE_SIZE)
    }

    /**
     * Returns flattened array of cubeProps
     */
    getCubesProps(): CubeProps[][] {
      return this.pf.get().map((pillar) => pillar.get())
    }
  }

  /**
   * Instancer
   */
  function Instances({ spawnProps, initialScale, maxScale }: instancerParams) {
    const ref = useRef(null)
    let scaleSpeed = 2
    let dummy = new Object3D()
    let targetScales: Vector3[] = []
    let needToScale = true
    let currentScales: Vector3[] = []

    // useEffect(() => {
    //   let index = 0
    //   for (let i = 0; i < spawnProps.length; i++) {
    //     for (let j = 0, props = spawnProps[i]; j < props.length; j++) {
    //       // Set initial positions of the dummy
    //       dummy.position.set(...props[j].pos)
    //       dummy.rotation.set(...props[j].rot)
    //       // @ts-ignore
    //       let currentScale: Vector3 = new Vector3(...props[j].size.map((s) => s * initialScale))
    //       dummy.scale.set(...currentScale.toArray())
    //       currentScales.push(currentScale)
    //       dummy.updateMatrix()

    //       // Set matrix of instance
    //       ref.current.setMatrixAt(index, dummy.matrix)
    //       ref.current.setColorAt(index, new Color(props[j].color))
    //       targetScales.push(new Vector3(...props[j].size.map((s) => s * maxScale)))
    //       index++
    //     }
    //   }

    //   // Update the instance
    //   ref.current.instanceMatrix.needsUpdate = true
    //   ref.current.instanceMatrix.setUsage(DynamicDrawUsage)
    // })

    // useFrame((state, delta) => {
    //   if (!ref.current) return
    //   if (!needToScale) return
    //   let tempVect = new Vector3()
    //   let index = 0
    //   for (let i = 0; i < spawnProps.length; i++) {
    //     for (let j = 0, props = spawnProps[i]; j < props.length; j++) {
    //       tempVect.set(0, 0, 0)
    //       let currentScale = currentScales[index]
    //       let targetScale = targetScales[index]
    //       if (targetScale.x <= currentScale.x && targetScale.y <= currentScale.y && targetScale.z <= currentScale.z) {
    //         // stop scaling
    //         needToScale = false
    //       } else {
    //         // incase all cubes not at max scale
    //         needToScale = true
    //       }

    //       // get current index's matrix
    //       ref.current.getMatrixAt(index, dummy.matrix)

    //       // interpolate between current scale and target scale
    //       currentScale.add(
    //         tempVect
    //           .subVectors(targetScale, currentScale)
    //           .add(targetScale.clone().multiplyScalar(0.01))
    //           .multiplyScalar(scaleSpeed * delta),
    //       )
    //       dummy.scale.set(...currentScale.toArray())
    //       dummy.position.set(...props[j].pos)
    //       dummy.rotation.set(...props[j].rot)
    //       dummy.updateMatrix()

    //       ref.current.setMatrixAt(index, dummy.matrix)
    //       index++
    //     }
    //   }
    //   // tells the renderer that the instance matrix has changed and needs to be updated
    //   ref.current.instanceMatrix.needsUpdate = true
    //   ref.current.computeBoundingSphere()
    // })

    return (
      <instancedMesh ref={ref} args={[null, null, spawnProps.flat().length]}>
        <boxGeometry args={[Math.random(), 1, 1]}></boxGeometry>
        <meshLambertMaterial />
      </instancedMesh>
    )
  }

  /**
   * Define generation properties
   */
  const INSTANCE_PROPS = {
    initialScale: 0,
    maxScale: 2.5,
  }
  const MIN_CUBES_PER_PILLAR = 10
  const MAX_CUBES_PER_PILLAR = 15
  const PILLAR_COUNT = 20
  const CUBE_SIZE = 0.3

  /**
   * create scene
   */
  const { scene } = useThree()
  let cubeScene = new CubeScene(scene)
  let cubeProps = cubeScene.getCubesProps()
  return (
    <>
      <boxGeometry args={[Math.random(), 1, 1]}></boxGeometry>
    </>
  )
}
