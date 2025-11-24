import {
  InMemoryAuthUserService,
  InMemoryCreateUserService,
  InMemoryGetUserService,
  InMemoryUpdateUserService
} from './user'
import { UserServiceRegistry } from './../../../app/authentication/authentication-model'
import { EditProfileServiceRegistry } from '@/app/(protect)/edit-profile/edit-profile-model'

export const InMemoryAuthUserRegistry: UserServiceRegistry = {
  createUserService: new InMemoryCreateUserService(),
  authUserService: new InMemoryAuthUserService()
}

export const InMemoryEditProfileRegistry: EditProfileServiceRegistry = {
  getUserService: new InMemoryGetUserService(),
  updateUserService: new InMemoryUpdateUserService()
}
