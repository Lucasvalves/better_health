"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsController = void 0;
const AppointmentsServices_1 = require("../services/AppointmentsServices");
class AppointmentsController {
    constructor() {
        this.appointmentsServices = new AppointmentsServices_1.AppointmentsServices();
    }
    async store(request, response, next) {
        const { patients_id, specialties_id, doctors_id, date } = request.body;
        //verificar se existe horario disponivel
        try {
            const result = await this.appointmentsServices.store({
                patients_id,
                specialties_id,
                doctors_id,
                date,
            });
            response.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async index(request, response, next) {
        const { range, specialties_id } = request.body;
        try {
            const result = await this.appointmentsServices.index({ range, specialties_id });
            response.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async availableDays(request, response, next) {
        const { date, specialties_id } = request.body;
        try {
            const result = await this.appointmentsServices.availableDays({
                date,
                specialties_id,
            });
            response.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AppointmentsController = AppointmentsController;
