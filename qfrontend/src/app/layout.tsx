import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ThemeProvider from '../components/ThemeProvider'
import Navigation from '../components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'URL Shortener',
  description: 'Create short, memorable URLs and track their performance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <Navigation />
          <main>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}