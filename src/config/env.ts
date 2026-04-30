import dotenv from 'dotenv';

dotenv.config();

export const config = {
    google: {
        credentialsPath: process.env.GOOGLE_CREDENTIALS_PATH || './credentials/google-credentials.json',
        spreadsheetId: process.env.SPREADSHEET_ID,
        sheetName: process.env.SHEET_NAME || 'init',
    },
    whatsapp: {
        number: process.env.WHATSAPP_NUMBER,
    },
    cron: {
        schedule: process.env.CRON_SCHEDULE || '40 8 1 * *', // Dia 01 às 08:40
    },
    env: process.env.NODE_ENV || 'development',
};

if (!config.google.spreadsheetId) {
    throw new Error('SPREADSHEET_ID não configurado no .env');
}

if (!config.whatsapp.number) {
    console.warn('WHATSAPP_NUMBER não configurado no .env - usando número padrão de teste');
}