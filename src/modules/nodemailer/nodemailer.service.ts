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
        user:  process.env.MAIL_USER,
        pass:  process.env.MAIL_PASS
      },
    });
  }

  async sendNotification(email: string, subject: string, message: string): Promise<void> {
    const info = await this.transporter.sendMail({
      from: 'info.resicion@ulibre.com',
      to: email,
      subject: subject,
      text: message,
      html: "<b>Hello world?</b>"
    });
    // console.log("Message sent: %s", info.messageId);
    return info
  }
}
