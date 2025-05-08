export declare class AuthService {
    static verifyToken(token: string): Promise<any>;
    static generateToken(payload: any, expiresIn?: string): string;
}
