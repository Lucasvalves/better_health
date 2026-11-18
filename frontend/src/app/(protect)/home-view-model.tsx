'use client'

import HomeView from './home-view'
import { useHomeModel } from './home-model'

export const HomeViewModel = () => {
  const methods = useHomeModel()

  return <HomeView {...methods} />
}
