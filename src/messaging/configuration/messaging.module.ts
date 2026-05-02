import {Module} from '@nestjs/common';
import {WhatsAppService} from '../services/whatsapp.service.js';
import {WhatsAppConnectionAdapter} from '../adapters/whatsapp-connection.adapter.js';
import {WhatsAppSenderAdapter} from '../adapters/whatsapp-sender.adapter.js';
import {ChargeScheduler} from '../scheduler/charge.scheduler.js';
import {WhatsAppConnectionPort} from '../../core/messaging/whatsapp-connection.port.js';
import {WhatsAppSenderPort} from '../../core/messaging/whatsapp-sender.port.js';


@Module({
    imports: [],
    providers: [
        WhatsAppService,
        { provide: WhatsAppConnectionPort, useClass: WhatsAppConnectionAdapter },
        { provide: WhatsAppSenderPort, useClass: WhatsAppSenderAdapter },
    ],
    exports: [
        WhatsAppConnectionPort,
        WhatsAppSenderPort,
        WhatsAppService,
    ],
})
export class MessagingModule {}