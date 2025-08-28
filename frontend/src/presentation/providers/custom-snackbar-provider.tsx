'use client'

import { SnackbarProvider } from 'notistack'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const CustomSnackbarProvider = ({ children }: Props) => {
  return <SnackbarProvider>{children}</SnackbarProvider>
}
