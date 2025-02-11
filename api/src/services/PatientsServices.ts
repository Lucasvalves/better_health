import { ICreate, IUpdate } from '../interfaces/PatientsInterface'
import { PatientsRepository } from '../repositories/PatientsRepository'

class PatientsServices {
	private patientsRepository: PatientsRepository

	constructor() {
		this.patientsRepository = new PatientsRepository()
	}
	async create({ name, cpf, user_id, phone }: ICreate) {
		const findByPatient = await this.patientsRepository.findByCpf(cpf)

		if (findByPatient) throw new Error('This CPF already exists')

		const create = await this.patientsRepository.create({
			name,
			cpf,
			user_id,
			phone,
		})

		return create
	}
	async index() {
		const result = await this.patientsRepository.findAll()

		return result
	}
	async findPatientsById(id: string) {
		const result = await this.patientsRepository.findPatient(id)
		console.log(result);


		if (!result) throw new Error("User doens't exists")

		return result
	}
	async findPatientsByCpf(cpf: string) {
		const result = await this.patientsRepository.findByCpf(cpf)

		if (!result) throw new Error("Patient doens't exists")

		return result
	}
	async update({ id, name, cpf, phone }: IUpdate) {
		const findPhone = await this.patientsRepository.findByPhone(id, phone)

		const findPatientsById = await this.patientsRepository.findPatient(id)

		//verificando se o novo CPF informado é diferente do cadastrado do paciente
		if (findPatientsById?.cpf != cpf) {
			const findByPatient = await this.patientsRepository.findByCpf(cpf)
			const findPhone = await this.patientsRepository.findByPhone(id, phone)

			//verificando se esse CPF informado não pertence a outro paciente
			if (findByPatient) {
				throw new Error('This CPF was registered for another patient')
			}
			/*Verificando se o telefone é o mesmo do já cadastrado se for
			atualiza só os outros dados*/
			if (findPhone) {
				const result = await this.patientsRepository.updateCpfAndName(
					id,
					name,
					cpf
				)
				return result
			}
			//Atualizando todos os dados
			const result = await this.patientsRepository.updateAllData({
				id,
				name,
				cpf,
				phone,
			})

			return result
		}

		//Verificando se o telefone é o mesmo do já cadastrado
		if (findPhone) throw new Error('Phone number is the same')

		//Atualizando só o telefone
		const result = await this.patientsRepository.updatePhone(id, phone)

		return result
	}
	async delete(id: string) {
		const result = await this.patientsRepository.delete(id)

		if (!result) {
			throw new Error("Patient doens't exists")
		}

		return result
	}
}
export { PatientsServices }
