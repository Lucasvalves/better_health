'use client'
import { ChangeEvent, FocusEvent, useState } from 'react'
import style from './page.module.scss'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { Condition } from '../../Condition'

type Props = {
  placeholder: string
  type: string
  IconLeft?: React.ElementType
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void
  value?: string
  error?: string
}
export default function AuthInput({
  placeholder,
  type,
  IconLeft,
  onChange,
  onBlur,
  value,
  error
}: Props) {
  const [showPassword, setShowPassword] = useState(false)

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev)
  }
  return (
    <>
      <div className={style.inputContainer}>
        {IconLeft && <IconLeft className={style.icon} aria-hidden="true" />}
        <input
          className={error ? style.inputError : ''}
          type={
            type === 'password' ? (showPassword ? 'text' : 'password') : type
          }
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          aria-describedby={error ? `${placeholder}-error` : undefined}
        />
        <Condition when={type === 'password'}>
          <button
            title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            type="button"
            className={style.iconButton}
            onClick={handleTogglePassword}
          >
            <Condition when={showPassword}>
              <BsEye className={style.iconRight} />
            </Condition>
            <Condition when={!showPassword}>
              <BsEyeSlash className={style.iconRight} />
            </Condition>
          </button>
        </Condition>
      </div>
      <Condition when={!!error}>
        <span
          id={`${placeholder}-error`}
          className={style.errorText}
          role="alert"
        >
          {error}
        </span>
      </Condition>
    </>
  )
}
