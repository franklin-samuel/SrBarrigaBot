import {Injectable, UnauthorizedException} from '@nestjs/common';
import {CreateTokenPort} from '../../core/security/create-token.port.js';
import {Context} from '../../core/context.js';
import {Jwt} from '../../domain/jwt.js';
import {CustomUserDetailsService} from '../services/custom-user-details.service.js';
import {JwtUtil} from '../utils/jwt.util.js';
import {PasswordEncoder} from '../configuration/password-encoder.configuration.js';

@Injectable()
export class CreateTokenAdapter implements CreateTokenPort {
    private readonly passwordEncoder = new PasswordEncoder();

    constructor(
        private readonly jwtUtil: JwtUtil,
        private readonly userDetailsService: CustomUserDetailsService
    ) {}

    async execute(context: Context): Promise<Jwt> {
        const username = context.getProperty<string>('username', String);
        const password = context.getProperty<string>('password', String);

        if (!username || !password) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const user = await this.userDetailsService.loadUserByUsername(username);

        const isPasswordValid = await this.passwordEncoder.matches(
            password,
            user.password
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const accessToken = this.jwtUtil.generateAccessToken(user);
        const refreshToken = this.jwtUtil.generateRefreshToken(user);

        const jwt = new Jwt();
        jwt.access_token = accessToken;
        jwt.refresh_token = refreshToken;
        jwt.type = 'Bearer';

        return jwt;
    }
}