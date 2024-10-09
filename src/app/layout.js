import { Providers } from './providers'
import { Analytics } from "@vercel/analytics/react"
import ChatBox from './ChatBox';

export const metadata = {
  title: '链上社保',
  description: '创新社保解决方案',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body>
        <Providers>{children}</Providers>
        <ChatBox />
        <Analytics />
      </body>
    </html>
  )
}