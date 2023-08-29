import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      // host: process.env.MAIL_HOST,
      // port: process.env.MAIL_PORT,
      // secure: false,
      service: 'gmail',
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      },
    });
  }

  async sendNotification(email: string, subject: string, message: string, data: any): Promise<void> {   
    const info = await this.transporter.sendMail({
      from: 'info.resicion@ulibre.com',
      to: email,
      subject: subject,
      text: message,
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 5px; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #333; margin-bottom: 20px;">${data.title}</h1>
          <p style="color: #666; line-height: 1.5;">${message}</p>
          <p style="color: #666; line-height: 1.5;">${data.description}</p>
          <p style="color: #666; line-height: 1.5;">${data.observation}</p>
          <p><strong>Solicitante:</strong> ${data.applicant}</p>
          <p><strong>Líder de Seguimiento:</strong> ${data.followUpLeader}</p>
          <p><strong>Coordinador de Proyecto:</strong> ${data.projectCoordinator}</p>
          <p><strong>Por favor, no responda a este correo.</strong></p>
        </div>
      </div>
      `
    });    
  }
}

