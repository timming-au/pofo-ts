import { FC } from 'react'
import { HoverEffect } from './Modifiers'
export const Button: FC<{
  children: any
  cursor: string
  magnet: number
  onClick: React.MouseEventHandler<HTMLSpanElement>
}> = ({ children, cursor, magnet, onClick }) => {
  return (
    <span
      data-cursor={5}
      data-magnet={0.3}
      className='cursor-pointer rounded-full border border-secondary px-4 font-medium lg:px-5 xl:px-6'
      onClick={onClick}
    >
      <HoverEffect>
        <span className='pointer-events-none'>Front&#8209;end</span>
      </HoverEffect>
    </span>
  )
}
