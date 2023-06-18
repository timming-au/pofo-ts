import { MutableRefObject, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export const Underline = ({ children, ...props }) => {
  const ref = useRef()
  return (
    <span className='relative' ref={ref}>
      <span className='absolute -bottom-2 h-1 w-full bg-accent md:h-2'></span>
      {children}
    </span>
  )
}

export const HoverEffect = ({ children, ...props }) => {
  let enter, leave
  const effectRef: MutableRefObject<HTMLElement> = useRef(null)
  function enterAni(event: MouseEvent) {
    if (typeof leave !== 'undefined') {
      leave.kill()
    }
    effectRef.current.style.transformOrigin = `${event.offsetX * 2}px ${event.offsetY * 2}px`
    gsap.to(effectRef.current, {
      duration: 1,
      scale: 1,
      ease: 'power4.out',
    })
    // effectRef.current.style.top = `${event.offsetY}px`
    // effectRef.current.style.left = `${event.offsetX}px`
  }
  function leaveAni(event: MouseEvent) {
    if (typeof enter !== 'undefined') {
      enter.kill()
    }
    effectRef.current.style.transformOrigin = `${event.offsetX * 2}px ${event.offsetY * 2}px`
    gsap.to(effectRef.current, {
      duration: 1,
      scale: 0,
      ease: 'power4.out',
    })
    // effectRef.current.style.top = `${event.offsetY}px`
    // effectRef.current.style.left = `${event.offsetX}px`
  }
  useEffect(() => {
    let parent = effectRef.current.parentElement
    parent.style.overflow = 'hidden'
    parent.addEventListener('mouseenter', enterAni)
    parent.addEventListener('mouseleave', leaveAni)

    return () => {
      parent.removeEventListener('mouseenter', enterAni)
      parent.removeEventListener('mouseleave', leaveAni)
    }
  })
  return (
    <>
      <span
        className='pointer-events-none absolute left-[-50%] top-[-50%] aspect-square h-[200%] w-[200%] scale-0 rounded-full bg-secondary'
        ref={effectRef}
      ></span>
      {children}
    </>
  )
}
