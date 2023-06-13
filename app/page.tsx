'use client'
import Image from 'next/image'
import Persona from '../public/img/persona.webp'
export default function Page() {
  return (
    <>
      <div className='grid h-screen w-full grid-cols-5'>
        <div className='col-span-3 flex flex-col justify-center gap-y-10'>
          <p className='font-medium sm:text-2xl md:text-4xl lg:text-9xl'>Hi, hi.</p>
          <div>
            <p className='sm:text-3xl md:text-4xl lg:text-6xl'>
              I&apos;m Tim Ming, a Malaysian-based <span>Front-end</span> developer creating aesthetic websites to
              inscribe lasting impressions.
            </p>
          </div>
        </div>
        <div className='col-span-2 flex items-center justify-center'>
          <div className='m-20'>
            <div className='rounded-xl border-[1px] border-secondary p-4'>
              <div className='overflow-hidden rounded-xl'>
                <Image src={Persona} alt='Persona' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
