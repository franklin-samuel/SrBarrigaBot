import {WhatsAppStatus} from "../../domain/whatsapp-status.js";

export abstract class WhatsAppConnectionPort {
    abstract connect(): Promise<boolean>;
    abstract disconnect(): Promise<void>;
    abstract getStatus(): Promise<WhatsAppStatus>;
    abstract isConnected(): boolean;
}