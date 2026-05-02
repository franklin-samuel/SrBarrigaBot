import {Injectable} from '@nestjs/common';
import {ExecuteChargePort} from '../../core/business/execute-charge.port.js';
import {Context} from '../../core/context.js';
import {config} from '../../security/configuration/env.js';
import {Cron} from "@nestjs/schedule";

@Injectable()
export class ChargeScheduler {
    constructor(private readonly executeChargePort: ExecuteChargePort) {}

    @Cron(config.cron.schedule, {
        name: 'send_messages',
        timeZone: 'America/Fortaleza'
    })
    async executeCharge(): Promise<void> {
        try {
            const context = new Context();
            await this.executeChargePort.execute(context);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erro desconhecido';
            console.error('Erro ao executar cobrança agendada: ' + message);
        }
    }
}