'use client'
import Image from 'next/image'
import Persona from '../public/img/persona.webp'
import { RandShape, Shape, Shaperize } from '@/components/dom/Shapes'
import { Underline } from '@/components/dom/Modifiers'
export default function Page() {
  return (
    <>
      <div className='flex h-screen w-full flex-col-reverse items-center justify-end pt-[calc(8vh+4rem)] lg:flex-row lg:justify-normal lg:pt-0'>
        <div className='grid grid-rows-[7] justify-center gap-y-10'>
          <div className='row-span-3 flex items-end'>
            <p className='text-5xl font-medium md:text-6xl lg:text-7xl xl:text-8xl'>Hi, hi.</p>
          </div>
          <div className='row-span-4 text-3xl md:text-4xl lg:text-5xl xl:text-6xl'>
            <span className='flex flex-wrap items-center gap-x-2 xl:gap-x-4 [&>*]:flex [&>*]:h-10 [&>*]:items-center md:[&>*]:h-14 lg:[&>*]:h-[4.5rem] xl:[&>*]:h-[5.5rem]'>
              <span>I&apos;m</span>
              <span>Tim</span>
              <span>Ming,</span>
              <span>a</span>
              <span>Malaysian-based</span>
              <span
                data-cursor={5}
                data-magnet='magnet0.3'
                className='rounded-full border border-secondary px-4 font-medium lg:px-5 xl:px-6'
              >
                Front&#8209;end
              </span>
              <span>developer</span>
              <span>passionate</span>
              <span>about</span>
              <span>
                <Underline>aesthetic</Underline>
              </span>
              <span>websites</span>
              <span>that</span>
              <span>inscribe</span>
              <span>lasting</span>
              <span>impressions.</span>
            </span>
          </div>
        </div>
        <div className='flex w-[calc(50%+1rem)] shrink-0 items-center justify-center md:w-[calc(10%+12rem)]'>
          <Shaperize count={10}>
            <div className='rounded-xl border-[1px] border-secondary p-2 md:p-3'>
              <div className=' overflow-hidden rounded-xl'>
                <Image priority src={Persona} alt='Persona' className='object-contain' />
              </div>
            </div>
          </Shaperize>
        </div>
      </div>
    </>
  )
}
