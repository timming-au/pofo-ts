import { useFrame, useThree } from '@react-three/fiber'
import { Perlin } from '@/helpers/utils'
import { Dispatch, MutableRefObject, SetStateAction, memo, useEffect, useRef, useState } from 'react'
import { AudioLoader, Audio, AudioListener, AudioAnalyser, Material, Mesh, SphereGeometry, Vector3 } from 'three'
import { maths } from '@/helpers/utils'
import Song from '../../../public/sounds/sample.mp3'

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
  const fftSize = 1024 * 16
  const analyser = new AudioAnalyser(sound, 1024 * 16)

  const noise = new Perlin()
  const k = 1
  let v = new Vector3()
  let time = 0
  useFrame(() => {
    let data = analyser.getFrequencyData()
    time += 0.0001
    let array = sphere.current.geometry.attributes.position
    for (let i = 0; i < sphere.current.geometry.attributes.position.count; i++) {
      let p = v.set(array.getX(i), array.getY(i), array.getZ(i))
      p.normalize().multiplyScalar(
        1 +
          0.3 *
            noise.perlin3(
              p.x * k + time + maths.map(data[Math.floor((i % fftSize) / 128)], 0, 255, -0.5, 0.5),
              p.y * k + time + maths.map(data[Math.floor((i % fftSize) / 128)], 0, 255, -0.5, 0.5),
              p.z * k + time + maths.map(data[Math.floor((i % fftSize) / 128)], 0, 255, -0.5, 0.5),
            ),
      )
      array.setXYZ(i, p.x, p.y, p.z)
    }
    sphere.current.geometry.computeVertexNormals()
    sphere.current.geometry.attributes.position.needsUpdate = true
  })
  return (
    <mesh onClick={() => sound.play()} ref={sphere}>
      <sphereGeometry args={[1, 128, 128]} />
      <meshLambertMaterial wireframe></meshLambertMaterial>
    </mesh>
  )
})
