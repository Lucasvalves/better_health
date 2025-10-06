import { SpecialtiesRepository } from '../repositories/SpecialtiesRepository'

class SpecialtiesServices {
	private specialtiesRepository: SpecialtiesRepository
	constructor() {
		this.specialtiesRepository = new SpecialtiesRepository()
	}
	async create(name: string) {
		const findSpecialty = await this.specialtiesRepository.findSpecialtyByName(
			name
		)

		if (findSpecialty) {
			throw new Error('Specialty already exists')
		}

		const duration = new Date('2029-02-01T00:30:00.000Z')

		const create = await this.specialtiesRepository.create(name, duration)
		return create
	}

	async index() {
		const result = await this.specialtiesRepository.getAll()
		return result
	}

	async findSpecialty(id: string) {
		const findSpecialty = await this.specialtiesRepository.find(id)

		if (!findSpecialty) {
			throw new Error('Specialty not found')
		}

		return findSpecialty
	}
}
export { SpecialtiesServices }
