'use client'

import { enqueueSnackbar } from 'notistack'
import { useState } from 'react'

export const useHeaderModel = () => {
  const [menuMobileIsVisible, setMenuMobileIsVisible] = useState(false)

  const logout = async () => {
    const response = await fetch('/api/auth/logout', { method: 'POST' })
    const data = await response.json()
    enqueueSnackbar(data.message, { variant: 'success' })
  }

  return { logout, menuMobileIsVisible, setMenuMobileIsVisible }
}
