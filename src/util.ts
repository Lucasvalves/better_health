import { IBreakTimeRange } from './interfaces/AppointmentsInterface'
import {
	format,
	parse,
	addHours,
	isBefore,
	isAfter,
	addMinutes,
	getMinutes,
	getHours,
} from 'date-fns'

export const breakTimeRange: IBreakTimeRange = (
	startDate,
	startTime,
	endTime,
	intervalMinutes
) => {
	const result = []
	const startDateTime = addHours(
		parse(`${startDate} ${startTime}`, 'yyyy-MM-dd HH:mm', new Date()),
		0
	)
	const endDateTime = addHours(
		parse(`${startDate} ${endTime}`, 'yyyy-MM-dd HH:mm', new Date()),
		0
	)

	let currentDateTime = startDateTime

	while (isBefore(currentDateTime, endDateTime)) {
		const nextDateTime = addMinutes(currentDateTime, intervalMinutes)

		// Verificar se o próximo intervalo ultrapassa o horário de término
		if (isAfter(nextDateTime, endDateTime)) {
			break
		}

		result.push(format(currentDateTime, 'HH:mm'))

		currentDateTime = nextDateTime
	}

	return result
}

export const addMinutesToDate = (date: Date, duration: Date) => {
	const minutesToDate = addMinutes(
		addHours(date, getHours(addHours(duration, +3))),
		getMinutes(duration)
	)

	return format(minutesToDate, 'HH:mm')
}

export const splitByvalue = (array: string[], value: string) => {
	let newArray = [[]]
	array?.forEach((item:string) => {
		if (item != value) {
			newArray[newArray.length - 1].push(item)
		}else{
			newArray.push([])
		}
	})

	return newArray
}
