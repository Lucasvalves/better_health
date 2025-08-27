"use client";
import { ChangeEvent, useState } from 'react'
import style from './page.module.scss'
import {BsEye, BsEyeSlash } from "react-icons/bs";
import { Condition } from '../../Condition';

type Props = {
  placeholder:string
  type:string
  IconLeft?: React.ElementType
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  value?: string
}
export default function AuthInput({placeholder,type, IconLeft, onChange, value}:Props){

  const [showPassword, setShowPassword] =  useState(false)

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  return(
    <div className={style.inputContainer}>

      {IconLeft && 
        <IconLeft className={style.icon} aria-hidden="true"/>} 
         <input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder} onChange={onChange} value={value}/>
        <Condition when={type === "password"}>
          <button title={showPassword ? "Ocultar senha" : "Mostrar senha"} type='button' className={style.iconButton} onClick={handleTogglePassword}>
            <Condition when={showPassword}> 
              <BsEye className={style.iconRight} />
            </Condition>
            <Condition when={!showPassword}> 
              <BsEyeSlash className={style.iconRight} />
            </Condition>
          </button>
        </Condition>
    </div>
  )
}