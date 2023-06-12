import { DOMLayout } from '@/components/dom/DOMLayout'
import '@/global.css'
import Header from './head'
import { Poppins } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

// TODO: import head to here
export const metadata = {
  title: 'Next.js + Three.js',
  description: 'A minimal starter for Nextjs + React-three-fiber and Threejs.',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en' className={`antialiased ${poppins.className} bg-primary font-light text-secondary`}>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <Header />
      <body>
        {/* To avoid FOUT with styled-components wrap Layout with StyledComponentsRegistry https://beta.nextjs.org/docs/styling/css-in-js#styled-components */}
        <DOMLayout>{children}</DOMLayout>
      </body>
    </html>
  )
}
