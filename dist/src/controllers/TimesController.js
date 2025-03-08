"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimesController = void 0;
const TimesServices_1 = require("../services/TimesServices");
class TimesController {
    constructor() {
        this.timesServices = new TimesServices_1.TimesServices();
    }
    async store(request, response, next) {
        const { days, startHour, endHour, specialties_id, doctors_id } = request.body;
        try {
            const result = await this.timesServices.store({
                days,
                startHour,
                endHour,
                specialties_id,
                doctors_id,
            });
            response.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async find(request, response, next) {
        try {
            const result = await this.timesServices.find();
            response.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async findBySpecialties(request, response, next) {
        const { specialties_id } = request.body;
        try {
            const result = await this.timesServices.findBySpecialties(specialties_id);
            response.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async delete(request, response, next) {
        const { id } = request.params;
        try {
            const result = await this.timesServices.delete(id);
            response.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.TimesController = TimesController;
