'use client'
import Form from 'next/form'
import styles from './page.module.scss'
import Image from 'next/image'
import { MdOutlineEdit } from 'react-icons/md'
import { PageLayout } from '@/presentation/components/PageLayout'
import AppInput from '@/presentation/components/Inputs/AppInput'
import { ButtonGroup } from '@/presentation/components/ButtonGroup'
import useEditProfileModel from './edit-profile-model'

export default function EditProfileView(
  methods: ReturnType<typeof useEditProfileModel>
) {
  const { handleFileChange, triggerFileInput, imageUrl } = methods

  return (
    <div className={styles.page}>
      <PageLayout title="Editar Perfil">
        <div className={styles.formWrapper}>
          <Form action="">
            <div className={styles.itemsCenter}>
              <label className={styles.avatarWrapper}>
                <Image
                  src={imageUrl || '/default-profile.png'}
                  width={100}
                  height={100}
                  alt="Avatar"
                  className={styles.avatarImage}
                  onClick={triggerFileInput}
                />
                <input
                  aria-label="edit"
                  type="file"
                  accept="image/*"
                  className={styles.fileInput}
                  onChange={handleFileChange}
                />
                <div className={styles.editIcon}>
                  <MdOutlineEdit size="20" />
                </div>
              </label>
              <AppInput
                label="Nome"
                placeholder="Luiza Gomes"
                className={styles.inputContainer}
              />
              <AppInput
                label="Email"
                placeholder="luizagomes@gmail.com"
                className={styles.inputContainer}
              />
              <AppInput
                label="Nova senha"
                placeholder="******"
                type="password"
                className={styles.inputContainer}
              />
              <AppInput
                label="Confirmar senha"
                placeholder="******"
                type="password"
                className={styles.inputContainer}
              />
              <ButtonGroup
                rightButtonLabel="Cancelar"
                leftButtonLabel="Editar"
              />
            </div>
          </Form>
        </div>
      </PageLayout>
    </div>
  )
}
