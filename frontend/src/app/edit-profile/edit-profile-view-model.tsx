'use client'
import useEditProfileModel from './edit-profile-model'
import EditProfileView from './edit-profile-view'

export default function EditProfileViewModel() {
  const methods = useEditProfileModel()
  return <EditProfileView {...methods} />
}
