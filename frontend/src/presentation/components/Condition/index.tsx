type Props = {
  when: boolean
  children: React.ReactNode
}

export function Condition({ when, children }: Props) {
  if (when) {
    return children
  }
}
