import { compare, hash } from 'bcrypt'
import { ICreate, IUpdate } from '../interfaces/UserInterface'
import { UsersRepository } from '../repositories/UsersRepository'
import { sign } from 'jsonwebtoken'

class UsersServices {
	private usersRepository: UsersRepository
	constructor() {
		this.usersRepository = new UsersRepository()
	}
	async create({ name, email, password }: ICreate) {
		const findUser = await this.usersRepository.findUserByEmail(email)

		if (findUser) {
			throw new Error('User Exists')
		}

		const hashPassword = await hash(password, 10)

		const create = await this.usersRepository.create({
			name,
			email,
			password: hashPassword,
		})
		return create
	}
	async update({ oldPassword, newPassword, user_id }: IUpdate) {

		if (!oldPassword || !newPassword) {
			throw new Error('Old password and new password are required');
		}

		const findUserById = await this.usersRepository.findUserById(user_id)
		console.log(findUserById);

		if (!findUserById) {
			throw new Error('User not found')
		}
		const passwordMatch = await compare(oldPassword, findUserById.password)

		if (!passwordMatch) {
			throw new Error('Invalid old password')
		}

		const hashedPassword = await hash(newPassword, 10)

		await this.usersRepository.updatePassword(hashedPassword, user_id)

		return {
			message: 'User updated successfully',
		}
	}

	async auth(email: string, password: string) {
		const findUser = await this.usersRepository.findUserByEmail(email)
		if (!findUser) {
			throw new Error('User or password invalid')
		}

		const passwordMatch = await compare(password, findUser.password)

		if (!passwordMatch) {
			throw new Error('User or password invalid')
		}
		let scretKey: string | undefined = process.env.ACCESS_KEY_TOKEN

		if (!scretKey) {
			throw new Error('There is no token key')
		}
		const token = sign({ email }, scretKey, {
			subject: findUser.id,
			expiresIn: '365d',
			//expiresIn: 60 * 15,
		})

		return {
			token,
			user: {
				name: findUser.name,
				email: findUser.email,
			},
		}
	}
}
export { UsersServices }
