import useHasMounted from '@/helpers/utils'
import { FC, useEffect, useState } from 'react'

export const Circle: FC<{ radius: number; className: string }> = ({ radius, className }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      width={24}
      height={24}
      style={{
        width: radius * 2,
        height: radius * 2,
      }}
    >
      <circle cx={12} cy={12} r={12}></circle>
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
      width={24}
      height={24}
      style={{ width: width, height: height, transform: `rotate(${rotation}deg)`, transformOrigin: 'center' }}
    >
      <rect width={24} height={24} rx='2' ry='2'></rect>
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
      width={base}
      height={height}
      style={{
        width: base,
        height: height,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center',
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
  const hasMounted = useHasMounted()
  return (
    <div style={{ width: size, height: size, transform: `rotate(${rotation})deg` }}>
      {hasMounted && shape === 'triangle' && (
        <Triangle base={size} height={size} rotation={rotation} className={className} />
      )}
      {hasMounted && shape === 'square' && (
        <Square width={size} height={size} rotation={rotation} className={className} />
      )}
      {hasMounted && shape === 'circle' && <Circle radius={size / 2} className={className} />}
    </div>
  )
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
  const [shape, setShape] = useState(null)
  const [size, setSize] = useState(0)
  const [randRotation, setRandRotation] = useState(0)

  /**
   * Sets the shape and size. Prevents hydration mismatch too, due to the random nature of the component
   */
  useEffect(() => {
    let shapes: ['triangle', 'square', 'circle'] = ['triangle', 'square', 'circle']
    setShape(shapes[Math.floor(Math.random() * shapes.length)])
    setSize(Math.random() * (sizeHi - sizeLo) + sizeLo)
    setRandRotation(Math.random() * 360)
  }, [sizeLo, sizeHi])

  if (!rotation) {
    rotation = randRotation
  }

  return <Shape size={size} shape={shape} rotation={0} className={className} />
}
