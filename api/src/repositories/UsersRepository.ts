import { prisma } from '../database/prisma'
import { ICreate } from '../interfaces/UserInterface'

class UsersRepository {
	async create({ name, email, password }: ICreate) {
		const result = await prisma.users.create({
			data: {
				name,
				email,
				password,
			},
		})
		return result
	}
	async findUserByEmail(email: string) {
		const result = await prisma.users.findUnique({
			where: {
				email,
			},
		})
		return result
	}
	async findUserById(id: string) {
		const result = await prisma.users.findUnique({
			where: {
				id,
			},
		})
		return result
	}
	async updatePassword(newPassword: string, user_id: string) {
		const result = await prisma.users.update({
			where: {
				id: user_id,
			},
			data: {
				password: newPassword,
			},
		})
		return result
	}
	async update(avatar_url: string, user_id: string) {
		const result = await prisma.users.update({
			where: {
				id: user_id,
			},
			data: {
				avatar_url,
			},
		})

		return result
	}
}

export { UsersRepository }
