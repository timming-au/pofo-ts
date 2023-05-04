import { ColorRepresentation, Object3D } from "three";

interface CubeProps {
  rot: [x:number,y:number,z:number],
  pos: [x:number,y:number,z:number],
  size: [x:number,y:number,z:number],
  color: ColorRepresentation,
}

interface instancerParams {
  spawnProps: CubeProps[][],
  dummy?: Object3D, 
  initialScale: number, 
  maxScale: number
}

interface FloorProps {
  position:[x:number,y:number,z:number],
  rotation:[x:number,y:number,z:number],
  size: [x:number,z:number],
}
