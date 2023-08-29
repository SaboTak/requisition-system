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

  async sendNotification(email: string, subject: string, message: string): Promise<void> {
    let parseMessage = JSON.parse(message)
    const accesoriosHtml = parseMessage.accesorios.map(accesorio => `
      <p><strong>Descripción:</strong> ${accesorio.descripcion}</p>
      <p><strong>Cantidad:</strong> ${accesorio.cantidad}</p>
      <p><strong>Presentación:</strong> ${accesorio.presentacion}</p>
      <p><strong>Marca:</strong> ${accesorio.marca}</p>
      <p><strong>Referencia:</strong> ${accesorio.referencia}</p>
      <p><strong>Observación:</strong> ${accesorio.observacion}</p>
      <p><strong>Duración:</strong> ${accesorio.duracion}</p>
      `).join('');
    const info = await this.transporter.sendMail({
      from: 'info.resicion@ulibre.com',
      to: email,
      subject: subject,
      text: message,
      html: `
        <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${parseMessage.title}</title>
            <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f5f5f5;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 5px;
              box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #333;
              margin-bottom: 20px;
            }
            p {
              color: #666;
              line-height: 1.5;
            }
            b {
              color: #f44336;
            }
            </style>
    </head>
    <body>
      <div class="container">
        <h1>${parseMessage.title}</h1>
        <p>${parseMessage.description}</p>
        <p>${parseMessage.observation}</p>
        <p><strong>Solicitante:</strong> ${parseMessage.applicant}</p>
        <p><strong>Líder de Seguimiento:</strong> ${parseMessage.followUpLeader}</p>
        <p><strong>Coordinador de Proyecto:</strong> ${parseMessage.projectCoordinator}</p>
        
        <h2>Accesorios:</h2>
        ${parseMessage.accesoriosHtml}
        
        <p><strong>Por favor, no responda a este correo.</strong></p>
      </div>
    </body>
    </html>
      `
    });
    return info
  }
}
