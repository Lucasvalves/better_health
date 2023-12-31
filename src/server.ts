import express, { Application, Request, Response } from 'express'
import { UsersRoutes } from './routes/users.routes'

const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const usersRoutes = new UsersRoutes().getRoutes()

app.use('/users', usersRoutes)

app.use(
	(err: Error, request: Request, response: Response, next: NextFunction) => {
		if (err instanceof Error) {
			return response.status(400).json({
				message: err.message,
			})
		}
		return response.status(500).json({
			message: 'Internal Server Error',
		})
	}
)

app.listen(3333, () => console.log('Server is running'))
