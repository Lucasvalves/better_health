import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { UsersRoutes } from './routes/users.routes';
import { PatientsRoutes } from './routes/patients.routes';
import { DoctorsRoutes } from './routes/doctors.routes';
import { TimesRoutes } from './routes/times.routes';
import { AppointmentsRoutes } from './routes/appointments.routes';
import { SpecialtiesRoutes } from './routes/specialties.routes';
import swaggerUi from 'swagger-ui-express'
import { SwaggerSpec } from './utils/swagger';


const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/v1/docs', swaggerUi.serve, swaggerUi.setup(SwaggerSpec))


const usersRoutes = new UsersRoutes().getRoutes();
const patientsRoutes = new PatientsRoutes().getRoutes();
const specialtiesRoutes = new SpecialtiesRoutes().getRoutes();
const doctorsRoutes = new DoctorsRoutes().getRoutes();
const timesRoutes = new TimesRoutes().getRoutes();
const appointmentsRoutes = new AppointmentsRoutes().getRoutes();

app.use('/users', usersRoutes);
app.use('/patients', patientsRoutes);
app.use('/specialties', specialtiesRoutes);
app.use('/doctors', doctorsRoutes);
app.use('/times', timesRoutes);
app.use('/appointments', appointmentsRoutes);


const errorHandler: express.ErrorRequestHandler = (err:Error, req:Request, res:any, next: NextFunction) => {
  const statusCode = err instanceof Error ? 400 : 500;
  const message = err instanceof Error ? err.message : 'Internal Server Error';

  return res.status(statusCode).json({
    message,
  });
};

app.use(errorHandler);
export { app };

app.listen(3333, () => console.log('Server is running'));

