import {Module} from '@nestjs/common';
import {CreateUserAdapter} from '../create-user.adapter.js';
import {PersistenceModule} from '../../persistence/configuration/persistence.module.js';
import {SecurityModule} from '../../security/configuration/security.module.js';
import {CreateUserPort} from "../../core/business/create-user.port.js";

@Module({
    imports: [PersistenceModule, SecurityModule],
    providers: [
        {
            provide: CreateUserPort,
            useClass: CreateUserAdapter,
        },
    ],
    exports: [
        CreateUserPort,
    ],
})
export class BusinessModule {}