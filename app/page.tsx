'use client'
import Image from 'next/image'
import Persona from '../public/img/persona.webp'
import { RandShape, Shape, Shaperize } from '@/components/dom/Shapes'
import { Underline } from '@/components/dom/components/Modifiers'
import dynamic from 'next/dynamic'
import Scroll from '@/helpers/Scroll'

const Index = dynamic(() => import('@/components/dom/content/index'))
const About = dynamic(() => import('@/components/dom/content/about'))
const Projects = dynamic(() => import('@/components/dom/content/projects'))
const Talk = dynamic(() => import('@/components/dom/content/talk'))

export default function Page() {
  return (
    <>
      <Index />
      <About />
      <Projects />
      <Talk />
    </>
  )
}
