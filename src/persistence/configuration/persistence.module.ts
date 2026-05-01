import {Module} from '@nestjs/common';
import {PrismaConfiguration} from './prisma.configuration.js';
import {UserMapper} from '../mapper/user.mapper.js';
import {UserRepositoryAdapter} from '../adapter/user.repository.adapter.js';
import {UserRepositoryPort} from "../../core/persistence/user.repository.port.js";

@Module({
    providers: [
        PrismaConfiguration,
        UserMapper,
        {
            provide: UserRepositoryPort,
            useClass: UserRepositoryAdapter,
        },
    ],
    exports: [
        UserRepositoryPort,
        PrismaConfiguration,
    ],
})
export class PersistenceModule {}