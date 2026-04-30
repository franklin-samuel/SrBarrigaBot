import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class SheetsService {
    constructor() {
        this.doc = null;
        this.sheet = null;
    }

    async init() {
        try {
            logger.info('Carregando credenciais do Google...');

            const credentialsPath = join(__dirname, '../../', config.google.credentialsPath);
            const credentials = JSON.parse(readFileSync(credentialsPath, 'utf-8'));

            const serviceAccountAuth = new JWT({
                email: credentials.client_email,
                key: credentials.private_key,
                scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
            });

            logger.info('Conectando ao Google Sheets...');
            this.doc = new GoogleSpreadsheet(config.google.spreadsheetId, serviceAccountAuth);

            await this.doc.loadInfo();
            logger.info(`Planilha carregada: ${this.doc.title}`);

            this.sheet = this.doc.sheetsByTitle[config.google.sheetName];

            if (!this.sheet) {
                throw new Error(`Sheet "${config.google.sheetName}" não encontrada na planilha`);
            }

            logger.info(`Aba carregada: ${this.sheet.title} (${this.sheet.rowCount} linhas)`);

            return true;
        } catch (error) {
            logger.error('Erro ao inicializar Google Sheets:', error.message);
            throw error;
        }
    }

    async getPessoas() {
        try {
            if (!this.sheet) {
                await this.init();
            }

            logger.info('📖 Lendo dados da planilha...');
            const rows = await this.sheet.getRows();

            const pessoas = [];
            const mesAtual = this.getMesAtual();

            for (const row of rows) {
                const nome = row.get('Nome');
                const telefone = row.get('Telefone');

                if (!nome || nome.trim() === '') {
                    continue;
                }

                pessoas.push({
                    nome: nome.trim(),
                    telefone: telefone ? telefone.trim() : config.whatsapp.number,
                    mesAtual: mesAtual,
                });
            }

            logger.info(`${pessoas.length} pessoas encontradas na planilha`);
            return pessoas;

        } catch (error) {
            logger.error('Erro ao ler pessoas da planilha:', error.message);
            throw error;
        }
    }

    getMesAtual() {
        const meses = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];

        const dataAtual = new Date();
        return meses[dataAtual.getMonth()];
    }
}

export const sheetsService = new SheetsService();