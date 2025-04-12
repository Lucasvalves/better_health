import Form from "next/form";
import { ButtonGroup } from "../components/ButtonGroup";
import AppInput from "../components/Inputs/AppInput";
import { PageLayout } from "../components/PageLayout";
import styles from './page.module.scss'
import Image from "next/image";
import { MdOutlineEdit } from "react-icons/md";

export default function EditProfile(){
  return(
    <div className={styles.page}>
      <PageLayout title="Editar Perfil" >
        <div className={styles.formWrapper}>
          <Form action="">
            <div className={styles.itemsCenter}>
            <label className={styles.avatarWrapper}>
              <Image src="/default-profile.png" width={100} height={100} alt="Avatar" className={styles.avatarImage} />
              <input aria-label="edit" type="file" className={styles.fileInput} />
              <div className={styles.editIcon}>
                <MdOutlineEdit size='20'/>
              </div>
            </label>
            <AppInput label="Nome" placeholder="Luiza Gomes" className={styles.containerInput}/>
            <AppInput label="Email" placeholder="luizagomes@gmail.com" className={styles.containerInput}/>
            <AppInput label="Nova senha" placeholder="******" type="password" className={styles.containerInput}/>
            <AppInput label="Confirmar senha" placeholder="******" type="password" className={styles.containerInput}/>
            <ButtonGroup rightButtonLabel="Cancelar" leftButtonLabel="Editar" />
          </div>
          </Form>
        </div>
      </PageLayout>
    </div>
  )
}

