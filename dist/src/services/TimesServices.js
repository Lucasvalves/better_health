"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimesServices = void 0;
const DoctorsRepository_1 = require("../repositories/DoctorsRepository");
const TimesRepository_1 = require("../repositories/TimesRepository");
class TimesServices {
    constructor() {
        this.timesRepository = new TimesRepository_1.TimesRepository();
        this.doctorsRepository = new DoctorsRepository_1.DoctorsRepository();
    }
    async store({ days, startHour, endHour, doctors_id, specialties_id, }) {
        const findDoctorSpecialties = await this.doctorsRepository.findDoctorId(doctors_id);
        if (findDoctorSpecialties?.specialties_id != specialties_id) {
            throw new Error('This doctor does not provide the specified specialty');
        }
        const result = await this.timesRepository.create({
            days,
            startHour,
            endHour,
            specialties_id,
            doctors_id,
        });
        return result;
    }
    async find() {
        const result = await this.timesRepository.allTimes();
        return result;
    }
    async findBySpecialties(specialties_id) {
        const result = await this.timesRepository.findBySpecialties(specialties_id);
        if (result.length === 0) {
            throw new Error("specialties_id doesn't exists");
        }
        console.log(result);
        return result;
    }
    async delete(id) {
        const result = await this.timesRepository.delete(id);
        if (!result) {
            throw new Error("Patient doens't exists");
        }
        return result;
    }
}
exports.TimesServices = TimesServices;
