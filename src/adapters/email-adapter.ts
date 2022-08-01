import nodemailer from "nodemailer";
import {injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class EmailAdapter {
    async sendEmail(email: string, subject: string, text: string) {


        let transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "backendkotyk@gmail.com",
                pass: "hvvqigrcnnrrifly",
            },
        });


        let info = await transport.sendMail({
            from: '"Kotyk" <backendkotyk@gmail.com>',
            to: email,
            subject: subject,
            html: text,
        });
        return


    }

}
