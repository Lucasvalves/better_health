import { useState, useRef, FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { enqueueSnackbar } from 'notistack'
import { UpdateUserBody, User } from '@/domain/models/user'
import { UpdateUserServiceContract } from '@/data/user-service/update-user-service/update-user-service'
import { AxiosError } from 'axios'
import Cookies from 'js-cookie'

type ApiError = { message?: string }

type UserServiceRegistry = {
  updateUserService: UpdateUserServiceContract
}

export default function useEditProfileModel({
  updateUserService
}: UserServiceRegistry) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [updateUserPayload, setUpdateUserPayload] = useState<UpdateUserBody>({
    oldPassword: '',
    newPassword: '',
    avatar_url: undefined
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const objectUrl = URL.createObjectURL(file)
    setImageUrl(objectUrl)
    setUpdateUserPayload((prev) => ({
      ...prev,
      avatar_url: file
    }))
  }

  const { mutate: updateUser } = useMutation<
    User,
    AxiosError<ApiError>,
    { body: UpdateUserBody | FormData; token?: string }
  >({
    mutationFn: async ({ body, token }) => {
      return await updateUserService.exec({ body, token })
    },
    onSuccess: () =>
      enqueueSnackbar('Usuário atualizado com sucesso!', {
        variant: 'success'
      }),
    onError: (err) =>
      enqueueSnackbar(
        err.response?.data?.message || 'Erro ao atualizar usuário.',
        {
          variant: 'error'
        }
      )
  })
  const triggerFileInput = () => fileInputRef.current?.click()

  const handleUpdateUser = (e: FormEvent) => {
    e.preventDefault()
    const token = Cookies.get('token')
    updateUser({ body: updateUserPayload, token })
  }

  const handleChange = (field: keyof UpdateUserBody, value: string) => {
    setUpdateUserPayload((prev) => ({ ...prev, [field]: value }))
  }

  return {
    handleFileChange,
    triggerFileInput,
    imageUrl,
    handleUpdateUser,
    handleChange,
    fileInputRef
  }
}
