import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import 'rsuite/dist/rsuite.min.css'
import './globals.css'

// const inter = Inter({ subsets: ['latin'] });
const montserrat = Montserrat({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='font-montserrat'>{children}</body>
    </html>
  )
}
