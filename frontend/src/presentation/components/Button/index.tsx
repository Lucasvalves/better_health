import style from './page.module.scss'
import Loading from '../Loading'

type Props = {
  type?: 'submit' | 'button'
  label: string
  hasClassName?: boolean
  isLoading?: boolean
  disabled?: boolean
  onClick?: () => void
}

export default function Button({
  label,
  type,
  hasClassName,
  isLoading,
  disabled,
  onClick
}: Props) {
  return (
    <button
      className={hasClassName ? '' : style.button}
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {label}
      {isLoading && <Loading />}
    </button>
  )
}
