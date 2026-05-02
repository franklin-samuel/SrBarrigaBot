import {Module} from '@nestjs/common';
import {GetPeopleFromSheetPort} from "../../core/infrastructure/get-people-from-sheet.port.js";
import {GoogleSheetsService} from "../services/google-sheets.service.js";
import {GetPeopleFromSheetAdapter} from "../adapters/get-people-from-sheet.adapter.js";

@Module({
    providers: [
        GoogleSheetsService,
        {
            provide: GetPeopleFromSheetPort,
            useClass: GetPeopleFromSheetAdapter,
        },
    ],
    exports: [GetPeopleFromSheetPort],
})
export class InfrastructureModule {}