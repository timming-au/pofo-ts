'use client'
import Persona from '@/img/persona.webp'
import Image from 'next/image'
export default function Page() {
  return (
    <>
      <div className='flex h-screen w-full flex-col justify-center'>
        <p className='text-6xl font-medium'>Hi, hi.</p>
        <div>
          <p className='text-4xl'>
            I&apos;m Tim Ming, a Malaysian-based <span>Front-end</span> developer creating aesthetic websites to
            inscribe lasting impressions.
          </p>
        </div>
        <Image src={Persona} alt='Persona' />
      </div>
    </>
  )
}
