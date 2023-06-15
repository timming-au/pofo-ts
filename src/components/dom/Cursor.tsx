import useEvent from '@/helpers/utils'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export const Cursor = () => {
  let isInteract = false
  let enter, leave
  let props = {
    target: null,
    magnetize: null,
  }
  let x, y, width, height
  const cursorRef = useRef(null)
  const [rotate, setRotate] = useState(null)
  useEffect(() => {
    setRotate(
      gsap.to(cursorRef.current, {
        paused: true,
        yoyo: true,
        repeat: -1,
        duration: 0.8,
        ease: 'power1.inOut',
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
      duration: 0.3,
      filter: 'drop-shadow(0 0 1px white)',
    })
  }
  function magnetize(event: any, width: number, height: number, x: number, y: number, strength: number): void {
    gsap.to(event.target, {
      x: (event.clientX - (x + width / 2)) * strength,
      y: (event.clientY - (y + height / 2)) * strength,
      duration: 0.2,
    })
  }
  function updateCursor(e) {
    if (props.target != e.target) {
      // reset previous magnetized element
      if (props.target != null) {
        if (typeof props.target.dataset.magnet !== 'undefined') {
          if (props.target.dataset.magnet.includes('magnet')) {
            gsap.to(props.target, {
              x: 0,
              y: 0,
              duration: 0.8,
              ease: 'elastic.out',
            })
          }
        }
      }
      props.target = e.target
      // magnetize elements
      if (typeof props.target.dataset.magnet !== 'undefined') {
        if (props.target.dataset.magnet.includes('magnet')) {
          width = props.target.getBoundingClientRect().width
          height = props.target.getBoundingClientRect().height
          x = props.target.getBoundingClientRect().x
          y = props.target.getBoundingClientRect().y
        }
      }
      let data = props.target.dataset.magnet
      if (typeof data !== 'undefined') {
        if (data.includes('magnet')) {
          let magnitude = parseFloat(data.replace('magnet', ''))
          props.magnetize = magnitude
          magnetize(e, width, height, x, y, magnitude)
        }
      } else {
        props.magnetize = null
      }
    } else {
      if (props.magnetize != null) magnetize(e, width, height, x, y, props.magnetize)
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
        entering(props.target.dataset.cursor)
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
