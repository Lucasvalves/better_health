import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
interface IPayload {
	sub: string
}
class AuthMiddleware {
	auth(request: Request, response: Response, next: NextFunction) {
		const authHeader = request.headers.authorization

		if (!authHeader) {
			return response.status(401).json({
				code: 'token is missing',
				message: 'Token is missing',
			})
		}

		const [, token] = authHeader.split(' ')

		const scretKey: string | undefined = process.env.ACCESS_KEY_TOKEN

		if (!scretKey) {
			throw new Error('There is no token key')
		}
		try {
			const { sub } = verify(token, scretKey) as IPayload
			request.user_id = sub
			return next()
		} catch (error) {
			response.status(401).json({
				code: 'token.expired',
				message: 'Token expired.',
			})
		}
	}
}
export { AuthMiddleware }
