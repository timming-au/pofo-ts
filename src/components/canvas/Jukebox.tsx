import { useFrame, useThree } from '@react-three/fiber'
import { Perlin } from '@/helpers/utils'
import { Dispatch, MutableRefObject, SetStateAction, memo, useEffect, useRef, useState } from 'react'
import {
  AudioLoader,
  Audio,
  AudioListener,
  AudioAnalyser,
  Material,
  Mesh,
  SphereGeometry,
  Vector3,
  MeshLambertMaterial,
  Color,
} from 'three'
import { maths } from '@/helpers/utils'
import Song from '../../../public/sounds/lofi1.mp3'
import { OrbitControls } from '@react-three/drei'

export const Jukebox = memo(function Jukebox() {
  const sphere: MutableRefObject<Mesh> = useRef(null)
  // create an AudioListener and add it to the camera
  const [listener]: [AudioListener, Dispatch<SetStateAction<AudioListener>>] = useState(new AudioListener())

  const camera = useThree((state) => {
    return state.camera
  })
  camera.add(listener)
  // create an Audio source
  const [sound]: [Audio<GainNode>, Dispatch<SetStateAction<Audio<GainNode>>>] = useState(new Audio(listener))

  // load a sound and set it as the Audio object's buffer
  const [audioLoader]: [AudioLoader, Dispatch<SetStateAction<AudioLoader>>] = useState(new AudioLoader())

  audioLoader.load(Song, function (buffer) {
    sound.setBuffer(buffer)
    sound.setLoop(true)
    sound.setVolume(0.2)
  })
  // create an AudioAnalyser, passing in the sound and desired fftSize
  const fftSize = 2 ** 10
  const analyser = new AudioAnalyser(sound, fftSize)

  const noise = new Perlin()
  const k = 1
  let v = new Vector3()
  let time = 0
  useFrame(() => {
    // We will separate FFT data into three ranges - bass (40-160), midrange (161-1999) and treble (2000-10000).
    let data = analyser.getFrequencyData()
    let avgFrequency = analyser.getAverageFrequency()

    // To map frequency range to fftSize
    let scale = 20000 / (fftSize / 2)

    let bassRange: [number, number] = [Math.floor(40 / scale), Math.floor(160 / scale)]
    let midRange: [number, number] = [Math.floor(160 / scale) + 1, Math.floor(2000 / scale)]
    let trebleRange: [number, number] = [Math.floor(2000 / scale) + 1, Math.floor(10000 / scale)]

    let bassMax = maths.max(data, bassRange)
    let bassAvg = maths.avg(data, bassRange)

    let midMax = maths.max(data, midRange)
    let midAvg = maths.avg(data, midRange)

    let trebleMax = maths.max(data, trebleRange)
    let trebleAvg = maths.avg(data, trebleRange)

    let bassAmp = maths.map(bassMax, 0, 255, 0, 2) ** 2 / 8
    let midAmp = maths.map(midAvg, 0, 1, 0, maths.map(midMax, 0, 255, 0, 4) ** 2) / 4
    let trebleAmp = trebleMax

    time += 0.001
    let amp = 0.001
    let spikeAmp = 2

    // set color based on treble
    let mat = sphere.current.material as MeshLambertMaterial
    mat.color.lerp(
      new Color(((midAmp + trebleAmp) / 4) ** 1.5, ((trebleAvg + midAmp) / 10) ** 1.5, (trebleMax / 4) ** 1.5),
      0.01 * bassMax ** 0.1,
    )
    console.log(mat.color)
    mat.color.lerp(new Color(0, 0, 0), 0.0005)

    let array = sphere.current.geometry.attributes.position
    for (let i = 0; i < sphere.current.geometry.attributes.position.count; i++) {
      let indexAmp = maths.map(
        data[Math.floor((((Math.sin(i / 100) + 1) / 2) * (fftSize / 2)) % (fftSize / 2))],
        0,
        255,
        1.5,
        2,
      )
      let p = v.set(array.getX(i), array.getY(i), array.getZ(i))
      p.normalize().multiplyScalar(
        1 +
          bassAmp +
          noise.perlin3(
            p.x * spikeAmp + indexAmp + time,
            p.y * spikeAmp + indexAmp + time,
            p.z * spikeAmp + indexAmp + time,
          ) *
            amp *
            midAmp,
      )
      array.setXYZ(i, p.x, p.y, p.z)
    }
    sphere.current.geometry.computeVertexNormals()
    sphere.current.geometry.attributes.position.needsUpdate = true
  })
  return (
    <>
      <pointLight position={[0, 5, 0]} castShadow intensity={0.05} color={new Color(50, 30, 0)}></pointLight>
      <ambientLight position={[0, 5, 0]} castShadow intensity={0.005} color={new Color(50, 30, 0)}></ambientLight>
      <OrbitControls></OrbitControls>
      <mesh receiveShadow castShadow onClick={() => sound.play()} ref={sphere}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshLambertMaterial wireframe></meshLambertMaterial>
      </mesh>
    </>
  )
})
