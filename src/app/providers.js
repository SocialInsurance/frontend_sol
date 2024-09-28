'use client'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    cyan: {
      400: '#0BC5EA',
    },
    blue: {
      500: '#3182CE',
      600: '#2B6CB0',
    },
    purple: {
      600: '#6B46C1',
    },
  },
})

export function Providers({ children }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>
}