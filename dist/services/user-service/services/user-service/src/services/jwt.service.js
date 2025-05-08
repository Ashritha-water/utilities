"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtService = void 0;
const crypto_1 = require("crypto");
const path_1 = require("path");
const fs_1 = require("fs");
class JwtService {
    constructor() {
        this.secretFile = (0, path_1.join)(__dirname, 'config', 'jwt-secret.json');
        this.loadSecret();
        this.secret = this.getSecret();
    }
    static getInstance() {
        if (!JwtService.instance) {
            JwtService.instance = new JwtService();
        }
        return JwtService.instance;
    }
    loadSecret() {
        if ((0, fs_1.existsSync)(this.secretFile)) {
            const secretData = JSON.parse((0, fs_1.readFileSync)(this.secretFile, 'utf-8'));
            const lastUpdated = new Date(secretData.lastUpdated);
            const now = new Date();
            // If secret is older than 24 hours, generate a new one
            if (now.getTime() - lastUpdated.getTime() > 24 * 60 * 60 * 1000) {
                this.generateNewSecret();
            }
            else {
                this.secret = secretData.secret;
            }
        }
        else {
            this.generateNewSecret();
        }
    }
    generateNewSecret() {
        this.secret = (0, crypto_1.randomBytes)(64).toString('hex');
        const secretData = {
            secret: this.secret,
            lastUpdated: new Date().toISOString()
        };
        (0, fs_1.writeFileSync)(this.secretFile, JSON.stringify(secretData, null, 2));
    }
    getSecret() {
        return this.secret;
    }
}
exports.jwtService = JwtService.getInstance();
