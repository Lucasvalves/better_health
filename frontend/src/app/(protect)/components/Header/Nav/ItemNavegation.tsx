import { ReactNode } from 'react'
import Link from 'next/link'

type Props = {
  children?: string | string[] | ReactNode
  to: string
  onClick?: () => void
}
export const ItemNavegation = ({ children, to, onClick }: Props) => {
  return (
    <Link onClick={onClick} href={to}>
      {children}
    </Link>
  )
}
