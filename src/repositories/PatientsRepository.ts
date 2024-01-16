import { prisma } from '../database/prisma'
import { ICreate } from '../interfaces/PatientsInterface'

class PatientsRepository {
	async create({ name, cpf, user_id }: ICreate) {
		//create patient
		//console.log(user_id)
		const result = await prisma.patients.create({
			data: {
				name,
				cpf,
				user_id,
			},
			include: {
				user: true, // Include user data in the returned object
			},
		})
		return result
	}
	async findByCpf(cpf: string) {
		//buscando paciente especifico pelo cpf
		const patient = await prisma.patients.findFirst({
			where: { cpf },
		})

		return patient
	}
	async findAllByUser(user_id: string) {
		//buscando todos pacientes cadastrado por o mesmo usuario
		const pacinets = await prisma.patients.findMany({
			where: { user_id },
		})
		return pacinets
	}
	async findPatient(id: string) {
		//buscando um paciente especifico
		const pacinets = await prisma.patients.findFirst({
			where: { id },
		})
		return pacinets
	}
}

export { PatientsRepository }
