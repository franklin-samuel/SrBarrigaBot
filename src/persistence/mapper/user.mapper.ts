import {Injectable} from '@nestjs/common';
import {User as PrismaUser} from '../../../generated/prisma/client.js';
import {User} from '../../domain/user.js';

@Injectable()
export class UserMapper {
    toDomain(entity: PrismaUser): User {
        const user = new User();
        user.id = entity.id;
        user.name = entity.name;
        user.email = entity.email;
        user.password = entity.password;
        user.createdAt = entity.createdAt;
        user.modifiedAt = entity.modifiedAt;
        user.deletedAt = entity.deletedAt;
        return user;
    }

    toEntity(domain: User): PrismaUser{
        return {
            id: domain.id,
            name: domain.name,
            email: domain.email,
            password: domain.password,
            createdAt: domain.createdAt,
            modifiedAt: domain.modifiedAt,
            deletedAt: domain.deletedAt,
        };
    }
}