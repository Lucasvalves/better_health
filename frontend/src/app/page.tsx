import styles from "./page.module.scss";
import BackgroundImage from './components/BackgroundImage'
import FormContainer from "./components/FormContainer";
import { ROUTES } from "./paths";


export default function Home() {
  return (
    <div className={styles.page}>
      <BackgroundImage src="/bg-login.png"/>
      <div className={styles.formWrapper}>
        <FormContainer pageTitle='Login'  title="Olá! Seja Bem Vindo!" labelButton="Entrar" route={ROUTES.HOME}/>
      </div>
    </div>
  );
}
