import Input from "@/presentation/components/Inputs/AuthInput";
import { MdOutlineEmail } from "react-icons/md";
import Button from "@/presentation/components/Button";

export function ForgotPasswordForm() {
  return (
    <>
        <Input
          IconLeft={MdOutlineEmail}
          type="email"
          placeholder="Insira seu email"
        />
      <Button type="submit" label='Confirmar'/>
    </>
  );
}
