
"use client"
import Form from "next/form";
import { ButtonGroup } from "../components/ButtonGroup";
import AppInput from "../components/Inputs/AppInput";
import { PageLayout } from "../components/PageLayout";
import styles from './page.module.scss'
import Image from "next/image";
import { MdOutlineEdit } from "react-icons/md";
import { useState, useRef} from "react";

export default function EditProfile(){
  const [imageUrl, setImageUrl] = useState<string | null >(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {

      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione um arquivo de imagem');
        return;
      }
      
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  return(
    <div className={styles.page}>
      <PageLayout title="Editar Perfil" >
        <div className={styles.formWrapper}>
          <Form action="">
            <div className={styles.itemsCenter}>
            <label className={styles.avatarWrapper}>
              <Image src={imageUrl || "/default-profile.png"} width={100} height={100} alt="Avatar" className={styles.avatarImage} onClick={triggerFileInput}/>
              <input aria-label="edit" type="file"  accept="image/*" className={styles.fileInput} onChange={handleFileChange}/>
              <div className={styles.editIcon}>
                <MdOutlineEdit size='20'/>
              </div>
            </label>
            <AppInput label="Nome" placeholder="Luiza Gomes" className={styles.inputContainer}/>
            <AppInput label="Email" placeholder="luizagomes@gmail.com" className={styles.inputContainer}/>
            <AppInput label="Nova senha" placeholder="******" type="password" className={styles.inputContainer}/>
            <AppInput label="Confirmar senha" placeholder="******" type="password" className={styles.inputContainer}/>
            <ButtonGroup rightButtonLabel="Cancelar" leftButtonLabel="Editar" />
          </div>
          </Form>
        </div>
      </PageLayout>
    </div>
  )
}

