"use client";
import { useState } from 'react'
import style from './page.module.scss'
import {BsEye, BsEyeSlash } from "react-icons/bs";

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
        <IconLeft className={style.icon}  aria-hidden="true"/>} 
         <input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}/>
       {type === "password" && (

        <button type='button' className={style.iconButton} onClick={handleTogglePassword}>
          {showPassword ? <BsEye className={style.iconRight} /> : <BsEyeSlash className={style.iconRight} />}
        </button>
       )} 
    </div>
  )
}