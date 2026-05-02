import {Controller, Get, Post, HttpCode, HttpStatus, Sse, UseGuards} from '@nestjs/common';
import {WhatsAppConnectionPort} from '../../core/messaging/whatsapp-connection.port.js';
import {ExecuteChargePort} from '../../core/business/execute-charge.port.js';
import {Context} from '../../core/context.js';
import {ApiResponse} from '../commons/api.response.js';
import {JwtAuthGuard} from '../../security/guards/jwt-auth.guard.js';
import {WhatsAppService} from '../../messaging/services/whatsapp.service.js';
import {Observable, fromEvent, map} from 'rxjs';

interface WhatsAppStatusResponse {
    isConnected: boolean;
    needsQR: boolean;
}

@Controller('whatsapp')
@UseGuards(JwtAuthGuard)
export class WhatsAppController {
    constructor(
        private readonly whatsappConnectionPort: WhatsAppConnectionPort,
        private readonly executeChargePort: ExecuteChargePort,
        private readonly whatsappService: WhatsAppService,
    ) {}

    @Get('status')
    @HttpCode(HttpStatus.OK)
    async getStatus(): Promise<ApiResponse<WhatsAppStatusResponse>> {
        const status = await this.whatsappConnectionPort.getStatus();

        const response: WhatsAppStatusResponse = {
            isConnected: status.isConnected,
            needsQR: status.needsQR,
        };

        return ApiResponse.success(response);
    }

    @Post('connect')
    @HttpCode(HttpStatus.OK)
    async connect(): Promise<ApiResponse<string>> {
        await this.whatsappConnectionPort.connect();
        return ApiResponse.successMessage('Conexão iniciada. Aguarde o QR code.');
    }

    @Post('disconnect')
    @HttpCode(HttpStatus.OK)
    async disconnect(): Promise<ApiResponse<string>> {
        await this.whatsappConnectionPort.disconnect();
        return ApiResponse.successMessage('WhatsApp desconectado com sucesso');
    }

    @Sse('qr/stream')
    qrStream(): Observable<MessageEvent> {
        return new Observable((subscriber) => {
            const onQR = (qr: string) => {
                subscriber.next({
                    data: {qrCode: qr, type: 'qr'},
                } as MessageEvent);
            };

            const onConnected = () => {
                subscriber.next({
                    data: {type: 'connected'},
                } as MessageEvent);
            };

            const onDisconnected = () => {
                subscriber.next({
                    data: {type: 'disconnected'},
                } as MessageEvent);
            };

            this.whatsappService.on('qr', onQR);
            this.whatsappService.on('connected', onConnected);
            this.whatsappService.on('disconnected', onDisconnected);

            return () => {
                this.whatsappService.off('qr', onQR);
                this.whatsappService.off('connected', onConnected);
                this.whatsappService.off('disconnected', onDisconnected);
            };
        });
    }

    @Post('execute-charge')
    @HttpCode(HttpStatus.OK)
    async executeCharge(): Promise<ApiResponse<string>> {
        const context = new Context();
        await this.executeChargePort.execute(context);
        return ApiResponse.successMessage('Cobrança executada com sucesso');
    }
}