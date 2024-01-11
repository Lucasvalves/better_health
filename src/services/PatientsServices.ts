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
}
export { PatientsServices }
