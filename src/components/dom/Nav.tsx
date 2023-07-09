import { Logo } from './Logo'

export const Nav = () => {
  return (
    <div className='absolute z-[9999] flex h-16 w-full items-end justify-between border-b-[1px] border-b-secondary'>
      <div className='flex gap-x-8'>
        <p>TBA</p>
        <p>TBA</p>
      </div>
      <Logo css='relative' />
      <div className='flex gap-x-8'>
        <p>TBA</p>
        <p>TBA</p>
        <p>TBA</p>
      </div>
    </div>
  )
}
