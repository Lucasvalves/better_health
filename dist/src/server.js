"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const users_routes_1 = require("./routes/users.routes");
const patients_routes_1 = require("./routes/patients.routes");
const doctors_routes_1 = require("./routes/doctors.routes");
const times_routes_1 = require("./routes/times.routes");
const appointments_routes_1 = require("./routes/appointments.routes");
const specialties_routes_1 = require("./routes/specialties.routes");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./utils/swagger");
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/v1/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.SwaggerSpec));
const usersRoutes = new users_routes_1.UsersRoutes().getRoutes();
const patientsRoutes = new patients_routes_1.PatientsRoutes().getRoutes();
const specialtiesRoutes = new specialties_routes_1.SpecialtiesRoutes().getRoutes();
const doctorsRoutes = new doctors_routes_1.DoctorsRoutes().getRoutes();
const timesRoutes = new times_routes_1.TimesRoutes().getRoutes();
const appointmentsRoutes = new appointments_routes_1.AppointmentsRoutes().getRoutes();
app.use('/users', usersRoutes);
app.use('/patients', patientsRoutes);
app.use('/specialties', specialtiesRoutes);
app.use('/doctors', doctorsRoutes);
app.use('/times', timesRoutes);
app.use('/appointments', appointmentsRoutes);
const errorHandler = (err, req, res, next) => {
    const statusCode = err instanceof Error ? 400 : 500;
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return res.status(statusCode).json({
        message,
    });
};
app.use(errorHandler);
const port = process.env.PORT || 3333;
app.listen(port, () => console.log('Server is running'));
