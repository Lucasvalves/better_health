import BackgroundImage from "../components/BackgroundImage";
import FormContainer from "../components/FormContainer";
import styles from "./page.module.scss";


export default function  registerPage(){
  return(
    <div className={styles.page}>
      <BackgroundImage src="/bg-register.png"/>
      <div className={styles.formWrapper}>
       <FormContainer pageTitle='Cadastro' title='Insira seus dados!' />
      </div>
    </div>
  )
} 