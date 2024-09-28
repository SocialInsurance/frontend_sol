import { Providers } from './providers'

export const metadata = {
  title: '链上社保',
  description: '创新社保解决方案',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}