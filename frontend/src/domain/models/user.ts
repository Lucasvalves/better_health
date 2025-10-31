export type User = {
  name?: string
  email: string
  password: string
}
export type UpdateUserBody = {
  oldPassword?: string
  newPassword?: string
  avatar_url?: File | string
}

export type UpdateUser = {
  body: UpdateUserBody | FormData
  token?: string
}
