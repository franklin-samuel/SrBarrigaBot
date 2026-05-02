import {Injectable, OnModuleInit} from '@nestjs/common';
import {GoogleSpreadsheet, GoogleSpreadsheetWorksheet} from 'google-spreadsheet';
import {JWT} from 'google-auth-library';
import {readFileSync} from 'fs';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';
import {config} from '../../security/configuration/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

@Injectable()
export class GoogleSheetsService implements OnModuleInit {
    private doc: GoogleSpreadsheet | null = null;
    private sheet: GoogleSpreadsheetWorksheet | null = null;

    async onModuleInit() {
        await this.init();
    }

    private async init(): Promise<void> {
        try {
            const credentialsPath = join(__dirname, '../../../', config.google.credentialsPath!);
            const credentials = JSON.parse(readFileSync(credentialsPath, 'utf8'));

            const serviceAccountAuth = new JWT({
                email: credentials.client_email,
                key: credentials.private_key,
                scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
            });

            this.doc = new GoogleSpreadsheet(config.google.spreadsheetId!, serviceAccountAuth);

            await this.doc.loadInfo();

            this.sheet = this.doc.sheetsByTitle[config.google.sheetName!];

            if (!this.sheet) {
                throw new Error(`Sheet "${config.google.sheetName}" não encontrada na planilha`);
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erro desconhecido';
            console.error('Erro ao inicializar Google Sheets: ' + message);
            throw error;
        }
    }

    async getRows(): Promise<any[]> {
        if (!this.sheet) {
            await this.init();
        }

        if (!this.sheet) {
            throw new Error('Falha ao inicializar planilha');
        }

        return await this.sheet.getRows();
    }

    getMesAtual(): string {
        const meses = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];

        const dataAtual = new Date();
        return meses[dataAtual.getMonth()];
    }
}