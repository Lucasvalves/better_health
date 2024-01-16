import { ICreate } from '../interfaces/PatientsInterface'
import { PatientsRepository } from '../repositories/PatientsRepository'

class PatientsServices {
	private patientsRepository: PatientsRepository

	constructor() {
		this.patientsRepository = new PatientsRepository()
	}
	async create({ name, cpf, user_id }: ICreate) {
		const findByPatient = await this.patientsRepository.findByCpf(cpf)

		if (findByPatient) {
			throw new Error('This CPF already exists')
		}

		const create = await this.patientsRepository.create({ name, cpf, user_id })

		return create
	}
	async index(user_id: string) {
		const result = await this.patientsRepository.findAllByUser(user_id)

		return result
	}
	async findPatientsById(id: string) {
		const result = await this.patientsRepository.findPatient(id)

		return result
	}
	async findPatientsByCpf(cpf: string) {
		const result = await this.patientsRepository.findByCpf(cpf)

		if (!result) {
			throw new Error("User doens't exists")
		}

		return result
	}
}
export { PatientsServices }

