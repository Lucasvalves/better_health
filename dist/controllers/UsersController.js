"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const UsersServices_1 = require("../services/UsersServices");
class UsersController {
    constructor() {
        this.usersServices = new UsersServices_1.UsersServices();
    }
    async store(request, response, next) {
        //criar usuario
        const { name, email, password } = request.body;
        try {
            const result = await this.usersServices.create({ name, email, password });
            response.status(201).json(result);
        }
        catch (error) {
            next(error);
            response.status(401);
        }
    }
    async auth(request, response, next) {
        const { email, password } = request.body;
        try {
            const result = await this.usersServices.auth(email, password);
            response.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async update(request, response, next) {
        const { oldPassword, newPassword } = request.body;
        const { user_id } = request;
        try {
            const result = await this.usersServices.update({
                oldPassword,
                newPassword,
                avatar_url: request.file,
                user_id,
            });
            response.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UsersController = UsersController;
