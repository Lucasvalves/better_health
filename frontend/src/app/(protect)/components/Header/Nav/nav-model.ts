'use client'

import { enqueueSnackbar } from 'notistack'

export const useNavModel = () => {
  const logout = async () => {
    const response = await fetch('/api/auth/logout', { method: 'POST' })
    const data = await response.json()
    enqueueSnackbar(data.message, { variant: 'success' })
  }

  return { logout }
}
