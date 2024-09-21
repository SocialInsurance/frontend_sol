'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { Analytics } from "@vercel/analytics/react"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          {children}
        </ChakraProvider>
        <Analytics />
      </body>
    </html>
  )
}