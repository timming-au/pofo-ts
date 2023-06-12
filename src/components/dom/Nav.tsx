import { Logo } from './Logo'

export const Nav = () => {
  return (
    <div className='absolute z-[9999] flex h-16 w-full items-end justify-between border-b-[1px] border-b-secondary'>
      <div className='flex gap-x-8'>
        <p>to top</p>
        <p>wyd?</p>
      </div>
      <Logo css='relative' />
      <div className='flex gap-x-8'>
        <p>about</p>
        <p>projects</p>
        <p>talk</p>
      </div>
    </div>
  )
}
