import { random } from 'gsap'
import { FC } from 'react'

export const Circle: FC<{ radius: number; className: string }> = ({ radius, className }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
    >
      <circle cx={radius / 2} cy={radius / 2} r={radius}></circle>
    </svg>
  )
}

export const Square: FC<{ width: number; height: number; rotation?: number; className: string }> = ({
  width,
  height,
  rotation = 0,
  className,
}) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      style={{ transform: `rotate(${rotation}deg)`, transformOrigin: 'center' }}
    >
      <rect x={width / 2} y={height / 2} width={width} height={height} rx='2' ry='2'></rect>
    </svg>
  )
}

export const Triangle: FC<{ base: number; height: number; rotation?: number; className: string }> = ({
  base,
  height,
  rotation = 0,
  className,
}) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      style={{
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center',
        width: `${base}px`,
        height: `${height}px`,
      }}
      className={className}
    >
      <path d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'></path>
    </svg>
  )
}

/**
 * Returns a shape
 * @param shape Shape to be returned, if none is provided, a random shape will be returned
 * @param size Size of the shape, if none is provided, a random size will be returned
 * @param className Classes to assign
 * @returns A shape
 */
export const Shape: FC<{
  size: number
  shape: 'triangle' | 'square' | 'circle'
  rotation: number
  className?: string
}> = ({ size, shape, rotation, className }) => {
  switch (shape) {
    case 'triangle':
      return <Triangle base={size} height={size} rotation={0} className={className} />
    case 'square':
      return <Square width={size} height={size} rotation={0} className={className} />
    case 'circle':
      return <Circle radius={size / 2} className={className} />
  }
}

/**
 * Returns a random shape
 * @param sizeLo Lower bound of the size
 * @param sizeHi Upper bound of the size
 * @param rotation Rotation of the shape
 * @param className Classes to assign
 * @returns A random shape
 */
export const RandShape: FC<{ sizeLo: number; sizeHi: number; rotation?: number; className?: string }> = ({
  sizeLo,
  sizeHi,
  rotation = 0,
  className,
}) => {
  let shapes: ['triangle', 'square', 'circle'] = ['triangle', 'square', 'circle']
  let shape = shapes[Math.floor(Math.random() * shapes.length)]

  let size = Math.random() * (sizeHi - sizeLo) + sizeLo

  if (!rotation) {
    rotation = Math.random() * 360
  }

  return <Shape size={size} shape={shape} rotation={rotation} className={className} />
}
