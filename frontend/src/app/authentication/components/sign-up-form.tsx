import Input from "@/presentation/components/Inputs/AuthInput";
import { BsKey } from "react-icons/bs";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import Button from "@/presentation/components/Button";

interface ILoginForm {
  setName: (e:string) => void;
  setEmail: (e:string) => void;
  setPassword: (e:string) => void;
  name: string;
  email: string;
  password: string;
}

export default function SignUpForm({
  setName,
  setEmail,
  setPassword,
  name, email, password
}: ILoginForm) {
  return (
    <>
      {/* title='Insira seus dados!' labelButton="Confirmar" /> */}
      <Input IconLeft={FaRegUser} type="text" placeholder="Insira seu nome" onChange={(e) => setName(e.target.value)} value={name}/>
      <Input
        IconLeft={MdOutlineEmail}
        type="email"
        placeholder="Insira seu email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <Input IconLeft={BsKey} type="password" placeholder="Insira uma senha" onChange={(e) => setPassword(e.target.value)} value={password}/>
      <Button type="submit" label="Confirmar" />
    </>
  );
}
