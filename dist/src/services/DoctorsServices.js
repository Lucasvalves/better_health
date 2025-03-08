"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorsServices = void 0;
const DoctorsRepository_1 = require("../repositories/DoctorsRepository");
const SpecialtiesRepository_1 = require("../repositories/SpecialtiesRepository");
class DoctorsServices {
    constructor() {
        this.doctorsRepository = new DoctorsRepository_1.DoctorsRepository();
        this.specialtiesRepository = new SpecialtiesRepository_1.SpecialtiesRepository();
    }
    async create({ name, crm, specialties_id, user_id }) {
        const findDoctor = await this.doctorsRepository.findByCrm(crm);
        const findSpecialty = await this.specialtiesRepository.find(specialties_id);
        console.log(name, crm, specialties_id, user_id);
        if (!findSpecialty) {
            throw new Error("This specialty doesn't exists");
        }
        if (findDoctor) {
            throw new Error('This CRM already exists');
        }
        const result = await this.doctorsRepository.create({
            name,
            crm,
            specialties_id,
            user_id,
        });
        return result;
    }
    async index(user_id) {
        const result = await this.doctorsRepository.findDoctorsByUserId(user_id);
        return result;
    }
    async findDoctorsById(id) {
        const result = await this.doctorsRepository.findDoctorId(id);
        if (!result) {
            throw new Error("Doctor t doens't exists");
        }
        return result;
    }
    async findDoctorsByCrm(crm) {
        const result = await this.doctorsRepository.findByCrm(crm);
        if (!result) {
            throw new Error("Doctor doens't exists");
        }
        return result;
    }
    async delete(id) {
        const result = await this.doctorsRepository.delete(id);
        if (!result) {
            throw new Error("Doctor doens't exists");
        }
        return result;
    }
}
exports.DoctorsServices = DoctorsServices;
