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

		const duration = new Date('2029-02-01T03:30:00.000Z')

		const create = await this.specialtiesRepository.create(name, duration)
		return create
	}

	async index() {
		const result = await this.specialtiesRepository.getAll()
		return result
	}

	async findSpecialty(id: string) {
		const result = await this.specialtiesRepository.find(id)
		return result
	}
	// async update({ name, oldPasswork, newPassword, user_id }: IUpdate) {
	// 	let password
	// 	if (oldPasswork && newPassword) {
	// 		const findUserById = await this.usersRepository.findUserById(user_id)
	// 		if (!findUserById) {
	// 			throw new Error('User not found')
	// 		}
	// 		const passwordMatch = compare(oldPasswork, findUserById.password)
	// 		if (!passwordMatch) {
	// 			throw new Error('Password invalid')
	// 		}

	// 		password = await hash(newPassword, 10)

	// 		await this.usersRepository.updatePassword(name, password, user_id)
	// 	}

	// 	return {
	// 		message: 'Specialties updated successfully',
	// 	}
	// }
}
export { SpecialtiesServices }
