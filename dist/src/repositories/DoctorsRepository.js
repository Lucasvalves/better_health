"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorsRepository = void 0;
const prisma_1 = require("../database/prisma");
class DoctorsRepository {
    async create({ name, crm, specialties_id, user_id }) {
        const result = await prisma_1.prisma.doctors.create({
            data: {
                name,
                crm,
                specialties_id,
                user_id,
            },
        });
        return result;
    }
    async findByCrm(crm) {
        const doctor = await prisma_1.prisma.doctors.findFirst({
            where: {
                crm,
            },
        });
        return doctor;
    }
    async findDoctorsByUserId(user_id) {
        const doctors = await prisma_1.prisma.doctors.findMany({
            where: {
                user_id,
            },
            include: {
                Specialties: true,
            },
        });
        return doctors;
    }
    async findDoctorId(id) {
        const doctor = await prisma_1.prisma.doctors.findFirst({
            where: {
                id,
            },
        });
        return doctor;
    }
    async delete(id) {
        const result = await prisma_1.prisma.doctors.delete({
            where: { id },
        });
        return result;
    }
}
exports.DoctorsRepository = DoctorsRepository;
