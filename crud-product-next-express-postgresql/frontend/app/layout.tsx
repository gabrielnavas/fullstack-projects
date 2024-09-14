import './globals.css'

import { Inter } from 'next/font/google'

import { Toaster } from '@/components/ui/toaster'
import { Header } from '@/components/header/header'
import { MenuDesktop } from '@/components/menu-left/menu-desktop'
import { getOrganizationDescription, getOrganizationName } from '@/utils/organization'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CRUD Product',
  description: "A simple product's CRUD",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className='h-[6vh]'>
          <Header organization={{
            name: getOrganizationName(),
            description: getOrganizationDescription(),
          }} />
        </div>
        <div className='flex min-h-[94vh]'>
          <MenuDesktop />
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  )
}
