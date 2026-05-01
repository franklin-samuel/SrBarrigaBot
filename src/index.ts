import cron from 'node-cron';
import { sheetsService } from './services/sheets.service.js';
import { whatsappService } from './services/whatsapp.service.js';
import { logger } from './utils/logger.js';
import { config } from './config/env.js';

class CobrancaBot {
    async start(): Promise<void> {
        try {
            logger.info('Iniciando bot de cobrança...');

            await whatsappService.connect();
            await sheetsService.init();

            logger.info('Bot inicializado com sucesso!');

            if (config.env === 'development') {
                logger.info('Modo desenvolvimento - executando cobrança de teste...');
                await this.executarCobranca();
            }

            this.agendarCobranca();

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erro desconhecido';
            logger.error('Erro ao iniciar bot: ' + message);
            process.exit(1);
        }
    }

    agendarCobranca(): void {
        logger.info(`Agendando cronjob: ${config.cron.schedule}`);

        cron.schedule(config.cron.schedule!, async () => {
            logger.info('Executando cobrança agendada...');
            await this.executarCobranca();
        }, {
            timezone: 'America/Fortaleza'
        });

        logger.info('Cronjob agendado com sucesso!');
    }

    async executarCobranca(): Promise<void> {
        try {
            logger.info('Buscando pessoas na planilha...');

            const pessoas = await sheetsService.getPessoas();

            if (pessoas.length === 0) {
                logger.warn('Nenhuma pessoa encontrada na planilha');
                return;
            }

            logger.info(`Enviando lembretes para ${pessoas.length} pessoas...`);

            for (const pessoa of pessoas) {
                try {
                    const mensagem = this.criarMensagem(pessoa);
                    await whatsappService.sendMessage(pessoa.telefone, mensagem);

                    await this.sleep(5000);

                } catch (error) {
                    const message = error instanceof Error ? error.message : 'Erro desconhecido';
                    logger.error(`Erro ao enviar mensagem para ${pessoa.nome}: ` + message);
                }
            }

            logger.info('Cobrança concluída!');

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erro desconhecido';
            logger.error('Erro ao executar cobrança: ' + message);
        }
    }

    private criarMensagem(pessoa: any): string {
        return `Olá ${pessoa.nome}! 👋

Este é um lembrete automático sobre o pagamento referente ao mês de *${pessoa.mesAtual}*.

Por favor, realize o pagamento até o dia 10 deste mês.

Caso já tenha pago, desconsidere esta mensagem.

Qualquer dúvida, estou à disposição! 😊`;
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async stop(): Promise<void> {
        logger.info('Encerrando bot...');
        await whatsappService.disconnect();
        process.exit(0);
    }
}

const bot = new CobrancaBot();
bot.start();

process.on('SIGINT', async () => {
    await bot.stop();
});

process.on('SIGTERM', async () => {
    await bot.stop();
});