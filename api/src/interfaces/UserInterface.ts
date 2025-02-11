export interface ICreate {
	name: string
	email: string
	password: string
}
export interface IUpdate {
	oldPassword: string
	newPassword: string
	user_id: string
}
