import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SafeMind - Youth AI Safety Monitor',
  description: 'Protecting youth in AI conversations through intelligent monitoring',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  )
}
