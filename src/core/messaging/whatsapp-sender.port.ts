export abstract class WhatsAppSenderPort {
    abstract sendMessage(number: string, message: string): Promise<boolean>;
}