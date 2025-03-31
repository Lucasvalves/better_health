import { ReactNode } from 'react';
import style from './page.module.scss'

type Props = {
  type?: 'submit';
  disabled?: boolean;
  children?: string | string[] | ReactNode;
}

export default function Button({children,type}:Props){
  return(
      <button className={style.button} type={type}>{children}</button>
  )
}