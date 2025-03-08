"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialtiesServices = void 0;
const SpecialtiesRepository_1 = require("../repositories/SpecialtiesRepository");
class SpecialtiesServices {
    constructor() {
        this.specialtiesRepository = new SpecialtiesRepository_1.SpecialtiesRepository();
    }
    async create(name) {
        const findSpecialty = await this.specialtiesRepository.findSpecialtyByName(name);
        if (findSpecialty) {
            throw new Error('Specialty already exists');
        }
        const duration = new Date('2029-02-01T00:30:00.000Z');
        const create = await this.specialtiesRepository.create(name, duration);
        return create;
    }
    async index() {
        const result = await this.specialtiesRepository.getAll();
        return result;
    }
    async findSpecialty(id) {
        const findSpecialty = await this.specialtiesRepository.find(id);
        if (!findSpecialty) {
            throw new Error('Specialty not found');
        }
        return findSpecialty;
    }
}
exports.SpecialtiesServices = SpecialtiesServices;
