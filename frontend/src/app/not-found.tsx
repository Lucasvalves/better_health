"use client";
import Link from "next/link";
import styles from "./not-found.module.scss";
import { BsArrowLeft } from "react-icons/bs";
import { enumsRoutes } from "@/shared/enums/enumsRoutes";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.subtitle}>Página não encontrada</p>
      <p className={styles.description}>
        Oops! A página que você está procurando não existe ou foi movida.
      </p>
      <Link href={enumsRoutes.HOME}className={styles.homeLink}>
        <BsArrowLeft className={styles.icon} /> Voltar para a página inicial
      </Link>
    </div>
  );
}
