import {Injectable} from '@nestjs/common';
import {WhatsAppConnectionPort} from '../../core/messaging/whatsapp-connection.port.js';
import {WhatsAppService} from '../services/whatsapp.service.js';
import {WhatsAppStatus} from "../../domain/whatsapp-status.js";

@Injectable()
export class WhatsAppConnectionAdapter implements WhatsAppConnectionPort {
    constructor(private readonly whatsappService: WhatsAppService) {}

    async connect(): Promise<boolean> {
        return await this.whatsappService.connect();
    }

    async disconnect(): Promise<void> {
        await this.whatsappService.disconnect();
    }

    async getStatus(): Promise<WhatsAppStatus> {
        return {
            isConnected: this.whatsappService.isConnected(),
            needsQR: this.whatsappService.needsQR(),
            qrCode: this.whatsappService.getCurrentQR(),
        };
    }

    isConnected(): boolean {
        return this.whatsappService.isConnected();
    }
}