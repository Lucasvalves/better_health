"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersServices = void 0;
const bcrypt_1 = require("bcrypt");
const UsersRepository_1 = require("../repositories/UsersRepository");
const jsonwebtoken_1 = require("jsonwebtoken");
const aws_1 = require("../config/aws");
const uuid_1 = require("uuid");
class UsersServices {
    constructor() {
        this.usersRepository = new UsersRepository_1.UsersRepository();
    }
    async create({ name, email, password }) {
        const findUser = await this.usersRepository.findUserByEmail(email);
        if (findUser) {
            throw new Error('User Exists');
        }
        const hashPassword = await (0, bcrypt_1.hash)(password, 10);
        const create = await this.usersRepository.create({
            name,
            email,
            password: hashPassword,
        });
        return create;
    }
    async update({ oldPassword, newPassword, avatar_url, user_id, }) {
        let password;
        if (oldPassword && newPassword) {
            const findUserById = await this.usersRepository.findUserById(user_id);
            if (!findUserById) {
                throw new Error('User not found');
            }
            const passwordMatch = (0, bcrypt_1.compare)(oldPassword, findUserById.password);
            if (!passwordMatch) {
                throw new Error('Password invalid.');
            }
            password = await (0, bcrypt_1.hash)(newPassword, 10);
            await this.usersRepository.updatePassword(newPassword, user_id);
        }
        if (avatar_url) {
            const uploadImage = avatar_url?.buffer;
            const uploadS3 = await aws_1.s3
                .upload({
                Bucket: 'better-health',
                Key: `${(0, uuid_1.v4)()}-${avatar_url?.originalname}`,
                Body: uploadImage,
            })
                .promise();
            await this.usersRepository.update(uploadS3.Location, user_id);
        }
        return {
            message: 'User updated successfully',
        };
    }
    async auth(email, password) {
        const findUser = await this.usersRepository.findUserByEmail(email);
        if (!findUser) {
            throw new Error('User or password invalid');
        }
        const passwordMatch = await (0, bcrypt_1.compare)(password, findUser.password);
        if (!passwordMatch) {
            throw new Error('User or password invalid');
        }
        let scretKey = process.env.ACCESS_KEY_TOKEN;
        if (!scretKey) {
            throw new Error('There is no token key');
        }
        const token = (0, jsonwebtoken_1.sign)({ email }, scretKey, {
            subject: findUser.id,
            expiresIn: '365d',
            //expiresIn: 60 * 15,
        });
        return {
            token,
            user: {
                name: findUser.name,
                email: findUser.email,
            },
        };
    }
}
exports.UsersServices = UsersServices;
