"use client";
import style from './page.module.scss'

type Props = {
  placeholder?:string
  type?:string
  label?:string
  className?:string
}
export default function AppInput({label, placeholder, type, className}:Props){

  return(
      <div className={style.container}>
        <label htmlFor="fullName">{label}</label>
        <div className={`${style.inputContainer} ${className}`}>
          <input
            id="email"
            type={type ? type : 'text'}
            placeholder={placeholder}
            required
            />
        </div>
      </div>
  )
}