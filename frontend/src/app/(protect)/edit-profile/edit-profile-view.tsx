'use client'
import styles from './page.module.scss'
import Image from 'next/image'
import { MdOutlineEdit } from 'react-icons/md'
import AppInput from '@/presentation/components/Inputs/AppInput'
import { ButtonGroup } from '@/presentation/components/ButtonGroup'
import useEditProfileModel from './edit-profile-model'

export default function EditProfileView(
  methods: ReturnType<typeof useEditProfileModel>
) {
  const {
    handleFileChange,
    triggerFileInput,
    imageUrl,
    handleUpdateUser,
    handleChange,
    fileInputRef
  } = methods

  return (
    <div className={styles.page}>
      <div>
        <p className={styles.title}>Editar Perfil</p>
      </div>
      <form onSubmit={handleUpdateUser} className={styles.formWrapper}>
        <div className={styles.itemsCenter}>
          <label className={styles.avatarWrapper}>
            <Image
              src={imageUrl || '/user.png'}
              width={100}
              height={100}
              alt="Avatar"
              className={styles.avatarImage}
              onClick={triggerFileInput}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={handleFileChange}
              title="Selecionar imagem de perfil"
            />
            <div className={styles.editIcon}>
              <MdOutlineEdit size="20" />
            </div>
          </label>
          <AppInput
            label="Senha antiga"
            placeholder="******"
            type="password"
            onChange={(e) => handleChange('oldPassword', e.target.value)}
            className={styles.inputContainer}
          />
          <AppInput
            label="Nova senha"
            placeholder="******"
            type="password"
            onChange={(e) => handleChange('newPassword', e.target.value)}
            className={styles.inputContainer}
          />

          <ButtonGroup leftButtonLabel="Editar" rightButtonLabel="Cancelar" />
        </div>
      </form>
    </div>
  )
}
