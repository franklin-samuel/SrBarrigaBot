import {Injectable} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import {CustomUserDetails} from '../model/custom-user-details.js';

@Injectable()
export class JwtUtil {
    private readonly jwtSecret: string;
    private readonly accessTokenExpirationMs = 86400000; // 24 horas
    private readonly refreshTokenExpirationMs = 604800000; // 7 dias

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'default-secret-key';
    }

    generateAccessToken(userDetails: CustomUserDetails): string {
        const payload = {
            sub: userDetails.username,
            userId: userDetails.userId,
        };

        return jwt.sign(payload, this.jwtSecret, {
            expiresIn: this.accessTokenExpirationMs,
        });
    }

    generateRefreshToken(userDetails: CustomUserDetails): string {
        const payload = {
            sub: userDetails.username,
            userId: userDetails.userId,
        };

        return jwt.sign(payload, this.jwtSecret, {
            expiresIn: this.refreshTokenExpirationMs,
        });
    }

    extractUsername(token: string): string {
        const decoded = jwt.verify(token, this.jwtSecret) as any;
        return decoded.sub;
    }

    extractUserId(token: string): string {
        const decoded = jwt.verify(token, this.jwtSecret) as any;
        return decoded.userId;
    }

    isTokenValid(token: string, userDetails: CustomUserDetails): boolean {
        try {
            const username = this.extractUsername(token);
            return username === userDetails.username && !this.isTokenExpired(token);
        } catch (error) {
            return false;
        }
    }

    private isTokenExpired(token: string): boolean {
        const decoded = jwt.verify(token, this.jwtSecret) as any;
        const expiration = new Date(decoded.exp * 1000);
        return expiration < new Date();
    }
}