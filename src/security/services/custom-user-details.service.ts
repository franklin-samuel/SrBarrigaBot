import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserRepositoryPort} from '../../core/persistence/user.repository.port.js';
import {CustomUserDetails} from '../model/custom-user-details.js';

@Injectable()
export class CustomUserDetailsService {
    constructor(private readonly userRepositoryPort: UserRepositoryPort) {}

    async loadUserByUsername(username: string): Promise<CustomUserDetails> {
        const user = await this.userRepositoryPort.findByEmail(username);

        if (!user) {
            throw new UnauthorizedException('Usuário não encontrado.');
        }

        if (user.deletedAt !== null) {
            throw new UnauthorizedException('Usuário foi deletado.');
        }

        return new CustomUserDetails(
            user.id,
            user.email,
            user.password,
        );
    }
}