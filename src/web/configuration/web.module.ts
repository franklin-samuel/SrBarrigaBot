import {Module} from '@nestjs/common';
import {UserController} from '../controller/user.controller.js';
import {BusinessModule} from '../../business/configuration/business.module.js';
import {SecurityModule} from '../../security/configuration/security.module.js';
import {PersistenceModule} from '../../persistence/configuration/persistence.module.js';

@Module({
    imports: [BusinessModule, SecurityModule, PersistenceModule],
    controllers: [UserController],
})
export class WebModule {}