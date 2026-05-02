import {Injectable} from '@nestjs/common';
import {GoogleSheetsService} from '../services/google-sheets.service.js';
import {config} from '../../security/configuration/env.js';
import {GetPeopleFromSheetPort} from "../../core/infrastructure/get-people-from-sheet.port.js";
import {PeopleModel} from "../../domain/people.js";

@Injectable()
export class GetPeopleFromSheetAdapter implements GetPeopleFromSheetPort {
    constructor(private readonly googleSheetsService: GoogleSheetsService) {}

    async execute(): Promise<PeopleModel[]> {
        const rows = await this.googleSheetsService.getRows();
        const pessoas: PeopleModel[] = [];
        const mesAtual = this.googleSheetsService.getMesAtual();

        for (const row of rows) {
            const nome = row.get('Nome');
            const telefone = row.get('Telefone');

            if (!nome || nome.trim() === '') {
                continue;
            }

            pessoas.push({
                nome: nome.trim(),
                telefone: telefone ? telefone.trim() : config.whatsapp.number!,
                mesAtual: mesAtual,
            });
        }

        return pessoas;
    }
}