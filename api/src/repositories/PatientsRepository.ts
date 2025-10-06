import { prisma } from '../database/prisma'
import { ICreate, IUpdate } from '../interfaces/PatientsInterface'

class PatientsRepository {
	async create({ name, cpf, user_id, phone }: ICreate) {
		//create patient
		const result = await prisma.patients.create({
			data: {
				name,
				cpf,
				user_id,
				phone,
			},
			include: {
				Users: true, // Include user data in the returned object
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
	async findAll() {
		//buscando todos pacientes cadastrado por o mesmo usuario
		const pacinets = await prisma.patients.findMany()
		return pacinets
	}
	async findPatient(id: string) {
		//buscando um paciente especifico
		const pacinets = await prisma.patients.findFirst({
			where: { id },
		})
		return pacinets
	}
	async findByPhone(id: string, phone: string) {
		//buscando paciente especifico pelo cpf
		const patient = await prisma.patients.findFirst({
			where: { id, phone },
		})

		return patient
	}

	async updateAllData({ id, name, cpf, phone }: IUpdate) {
		const result = await prisma.patients.update({
			where: { id },
			data: {
				name,
				cpf,
				phone,
			},
		})
		return result
	}
	async updatePhone(id: string, phone: string) {
		const result = await prisma.patients.update({
			where: { id },
			data: {
				phone,
			},
		})
		return result
	}
	async updateCpfAndName(id: string, name: string, cpf: string) {
		const result = await prisma.patients.update({
			where: { id },
			data: {
				name,
				cpf,
			},
		})
		return result
	}
	async delete(id: string) {
		const result = await prisma.patients.delete({
			where: { id },
		})
		return result
	}
}

export { PatientsRepository }
