'use client'
import { HttpClient } from '@/infrastructure/http/http-client'
import useEditProfileModel from './edit-profile-model'
import EditProfileView from './edit-profile-view'
import { UpdateUserService } from '@/data/user-service/update-user-service/update-user-service'

export default function EditProfileViewModel() {
  const httpClient = HttpClient.create()
  const updateUserService = UpdateUserService.create(httpClient)

  const methods = useEditProfileModel({
    updateUserService
  })
  return <EditProfileView {...methods} />
}
