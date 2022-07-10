import {UserType} from "../types/user-type";
import {emailAdapter} from "../adapters/email-adapter";

export const emailManager={
    async sendEmailConfirmationMessage(user:UserType){
        const code= user.emailConfirmation.confirmationCode
       await emailAdapter.sendEmail(user.accountData.email,"registration",code)
       return

    }
}