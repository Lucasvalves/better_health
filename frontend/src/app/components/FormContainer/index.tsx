"use client";
import Image from 'next/image';
import Button from '../Button';
import Input from '../Inputs/AuthInput';
import styles from './page.module.scss'
import Form from 'next/form'
import { BsKey } from "react-icons/bs";
import { MdOutlineEmail } from "react-icons/md";
import Link from 'next/link';
import { ROUTES } from '@/app/paths';
import { Condition } from '../Condition';

type Props = {
  pageTitle: string
  title: string
  labelButton: string
  route: string
}

export default function FormContainer({ pageTitle, title, labelButton , route}: Props) {

  return (
    <div className={styles.container}>
      <div className={styles.pageTitle}>
        <span>
          <h1>{pageTitle}</h1>
        </span>
        <Image alt='' src='/logo-bg-blue.png' width={100} height={100} />
      </div>
      <h2>{title}</h2>
      <Form action="/search">
        <Condition when={route === ROUTES.HOME}>
          <Input IconLeft={MdOutlineEmail} type="email" placeholder="Email" />
          <Input  IconLeft={BsKey} type="password" placeholder="Senha" />
        </Condition>
        <Condition when={route === ROUTES.FORGOT}>
          <span className={styles.inputForgot}>
            <Input  IconLeft={MdOutlineEmail} type="email" placeholder="Insira seu email" />
          </span>
        </Condition>
        <Condition when={route === ROUTES.REGISTER}>
          <Input IconLeft={MdOutlineEmail} type="email" placeholder="Insira seu nome" />
          <Input IconLeft={MdOutlineEmail} type="email" placeholder="Insira seu email" />
          <Input  IconLeft={BsKey} type="password" placeholder="Insira uma senha" />
        </Condition>
        <Button type="submit" label={labelButton}/>
      </Form>
      <p className={styles.links}>
        <Condition when={route === ROUTES.HOME}>
          <span>
          Esqueceu sua senha?  <Link href={ROUTES.FORGOT}> Recuperar</Link>
          </span>
          <span>
            Ainda não tem conta?  <Link href={ROUTES.REGISTER}>Cadastre-se</Link>
          </span>
        </Condition>
        <Condition when={route !== ROUTES.HOME}>
          <Condition when={route !== ROUTES.FORGOT}>
            <span>
              Já tem cadastro? <Link href={ROUTES.HOME}>Voltar à Página Inicial</Link>  
            </span>
          </Condition>
          <Condition when={route === ROUTES.FORGOT}>
            <span>
              Deseja cancelar?  <Link href={ROUTES.HOME}>Voltar à Página Inicial</Link>  
            </span>
          </Condition>
        </Condition>
      </p>
    </div>
  )
}