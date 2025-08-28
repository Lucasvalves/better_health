'use client'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { Condition } from '../../Condition'
import style from './page.module.scss'
import { useState } from 'react'

type Props = {
  placeholder?: string
  type?: string
  label?: string
  className?: string
}
export default function AppInput({
  label,
  placeholder,
  type,
  className
}: Props) {
  const [showPassword, setShowPassword] = useState(false)

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev)
  }
  return (
    <div className={style.container}>
      <label htmlFor="fullName">{label}</label>
      <div className={`${style.inputContainer} ${className}`}>
        <input
          type={
            type === 'password' ? (showPassword ? 'text' : 'password') : type
          }
          placeholder={placeholder}
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
    </div>
  )
}
