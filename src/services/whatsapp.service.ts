import makeWASocket, { DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.ts';
import qrcode from 'qrcode-terminal';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class WhatsAppService {
    constructor() {
        this.sock = null;
        this.isConnected = false;
    }

    async connect() {
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

            this.sock.ev.on('connection.update', (update) => {
                const { connection, lastDisconnect, qr } = update;

                if (qr) {
                    logger.info('QR Code gerado! Escaneie com o WhatsApp');
                    qrcode.generate(qr, { small: true });
                }

                if (connection === 'close') {
                    const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;

                    logger.warn('Conexão fechada. Reconectando:', shouldReconnect);

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
            logger.error('Erro ao conectar no WhatsApp:', error.message);
            throw error;
        }
    }

    formatPhoneNumber(number) {
        let cleaned = number.replace(/\D/g, '');

        if (cleaned.startsWith('0')) {
            cleaned = cleaned.substring(1);
        }

        if (!cleaned.startsWith('55')) {
            cleaned = '55' + cleaned;
        }

        return cleaned + '@s.whatsapp.net';
    }

    async sendMessage(number, message) {
        try {
            if (!this.isConnected) {
                throw new Error('WhatsApp não está conectado');
            }

            const formattedNumber = this.formatPhoneNumber(number);
            logger.info(`Enviando mensagem para ${formattedNumber}`);

            await this.sock.sendMessage(formattedNumber, { text: message });
            logger.info('Mensagem enviada com sucesso!');

            return true;
        } catch (error) {
            logger.error(`Erro ao enviar mensagem para ${number}:`, error.message);
            throw error;
        }
    }

    async disconnect() {
        if (this.sock) {
            await this.sock.logout();
            logger.info('WhatsApp desconectado');
        }
    }
}

export const whatsappService = new WhatsAppService();