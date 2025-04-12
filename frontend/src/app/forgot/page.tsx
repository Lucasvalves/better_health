import BackgroundImage from "../components/BackgroundImage";
import FormContainer from "../components/FormContainer";
import { ROUTES } from "../paths";
import styles from "./page.module.scss";


export default function  forgotPage(){
  return(
    <div className={styles.page}>
      <BackgroundImage src="/bg-forgot.png"/>
      <div className={styles.formWrapper}>
        <FormContainer pageTitle='Recuperar' title='Solicitar redefinição!' labelButton="Confirmar" route={ROUTES.FORGOT}/>
      </div>
    </div>
  )
} 