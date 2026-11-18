'use client'

import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

export const useHomeModel = () => {
  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    const name = Cookies.get('userName')?.split(' ').slice(0, 2).join(' ')
    if (name) setUserName(name)
  }, [])

  return { userName }
}
