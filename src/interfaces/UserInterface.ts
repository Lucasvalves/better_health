export interface ICreate {
	name: string
	email: string
	password: string
}
export interface IUpdate {
	name: string
	oldPasswork: string
	newPassword: string
	user_id: string
}
