'use client'

import { AuthenticationView } from './authentication-view'
import { useAuthenticationModel } from './authentication-model'
import { CreateUserService } from '@/data/user-service/create-user-service/create-user-service'
import { AuthUserService } from '@/data/user-service/auth-user/auth-user-service'
import { HttpClient } from '@/infrastructure/http/http-client'

export const AuthenticationViewModel = () => {
  const httpClient = HttpClient.create()
  const createUserService = CreateUserService.create(httpClient)
  const authUserService = AuthUserService.auth(httpClient)

  const methods = useAuthenticationModel({
    createUserService,
    authUserService
  })

  return <AuthenticationView {...methods} />
}
