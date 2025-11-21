import { useState, useRef, FormEvent, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { enqueueSnackbar } from 'notistack'
import { UpdateUserBody, User } from '@/domain/models/user'
import { UpdateUserServiceContract } from '@/data/user-service/update-user-service/update-user-service'
import { AxiosError } from 'axios'
import Cookies from 'js-cookie'
import { GetUserService } from '@/data/user-service/get-user-service/get-user-service'

type ApiError = { message?: string }

type UserServiceRegistry = {
  updateUserService: UpdateUserServiceContract
  getUserService: GetUserService
}

export default function useEditProfileModel({
  updateUserService,
  getUserService
}: UserServiceRegistry) {
  const queryClient = useQueryClient()

  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [updateUserPayload, setUpdateUserPayload] = useState<UpdateUserBody>({
    oldPassword: '',
    newPassword: '',
    avatar_url: undefined
  })

  const token = Cookies.get('token')

  const { data: user } = useQuery<User, AxiosError<ApiError>>({
    queryKey: ['user'],
    queryFn: () => {
      if (!token) throw new Error('Token not found')
      return getUserService.exec({ token })
    },
    enabled: !!token
  })

  useEffect(() => {
    if (user?.avatar_url) {
      setImageUrl(user.avatar_url)
    }
  }, [user])

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

  const triggerFileInput = () => fileInputRef.current?.click()

  const { mutate: updateUser } = useMutation<
    User,
    AxiosError<ApiError>,
    { body: UpdateUserBody; token?: string }
  >({
    mutationFn: ({ body, token }) => updateUserService.exec({ body, token }),

    onSuccess: () => {
      enqueueSnackbar('Usuário atualizado com sucesso!', { variant: 'success' })

      queryClient.invalidateQueries({ queryKey: ['user'] })
    },

    onError: (err) => {
      enqueueSnackbar(
        err.response?.data?.message || 'Erro ao atualizar usuário.',
        { variant: 'error' }
      )
    }
  })

  const handleUpdateUser = (e: FormEvent) => {
    e.preventDefault()
    updateUser({ body: updateUserPayload, token })
  }

  const handleChange = (field: keyof UpdateUserBody, value: string) => {
    setUpdateUserPayload((prev) => ({ ...prev, [field]: value }))
  }

  return {
    imageUrl,
    fileInputRef,
    handleFileChange,
    triggerFileInput,
    handleUpdateUser,
    handleChange
  }
}
