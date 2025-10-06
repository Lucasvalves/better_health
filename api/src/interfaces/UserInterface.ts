export interface ICreate {
	name: string
	email: string
	password: string
}
export interface IUpdate {
	oldPassword: string
	newPassword: string
	user_id: string
	avatar_url?: FileUpload
}

interface FileUpload {
	fieldName?: string
	originalname: string
	encoding: string
	mimetype: string
	buffer: Buffer
	size: number
}
