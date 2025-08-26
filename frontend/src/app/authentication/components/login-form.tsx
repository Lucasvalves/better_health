import { MdOutlineEmail } from "react-icons/md";
import { BsKey } from "react-icons/bs";
import Input from '@/presentation/components/Inputs/AuthInput';
import Button from "@/presentation/components/Button";

export default function LoginForm() {
  return (
    <>
      <Input IconLeft={MdOutlineEmail} type="email" placeholder="Insira seu email" />
      <Input  IconLeft={BsKey} type="password" placeholder="Insira uma senha" />
      <Button type="submit" label='Entrar'/>
    </>
  );
}