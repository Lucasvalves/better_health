export interface ICreate {
	date: string
	patients_id: string
	doctors_id: string
	users_id: string
}
export interface ICreateAvailableDays {
	date: Date
	specialties_id: string
	user_id: string
}
