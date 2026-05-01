import cron from 'node-cron';
import { sheetsService } from './services/sheets.service.ts';
import { whatsappService } from './services/whatsapp.service.ts';
import { logger } from './utils/logger.ts';
import { config } from './config/env.ts';

class CobrancaBot {
    async start() {
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
            logger.error('Erro ao iniciar bot:', error.message);
            process.exit(1);
        }
    }

    agendarCobranca() {
        logger.info(`Agendando cronjob: ${config.cron.schedule}`);

        cron.schedule(config.cron.schedule, async () => {
            logger.info('Executando cobrança agendada...');
            await this.executarCobranca();
        }, {
            timezone: 'America/Fortaleza'
        });

        logger.info('Cronjob agendado com sucesso!');
    }

    async executarCobranca() {
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
                    logger.error(`Erro ao enviar mensagem para ${pessoa.nome}:`, error.message);
                }
            }

            logger.info('✅ Cobrança concluída!');

        } catch (error) {
            logger.error('Erro ao executar cobrança:', error.message);
        }
    }

    criarMensagem(pessoa) {
        return `Olá ${pessoa.nome}! 👋

Este é um lembrete automático sobre o pagamento referente ao mês de *${pessoa.mesAtual}*.

Por favor, realize o pagamento até o dia 10 deste mês.

Caso já tenha pago, desconsidere esta mensagem.

Qualquer dúvida, estou à disposição! 😊`;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async stop() {
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