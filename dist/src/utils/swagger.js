"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        info: {
            title: 'Better Health Documentation',
            version: '1.0.0',
            contact: {
                name: "Lucas Veloso",
                email: "lucasvelosoalves@outlook.com",
                url: "https://lucasvelosodev.com.br/"
            }
        }
    },
    apis: ['**/*.ts'],
};
exports.SwaggerSpec = (0, swagger_jsdoc_1.default)(options);
