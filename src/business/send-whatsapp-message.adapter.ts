import {Injectable} from '@nestjs/common';
import {SendWhatsAppMessagePort} from '../core/business/send-whatsapp-message.port.js';
import {Context} from '../core/context.js';
import {WhatsAppSenderPort} from '../core/messaging/whatsapp-sender.port.js';
import {BusinessException} from '../domain/exceptions/business.exception.js';

@Injectable()
export class SendWhatsAppMessageAdapter implements SendWhatsAppMessagePort {
    constructor(private readonly whatsappSenderPort: WhatsAppSenderPort) {}

    async execute(context: Context): Promise<boolean> {
        const number = context.getProperty<string>('number', String);
        const message = context.getProperty<string>('message', String);

        if (!number || !message) {
            throw new BusinessException('Número e mensagem são obrigatórios');
        }

        return await this.whatsappSenderPort.sendMessage(number, message);
    }
}