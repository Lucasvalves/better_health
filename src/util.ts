import {
	format,
	parse,
	addHours,
	isBefore,
	isAfter,
	addMinutes,
	getHours
} from 'date-fns'

//Função para quebrar um intervalo de tempo em segmentos menores
export const util = (
	startDate: string,
	startTime: string,
	endTime: string,
	intervalMinutes: number
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

		result.push(
			format(currentDateTime, 'HH:mm'),
		)

		currentDateTime = nextDateTime
	}

	return result
}
