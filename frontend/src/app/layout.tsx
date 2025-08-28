import type { Metadata } from 'next'
import { Sora, Poppins } from 'next/font/google'
import '../styles/global.scss'
import { ReactQueryProvider } from '@/presentation/providers/react-query'
import { CustomSnackbarProvider } from '@/presentation/providers/custom-snackbar-provider'

const sora = Sora({
  variable: '--font-sora',
  subsets: ['latin']
})

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'Better Health'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${poppins.variable}`}>
      <head>
        <link rel="shortcut icon" type="imagex/png" href="/logo-bg-blue.png" />
      </head>
      <body className="font-sans">
        <CustomSnackbarProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </CustomSnackbarProvider>
      </body>
    </html>
  )
}
