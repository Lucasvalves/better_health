'use client'

import { enqueueSnackbar } from 'notistack'

export const useNavModel = () => {
  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    enqueueSnackbar('Logout feito com sucesso!', { variant: 'success' })
  }

  return { logout }
}
