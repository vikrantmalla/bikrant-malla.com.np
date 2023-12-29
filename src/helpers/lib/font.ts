import { Josefin_Sans, Teko } from 'next/font/google'
 
const Jose = Josefin_Sans({
  subsets: ['latin']
})

const TekoFont = Teko({
  subsets: ['latin'],
  weight: '700'
})

export const joseFont = Jose.className
export const tekoFont = TekoFont.className