"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialtiesRepository = void 0;
const prisma_1 = require("../database/prisma");
class SpecialtiesRepository {
    async create(name, dateFormatted) {
        const result = await prisma_1.prisma.specialties.create({
            data: {
                name,
                duration: dateFormatted,
            },
        });
        return result;
    }
    async findSpecialtyByName(name) {
        const result = await prisma_1.prisma.specialties.findUnique({
            where: {
                name,
            },
        });
        return result;
    }
    async getAll() {
        const specialties = await prisma_1.prisma.specialties.findMany();
        return specialties;
    }
    async find(id) {
        const specialty = await prisma_1.prisma.specialties.findFirst({
            where: {
                id,
            },
        });
        return specialty;
    }
}
exports.SpecialtiesRepository = SpecialtiesRepository;
