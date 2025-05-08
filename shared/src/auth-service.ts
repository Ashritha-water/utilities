import jwt from 'jsonwebtoken';

export class AuthService {
  static async verifyToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }

  static generateToken(payload: any, expiresIn: string = '24h'): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign(payload, secret, { expiresIn: '24h' });
  }
}