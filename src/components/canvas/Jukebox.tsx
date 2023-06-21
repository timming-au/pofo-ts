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
  HSL,
  AmbientLight,
  Matrix3,
} from 'three'
import { maths, colors } from '@/helpers/utils'
import Song from '../../../public/sounds/sample.mp3'
import { MeshDistortMaterial, OrbitControls } from '@react-three/drei'
import router from 'next/router'
import { Common } from './View'

export const Jukebox = memo(function Jukebox() {
  const sphere: MutableRefObject<Mesh> = useRef(null)
  const light: MutableRefObject<AmbientLight> = useRef(null)

  // create Audio //
  // create an AudioListener and add it to the camera
  const [listener]: [AudioListener, Dispatch<SetStateAction<AudioListener>>] = useState(new AudioListener())

  const camera = useThree((state) => {
    return state.camera
  })
  camera.add(listener)

  // create Audio source
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

  // some variables for Jukebox
  const noise = new Perlin()
  let v = new Vector3()
  let c = new Color()
  let time = 0

  useFrame((state, delta) => {
    // We will separate FFT data into three ranges - bass (40-160), midrange (161-1999) and treble (2000-10000).
    let data = analyser.getFrequencyData()
    let avgFrequency = analyser.getAverageFrequency()

    // map frequency range to fftSize
    let scale = 20000 / (fftSize / 2)

    // map frequency range to fftSize
    let bassRange: [number, number] = [Math.floor(40 / scale), Math.floor(80 / scale)]
    let midRange: [number, number] = [Math.floor(80 / scale) + 1, Math.floor(800 / scale)]
    let trebleRange: [number, number] = [Math.floor(800 / scale) + 1, Math.floor(10000 / scale)]

    // max and average values for each range
    let bassMax = maths.max(data, bassRange)
    let bassAvg = maths.avg(data, bassRange)

    let midMax = maths.max(data, midRange)
    let midAvg = maths.avg(data, midRange)

    let trebleMax = maths.max(data, trebleRange)
    let trebleAvg = maths.avg(data, trebleRange)

    // amplitude for each range
    let bassAmp = maths.map(bassMax, 0, 255, 0, 2) ** 2 / 8
    let midAmp = maths.map(midAvg, 0, 1, 0, maths.map(midMax, 0, 255, 0, 4) ** 2) / 4
    let trebleAmp = trebleMax

    time += 0.001
    let amp = 0.001
    let baseAmp = 0.2
    let baseSpikeAmp = 1
    let spikeAmp = 2
    let colorDecay = 2
    let lightnessDecay = 0.1

    // set color based on treble
    let mat = sphere.current.material as MeshLambertMaterial
    let [r, g, b] = colors.boostRGB(
      ...colors.vibrantise(
        Math.min(((midAmp + trebleAmp) / 8) ** 1.5, 255),
        Math.min(((trebleAvg + midAmp) / 8) ** 1.5, 255),
        Math.min(((trebleMax + trebleAmp) / 8) ** 1.5, 255),
        100,
      ),
      100,
      20,
    )

    mat.color.lerp(
      new Color(`rgb(${Math.max(Math.floor(r), 50)}, ${Math.max(Math.floor(g), 50)}, ${Math.max(Math.floor(b), 50)})`),
      delta,
    )
    if (sound.isPlaying) {
      mat.color.offsetHSL(0, colorDecay * delta, lightnessDecay * delta)
    }

    let array = sphere.current.geometry.attributes.position
    for (let i = 0; i < sphere.current.geometry.attributes.position.count; i++) {
      let indexAmp = maths.map(data[Math.floor((Math.tan(i / 10) ** 2 * (fftSize / 2)) % (fftSize / 2))], 0, 255, 1, 2)
      let p = v.set(array.getX(i), array.getY(i), array.getZ(i))
      p.normalize().multiplyScalar(
        1 +
          bassAmp * 0.5 +
          noise.perlin3(
            p.x * spikeAmp + indexAmp + time,
            p.y * spikeAmp + indexAmp + time,
            p.z * spikeAmp + indexAmp + time,
          ) *
            amp *
            midAmp +
          noise.perlin3(p.x * baseSpikeAmp + time, p.y * baseSpikeAmp + time, p.z * baseSpikeAmp + time) * baseAmp,
      )
      array.setXYZ(i, p.x, p.y, p.z)
    }
    sphere.current.geometry.computeVertexNormals()
    sphere.current.geometry.attributes.position.needsUpdate = true
    sphere.current.rotation.y += 0.001
  })

  // helper functions
  const juke = () => {
    if (sound.isPlaying) {
      sound.pause()
    } else {
      sound.play()
    }
  }
  return (
    <>
      <ambientLight ref={light} color={0xffffff} intensity={1} />
      <OrbitControls></OrbitControls>
      <mesh onClick={() => juke()} ref={sphere}>
        <sphereGeometry args={[1, 48, 32]} />
        <meshLambertMaterial wireframe></meshLambertMaterial>
      </mesh>
    </>
  )
})
