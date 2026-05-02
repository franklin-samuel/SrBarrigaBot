import {Module} from '@nestjs/common';
import {CreateUserAdapter} from '../create-user.adapter.js';
import {PersistenceModule} from '../../persistence/configuration/persistence.module.js';
import {SecurityModule} from '../../security/configuration/security.module.js';
import {CreateUserPort} from "../../core/business/create-user.port.js";
import {ExecuteChargePort} from "../../core/business/execute-charge.port.js";
import {ExecuteChargeAdapter} from "../execute-charge.adapter.js";
import {SendWhatsAppMessageAdapter} from "../send-whatsapp-message.adapter.js";
import {SendWhatsAppMessagePort} from "../../core/business/send-whatsapp-message.port.js";
import {InfrastructureModule} from "../../infrastructure/configuration/insfrastructure.module.js";
import {MessagingModule} from "../../messaging/configuration/messaging.module.js";
import {ChargeScheduler} from "../../messaging/scheduler/charge.scheduler.js";
import {ScheduleModule} from "@nestjs/schedule";

@Module({
    imports: [
        ScheduleModule.forRoot(),
        PersistenceModule,
        SecurityModule,
        InfrastructureModule,
        MessagingModule
    ],
    providers: [
        ChargeScheduler,
        { provide: CreateUserPort, useClass: CreateUserAdapter },
        { provide: ExecuteChargePort, useClass: ExecuteChargeAdapter },
        {
            provide: SendWhatsAppMessagePort,
            useClass: SendWhatsAppMessageAdapter
        },
    ],
    exports: [
        CreateUserPort,
        ExecuteChargePort,
        SendWhatsAppMessagePort,
    ],
})
export class BusinessModule {}