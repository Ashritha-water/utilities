"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    static async verifyToken(token) {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(decoded);
                }
            });
        });
    }
    static generateToken(payload, expiresIn = '24h') {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '24h' });
    }
}
exports.AuthService = AuthService;
