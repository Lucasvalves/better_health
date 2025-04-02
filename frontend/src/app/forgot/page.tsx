import BackgroundImage from "../components/BackgroundImage";
import FormContainer from "../components/FormContainer";
import styles from "./page.module.scss";


export default function  forgotPage(){
  return(
    <div className={styles.page}>
      <BackgroundImage src="/bg-forgot.png"/>
      <div className={styles.formWrapper}>
        <FormContainer pageTitle='Recuperar Senha' title='Esqueceu sua senha?!' />
         {/* Solicitar redefinição de senha */}
      </div>
    </div>
  )
} 