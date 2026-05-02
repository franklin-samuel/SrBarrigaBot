import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtUtil } from '../utils/jwt.util.js';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
    constructor(private readonly jwtUtil: JwtUtil) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const client: Socket = context.switchToWs().getClient();
            const token = this.extractTokenFromHandshake(client);

            if (!token) {
                return false;
            }

            const username = this.jwtUtil.extractUsername(token);
            if (!username) {
                return false;
            }

            (client as any).user = { username };

            return true;
        } catch (error) {
            return false;
        }
    }

    private extractTokenFromHandshake(client: Socket): string | undefined {
        const authHeader = client.handshake.headers.authorization;
        if (authHeader) {
            const [type, token] = authHeader.split(' ');
            return type === 'Bearer' ? token : undefined;
        }

        const authToken = client.handshake.auth?.token;
        return authToken ? authToken : undefined;
    }
}