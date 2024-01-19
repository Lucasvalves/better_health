import { ICreate } from '../interfaces/DoctorsInterfaces'
import { DoctorsRepository } from '../repositories/DoctorsRepository'

class DoctorsServices {
	private doctorsRepository: DoctorsRepository

	constructor() {
		this.doctorsRepository = new DoctorsRepository()
	}

	async create({ name, crm, specialties_id, user_id }: ICreate) {
		const findDoctor = await this.doctorsRepository.findByCrm(crm)

		if (findDoctor) {
			throw new Error('This CRM already exists')
		}

		const result = await this.doctorsRepository.create({
			name,
			crm,
			specialties_id,
			user_id,
		})

		return result
	}
	async index(user_id: string) {
		const result = await this.doctorsRepository.findDoctorsByUserId(user_id)

		return result
	}

	async findDoctorsById(id: string) {
		const result = await this.doctorsRepository.findDoctorId(id)

		if (!result) {
			throw new Error("Doctor t doens't exists")
		}

		return result
	}

	async findDoctorsByCrm(crm: string) {
		const result = await this.doctorsRepository.findByCrm(crm)

		if (!result) {
			throw new Error("Doctor doens't exists")
		}

		return result
	}
	async delete(id: string) {
		const result = await this.doctorsRepository.delete(id)

		if (!result) {
			throw new Error("Doctor doens't exists")
		}

		return result
	}

}
export { DoctorsServices }
