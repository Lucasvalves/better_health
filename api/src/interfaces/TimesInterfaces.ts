export interface ICreate {
	days: number
	startHour: string
	endHour: string
	specialties_id: string
	doctors_id: string
}

export interface ICreateDB {
	days: number
	startHour: Date
	endHour: Date
	specialties_id: string
	doctors_id: string
}
