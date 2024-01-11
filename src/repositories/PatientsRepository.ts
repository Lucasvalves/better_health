import { prisma } from '../database/prisma'
import { ICreate } from '../interfaces/PatientsInterface'

class PatientsRepository {
	async create({ name, cpf, user_id }: ICreate) {
		console.log(user_id)
		const result = await prisma.patients.create({
			data: {
				name,
				cpf,
				user_id,
			},
		})
		return result
	}
	async findByCpf(cpf: string) {
		const patient = await prisma.patients.findFirst({
			where: { cpf },
		})

		return patient
	}
}

export { PatientsRepository }
