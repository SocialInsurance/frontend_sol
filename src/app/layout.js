'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { Analytics } from "@vercel/analytics/react"
import ChatBox from './ChatBox';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          {children}
        </ChakraProvider>
        <ChatBox />
        <Analytics />
      </body>
    </html>
  )
}