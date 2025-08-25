import BackgroundImage from "@/presentation/components/BackgroundImage";
import styles from "./page.module.scss";
import { enumsRoutes } from "@/shared/enums/enumsRoutes";
import FormContainer from "@/presentation/components/FormContainer";



export default function Home() {
  return (
    <div className={styles.page}>
      <BackgroundImage src="/bg-login.png"/>
      <div className={styles.formWrapper}>
        <FormContainer pageTitle='Login'  title="Olá! Seja Bem Vindo!" labelButton="Entrar" route={enumsRoutes.HOME}/>
      </div>
    </div>
  );
}
