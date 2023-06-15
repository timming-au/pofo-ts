import { useHasMounted } from '@/helpers/utils'
import { ShapeProps } from '@/types'
import { FC, useEffect, useState, useRef, Dispatch, SetStateAction, useMemo } from 'react'
import { maths } from '@/helpers/utils'
import { gsap } from 'gsap'

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
  parentClassName?: string
  className?: string
}> = ({ size, shape, rotation, parentClassName, className }) => {
  const hasMounted = useHasMounted()
  return (
    <div className={parentClassName} style={{ width: size, height: size, transform: `rotate(${rotation})deg` }}>
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
 * Returns a random ShapeProps
 * @param sizeLo Lower bound of the size
 * @param sizeHi Upper bound of the size
 * @param rotation Rotation of the shape
 * @returns random ShapeProps
 */
const getRandShapeProps = (sizeLo: number, sizeHi: number, rotation?: number): ShapeProps => {
  let shapes: ['triangle', 'square', 'circle'] = ['triangle', 'square', 'circle']
  const props = {
    size: Math.random() * (sizeHi - sizeLo) + sizeLo,
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    rotation: rotation ? rotation : Math.random() * 360,
    position: null,
  }
  return props
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
  const [shapeProps, setShapeProps]: [ShapeProps, Dispatch<SetStateAction<ShapeProps>>] = useState({
    size: 0,
    shape: 'triangle',
    rotation: 0,
    position: null,
  })

  /**
   * Set props. Prevents hydration mismatch with useEffect, due to the random nature of the component
   */
  useEffect(() => {
    setShapeProps(getRandShapeProps(sizeLo, sizeHi, rotation))
  }, [sizeLo, sizeHi, rotation])

  return <Shape size={shapeProps.size} shape={shapeProps.shape} rotation={shapeProps.rotation} className={className} />
}

export const Shaperize = ({ children, count, ...props }) => {
  const containerRef = useRef(null)
  // const [shapes, setShapes]:[ShapeProps[], Dispatch<SetStateAction<ShapeProps[]>>] = useState([])
  function getProps(count: number): ShapeProps[] {
    const props = []
    for (let i = 0; i < count; i++) {
      let prop = getRandShapeProps(10, 30)
      let [lower, upper] = [0, 100]
      let [x, y] = maths.numberPairWithBoundary(lower, upper)

      // Calculate the offset from elements using a random & scaling factor based on the size of the shape.
      let offset = maths.between(0.3, 1) * prop.size

      // process positions
      if (x == lower || x == upper) {
        if (x == lower) {
          offset *= -1
          offset -= prop.size
        }
      } else {
        if (y == lower) {
          offset *= -1
          offset -= prop.size
        }
      }
      prop.position = [`calc(${x}% + ${offset}px)`, `calc(${y}% + ${offset}px)`]

      props.push(prop)
    }
    return props
  }
  const shapeProps = useMemo(() => getProps(count), [count])

  useEffect(() => {
    for (let i = 0; i < shapeProps.length; i++) {
      const shape = shapeProps[i]
      gsap.to(containerRef.current.children[i], {
        duration: 2,
        left: shape.position[0],
        top: shape.position[1],
        rotation: shape.rotation + 360,
        ease: 'power4.out',
      })
    }
  })
  return (
    <div ref={containerRef} className='relative z-50'>
      {shapeProps.map((shapeProp, index) => (
        <Shape
          key={index}
          size={shapeProp.size}
          shape={shapeProp.shape}
          rotation={0}
          className='shape-fill shape-glow transform-gpu'
          parentClassName='absolute -z-10 left-[50%] top-[50%]'
        />
      ))}
      {children}
    </div>
  )
}
