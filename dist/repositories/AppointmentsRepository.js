"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsRepository = void 0;
const date_fns_1 = require("date-fns");
const prisma_1 = require("../database/prisma");
class AppointmentsRepository {
    async create({ patients_id, specialties_id, doctors_id, date }) {
        const result = await prisma_1.prisma.appointments.create({
            data: {
                patients_id,
                specialties_id,
                doctors_id,
                date,
            },
        });
        return result;
    }
    async find({ specialties_id, start, end }) {
        const result = await prisma_1.prisma.appointments.findMany({
            where: {
                specialties_id,
                date: {
                    gte: start, //trazendo agendamentos a partir do dia informado
                    lt: end
                }
            },
            orderBy: {
                date: 'asc', //ordenando de forma crescente
            },
        });
        return result;
    }
    async findSchedules(specialties_id, date) {
        const result = await prisma_1.prisma.appointments.findFirst({
            where: {
                specialties_id,
                date,
            },
        });
        return result;
    }
    async findByDoctorsId(doctors_id, lastDay) {
        const result = await prisma_1.prisma.appointments.findMany({
            where: {
                doctors_id,
                date: {
                    gte: (0, date_fns_1.startOfDay)(lastDay),
                    lt: (0, date_fns_1.endOfDay)(lastDay),
                }
            }, select: {
                date: true, // indica que queremos apenas a parte da data
                Specialties: true,
                Doctors: true,
            },
            orderBy: {
                date: 'asc', //ordenando de forma crescente
            },
        });
        return result;
    }
}
exports.AppointmentsRepository = AppointmentsRepository;
