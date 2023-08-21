import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';

@Injectable()
export class TwilioService {
    private twilioClient: twilio.Twilio;

    constructor() {
        this.twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }

    async sendWhatsAppMessage(to: string, message: string) {
        try {
            const result = await this.twilioClient.messages.create({
                from: 'whatsapp:' + process.env.TWILIO_PHONE_NUMBER,
                to: 'whatsapp:' + to,
                body: message,
            });
            console.log('Message sent:', result.sid);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
}
