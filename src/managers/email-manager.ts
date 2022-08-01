import {EmailAdapter} from "../adapters/email-adapter";
import {inject, injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class EmailManager {


    constructor(@inject(EmailAdapter) protected emailAdapter: EmailAdapter) {

    }

    message(code: string) {


        return ` <div><a href=https://some-front.com/confirm-registration?code=${code}>https://some-front.com/confirm-registration?code=${code}</a></div>`
    }

    async sendEmailConfirmationMessage(email: string, code: string) {
        const message = this.message(code)

        await this.emailAdapter.sendEmail(email, "registration", message)
        return
    }

    async resentEmailConfirmationMessage(email: string, code: string) {

        const message = this.message(code)

        await this.emailAdapter.sendEmail(email, "resent registration code", message)
        return
    }


}