import { Icreate } from '../interfaces/DoctorsInterfaces'
import { DoctorsRepository } from '../repositories/DoctorsRepository'

class DoctorsServices {
	private doctorsRepository: DoctorsRepository

	constructor() {
		this.doctorsRepository = new DoctorsRepository()
	}

	async create({ name, crm, specialties, user_id }: Icreate) {
		const findDoctor = await this.doctorsRepository.findByCrm(crm)

		if (findDoctor) {
			throw new Error('This CRM already exists')
		}

		const result = await this.doctorsRepository.create({
			name,
			crm,
			specialties,
			user_id,
		})

		return result
	}
	async index(user_id: string) {
		const result = await this.doctorsRepository.findDoctorsById(user_id)

		return result
	}

	async findDoctorsById(id: string) {
		const result = await this.doctorsRepository.findDoctorId(id)
		if (!result) {
			throw new Error("User doens't exists")
		}

		return result
	}

	async findDoctorsByCrm(crm: string) {
		const result = await this.doctorsRepository.findByCrm(crm)

		if (!result) {
			throw new Error("User doens't exists")
		}

		return result
	}
	async delete(id: string) {
		const result = await this.doctorsRepository.delete(id)

		return result
	}
	async findBySpecialties(specialties:string){
		const result = await this.doctorsRepository.findSpecialties(specialties)

		return result

	}
}
export { DoctorsServices }
