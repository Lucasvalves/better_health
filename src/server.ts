import express, { Application, Request, Response, NextFunction } from 'express'
import { UsersRoutes } from './routes/users.routes'
import { PatientsRoutes } from './routes/patients.routes'
import cors from 'cors'
import { DoctorsRoutes } from './routes/doctors.routes'

const app: Application = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))





const usersRoutes = new UsersRoutes().getRoutes()
const patientsRoutes = new PatientsRoutes().getRoutes()
const doctorsRoutes = new DoctorsRoutes().getRoutes()

app.use('/doctors',doctorsRoutes)

app.use('/users', usersRoutes)
app.use('/patients', patientsRoutes)

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
