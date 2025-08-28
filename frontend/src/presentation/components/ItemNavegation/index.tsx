import { ReactNode } from 'react'
import Link from 'next/link'

type Props = {
  children?: string | string[] | ReactNode
  to: string
  onClick?: (newState: boolean) => void
}
export const ItemNavegation = ({ children, to }: Props) => {
  return <Link href={to}>{children}</Link>
}
