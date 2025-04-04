import style from './page.module.scss'

type Props = {
  type?: 'submit';
  label: string;
  hasClassName?: boolean;
}

export default function Button({label,type, hasClassName}:Props){
  return(
      <button className={hasClassName? '' : style.button} type={type}>{label}</button>
  )
}