import {UserType} from "../types/user-type";
import {emailAdapter} from "../adapters/email-adapter";

export const emailManager={
    async conFirmaTionCode(user:UserType){
        return user.emailConfirmation.confirmationCode

    },
    async sendEmailConfirmationMessage(user:UserType){
        const code=await this.conFirmaTionCode(user)
       await emailAdapter.sendEmail(user.accountData.email,"registration",code)
       return

    },
    async resentEmailConfirmationMessage(user: UserType) {
        const code=await this.conFirmaTionCode(user)
        await emailAdapter.sendEmail(user.accountData.email,"registration",code)
        return
    }
}