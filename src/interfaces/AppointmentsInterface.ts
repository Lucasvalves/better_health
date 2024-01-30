export interface ICreate {
	date: string
	patients_id: string
	doctors_id: string
	specialties_id: string
}
export interface ICreateAvailableDays {
	date: Date
	specialties_id: string
}
export interface IRange {
	start?: Date| undefined
	end?: Date | undefined
}
export interface IFilter {
	specialties_id: string
	range: IRange
}
export interface IRangeRepository {
	specialties_id:string
	start?: Date| undefined
	end?: Date | undefined
}
export interface IObject{
	[chave: string]: any
}
export interface IBreakTimeRange {
  (
    startDate: string,
    startTime: string,
    endTime: string,
    intervalMinutes: number
  ): string[];
}

