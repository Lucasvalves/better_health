'use client'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { Condition } from '../../Condition'
import style from './page.module.scss'
import { ChangeEvent, KeyboardEvent, useState } from 'react'

type Props = {
  id?: string
  placeholder?: string
  type?: string
  label?: string
  className?: string
  value?: string
  disabled?: boolean
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void
}

export default function AppInput({
  id,
  label,
  placeholder,
  type,
  className,
  onChange,
  value,
  disabled,
  onKeyDown
}: Props) {
  const [showPassword, setShowPassword] = useState(false)

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className={style.container}>
      {label && <label htmlFor={id}>{label}</label>}

      <div className={`${style.inputContainer} ${className}`}>
        <input
          id={id}
          type={
            type === 'password' ? (showPassword ? 'text' : 'password') : type
          }
          placeholder={placeholder}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={value}
          disabled={disabled}
        />

        <Condition when={type === 'password'}>
          <button
            title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            type="button"
            className={style.iconButton}
            onClick={handleTogglePassword}
            disabled={disabled}
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
    </div>
  )
}
