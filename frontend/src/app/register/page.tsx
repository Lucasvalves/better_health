import { enumsRoutes } from "@/shared/enums/enumsRoutes";
import styles from "./page.module.scss";
import FormContainer from "@/presentation/components/FormContainer";
import BackgroundImage from "@/presentation/components/BackgroundImage";


export default function  registerPage(){
  return(
    <div className={styles.page}>
      <BackgroundImage src="/bg-register.png"/>
      <div className={styles.formWrapper}>
       <FormContainer pageTitle='Cadastro' title='Insira seus dados!' labelButton="Confirmar" route={enumsRoutes.REGISTER}/>
      </div>
    </div>
  )
} 