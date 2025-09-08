import style from './page.module.scss'
import Loading from '../Loading'

type Props = {
  type?: 'submit'
  label: string
  hasClassName?: boolean
  isLoading?: boolean
  disabled?: boolean
}

export default function Button({
  label,
  type,
  hasClassName,
  isLoading,
  disabled
}: Props) {
  return (
    <button
      className={hasClassName ? '' : style.button}
      type={type}
      disabled={disabled || isLoading}
    >
      {label}
      {isLoading && <Loading />}
    </button>
  )
}
