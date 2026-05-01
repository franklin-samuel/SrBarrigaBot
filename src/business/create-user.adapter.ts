import {Injectable} from '@nestjs/common';
import {CreateUserPort} from '../core/business/create-user.port.js';
import {Context} from '../core/context.js';
import {User} from '../domain/user.js';
import {BusinessException} from '../domain/exceptions/business.exception.js';
import {UserRepositoryPort} from '../core/persistence/user.repository.port.js';
import {PasswordEncoder} from '../security/configuration/password-encoder.configuration.js';

@Injectable()
export class CreateUserAdapter implements CreateUserPort {
    private readonly passwordEncoder = new PasswordEncoder();

    constructor(private readonly userRepositoryPort: UserRepositoryPort ) {}

    async execute(context: Context): Promise<User> {
        const user = context.getData(User);

        if (!user) {
            throw new BusinessException('Por favor, informe os dados do usuário.');
        }

        if (!user.name || user.name.trim() === '') {
            throw new BusinessException('Por favor, informe o nome do usuário.');
        }

        if (!user.email || user.email.trim() === '') {
            throw new BusinessException('Por favor, informe o email do usuário.');
        }

        if (!user.password || user.password.trim() === '') {
            throw new BusinessException('Por favor, informe a senha do usuário.');
        }

        const emailExists = await this.userRepositoryPort.existsByEmail(user.email);
        if (emailExists) {
            throw new BusinessException('Já existe um usuário com esse email.');
        }

        const newUser = new User();
        newUser.name = user.name.trim();
        newUser.email = user.email.trim();
        newUser.password = await this.passwordEncoder.encode(user.password);
        newUser.createdAt = new Date();
        newUser.modifiedAt = new Date();

        return await this.userRepositoryPort.save(newUser);
    }
}