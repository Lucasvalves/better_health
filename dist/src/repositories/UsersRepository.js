"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepository = void 0;
const prisma_1 = require("../database/prisma");
class UsersRepository {
    async create({ name, email, password }) {
        const result = await prisma_1.prisma.users.create({
            data: {
                name,
                email,
                password,
            },
        });
        return result;
    }
    async findUserByEmail(email) {
        const result = await prisma_1.prisma.users.findUnique({
            where: {
                email,
            },
        });
        return result;
    }
    async findUserById(id) {
        const result = await prisma_1.prisma.users.findUnique({
            where: {
                id,
            },
        });
        return result;
    }
    async updatePassword(newPassword, user_id) {
        const result = await prisma_1.prisma.users.update({
            where: {
                id: user_id,
            },
            data: {
                password: newPassword,
            },
        });
        return result;
    }
    async update(avatar_url, user_id) {
        const result = await prisma_1.prisma.users.update({
            where: {
                id: user_id,
            },
            data: {
                avatar_url,
            },
        });
        return result;
    }
}
exports.UsersRepository = UsersRepository;
