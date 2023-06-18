import useEvent from '@/helpers/utils'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export const Cursor = () => {
  let isInteract = false
  let enter, leave
  let props: {
    target: null | HTMLElement
    magnetize: null | number
    boundingRect: null | DOMRect
  } = {
    target: null,
    magnetize: null,
    boundingRect: null,
  }
  const cursorRef = useRef(null)
  const [rotate, setRotate] = useState(null)
  useEffect(() => {
    setRotate(
      gsap.to(cursorRef.current, {
        paused: true,
        yoyo: true,
        repeat: -1,
        duration: 1.5,
        ease: 'power2.inOut',
        rotate: 180,
      }),
    )
  }, [])
  function entering(scale: number) {
    if (typeof leave !== 'undefined') {
      leave.kill()
    }
    enter = gsap.to(cursorRef.current, {
      scale: scale,
      duration: 0.2,
      ease: 'sine.out',
      filter: 'drop-shadow(0 0 3px white)',
    })
    if (rotate.paused()) {
      rotate.resume()
    }
  }
  function leaving() {
    if (typeof leave !== 'undefined') {
      enter.kill()
    }
    if (!rotate.paused()) {
      rotate.pause()
    }
    leave = gsap.to(cursorRef.current, {
      rotate: 0,
      ease: 'sine.out',
      scale: 1,
      duration: 0.5,
      filter: 'drop-shadow(0 0 1px white)',
    })
  }
  function magnetize(event: MouseEvent, width: number, height: number, x: number, y: number, strength: number): void {
    gsap.to(event.target, {
      x: (event.clientX - (x + width / 2)) * strength,
      y: (event.clientY - (y + height / 2)) * strength,
      duration: 0.2,
    })
  }
  function updateCursor(e: MouseEvent) {
    if (props.target != e.target) {
      // reset previous magnetized element
      if (props.target != null) {
        if (typeof props.target.dataset.magnet !== 'undefined') {
          gsap.to(props.target, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'power4.out',
          })
        }
      }
      props.target = e.target as HTMLElement
      let data = props.target.dataset.magnet
      if (typeof data !== 'undefined') {
        props.boundingRect = props.target.getBoundingClientRect()
        let magnitude = parseFloat(data)
        props.magnetize = magnitude
        magnetize(
          e,
          props.boundingRect.width,
          props.boundingRect.height,
          props.boundingRect.x,
          props.boundingRect.y,
          magnitude,
        )
      } else {
        props.magnetize = null
      }
    } else {
      if (props.magnetize != null && props.boundingRect != null) {
        magnetize(
          e,
          props.boundingRect.width,
          props.boundingRect.height,
          props.boundingRect.x,
          props.boundingRect.y,
          props.magnetize,
        )
      }
    }
    // animating hexagon when enter clickable element
    gsap.to(cursorRef.current, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1,
      ease: 'sine.out',
    })
    let currentIsInteract = props.target.dataset.cursor == undefined ? false : true

    if (currentIsInteract != isInteract) {
      if (currentIsInteract == true) {
        entering(parseFloat(props.target.dataset.cursor))
      } else {
        leaving()
      }
      isInteract = currentIsInteract
    }
  }
  useEvent('mousemove', updateCursor)
  return (
    <svg
      className='pointer-events-none fixed left-0 top-0 z-[9999] ml-[-6.5025px] mt-[-7.5px] origin-center mix-blend-difference'
      id='cursor'
      fill='white'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      width='13.05'
      height='15'
      viewBox='0 0 173.20508075688772 200'
      ref={cursorRef}
    >
      <path
        stroke='white'
        strokeWidth='5'
        d='M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z'
      ></path>
    </svg>
  )
}
