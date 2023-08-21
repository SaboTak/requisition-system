import { Module } from '@nestjs/common';
import { TwilioService } from './twilio.service';

@Module({
    providers: [TwilioService],
    exports: [TwilioService], // Si deseas que este servicio sea inyectado en otros módulos
})
export class TwilioModule { }
