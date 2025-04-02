"use client";
import style from './page.module.scss'

type Props = {
  placeholder:string
  type:string
  label:string

}
export default function AppInput({label, placeholder}:Props){

  return(
      <div className={style.container}>
        <label htmlFor="fullName">{label}</label>
        <div className={style.inputContainer}>
          <input
            id="email"
            type="email"
            placeholder={placeholder}
            className="input"
            required
            />
        </div>
      </div>
         
  )
}