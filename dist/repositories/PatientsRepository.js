"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientsRepository = void 0;
const prisma_1 = require("../database/prisma");
class PatientsRepository {
    async create({ name, cpf, user_id, phone }) {
        //create patient
        //console.log(user_id)
        const result = await prisma_1.prisma.patients.create({
            data: {
                name,
                cpf,
                user_id,
                phone,
            },
            include: {
                Users: true, // Include user data in the returned object
            },
        });
        return result;
    }
    async findByCpf(cpf) {
        //buscando paciente especifico pelo cpf
        const patient = await prisma_1.prisma.patients.findFirst({
            where: { cpf },
        });
        return patient;
    }
    async findAll() {
        //buscando todos pacientes cadastrado por o mesmo usuario
        const pacinets = await prisma_1.prisma.patients.findMany();
        return pacinets;
    }
    async findPatient(id) {
        //buscando um paciente especifico
        const pacinets = await prisma_1.prisma.patients.findFirst({
            where: { id },
        });
        return pacinets;
    }
    async findByPhone(id, phone) {
        //buscando paciente especifico pelo cpf
        const patient = await prisma_1.prisma.patients.findFirst({
            where: { id, phone },
        });
        return patient;
    }
    async updateAllData({ id, name, cpf, phone }) {
        const result = await prisma_1.prisma.patients.update({
            where: { id },
            data: {
                name,
                cpf,
                phone,
            },
        });
        return result;
    }
    async updatePhone(id, phone) {
        const result = await prisma_1.prisma.patients.update({
            where: { id },
            data: {
                phone,
            },
        });
        return result;
    }
    async updateCpfAndName(id, name, cpf) {
        const result = await prisma_1.prisma.patients.update({
            where: { id },
            data: {
                name,
                cpf,
            },
        });
        return result;
    }
    async delete(id) {
        const result = await prisma_1.prisma.patients.delete({
            where: { id },
        });
        return result;
    }
}
exports.PatientsRepository = PatientsRepository;
