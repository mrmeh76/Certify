import { createTransport } from "nodemailer";

export default class Mail {
    static transport = createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: process.env.NEXT_PUBLIC_MAIL_USER,
            pass: process.env.NEXT_PUBLIC_MAIL_PASSWORD
        }
    });

    static sendMail(html: string, from: string, to: string, subject: string): Promise<void> {
        return new Promise((res, rej) => {
            this.transport.sendMail({
                from,
                to,
                subject,
                html
            }).then(info => {
                return res();
            }).catch((err: any) => {
                console.log(err);
                throw "Could Not Send Email"
            })
        });
    }
}