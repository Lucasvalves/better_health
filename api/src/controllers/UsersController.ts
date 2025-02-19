import { NextFunction, Request, Response } from 'express'
import { UsersServices } from '../services/UsersServices'
class UsersController {
	private usersServices: UsersServices
	constructor() {
		this.usersServices = new UsersServices()
	}

	async store(request: Request, response: Response, next: NextFunction) : Promise<void>  {
		//criar usuario
		const { name, email, password } = request.body

		try {
			const result = await this.usersServices.create({ name, email, password })
			response.status(201).json(result)
		} catch (error) {
			next(error)
			response.status(401)
		}
	}
	async auth(request: Request, response: Response, next: NextFunction) : Promise<void>  {
		const { email, password } = request.body
		try {
			const result = await this.usersServices.auth(email, password)
			response.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}
	async update(request: Request, response: Response, next: NextFunction) : Promise<void> {
		const { oldPassword, newPassword } = request.body
		const { user_id } = request

		try {
			const result = await this.usersServices.update({
        oldPassword,
        newPassword,
				avatar_url: request.file,
        user_id,
			})
			response.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}
}
export { UsersController }
