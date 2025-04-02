"use client";
import { useState } from 'react'
import style from './page.module.scss'
import {BsEye, BsEyeSlash } from "react-icons/bs";
import { Condition } from '../Condition';

type Props = {
  placeholder:string
  type:string
  IconLeft?: React.ElementType
}
export default function Input({placeholder,type, IconLeft}:Props){

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
          placeholder={placeholder}/>
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