import { enumsRoutes } from "@/shared/enums/enumsRoutes";
import styles from "./page.module.scss";
import BackgroundImage from "@/presentation/components/BackgroundImage";
import FormContainer from "@/presentation/components/FormContainer";


export default function  forgotPage(){
  return(
    <div className={styles.page}>
      <BackgroundImage src="/bg-forgot.png"/>
      <div className={styles.formWrapper}>
        <FormContainer pageTitle='Recuperar' title='Solicitar redefinição!' labelButton="Confirmar" route={enumsRoutes.FORGOT}/>
      </div>
    </div>
  )
} 