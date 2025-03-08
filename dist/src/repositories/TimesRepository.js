"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimesRepository = void 0;
const prisma_1 = require("../database/prisma");
class TimesRepository {
    async create({ days, startHour, endHour, specialties_id, doctors_id, }) {
        const result = await prisma_1.prisma.times.create({
            data: {
                days,
                startHour,
                endHour,
                specialties_id,
                doctors_id,
            },
            include: {
                Doctors: true, // Include user data in the returned object
                Specialties: true,
            },
        });
        return result;
    }
    async allTimes() {
        const result = await prisma_1.prisma.times.findMany({
            include: {
                Doctors: true, // Include user data in the returned object
                Specialties: true,
            },
        });
        return result;
    }
    async findBySpecialties(specialties_id) {
        const result = await prisma_1.prisma.times.findMany({
            where: {
                specialties_id,
            },
        });
        return result;
    }
    async delete(id) {
        const result = await prisma_1.prisma.times.delete({
            where: { id },
        });
        return result;
    }
}
exports.TimesRepository = TimesRepository;
