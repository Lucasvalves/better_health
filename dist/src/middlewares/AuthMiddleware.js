"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
class AuthMiddleware {
    auth(request, response, next) {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            response.status(401).json({
                code: 'token is missing',
                message: 'Token is missing',
            });
            return;
        }
        const [, token] = authHeader.split(' ');
        const secretKey = process.env.ACCESS_KEY_TOKEN;
        if (!secretKey) {
            throw new Error('There is no token key');
        }
        try {
            const { sub } = (0, jsonwebtoken_1.verify)(token, secretKey);
            request.user_id = sub;
            next();
        }
        catch (error) {
            response.status(401).json({
                code: 'token missing or invalid',
                message: 'Token expired.',
            });
        }
    }
}
exports.AuthMiddleware = AuthMiddleware;
