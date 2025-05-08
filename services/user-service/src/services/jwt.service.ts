import { randomBytes } from 'crypto';
import { join } from 'path';
import { writeFileSync, existsSync, readFileSync } from 'fs';

class JwtService {
  private static instance: JwtService;
  private secret: string;
  private secretFile: string;

  private constructor() {
    this.secretFile = join(__dirname, 'config', 'jwt-secret.json');
    this.loadSecret();
    this.secret = this.getSecret();
  }

  static getInstance(): JwtService {
    if (!JwtService.instance) {
      JwtService.instance = new JwtService();
    }
    return JwtService.instance;
  }

  private loadSecret(): void {
    if (existsSync(this.secretFile)) {
      const secretData = JSON.parse(readFileSync(this.secretFile, 'utf-8'));
      const lastUpdated = new Date(secretData.lastUpdated);
      const now = new Date();
      
      // If secret is older than 24 hours, generate a new one
      if (now.getTime() - lastUpdated.getTime() > 24 * 60 * 60 * 1000) {
        this.generateNewSecret();
      } else {
        this.secret = secretData.secret;
      }
    } else {
      this.generateNewSecret();
    }
  }

  private generateNewSecret(): void {
    this.secret = randomBytes(64).toString('hex');
    const secretData = {
      secret: this.secret,
      lastUpdated: new Date().toISOString()
    };
    writeFileSync(this.secretFile, JSON.stringify(secretData, null, 2));
  }

  getSecret(): string {
    return this.secret;
  }
}

export const jwtService = JwtService.getInstance();