"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3 = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
aws_sdk_1.default.config.credentials = new aws_sdk_1.default.EnvironmentCredentials('AWS');
aws_sdk_1.default.config.update({ region: process.env.AWS_REGION });
const s3 = new aws_sdk_1.default.S3();
exports.s3 = s3;
