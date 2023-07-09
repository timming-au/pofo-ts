'use client'
import Image from 'next/image'
import Persona from '../../../../public/img/persona.webp'
import { RandShape, Shape, Shaperize } from '@/components/dom/Shapes'
import { HoverEffect, Underline } from '@/components/dom/components/Modifiers'
import { View } from '@/components/canvas/View'
import dynamic from 'next/dynamic'

export default function Index() {
  const Jukebox = dynamic(() => import('@/components/canvas/Jukebox').then((mod) => mod.Jukebox), { ssr: false })

  return (
    <>
      <div className='flex h-screen min-h-[90rem] w-full min-w-[40rem] flex-col-reverse items-center justify-end lg:flex-row lg:justify-normal lg:pt-0'>
        <div className='grid h-full grid-cols-8 grid-rows-6 gap-2 py-32 text-4xl md:text-5xl xl:text-6xl [&>*]:rounded-3xl [&>*]:border-[1px] [&>*]:border-secondary [&>*]:p-6'>
          <div className='col-span-2 row-span-1 flex flex-col justify-end'>
            <h1 className='font-bold'>Hi, hi.</h1>
          </div>
          <div className='col-span-2 row-span-2 row-start-2  flex flex-col justify-end'>
            <h1>I&apos;m Tim Ming.</h1>
          </div>
          <div className='relative col-span-3 row-span-2 h-full w-full items-center justify-center !p-0'>
            <View className='flex h-full w-full flex-col items-center justify-center'>
              <Jukebox />
            </View>
          </div>
          <span
            data-cursor={5}
            data-magnet={0.2}
            className='col-span-3 row-span-2 flex cursor-pointer items-end px-4 font-medium lg:px-5 xl:px-6'
          >
            <HoverEffect>
              <span className='pointer-events-none mix-blend-difference'>Front&#8209;end</span>
            </HoverEffect>
          </span>
          <div className='col-span-5 col-start-4 row-span-2 flex items-end'>
            developer passionate about aesthetic websites.
          </div>
          <div className='col-start-3 row-start-3 flex flex-col items-end justify-end text-end text-xl'>
            <p className='text-lg'>v0.0.1:</p>
            <p className='text-xl'>Added jukebox</p>
          </div>
          <span
            data-cursor={5}
            data-magnet={0.2}
            className='col-span-3 row-span-3 flex cursor-pointer items-end px-4 font-medium lg:px-5 xl:px-6'
          >
            <HoverEffect>
              <span className='pointer-events-none mix-blend-difference'>More tiles & interactivity coming soon</span>
            </HoverEffect>
          </span>
          <span
            data-cursor={5}
            data-magnet={0.2}
            className='col-span-5 row-span-2 flex cursor-pointer items-end px-4 font-medium lg:px-5 xl:px-6'
          >
            <HoverEffect>
              <span className='pointer-events-none mix-blend-difference'>Mobile support coming soon</span>
            </HoverEffect>
          </span>
        </div>
      </div>
      {/* <div className='flex w-[calc(50%+1rem)] shrink-0 items-center justify-center md:w-[calc(10%+12rem)]'>
        <Shaperize count={10}>
          <div className='rounded-xl border-[1px] border-secondary p-2 md:p-3'>
            <div className=' overflow-hidden rounded-xl'>
              <Image priority src={Persona} alt='Persona' className='object-contain' />
            </div>
          </div>
        </Shaperize>
      </div> */}
    </>
  )
}
