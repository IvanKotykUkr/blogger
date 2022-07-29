import {EmailAdapter} from "../adapters/email-adapter";

export class EmailManager {


    constructor(protected emailAdapter: EmailAdapter) {

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