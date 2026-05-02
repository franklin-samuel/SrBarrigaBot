import {Injectable} from '@nestjs/common';
import {ExecuteChargePort} from '../core/business/execute-charge.port.js';
import {Context} from '../core/context.js';
import {GetPeopleFromSheetPort} from '../core/infrastructure/get-people-from-sheet.port.js';
import {SendWhatsAppMessagePort} from '../core/business/send-whatsapp-message.port.js';

@Injectable()
export class ExecuteChargeAdapter implements ExecuteChargePort {
    constructor(
        private readonly getPeopleFromSheetPort: GetPeopleFromSheetPort,
        private readonly sendWhatsAppMessagePort: SendWhatsAppMessagePort,
    ) {}

    async execute(context: Context): Promise<void> {
        console.log('Buscando pessoas na planilha...');

        const contextPessoas = new Context();
        const pessoas = await this.getPeopleFromSheetPort.execute(contextPessoas);

        if (pessoas.length === 0) {
            console.warn('Nenhuma pessoa encontrada na planilha');
            return;
        }

        console.log(`Enviando lembretes para ${pessoas.length} pessoas...`);

        for (const pessoa of pessoas) {
            try {
                const mensagem = this.criarMensagem(pessoa);

                const contextMessage = new Context();
                contextMessage.putProperty('number', pessoa.telefone);
                contextMessage.putProperty('message', mensagem);

                await this.sendWhatsAppMessagePort.execute(contextMessage);

                await this.sleep(5000);

            } catch (error) {
                const message = error instanceof Error ? error.message : 'Erro desconhecido';
                console.error(`Erro ao enviar mensagem para ${pessoa.nome}: ` + message);
            }
        }

        console.log('Cobrança concluída!');
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
}