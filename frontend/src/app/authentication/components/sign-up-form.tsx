import Input from '@/presentation/components/Inputs/AuthInput';
import { BsKey } from "react-icons/bs";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import Button from "@/presentation/components/Button";


export default function SignUpForm(){
  return(
    <>
      {/* title='Insira seus dados!' labelButton="Confirmar" /> */}
      <Input IconLeft={FaRegUser} type="email" placeholder="Insira seu nome" />
      <Input IconLeft={MdOutlineEmail} type="email" placeholder="Insira seu email" />
      <Input  IconLeft={BsKey} type="password" placeholder="Insira uma senha" />
      <Button type="submit" label='Confirmar'/>
    </>
  )
} 