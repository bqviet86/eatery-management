import { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { envConfig } from '~/config'
import AppProvider from '~/components/app-provider'
import { ThemeProvider } from '~/components/theme-provider'
import { Toaster } from '~/components/ui/toaster'

import './globals.css'

console.log(envConfig)

const inter = Inter({
  subsets: ['vietnamese']
})

export const metadata: Metadata = {
  title: 'Big Boy Restaurant',
  description: 'The best restaurant in the world'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <AppProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  )
}
