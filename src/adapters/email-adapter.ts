import nodemailer from "nodemailer";

export const emailAdapter = {

    async sendEmail(email: string, subject: string, text: string) {


        // create reusable transporter object using the default SMTP transport
        let transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "backendkotyk@gmail.com", // generated ethereal user
                pass: "hvvqigrcnnrrifly", // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transport.sendMail({
            from: '"Kotyk" <backendkotyk@gmail.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            html: text, // html body
        });
        return


    }
}