import { FC } from 'react'

export const Logo: FC<{ css?: string }> = ({ css, ...props }) => {
  return (
    <div
      className={
        'flex h-14 w-14 items-center justify-center [&>*]:absolute [&>*]:fill-secondary [&>*]:mix-blend-difference ' +
        css
      }
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <circle cx='12' cy='10' r='8'></circle>
      </svg>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='bottom-0 left-0 h-8 w-8'
      >
        <rect x='3' y='3' width='18' height='18' rx='2' ry='2'></rect>
      </svg>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='bottom-1 right-0 h-8 w-8 rotate-[-30deg]'
      >
        <path d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'></path>
      </svg>
    </div>
  )
}
