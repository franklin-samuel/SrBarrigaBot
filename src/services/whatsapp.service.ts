import makeWASocket, { DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';
import qrcode from 'qrcode-terminal';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class WhatsAppService {
    private sock: any = null;
    public isConnected: boolean = false;

    constructor() {
        this.sock = null;
        this.isConnected = false;
    }

    async connect(): Promise<boolean> {
        try {
            logger.info('Conectando ao WhatsApp...');

            const authFolder = join(__dirname, '../../auth_info');
            const { state, saveCreds } = await useMultiFileAuthState(authFolder);
            const { version } = await fetchLatestBaileysVersion();

            this.sock = makeWASocket({
                version,
                auth: state,
                printQRInTerminal: true,
                logger: logger.child({ module: 'baileys' })
            });

            this.sock.ev.on('creds.update', saveCreds);

            this.sock.ev.on('connection.update', (update: any) => {
                const { connection, lastDisconnect, qr } = update;

                if (qr) {
                    logger.info('QR Code gerado! Escaneie com o WhatsApp');
                    qrcode.generate(qr, { small: true });
                }

                if (connection === 'close') {
                    const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;

                    logger.warn({ shouldReconnect }, 'Conexão fechada. Reconectando...');

                    if (shouldReconnect) {
                        this.connect();
                    } else {
                        this.isConnected = false;
                    }
                } else if (connection === 'open') {
                    logger.info('WhatsApp conectado!');
                    this.isConnected = true;
                }
            });

            await new Promise((resolve) => {
                const checkConnection = setInterval(() => {
                    if (this.isConnected) {
                        clearInterval(checkConnection);
                        resolve(true);
                    }
                }, 1000);
            });

            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erro desconhecido';
            logger.error('Erro ao conectar no WhatsApp: ' + message);
            throw error;
        }
    }

    formatPhoneNumber(number: string): string {
        let cleaned = number.replace(/\D/g, '');

        if (cleaned.startsWith('0')) {
            cleaned = cleaned.substring(1);
        }

        if (!cleaned.startsWith('55')) {
            cleaned = '55' + cleaned;
        }

        return cleaned + '@s.whatsapp.net';
    }

    async sendMessage(number: string, message: string): Promise<boolean> {
        try {
            if (!this.isConnected || !this.sock) {
                throw new Error('WhatsApp não está conectado');
            }

            const formattedNumber = this.formatPhoneNumber(number);
            logger.info(`Enviando mensagem para ${formattedNumber}`);

            await this.sock.sendMessage(formattedNumber, { text: message });
            logger.info('Mensagem enviada com sucesso!');

            return true;
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
            logger.error(`Erro ao enviar mensagem para ${number}: ${errorMsg}`);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        if (this.sock) {
            await this.sock.logout();
            logger.info('WhatsApp desconectado');
        }
    }
}

export const whatsappService = new WhatsAppService();