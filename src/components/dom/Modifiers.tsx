import { useRef } from 'react'

export const Underline = ({ children, ...props }) => {
  const ref = useRef()
  return (
    <span className='relative' ref={ref}>
      <span className='absolute -bottom-2 h-1 w-full bg-accent md:h-2'></span>
      {children}
    </span>
  )
}
