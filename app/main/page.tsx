'use client'

import dynamic from 'next/dynamic'

const Main = dynamic(() => import('@/components/canvas/Main').then((mod) => mod.Main), { ssr: false })
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {ssr:false})

export default function Page() {
  return (
    <>
      <div className='mx-auto flex w-full flex-col flex-wrap items-center md:flex-row lg:w-4/5'>
        <div className='flex w-full flex-col items-start justify-center p-12 text-center md:w-2/5 md:text-left'>
          <p className='w-full uppercase'>Next + React Three Fiber</p>
          <h1 className='my-4 text-5xl font-bold leading-tight'>Next 3D Starter</h1>
          <p className='mb-8 text-2xl leading-normal'>A minimalist starter for React, React-three-fiber and Threejs.</p>
        </div>
      </div>

      <View className='absolute top-0 flex h-screen w-full flex-col items-center justify-center'>
        <Main/>
      </View>
    </>
  )
}
