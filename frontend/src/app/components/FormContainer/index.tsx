"use client";
import Image from 'next/image';
import Button from '../Button';
import Input from '../Inputs/AuthInput';
import style from './page.module.scss'
import Form from 'next/form'
import { BsKey } from "react-icons/bs";
import { MdOutlineEmail } from "react-icons/md";
import Link from 'next/link';
import { ROUTES } from '@/app/paths';

type Props = {
  pageTitle: string
  title: string
}

export default function FormContainer({ pageTitle, title }: Props) {

  return (
    <div className={style.container}>
      <div className={style.pageTitle}>
        <span>
          <h3>{pageTitle}</h3>
        </span>
        <Image alt='' src='/logo-bg-blue.png' width={100} height={100} />
      </div>
      <p >{title}</p>
      <Form action="/search">
        <Input IconLeft={MdOutlineEmail} type="email" placeholder="Email" />
        <Input  IconLeft={BsKey} type="password" placeholder="Senha" />
        <Button type="submit">Entrar</Button>
      </Form>
      <p className={style.links}>
        <span>
        Esqueceu sua senha?  <Link href={ROUTES.FORGOT}> Recuperar</Link>
        </span>
        <span>
          Ainda não tem conta?  <Link href={ROUTES.REGISTER}>Cadastre-se</Link>
        </span>
      </p>
    </div>
  )
}