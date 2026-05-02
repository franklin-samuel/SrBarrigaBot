import {Injectable} from '@nestjs/common';
import {WhatsAppSenderPort} from '../../core/messaging/whatsapp-sender.port.js';
import {WhatsAppService} from '../services/whatsapp.service.js';

@Injectable()
export class WhatsAppSenderAdapter implements WhatsAppSenderPort {
    constructor(private readonly whatsappService: WhatsAppService) {}

    async sendMessage(number: string, message: string): Promise<boolean> {
        return await this.whatsappService.sendMessage(number, message);
    }
}